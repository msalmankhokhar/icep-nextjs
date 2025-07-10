// utils/pastPapersTypes.ts

// Define the structure of a past paper
export interface PastPaper {
  id: string;
  title: string;
  subject: string;
  year: string;
  yearRange: string;
  filePath: string;
  fileUrl: string;
}

// Utility function to format a subject for use in URLs
export function formatSubjectForUrl(subject: string): string {
  return subject.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Utility function to get subject from URL format
export function getSubjectFromUrl(urlSubject: string, allSubjects: string[]): string | null {
  return allSubjects.find(subject => formatSubjectForUrl(subject) === urlSubject) || null;
}
