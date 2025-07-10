import Navbar from '@/components/Navbar';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Sections/Footer';
import SubjectCard from '@/components/SubjectCard';
import { getAllSubjects, getPapersBySubject } from '@/utils/pastPapersServerUtils';
import { 
  PiExamBold, 
  PiBookOpenTextBold, 
  PiBrainBold, 
  PiNewspaperClippingBold, 
  PiFlagBold, 
  PiHandsPrayingBold, 
  PiBookBookmarkBold,
  PiGlobeBold,
  PiMountainsBold,
  PiLightbulbBold,
  PiTreeBold,
  PiBuildings
} from 'react-icons/pi';

export const metadata = {
  title: 'CSS Past Papers | ICEP Institute',
  description: 'Access a comprehensive collection of CSS past papers from all subjects. Download and practice with solved and unsolved papers to enhance your preparation.',
};

export default async function PastPapersPage() {
  // Get all unique subjects
  const subjects = await getAllSubjects();
  
  // Map icons to subjects
  const subjectIcons: Record<string, React.ReactNode> = {
    'Essay': <PiBookOpenTextBold />,
    'English (Precis & Composition)': <PiExamBold />,
    'General Science & Ability': <PiBrainBold />,
    'Current Affairs': <PiNewspaperClippingBold />,
    'Pakistan Affairs': <PiFlagBold />,
    'Islamic Studies': <PiHandsPrayingBold />,
    'Political Science': <PiBuildings />,
    'Indo-Pak History': <PiMountainsBold />,
    'International Relations': <PiGlobeBold />,
    'Environmental Science': <PiTreeBold />,
    'Governance & Public Policies': <PiLightbulbBold />,
  };
  
  return (
    <>
      <Topbar />
      <Navbar />
      
      <main className="min-h-screen">
        {/* Hero section */}
        <section className="bg-brand-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-12">
            <h1 className="text-4xl md:text-5xl font-bold heading-font mb-4">
              CSS Past Papers
            </h1>
            <p className="text-brand-blue-100 text-lg max-w-3xl">
              Access a comprehensive collection of CSS past papers from 2014 to 2024. 
              Practice with real exam questions to enhance your preparation and increase your chances of success.
            </p>
          </div>
        </section>
        
        {/* Subjects grid */}
        <section className="py-12 md:py-20 bg-brand-white">
          <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-3xl font-bold heading-font text-brand-blue mb-8">
              Select a Subject
            </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {subjects.map(async (subject, index) => {
                const papers = await getPapersBySubject(subject);
                const paperCount = papers.length;
                return (
                  <SubjectCard 
                    key={subject}
                    subject={subject}
                    icon={subjectIcons[subject] || <PiBookBookmarkBold />}
                    count={paperCount}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Info section */}
        <section className="py-16 bg-brand-blue-50 border-t border-b border-brand-blue-100">
          <div className="container mx-auto px-6 md:px-12">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-brand-blue-100">
              <h2 className="text-2xl font-bold heading-font text-brand-blue mb-4">
                How to Use CSS Past Papers
              </h2>
              
              <div className="space-y-4 text-brand-blue-700">
                <p>
                  <strong>1. Understand the Pattern:</strong> Review the exam structure, marking scheme, and question formats.
                </p>
                <p>
                  <strong>2. Practice Regularly:</strong> Solve papers from multiple years to familiarize yourself with different question styles.
                </p>
                <p>
                  <strong>3. Time Management:</strong> Practice under timed conditions to improve your speed and efficiency.
                </p>
                <p>
                  <strong>4. Self-Assessment:</strong> Compare your answers with model solutions to identify areas for improvement.
                </p>
                <p>
                  <strong>5. Pattern Recognition:</strong> Identify recurring themes and topics that frequently appear in exams.
                </p>
              </div>
              
              <div className="mt-6 p-4 bg-brand-yellow-50 border border-brand-yellow-200 rounded-md">
                <p className="text-brand-blue-800 font-medium">
                  Need help with your CSS preparation? Join ICEP&apos;s comprehensive CSS preparation courses for expert guidance and mentorship.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
