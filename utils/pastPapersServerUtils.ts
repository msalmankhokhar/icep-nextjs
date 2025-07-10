// utils/pastPapersServerUtils.ts
'use server'
import fs from 'fs';
import path from 'path';

// Define the structure of a past paper for server-side only
interface PastPaper {
  id: string;
  title: string;
  subject: string;
  year: string;
  yearRange: string;
  filePath: string;
  fileUrl: string;
}

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

// Extract year information from filename
function extractYearInfo(filename: string): { year: string; yearRange: string } {
  // Look for year patterns like "2016-2024" in the filename
  const yearRangeMatch = filename.match(/(\d{4})-(\d{4})/);
  if (yearRangeMatch) {
    return {
      year: yearRangeMatch[2], // Latest year
      yearRange: `${yearRangeMatch[1]}-${yearRangeMatch[2]}`
    };
  }
  
  // If no year range, look for single year
  const yearMatch = filename.match(/(\d{4})/);
  if (yearMatch) {
    return {
      year: yearMatch[1],
      yearRange: yearMatch[1]
    };
  }
  
  return {
    year: 'Unknown',
    yearRange: 'Unknown'
  };
}

// Extract subject name from filename
function extractSubjectName(filename: string): string {
  // Remove year part and file extension
  const subjectName = filename.replace(/\d{4}-\d{4}.*$|\d{4}.*$/, '').trim();
  
  // Look for exact match in the map
  for (const key in subjectNameMap) {
    if (subjectName.includes(key)) {
      return subjectNameMap[key];
    }
  }
  
  return subjectName;
}

// Load all past papers
export async function getAllPastPapers(): Promise<PastPaper[]> {
  const pastPapersDirectory = path.join(process.cwd(), 'public/docs/past_papers/css_past_papers');
  const fileNames = fs.readdirSync(pastPapersDirectory);
  
  const pastPapers = fileNames.map(fileName => {
    const id = fileName.replace(/\.pdf$/, '');
    const subjectName = extractSubjectName(id);
    const { year, yearRange } = extractYearInfo(id);
    
    return {
      id,
      title: `${subjectName} (${yearRange})`,
      subject: subjectName,
      year,
      yearRange,
      filePath: path.join(pastPapersDirectory, fileName),
      fileUrl: `/docs/past_papers/css_past_papers/${fileName}`
    };
  });
  
  return pastPapers;
}

// Get papers for a specific subject
export async function getPapersBySubject(subject: string): Promise<PastPaper[]> {
  const allPapers = await getAllPastPapers();
  
  // Find the standardized subject name if it exists
  let standardizedSubject = subject;
  for (const [value] of Object.entries(subjectNameMap)) {
    if (value.toLowerCase() === subject.toLowerCase()) {
      standardizedSubject = value;
      break;
    }
  }
  
  return allPapers.filter(paper => 
    paper.subject.toLowerCase() === standardizedSubject.toLowerCase()
  );
}

// Get a specific paper by ID
export async function getPaperById(id: string): Promise<PastPaper | null> {
  const allPapers = await getAllPastPapers();
  return allPapers.find(paper => paper.id === id) || null;
}

// Get all unique subjects
export async function getAllSubjects(): Promise<string[]> {
  const allPapers = await getAllPastPapers();
  const subjectsSet = new Set(allPapers.map(paper => paper.subject));
  return Array.from(subjectsSet);
}
