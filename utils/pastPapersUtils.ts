// utils/pastPapersUtils.ts
// This file now re-exports utilities from both server and client files
// to maintain backward compatibility while fixing the fs module error

// Re-export types
export type { PastPaper } from './pastPapersTypes';

// Re-export client utilities
export { formatSubjectForUrl, getSubjectFromUrl } from './pastPapersTypes';

// Re-export server utilities
export { getAllPastPapers, getPapersBySubject, getPaperById, getAllSubjects } from './pastPapersServerUtils';
