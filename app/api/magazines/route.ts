import { NextResponse, NextRequest } from "next/server";
import { getAllMagazines } from "@/utils/magazinesServerUtils";
import { del, put } from "@vercel/blob";
import * as fs from "node:fs";
import * as path from "node:path";

const dataDirectory = path.join(process.cwd(), "data");
const magazinesFile = path.join(dataDirectory, "magazines.json");

// Helper function to read magazines from JSON file
function readMagazinesFromJson(): unknown[] {
  try {
    if (fs.existsSync(magazinesFile)) {
      const data = fs.readFileSync(magazinesFile, "utf-8");
      return JSON.parse(data) as unknown[];
    }
    return [];
  } catch (error) {
    console.warn("Could not read magazines from JSON file:", error);
    return [];
  }
}

// Helper function to write magazines to JSON file
function writeMagazinesToJson(magazines: unknown[]): void {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }
    fs.writeFileSync(
      magazinesFile,
      JSON.stringify(magazines, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing magazines to JSON file:", error);
    throw error;
  }
}

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

export async function GET() {
  try {
    const magazines = getAllMagazines();

    // Convert Date objects to ISO strings for JSON serialization
    const serializedMagazines = magazines.map((magazine) => ({
      ...magazine,
      publishDate: magazine.publishDate.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: serializedMagazines,
      count: magazines.length,
    });
  } catch (error) {
    console.error("Error fetching magazines:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch magazines",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if the request is JSON or form data
    const contentType = request.headers.get("content-type");

    let magazineData: unknown;

    if (contentType?.includes("application/json")) {
      // Handle JSON data (from addMagazine page)
      magazineData = await request.json();
    } else {
      // Handle form data (for future use)
      const formData = await request.formData();
      magazineData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        week: formData.get("week") as string,
        month: formData.get("month") as string,
        year: formData.get("year") as string,
        file: formData.get("file") as File,
      };
    }

    // Extract fields 
    const {
      title,
      description,
      week,
      month,
      year,
      file,
      fileUrl,
      filePath,
      id,
    } = magazineData as {
      title: string;
      description?: string;
      week: string;
      month: string;
      year: string;
      file?: File;
      fileUrl?: string;
      filePath?: string;
      id?: string;
    };

    // Validate required fields
    if (!title || !week || !month || !year) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "Please fill in all required fields",
        },
        { status: 400 }
      );
    }

    // If file is provided, validate and upload it
    let finalFileUrl = fileUrl;
    let finalFilePath = filePath;

    if (file && file instanceof File) {
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

      // Upload file to Vercel Blob with allowOverwrite
      const blob = await put(file.name, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        allowOverwrite: true,
      });

      finalFileUrl = blob.url;
      finalFilePath = `/docs/magazines/${file.name}`;
    }

    // Generate unique ID if not provided
    const magazineId = id || `${week}_${month}_${year}_${Date.now()}`;

    // Check if magazine already exists
    const existingMagazines = getAllMagazines();
    if (existingMagazines.find((mag) => mag.id === magazineId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Magazine already exists",
          message: `A magazine with ID "${magazineId}" already exists`,
        },
        { status: 409 }
      );
    }

    // Create new magazine object
    const newMagazine = {
      id: magazineId,
      title,
      description: description || undefined,
      week,
      month,
      year,
      filePath: finalFilePath,
      fileUrl: finalFileUrl,
      publishDate: new Date(),
    };

    // Add to JSON file
    const updatedMagazines = [...existingMagazines, newMagazine];
    writeMagazinesToJson(updatedMagazines);

    return NextResponse.json({
      success: true,
      message: "Magazine added successfully",
      data: {
        magazine: {
          ...newMagazine,
          publishDate: newMagazine.publishDate.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Error adding magazine:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add magazine",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const magazineId = searchParams.get("id");

    if (!magazineId) {
      return NextResponse.json(
        {
          success: false,
          error: "Magazine ID is required",
          message: "Please provide a magazine ID to delete",
        },
        { status: 400 }
      );
    }

    // Get all magazines to find the one to delete
    const magazines = getAllMagazines();
    const magazineToDelete = magazines.find((mag) => mag.id === magazineId);

    if (!magazineToDelete) {
      return NextResponse.json(
        {
          success: false,
          error: "Magazine not found",
          message: `Magazine with ID "${magazineId}" was not found`,
        },
        { status: 404 }
      );
    }

    // Delete from JSON file
    const jsonMagazines = readMagazinesFromJson();
    const updatedJsonMagazines = jsonMagazines.filter(
      (mag) => mag.id !== magazineId
    );
    writeMagazinesToJson(updatedJsonMagazines);

    // Track deletion results
    let fileDeleted = false;
    let blobDeleted = false;

    // Try to delete from Vercel Blob storage first
    if (magazineToDelete.fileUrl) {
      blobDeleted = await deleteFromVercelBlob(magazineToDelete.fileUrl);
    }

    // Try to delete the PDF file from local filesystem
    if (magazineToDelete.filePath) {
      const fullFilePath = path.join(process.cwd(), magazineToDelete.filePath);
      fileDeleted = safeDeleteFile(fullFilePath);
    }

    return NextResponse.json({
      success: true,
      message: "Magazine deleted successfully",
      data: {
        deletedMagazine: {
          ...magazineToDelete,
          publishDate: magazineToDelete.publishDate.toISOString(),
        },
        fileDeleted,
        blobDeleted,
        id: magazineId,
      },
    });
  } catch (error) {
    console.error("Error deleting magazine:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete magazine",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
