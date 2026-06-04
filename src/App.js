import Analytics from './Analytics';
import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, Folder, Mail, Phone, MapPin, Download, Loader } from 'lucide-react';
import { supabase } from './supabaseClient'; 

// Analytics tracking function
const trackEvent = async (eventType, subject = null, grade = null) => {
  try {
    await supabase.from('analytics').insert([
      {
        event_type: eventType,
        subject: subject,
        grade: grade,
        timestamp: new Date()
      }
    ]);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

const GRADES = [7, 9, 12];

const SUBJECTS_BY_GRADE = {
  12: [
    'English', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Accounts', 'Commerce',
    'Science', 'Civics', 'Geography', 'History', 'Computer Studies', 'Additional Maths',
    'Art & Design', 'Cinyanja', 'French', 'Metal Work', 'Musical Art Education',
    'Physical Education', 'Religious Education (2046)', 'Religious Education (2044)',
    'Wood Work', 'Home Management', 'Geometrical & Mechanical Drawing', 'Food Nutrition'
  ],
  9: [
    'Art & Design', 'Agriculture Science', 'Business Studies', 'Cinyanja', 'Civics',
    'Design & Technology', 'English', 'French', 'Geography', 'Home Economics', 'History',
    'ICT', 'Mathematics', 'Musical Art Education', 'Office Practice', 'Physical Education',
    'Religious Education', 'Science', 'Social Studies'
  ],
  7: [
    'English', 'Mathematics', 'Science', 'Social Studies', 'CTS', 'Special paper 1', 'Special paper 2'
  ]
};

// Footer Component
function Footer({ setCurrentView, setSelectedGrade, setSelectedSubject }) {
  const navigate = (view) => {
    setCurrentView(view);
    setSelectedGrade(null);
    setSelectedSubject(null);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-3">
              <img src="/past_paper_hub.png" alt="Past Paper Hub Logo" className="h-12 w-12" />
              <span className="font-bold text-white text-xl">Past Paper Hub</span>
            </div>
            <p className="text-gray-400 text-base leading-relaxed">
              Your free resource for ECZ past exam papers. Helping Zambian students achieve academic excellence.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate('home')} className="text-left text-gray-400 hover:text-white text-base transition">Home</button>
              <button onClick={() => navigate('grades')} className="text-left text-gray-400 hover:text-white text-base transition">Past Papers</button>
              <button onClick={() => navigate('about')} className="text-left text-gray-400 hover:text-white text-base transition">About Us</button>
              <button onClick={() => navigate('contact')} className="text-left text-gray-400 hover:text-white text-base transition">Contact Us</button>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <div className="flex flex-col gap-2 text-base text-gray-400">
              <a href="mailto:benardmusonda11@gmail.com" className="hover:text-white transition">benardmusonda11@gmail.com</a>
              <a href="tel:+260764877770" className="hover:text-white transition">+260 764 877 770</a>
              <span>Lusaka, Zambia</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 flex justify-center">
          <p className="text-base text-gray-500">© {new Date().getFullYear()} Past Paper Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Navigation Component
function Navigation({ currentPage, setCurrentView, setSelectedGrade, setSelectedSubject }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (view) => {
    setCurrentView(view);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setMenuOpen(false);
  };

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('home')} className="flex items-center gap-2 hover:opacity-80 transition">
            <img src="/past_paper_hub.png" alt="Past Paper Hub Logo" className="h-10 w-10" />
            <span className="font-bold text-gray-900 text-sm">Past Paper Hub</span>
          </button>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('home')} className={`font-semibold ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}>Home</button>
            <button onClick={() => navigate('grades')} className={`font-semibold ${currentPage === 'papers' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}>Past Papers</button>
            <button onClick={() => navigate('about')} className={`font-semibold ${currentPage === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}>About Us</button>
            <button onClick={() => navigate('contact')} className={`font-semibold ${currentPage === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}>Contact Us</button>
            <button onClick={() => navigate('analytics')} className={`font-semibold ${currentPage === 'analytics' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}>Analytics</button>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden border-2 border-dashed border-green-500 p-2 rounded">
            <div className="w-6 h-0.5 bg-gray-700 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-700 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-700"></div>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-3 pb-3 flex flex-col gap-4 border-t border-gray-100 pt-3">
            <button onClick={() => navigate('home')} className={`text-left font-semibold ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-700'}`}>Home</button>
            <button onClick={() => navigate('grades')} className={`text-left font-semibold ${currentPage === 'papers' ? 'text-blue-600' : 'text-gray-700'}`}>Past Papers</button>
            <button onClick={() => navigate('about')} className={`text-left font-semibold ${currentPage === 'about' ? 'text-blue-600' : 'text-gray-700'}`}>About Us</button>
            <button onClick={() => navigate('contact')} className={`text-left font-semibold ${currentPage === 'contact' ? 'text-blue-600' : 'text-gray-700'}`}>Contact Us</button>
            <button onClick={() => navigate('analytics')} className={`text-left font-semibold ${currentPage === 'analytics' ? 'text-blue-600' : 'text-gray-700'}`}>Analytics</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PastPaperHub() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Track page views - MUST be before conditional returns
  useEffect(() => {
    if (currentView === 'home') {
      trackEvent('page_view', null, null);
    } else if (currentView === 'about') {
      trackEvent('page_view', null, null);
    } else if (currentView === 'contact') {
      trackEvent('page_view', null, null);
    } else if (currentView === 'grades') {
      trackEvent('page_view', null, null);
    }
  }, [currentView]);

  const availableSubjects = useMemo(() => {
    return SUBJECTS_BY_GRADE[selectedGrade] || [];
  }, [selectedGrade]);

  useEffect(() => {
    if (currentView === 'papers' && selectedGrade && selectedSubject) {
      fetchPapers();
    }  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, selectedGrade, selectedSubject]);

  const fetchPapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('past_papers')
        .select('*')
        .eq('grade', selectedGrade)
        .eq('subject', selectedSubject)
        .order('year', { ascending: false });

      if (error) throw error;
      setPapers(data || []);
    } catch (err) {
      setError('Failed to load papers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const availableYears = useMemo(() => {
    return [...new Set(papers.map(p => p.year))].sort((a, b) => b - a);
  }, [papers]);

  const filteredPapers = useMemo(() => {
    if (!selectedYear) return papers;
    return papers.filter(p => p.year === parseInt(selectedYear));
  }, [papers, selectedYear]);

  // Analytics View - AFTER all hooks
  if (currentView === 'analytics') {
    return <Analytics setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />;
  }

  // Home View
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
        <Navigation currentPage="home" setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
        <div className="flex-grow max-w-6xl mx-auto px-4 py-16 w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Past Paper Hub</h2>
            <p className="text-gray-600 text-lg mb-8">Access free ECZ past exam papers for all grades</p>
            <button onClick={() => setCurrentView('grades')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all">
              Get Started
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free Access</h3>
              <p className="text-gray-600">All past papers are completely free. No registration or hidden fees.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <h3 className="text-xl font-bold text-gray-900 mb-2">All Grades</h3>
              <p className="text-gray-600">Find papers for Grade 7, 9, and 12 ECZ exams.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Search</h3>
              <p className="text-gray-600">Quickly find papers by grade, subject, and year.</p>
            </div>
          </div>
        </div>
        <Footer setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
      </div>
    );
  }

  // About Us View
  if (currentView === 'about') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
        <Navigation currentPage="about" setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
        <div className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Past Paper Hub</h1>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Past Paper Hub is dedicated to making quality educational resources accessible to every Zambian student. We believe that having access to past exam papers is crucial for effective exam preparation and academic success.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our platform provides free, organized access to ECZ past papers across all grade levels, helping students practice and familiarize themselves with exam formats before sitting for their final exams.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why We Built This</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Many Zambian students struggle to find organized, centralized resources for exam preparation. Past papers are essential study materials, yet they're often scattered across different sources or difficult to access.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Past Paper Hub was created to solve this problem by providing a simple, free platform where students can easily download and access all ECZ past papers in one place.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Whether you're preparing for your final exams in Grade 7, 9, or 12, we're here to support your academic journey.
            </p>
          </div>
        </div>
        <Footer setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
      </div>
    );
  }

  // Contact Us View
  if (currentView === 'contact') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
        <Navigation currentPage="contact" setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
        <div className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-blue-600 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href="mailto:benardmusonda11@gmail.com" className="text-blue-600 hover:text-blue-700">benardmusonda11@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-blue-600 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a href="tel:+260764877770" className="text-blue-600 hover:text-blue-700">+260 764 877 770</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-blue-600 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">Lusaka, Zambia</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About The Creator</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900">Benard Musonda</p>
                  <p className="text-gray-600">First Year Computer Science Student</p>
                  <p className="text-gray-600">University of Zambia (UNZA)</p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Benard is a passionate software developer and first-year CS student at UNZA. He created Past Paper Hub to help fellow students in Zambia access quality educational resources easily.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Interested in contributing papers, reporting bugs, or collaborating? Feel free to reach out!
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
      </div>
    );
  }

  // Grade Selection View
  if (currentView === 'grades') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
        <Navigation currentPage="papers" setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
        <div className="flex-grow max-w-6xl mx-auto px-4 py-16 w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Select Your Grade</h2>
            <p className="text-gray-600 text-lg">Choose your exam level to find relevant past papers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GRADES.map(grade => (
              <button
                key={grade}
                onClick={() => { setSelectedGrade(grade); setCurrentView('subjects'); }}
                className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 p-8 transition-all duration-300 hover:border-blue-500 hover:shadow-xl"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl font-bold text-blue-600 mb-2">Grade {grade}</div>
                  <p className="text-gray-600">
                    {grade === 7 && 'Junior Secondary'}
                    {grade === 9 && 'Upper Junior Secondary'}
                    {grade === 12 && 'Senior Secondary (School Cert)'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <Footer setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
      </div>
    );
  }

  // Subject Selection View
  if (currentView === 'subjects') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
        <Navigation currentPage="papers" setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
        <div className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
          <button
            onClick={() => { setCurrentView('grades'); setSelectedGrade(null); setSelectedSubject(null); }}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 mb-4"
          >
            ← Back to Grades
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Grade {selectedGrade} Subjects</h1>
          <div className="space-y-3">
            {availableSubjects.map(subject => (
              <button
                key={subject}
                onClick={() => { setSelectedSubject(subject); setCurrentView('papers'); setPapers([]); setSelectedYear(''); }}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-left"
              >
                <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                  <Folder size={24} />
                </div>
                <span className="text-lg font-semibold text-gray-900">{subject}</span>
              </button>
            ))}
          </div>
        </div>
        <Footer setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
      </div>
    );
  }

  // Papers View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Navigation currentPage="papers" setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
      <div className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { setCurrentView('subjects'); setSelectedSubject(null); setPapers([]); setSelectedYear(''); }}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{selectedSubject}</h1>
        </div>

        {papers.length > 0 && (
          <div className="mb-6">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <Loader size={40} className="mx-auto text-blue-400 animate-spin mb-4" />
            <p className="text-gray-500">Loading papers...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 font-semibold">{error}</p>
            <button onClick={fetchPapers} className="mt-4 text-blue-600 underline">Try again</button>
          </div>
        )}

        {!loading && !error && filteredPapers.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={56} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-xl font-semibold mb-2">No papers yet</p>
            <p className="text-gray-400 text-sm">Papers for this subject will be available soon. Check back later!</p>
          </div>
        )}

        {!loading && !error && filteredPapers.length > 0 && (
          <div className="space-y-3">
            {filteredPapers.map(paper => (
              <div
                key={paper.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-600 p-2 rounded">
                    <Download size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{paper.year}</p>
                    <p className="text-sm text-gray-600">{paper.paper_type}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    trackEvent('download', selectedSubject, selectedGrade);
                    const link = document.createElement('a');
                    link.href = paper.file_url;
                    link.download = `${selectedSubject}-${paper.year}-${paper.paper_type}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer setCurrentView={setCurrentView} setSelectedGrade={setSelectedGrade} setSelectedSubject={setSelectedSubject} />
    </div>
  );
}