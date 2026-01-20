import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';

// Pages
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AddCoursePage from './pages/AddCoursePage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import StudySessionPage from './pages/StudySessionPage';
import ProfilePage from './pages/ProfilePage';

// Navigation
import { DesktopSidebar, MobileBottomNav, MobileHeader } from './components/Navigation';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Navigation handler
  const handleNavigate = (page: string, courseId?: string, topicId?: string) => {
    setCurrentPage(page);
    if (courseId !== undefined) {
      setSelectedCourseId(courseId);
    }
    if (topicId !== undefined) {
      setSelectedTopicId(topicId);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <AuthPage />;
  }

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'add-course':
        return <AddCoursePage onNavigate={handleNavigate} />;
      case 'course':
        return selectedCourseId ? (
          <CourseDetailsPage 
            courseId={selectedCourseId} 
            onNavigate={handleNavigate} 
          />
        ) : (
          <Dashboard onNavigate={handleNavigate} />
        );
      case 'study':
        return selectedCourseId ? (
          <StudySessionPage 
            courseId={selectedCourseId}
            topicId={selectedTopicId || undefined}
            onNavigate={handleNavigate} 
          />
        ) : (
          <Dashboard onNavigate={handleNavigate} />
        );
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <DesktopSidebar currentPage={currentPage} onNavigate={handleNavigate} />
      
      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content */}
      <main className="lg:mr-64 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8">
          {renderPage()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <AppContent />
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
