import React, { useEffect, useState, useRef } from 'react';
import {
  Users,
  BookOpen,
  FolderKanban,
  Award,
  TrendingUp,
  FileText,
  Cpu,
  Video,
  Globe,
  Bell,
  Image,
  Bot,
  BookType,
  BookImage
} from 'lucide-react';
import { aboutService } from '../services/about.service';
import { courseService } from '../services/course.service';
import { domainService } from '../services/domain.service';
import { projectService } from '../services/project.service';
import { testimonialService } from '../services/testimonial.service';
import { noticeService } from '../services/notice.service';
import { heroService } from '../services/hero.service';
import { videoTestimonialService } from '../services/videoTestimonial.service';
import { techStackService } from '../services/techStack.service';
import { studyMaterialService } from '../services/studyMaterial.service';
import { certificateService } from '../services/certificate.service';
import { careerImpactService } from '../services/careerImpact.service';
import { studentSuccessService } from '../services/studentSuccess.service';
import { trainerAboutService } from '../services/trainerAbout.service';
import { moduleService } from '../services/module.service';
import { enrollmentRequestService } from '../services/enrollment.service';
import { enrollCardService } from '../services/enrollCard.service';
import { faqChatService } from "../services/faq.service"
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const hasFetchedRef = useRef(false);

  const [stats, setStats] = useState({
    about: 0,
    courses: 0,
    domains: 0,
    projects: 0,
    testimonials: 0,
    videoTestimonials: 0,
    hero: 0,
    techStack: 0,
    studyMaterials: 0,
    certificates: 0,
    careerImpacts: 0,
    studentSuccess: 0,
    trainerAbout: 0,
    notices: 0,
    modules: 0,
    enrollment: 0,
    faq: 0,
    enrollcard: 0,
  });




  const fetchStats = async () => {
    try {
      const [
        aboutData,
        coursesData,
        domainsData,
        projectsData,
        testimonialsData,
        videoTestimonialsData,
        heroData,
        techStackData,
        studyMaterialsData,
        certificatesData,
        careerImpactsData,
        studentSuccessData,
        trainerAboutsData,
        noticesData,
        modulesData,
        enrollmentData,
        faqData,
        enrollcardData,
      ] = await Promise.all([
        aboutService.getAll(),
        courseService.getAll(),
        domainService.getAll(),
        projectService.getAll(),
        testimonialService.getAll(),
        videoTestimonialService.getAll(),
        heroService.getAll(),
        techStackService.getAll(),
        studyMaterialService.getAll(),
        certificateService.getAll(),
        careerImpactService.getAll(),
        studentSuccessService.getAll(),
        trainerAboutService.getAll(),
        noticeService.getAll(),
        moduleService.getAll(),
        enrollmentRequestService.getAllRequests(),
        faqChatService.getAllAdmin(),
        enrollCardService.getAllForAdmin(),
      ]);

      setStats({
        about: aboutData.length,
        courses: coursesData.length,
        domains: domainsData.length,
        projects: projectsData.length,
        testimonials: testimonialsData.length,
        videoTestimonials: videoTestimonialsData.length,
        hero: heroData.length,
        techStack: techStackData.length,
        studyMaterials: studyMaterialsData.length,
        certificates: certificatesData.length,
        careerImpacts: careerImpactsData.length,
        studentSuccess: studentSuccessData.length,
        trainerAbout: trainerAboutsData.length,
        notices: noticesData.length,
        modules: modulesData.length,
        enrollment: enrollmentData.data.length,
        faq: faqData.length,
        enrollcard: enrollcardData.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch dashboard stats');
    }
  };
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetchStats();
  }, []);

  const statCards = [
    { icon: Globe, label: 'Domains', value: stats.domains, color: 'bg-blue-500' },
    { icon: BookOpen, label: 'Courses', value: stats.courses, color: 'bg-green-500' },
    { icon: BookOpen, label: 'Modules', value: stats.modules, color: 'bg-violet-500' },
    { icon: FolderKanban, label: 'Projects', value: stats.projects, color: 'bg-purple-500' },
    { icon: Users, label: 'Testimonials', value: stats.testimonials, color: 'bg-pink-500' },
    { icon: Video, label: 'Video Testimonials', value: stats.videoTestimonials, color: 'bg-red-500' },
    { icon: Cpu, label: 'Tech Stack', value: stats.techStack, color: 'bg-yellow-500' },
    { icon: FileText, label: 'Study Materials', value: stats.studyMaterials, color: 'bg-indigo-500' },
    { icon: Award, label: 'Certificates', value: stats.certificates, color: 'bg-teal-500' },
    { icon: TrendingUp, label: 'Career Impacts', value: stats.careerImpacts, color: 'bg-orange-500' },
    { icon: Users, label: 'Student Success', value: stats.studentSuccess, color: 'bg-cyan-500' },
    { icon: Users, label: 'Trainer About', value: stats.trainerAbout, color: 'bg-lime-500' },
    { icon: Image, label: 'Hero Sections', value: stats.hero, color: 'bg-rose-500' },
    { icon: Image, label: 'About Sections', value: stats.about, color: 'bg-fuchsia-500' },
    { icon: Bell, label: 'Active Notices', value: stats.notices, color: 'bg-gray-500' },
    { icon: Bot, label: 'Enroll Card', value: stats.enrollcard, color: 'bg-green-500' },
    { icon: BookType, label: 'Enrollment Info', value: stats.enrollment, color: 'bg-indigo-500' },
    { icon: BookImage, label: 'FAQ', value: stats.faq, color: 'bg-green-500' }
  ];


  return (
    <div className="md:ml-[250px] lg:ml-0 transition-all duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to Greens Technologies</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;