import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from './supabaseClient';
import { BarChart3, Download, Eye } from 'lucide-react';

export default function Analytics({ setCurrentView, setSelectedGrade, setSelectedSubject }) {
  const [pageViews, setPageViews] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [subjectData, setSubjectData] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const goBack = () => {
    setCurrentView('home');
    setSelectedGrade(null);
    setSelectedSubject(null);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('*');

      if (error) throw error;

      // Count page views
      const views = data.filter(item => item.event_type === 'page_view').length;
      setPageViews(views);

      // Count downloads
      const dlCount = data.filter(item => item.event_type === 'download').length;
      setDownloads(dlCount);

      // Group by subject
      const downloadsBySubject = {};
      data
        .filter(item => item.event_type === 'download')
        .forEach(item => {
          if (item.subject) {
            downloadsBySubject[item.subject] = (downloadsBySubject[item.subject] || 0) + 1;
          }
        });

      const subjectArray = Object.entries(downloadsBySubject).map(([subject, count]) => ({
        name: subject,
        downloads: count
      }));
      setSubjectData(subjectArray);

      // Group by grade
      const downloadsByGrade = {};
      data
        .filter(item => item.event_type === 'download')
        .forEach(item => {
          if (item.grade) {
            const gradeKey = `Grade ${item.grade}`;
            downloadsByGrade[gradeKey] = (downloadsByGrade[gradeKey] || 0) + 1;
          }
        });

      const gradeArray = Object.entries(downloadsByGrade).map(([grade, count]) => ({
        name: grade,
        downloads: count
      }));
      setGradeData(gradeArray);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={goBack}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 mb-4"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
          </div>
          <p className="text-gray-600">Past Paper Hub - Usage Statistics</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Page Views */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Page Views</p>
                <p className="text-5xl font-bold text-blue-600">{pageViews}</p>
              </div>
              <Eye className="text-blue-400" size={48} />
            </div>
          </div>

          {/* Downloads */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Downloads</p>
                <p className="text-5xl font-bold text-green-600">{downloads}</p>
              </div>
              <Download className="text-green-400" size={48} />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Downloads by Subject */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Downloads by Subject</h2>
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="downloads" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No download data yet</p>
            )}
          </div>

          {/* Downloads by Grade */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Downloads by Grade</h2>
            {gradeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, downloads }) => `${name}: ${downloads}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="downloads"
                  >
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No download data yet</p>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-12 text-center">
          <button
            onClick={fetchAnalytics}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
          >
            Refresh Analytics
          </button>
        </div>
      </div>
    </div>
  );
}