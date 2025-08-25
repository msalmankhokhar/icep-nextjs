import "server-only";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  AdminPastPaper,
  ExamData,
  PastPaperSubject,
} from "./pastPapersAdminTypes";

const dataDirectory = path.join(process.cwd(), "data");
const pastPapersFile = path.join(dataDirectory, "pastPapers.json");

// Map file names to cleaner subject names
const subjectNameMap: Record<string, string> = {
  'Essay': 'Essay',
  'Preci and composition': 'English (Precis & Composition)',
  'General Science and ability': 'General Science & Ability',
  'current affais': 'Current Affairs',
  'pakistn affairs': 'Pakistan Affairs',
  'Islamiyat': 'Islamic Studies',
  'Pol. Science': 'Political Science',
  'Indo pak History': 'Indo-Pak History',
  'International relation': 'International Relations',
  'Environmental_Science': 'Environmental Science',
  'GPP': 'Governance & Public Policies',
  'Punjabi': 'Punjabi'
};

// Helper function to read past papers from JSON file
export function readPastPapersFromJson(): AdminPastPaper[] {
  try {
    if (fs.existsSync(pastPapersFile)) {
      const data = fs.readFileSync(pastPapersFile, "utf-8");
      const papers = JSON.parse(data);
      // Convert date strings back to Date objects
      return papers.map((paper: any) => ({
        ...paper,
        uploadDate: new Date(paper.uploadDate),
      }));
    }
    return [];
  } catch (error) {
    console.warn("Could not read past papers from JSON file:", error);
    return [];
  }
}

// Helper function to write past papers to JSON file
export function writePastPapersToJson(papers: AdminPastPaper[]): void {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }

    // Convert Date objects to ISO strings for JSON serialization
    const serializedPapers = papers.map((paper) => ({
      ...paper,
      uploadDate: paper.uploadDate.toISOString(),
    }));

    fs.writeFileSync(
      pastPapersFile,
      JSON.stringify(serializedPapers, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing past papers to JSON file:", error);
    throw error;
  }
}

// Get all past papers
export function getAllPastPapers(): AdminPastPaper[] {
  return readPastPapersFromJson();
}

// Get past paper by ID
export function getPastPaperById(id: string): AdminPastPaper | null {
  const papers = getAllPastPapers();
  return papers.find((paper) => paper.id === decodeURIComponent(id)) || null;
}


// Get unique exam types
export function getAvailableExamTypes(): string[] {
  const papers = getAllPastPapers();
  const examTypes = Array.from(new Set(papers.map((paper) => paper.examType)));
  return examTypes.sort();
}

// Get unique subjects for a specific exam type
export function getAvailableSubjectsForExam(examType: string): string[] {
  const papers = getAllPastPapers();
  const subjects = Array.from(
    new Set(
      papers
        .filter((paper) => paper.examType === examType)
        .map((paper) => paper.subject)
    )
  );
  return subjects.sort();
}

// Get unique years
export function getAvailableYears(): string[] {
  const papers = getAllPastPapers();
  const years = Array.from(new Set(papers.map((paper) => paper.year)));
  return years.sort((a, b) => parseInt(b) - parseInt(a));
}

// Get unique subject types
export function getAvailableSubjectTypes(): string[] {
  const papers = getAllPastPapers();
  const subjectTypes = Array.from(
    new Set(papers.map((paper) => paper.subjectType))
  );
  return subjectTypes.sort();
}

// Search past papers
export function searchPastPapers(query: string): AdminPastPaper[] {
  const papers = getAllPastPapers();
  const lowercaseQuery = query.toLowerCase();

  return papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(lowercaseQuery) ||
      paper.subject.toLowerCase().includes(lowercaseQuery) ||
      paper.examType.toLowerCase().includes(lowercaseQuery) ||
      paper.year.includes(query) ||
      paper.yearRange.includes(query)
  );
}

// Get all unique subjects
export async function getAllAdminSubjects(): Promise<ExamData> {
  // initialize with empty arrays
  const examData: ExamData = {
    css: { comp: [], optional: [] },
    pms: { comp: [], optional: [] },
  };
  // fetch once
  const allPastPapers = await getAllPastPapers();
  allPastPapers.forEach((item) => {
    const subject: PastPaperSubject = {
      name: item.subject, // assuming item has subject field
      type: item.subjectType, // "compulsory" | "optional"
      Exam: item.examType, // "CSS" | "PMS"
    };

    if (item.examType === "CSS") {
      if (item.subjectType === "compulsory") {
        examData.css.comp.push(subject);
      } else {
        examData.css.optional.push(subject);
      }
    }

    if (item.examType === "PMS") {
      if (item.subjectType === "compulsory") {
        examData.pms.comp.push(subject);
      } else {
        examData.pms.optional.push(subject);
      }
    }
  });

  return examData;
}