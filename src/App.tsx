import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Login';
const Youtubeshort=lazy(()=>import('./pages/YouTubeShortsPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Courses = lazy(() => import('./pages/CoursePage'));
const Domains = lazy(() => import('./pages/DomainPage'));
const About = lazy(() => import('./pages/AboutPage'));
const HeroPage = lazy(() => import('./pages/HeroPage'));
const Projects = lazy(() => import('./pages/ProjectPage'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const TechStack = lazy(() => import('./pages/TechStack'));
const StudyMaterials = lazy(() => import('./pages/StudyMaterials'));
const Certificates = lazy(() => import('./pages/Certificates'));
const CareerImpact = lazy(() => import('./pages/CareerImpact'));
const StudentSuccess = lazy(() => import('./pages/StudentSuccess'));
const VideoTestimonials = lazy(() => import('./pages/VideoTestimonials'));
const TrainerAbout = lazy(() => import('./pages/TrainerAbout'));
const Notices = lazy(() => import('./pages/Notices'));
const ModulesPage = lazy(() => import('./pages/ModulesPage'));
const EnrollCardsPage = lazy(() => import('./pages/EnrollCardPage'));
const EnrollmentRequestsPage = lazy(() => import('./pages/EnrollmentPage'));
const FAQManagement = lazy(() => import('./pages/FAQManagement'));
const Mail =lazy(()=>import('./pages/BulkMailPage'));
const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <Routes>
            {/* 🔓 PUBLIC */}
            <Route path="/login" element={<Login />} />

            {/* 🔒 PROTECTED */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="about" element={<About />} />
              <Route path="courses" element={<Courses />} />
              <Route path="domains" element={<Domains />} />
              <Route path="hero" element={<HeroPage />} />
              <Route path="projects" element={<Projects />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="tech-stack" element={<TechStack />} />
              <Route path="study-materials" element={<StudyMaterials />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="career-impact" element={<CareerImpact />} />
              <Route path="student-success" element={<StudentSuccess />} />
              <Route path="video-testimonials" element={<VideoTestimonials />} />
              <Route path="trainer-about" element={<TrainerAbout />} />
              <Route path="notices" element={<Notices />} />
              <Route path="modules" element={<ModulesPage />} />
              <Route path="enroll-card" element={<EnrollCardsPage />} />
              <Route path="enrollment" element={<EnrollmentRequestsPage />} />
              <Route path="faq" element={<FAQManagement />} />
              <Route path='mail'element={<Mail/>}/>
              <Route path='youtube-short' element={<Youtubeshort/>}/>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <Toaster position="top-right" />
    </>
  );
};


export default App;