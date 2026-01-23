export interface Admin {
  id: number;
  email: string;
  password: string;
  token?: string;
  username?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface About {
  id: number;
  domainId: number;
  courseId: number;
  label: string;
  heading: string;
  description1: string;
  description2?: string;
  mainImages: string[];
  smallImages: string[];
  isActive: boolean;
}
export interface EnrollCard {
  id: number;
  domainId: number;
  courseId: number;
  title: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface EnrollCardAdminResponse {
  success: boolean;
  data: EnrollCard[];
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  message?: string;
}
export interface EnrollmentRequest {
  id: number;
  domainId: number;
  domain: string;
  courseId: number;
  course: string;
  name: string;
  email: string;
  phone: string;
  proofImage: string;
  // Status removed
  createdAt?: string;
  updatedAt?: string;
}


export interface StatsResponse {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byDomain: Record<number, number>;
  byCourse: Record<number, number>;
}

export interface EnrollmentFilters {
  domainId?: string;
  courseId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}
export interface Course {
  id: number;
  courseId: number;
  domainId: number;
  title: string;
  description: string;
  image: string;
  price: string;
  duration: string;
  isActive: boolean;
}

export type MailMode = 'CLIENT_GENERAL' | 'CLIENT_COURSE' | 'ADMIN_BULK';
export type MailTarget = 'GENERAL' | 'DOMAIN_SPECIFIC' | 'COURSE_SPECIFIC';

export interface MailActionPayload {
  mode: MailMode;
  email?: string;
  fullName?: string;
  phone?: string;
  domainId?: number;
  courseId?: number;
  targetType?: MailTarget;
  subject?: string;
  message?: string;
  attachment?: File | null;
}
export interface YouTubeShort {
  id: number;
  domainId: number;
  courseId: number;
  name: string;
  batch: string;
  quote: string;
  imageUrl: string;
  videoUrl: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export interface YouTubeShortFormState {
  name: string;
  batch: string;
  quote: string;
  videoUrl: string;
  domainId: number;
  courseId: number;
  order: number;
  isActive: boolean;
}
export interface MailActionResponse {
  success: boolean;
  sent?: number;
  audience?: string;
  message?: string;
}

export interface FAQChat {
  id: number;
  step: number;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQBulkRequest {
  step: number;
  questions: string[];
  answers: string[];
}

export interface FAQUpdateRequest {
  step?: number;
  question?: string;
  answer?: string;
  isActive?: boolean;
}

export interface Domain {
  id: number;
  domainId: number;
  courseId: number;
  domain: string;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  thumbnailUrl: string,
  videoUrl: string,
  isActive: boolean;
  mainImageUrl: string,
}

export interface Hero {
  id: number;
  domainId: number;
  courseId: number;
  title: string;
  subtitle: string;
  description?: string;
  images: string[];
  runningTexts: { text: string }[];
  isActive: boolean;
}

// types/index.ts
export interface Project {
  id: number;
  domainId: number;
  courseId: number;
  title: string;
  description: string;
  order: number;
  imageUrl: string;
  isActive: boolean;
  tech?: ProjectTech[];
  createdAt?: string;
  updatedAt?: string;
  projectLink: string;
}

export interface ProjectTech {
  id: number;
  projectId: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: number;
  domainId: number;
  courseId: number
  name: string;
  batch: string;
  image: string;
  quote: string;
  videoUrl: string;
  isActive: boolean;
}

export interface TechStack {
  id: number;
  domainId: number;
  courseId: number;
  name: string;
  iconUrl: string;
  order: number;
  isActive: boolean;
}

export interface StudyMaterial {
  id: number;
  domainId: number;
  courseId: number;
  fileName: string;
  description?: string;
  fileType: "PDF" | "DOCX" | "VIDEO" | "PRESENTATION" | "EBOOK";
  highlight: string;
  filePath: string;
  imageUrl: string;
  isActive: boolean;
}

export interface CertificateStep {
  id: number;
  title: string;
  description: string;
  icon: string; // Icon name (e.g., 'check-circle', 'award', 'shield', 'star', 'certificate')
}

export interface Certificate {
  id: number;
  domainId: number;
  courseId: number;
  sectionTitle: string;
  steps: CertificateStep[];
  certificateImage: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareerImpact {
  id: number;
  domainId: number;
  courseId: number;
  mainTitle: string;
  mainDescription: string;
  ctaText: string;
  ctaLink: string;
  card1Title: string;
  card1Description: string;
  card2Title: string;
  card2Description: string;
  isActive: boolean;
}

export interface StudentSuccess {
  id: number;
  domainId: number;
  courseId: number;
  name: string;
  course: string;
  rating: number;
  review: string;
  placement: string;
  sortOrder?: number;
  duration: string;
  image: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VideoTestimonial {
  id: number;
  domainId: number;
  courseId: number;
  name: string;
  batch: string;
  quote: string;
  imageUrl: string;
  videoUrl: string;
  order: number;
  isActive: boolean;
}
export interface SocialLink {
  platform: string;
  url: string;
}
export interface TrainerAbout {
  id: number;
  domainId: number;
  courseId: number;
  label: string;
  heading: string;
  description1: string;
  description2?: string;
  mainImage: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  socialLinks: SocialLink[],
}

export interface Notice {
  id: number;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: number;
  domainId: number;
  courseId: number;
  title: string;
  description?: string;
  order: number;
  isActive: boolean;
  topics?: ModuleTopic[];
}

export interface ModuleTopic {
  id: number;
  moduleId: number;
  title: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  domainId?: number;
  courseId?: number;
}