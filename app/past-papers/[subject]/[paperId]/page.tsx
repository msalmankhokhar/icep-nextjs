import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Sections/Footer';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { getAllPastPapers, getPaperById } from '@/utils/pastPapersServerUtils';
import { formatSubjectForUrl } from '@/utils/pastPapersTypes';
import PDFViewerSimple from '@/components/PDFViewerSimple';

export const dynamicParams = true;

export async function generateStaticParams() {
  const allPapers = await getAllPastPapers();
  
  return allPapers.map(paper => ({
    subject: formatSubjectForUrl(paper.subject),
    paperId: paper.id
  }));
}

export async function generateMetadata({ params }: { params: { subject: string, paperId: string } }) {
  // Make sure to use promise here to avoid Next.js warnings
  const paperIdParam = await Promise.resolve(params.paperId);
  const paper = await getPaperById(paperIdParam);
  
  if (!paper) {
    return {
      title: 'Paper Not Found | ICEP Institute'
    };
  }
  
  return {
    title: `${paper.subject} (${paper.yearRange}) | ICEP Institute`,
    description: `View and download ${paper.subject} past paper from ${paper.yearRange}. Practice with real CSS exam questions to enhance your preparation.`
  };
}

export default async function PaperPage({ params }: { params: { subject: string, paperId: string } }) {
  // Make sure to use promise here to avoid Next.js warnings
  const paperIdParam = await Promise.resolve(params.paperId);
  const subjectParam = await Promise.resolve(params.subject);
  
  // Get the paper details
  const paper = await getPaperById(paperIdParam);
  
  // If paper doesn't exist, show 404
  if (!paper) {
    notFound();
  }
  
  const urlSubject = formatSubjectForUrl(paper.subject);
  
  // Make sure the subject in the URL matches the paper's subject
  // Use a more lenient check to avoid URL parameter issues
  if (!subjectParam.toLowerCase().includes(urlSubject.toLowerCase()) && 
      !urlSubject.toLowerCase().includes(subjectParam.toLowerCase())) {
    // Instead of showing 404, we'll redirect in the client component
    // For now, we'll still show the content as this is a server component
    console.warn(`Subject mismatch: ${subjectParam} vs ${urlSubject}`);
  }
  
  return (
    <>
      <Topbar />
      <Navbar />
      
      <main className="min-h-screen bg-brand-white pb-16">
        {/* Hero section */}
        <section className="bg-brand-blue text-white py-10 md:py-14">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex items-center gap-2 text-brand-blue-200 mb-3 flex-wrap">
              <Link href="/" className="hover:text-brand-blue-100">Home</Link>
              <ChevronRightIcon className="w-4 h-4" />
              <Link href="/past-papers" className="hover:text-brand-blue-100">Past Papers</Link>
              <ChevronRightIcon className="w-4 h-4" />
              <Link href={`/past-papers/${urlSubject}`} className="hover:text-brand-blue-100">{paper.subject}</Link>
              <ChevronRightIcon className="w-4 h-4" />
              <span className="truncate max-w-[150px] sm:max-w-none">{paper.yearRange}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold heading-font mb-3">
              {paper.subject} Past Paper
            </h1>
            <p className="text-brand-blue-100">
              Examination Years: <span className="font-semibold">{paper.yearRange}</span>
            </p>
          </div>
        </section>
        
        {/* PDF Viewer */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-12">
            {/* Paper info */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-brand-blue-100 mb-6">
              <h2 className="text-xl font-bold heading-font text-brand-blue mb-4">
                Paper Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-brand-blue-400 text-sm">Subject</p>
                  <p className="text-brand-blue-800 font-medium">{paper.subject}</p>
                </div>
                <div>
                  <p className="text-brand-blue-400 text-sm">Years Covered</p>
                  <p className="text-brand-blue-800 font-medium">{paper.yearRange}</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-brand-yellow-50 border border-brand-yellow-200 rounded-md text-sm">
                <p className="text-brand-blue-700">
                  <strong>Tip:</strong> Practice with a timer to simulate real exam conditions. Allocate appropriate time for each question based on its marks.
                </p>
              </div>            </div>
            
            {/* PDF viewer */}
            {/* <PaperViewerClient fileUrl={paper.fileUrl} /> */}
            <PDFViewerSimple pdfUrl={paper.fileUrl} />
          </div>
        </section>
        
        {/* Call to action */}
        <section className="py-10">
          <div className="container mx-auto px-6 md:px-12">
            <div className="bg-brand-blue-700 text-white p-6 md:p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold heading-font mb-4">
                Enhance Your CSS Preparation
              </h2>
              <p className="text-brand-blue-100 mb-6 max-w-3xl mx-auto">
                Join ICEP&apos;s comprehensive CSS preparation courses for expert guidance, structured study plans, and personalized feedback from experienced mentors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/past-papers"
                  className="bg-brand-blue-500 text-white px-6 py-3 rounded-md hover:bg-brand-blue-400 transition"
                >
                  Browse More Papers
                </Link>
                <Link 
                  href="/courses"
                  className="bg-brand-yellow text-brand-blue-800 px-6 py-3 rounded-md hover:bg-brand-yellow-400 transition font-medium"
                >
                  Explore Our Courses
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
