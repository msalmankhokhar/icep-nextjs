import { NextResponse, NextRequest } from "next/server";
import {
  getAllPastPapers,
  readPastPapersFromJson,
  writePastPapersToJson,
} from "@/utils/pastPapersAdminUtils";
import { del, put } from "@vercel/blob";
import * as fs from "node:fs";
import * as path from "node:path";

const pastPapersDirectory = path.join(process.cwd(), "public/docs/past_papers");

// Helper function to safely delete file
function safeDeleteFile(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.warn(`Could not delete file: ${filePath}`, error);
    return false;
  }
}

// Helper function to delete from Vercel Blob
async function deleteFromVercelBlob(fileUrl: string): Promise<boolean> {
  try {
    // Check if it's a Vercel Blob URL
    if (fileUrl.includes("blob.vercel-storage.com")) {
      await del(fileUrl);
      return true;
    }
    return false;
  } catch (error) {
    console.warn(`Could not delete from Vercel Blob: ${fileUrl}`, error);
    return false;
  }
}

// Helper function to generate folder path for Vercel Blob
function generateBlobFolderPath(
  examType: string,
  subjectType: string,
  subject: string
): string {
  const sanitizedSubject = subject
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  return `past-papers/${examType.toLowerCase()}_past_papers/${subjectType}/${sanitizedSubject}`;
}

// Helper function to generate file path for local storage
function generateLocalFilePath(
  examType: string,
  subjectType: string,
  subject: string,
  filename: string
): string {
  const sanitizedSubject = subject
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  return `/docs/past_papers/${examType.toLowerCase()}_past_papers/${subjectType}/${sanitizedSubject}/${filename}`;
}

export async function GET() {
  try {
    const pastPapers = getAllPastPapers();

    // Convert Date objects to ISO strings for JSON serialization
    const serializedPastPapers = pastPapers.map((paper) => ({
      ...paper,
      uploadDate: paper.uploadDate.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: serializedPastPapers,
      count: pastPapers.length,
    });
  } catch (error) {
    console.error("Error fetching past papers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch past papers",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const examType = formData.get("examType") as "CSS" | "PMS";
    const subjectType = formData.get("subjectType") as
      | "compulsory"
      | "optional";
    const year = formData.get("year") as string;
    const yearRange = formData.get("yearRange") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    // Validate required fields
    if (
      !title ||
      !subject ||
      !examType ||
      !subjectType ||
      !year ||
      !yearRange ||
      !file
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "Please fill in all required fields and upload a file",
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type",
          message: "Only PDF files are allowed",
        },
        { status: 400 }
      );
    }

    // Generate unique ID
    const id = `${examType.toLowerCase()}-${subject
      .toLowerCase()
      .replace(/\s+/g, "-")}-${yearRange}`;

    // Check if past paper already exists
    const existingPapers = getAllPastPapers();
    if (existingPapers.find((paper) => paper.id === id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Past paper already exists",
          message: `A past paper with ID "${id}" already exists`,
        },
        { status: 409 }
      );
    }

    // Generate folder path for Vercel Blob
    const blobFolderPath = generateBlobFolderPath(
      examType,
      subjectType,
      subject
    );
    const blobFileName = `${id}.pdf`;
    const blobPath = `${blobFolderPath}/${blobFileName}`;

    // Upload file to Vercel Blob with allowOverwrite
    const blob = await put(blobPath, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowOverwrite: true,
    });

    // Generate local file path for reference
    const localFilePath = generateLocalFilePath(
      examType,
      subjectType,
      subject,
      blobFileName
    );

    // Create new past paper object
    const newPastPaper = {
      id,
      title,
      subject,
      examType,
      subjectType,
      year,
      yearRange,
      filePath: localFilePath,
      fileUrl: blob.url,
      uploadDate: new Date(),
      description: description || undefined,
    };

    // Add to JSON file
    const updatedPapers = [...existingPapers, newPastPaper];
    writePastPapersToJson(updatedPapers);

    return NextResponse.json({
      success: true,
      message: "Past paper added successfully",
      data: {
        pastPaper: {
          ...newPastPaper,
          uploadDate: newPastPaper.uploadDate.toISOString(),
        },
        blob: {
          url: blob.url,
          pathname: blob.pathname,
        },
      },
    });
  } catch (error) {
    console.error("Error adding past paper:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add past paper",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paperId = searchParams.get("id");

    if (!paperId) {
      return NextResponse.json(
        {
          success: false,
          error: "Past paper ID is required",
          message: "Please provide a past paper ID to delete",
        },
        { status: 400 }
      );
    }

    // Get all past papers to find the one to delete
    const pastPapers = getAllPastPapers();
    const paperToDelete = pastPapers.find((paper) => paper.id === paperId);

    if (!paperToDelete) {
      return NextResponse.json(
        {
          success: false,
          error: "Past paper not found",
          message: `Past paper with ID "${paperId}" was not found`,
        },
        { status: 404 }
      );
    }

    // Delete from JSON file
    const jsonPastPapers = readPastPapersFromJson();
    const updatedJsonPastPapers = jsonPastPapers.filter(
      (paper) => paper.id !== paperId
    );
    writePastPapersToJson(updatedJsonPastPapers);

    // Track deletion results
    let fileDeleted = false;
    let blobDeleted = false;

    // Try to delete from Vercel Blob storage first
    if (paperToDelete.fileUrl) {
      blobDeleted = await deleteFromVercelBlob(paperToDelete.fileUrl);
    }

    // Try to delete the PDF file from local filesystem
    if (paperToDelete.filePath) {
      const fullFilePath = path.join(process.cwd(), paperToDelete.filePath);
      fileDeleted = safeDeleteFile(fullFilePath);
    }

    // Also try to delete by filename pattern (for filesystem-based papers)
    const filename = paperToDelete.id + ".pdf";
    const alternativePath = path.join(pastPapersDirectory, filename);
    if (!fileDeleted) {
      fileDeleted = safeDeleteFile(alternativePath);
    }

    return NextResponse.json({
      success: true,
      message: "Past paper deleted successfully",
      data: {
        deletedPaper: {
          ...paperToDelete,
          uploadDate: paperToDelete.uploadDate.toISOString(),
        },
        fileDeleted,
        blobDeleted,
        id: paperId,
      },
    });
  } catch (error) {
    console.error("Error deleting past paper:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete past paper",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
