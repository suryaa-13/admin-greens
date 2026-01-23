// src/utils/constants.ts

// API Configuration
import {IMAGE_URL} from './storage'
export const API_CONFIG = {
  BASE_URL: IMAGE_URL,
  API_PREFIX: '/api',
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'admin_token',
  ADMIN_DATA: 'admin_data',
  THEME: 'admin_theme',
  LANGUAGE: 'admin_language',
  SIDEBAR_STATE: 'sidebar_collapsed',
} as const;

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_SIZE: {
    IMAGE: 5 * 1024 * 1024, // 5MB
    VIDEO: 100 * 1024 * 1024, // 100MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
    ALL: 100 * 1024 * 1024, // 100MB
  },
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    PRESENTATIONS: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
  ALLOWED_EXTENSIONS: {
    IMAGES: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    VIDEOS: ['.mp4', '.webm', '.ogg'],
    DOCUMENTS: ['.pdf', '.doc', '.docx'],
    PRESENTATIONS: ['.ppt', '.pptx'],
    SPREADSHEETS: ['.xls', '.xlsx'],
    EBOOKS: ['.epub', '.mobi'],
  },
} as const;

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: false,
  },
  TEXT: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 255,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000,
  },
  PRICE: {
    MIN: 0,
    MAX: 1000000,
  },
  RATING: {
    MIN: 1,
    MAX: 5,
  },
} as const;

// Domain and Course IDs
export const DOMAIN_IDS = {
  LANDING: 0,
  DEVOPS: 1,
  AI_ML: 2,
  WEB_DEVELOPMENT: 3,
  DATA_SCIENCE: 4,
  CYBER_SECURITY: 5,
  CLOUD_COMPUTING: 6,
  MOBILE_DEVELOPMENT: 7,
  BLOCKCHAIN: 8,
  UI_UX: 9,
} as const;


// File Types
export const FILE_TYPES = {
  PDF: 'PDF',
  DOCX: 'DOCX',
  VIDEO: 'VIDEO',
  PRESENTATION: 'PRESENTATION',
  EBOOK: 'EBOOK',
  IMAGE: 'IMAGE',
} as const;

export const FILE_TYPE_LABELS: Record<string, string> = {
  PDF: 'PDF Document',
  DOCX: 'Word Document',
  VIDEO: 'Video File',
  PRESENTATION: 'Presentation',
  EBOOK: 'E-Book',
  IMAGE: 'Image',
} as const;

// Status Constants
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  PUBLISHED: 'published',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
} as const;

export const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  published: 'bg-blue-100 text-blue-800',
  draft: 'bg-gray-100 text-gray-800',
  archived: 'bg-purple-100 text-purple-800',
} as const;

export const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  published: 'Published',
  draft: 'Draft',
  archived: 'Archived',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 25, 50, 100],
  MAX_LIMIT: 100,
} as const;

// Sort Options
export const SORT_OPTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const SORT_BY = {
  ID: 'id',
  NAME: 'name',
  TITLE: 'title',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  ORDER: 'order',
  PRICE: 'price',
  RATING: 'rating',
} as const;

// UI Constants
export const UI = {
  SIDEBAR_WIDTH: 256, // pixels
  HEADER_HEIGHT: 64, // pixels
  MOBILE_BREAKPOINT: 768, // pixels
  TABLE_ROWS_PER_PAGE: 10,
  TOAST_DURATION: 4000, // milliseconds
  MODAL_ANIMATION_DURATION: 300, // milliseconds
  LOADING_DEBOUNCE: 300, // milliseconds
} as const;

// Theme Constants
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Color Palette
export const COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  SUCCESS: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  WARNING: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  ERROR: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Date & Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  DISPLAY_WITH_TIME: 'dd MMM yyyy, HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  TIME: 'HH:mm',
  RELATIVE: 'relative', // for date-fns formatDistanceToNow
} as const;

// Localization
export const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
  // Add more languages as needed
} as const;

export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'हिंदी',
} as const;

// Feature Flags (for enabling/disabling features)
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_MULTI_LANGUAGE: false,
  ENABLE_EXPORT: true,
  ENABLE_BULK_ACTIONS: true,
  ENABLE_ADVANCED_FILTERS: true,
  ENABLE_DATA_STATS: true,
  ENABLE_NOTIFICATIONS: true,
} as const;

// Dashboard Constants
export const DASHBOARD = {
  REFRESH_INTERVAL: 300000, // 5 minutes in milliseconds
  STATS_CACHE_DURATION: 60000, // 1 minute in milliseconds
  RECENT_ACTIVITY_LIMIT: 10,
  QUICK_ACTIONS_LIMIT: 4,
} as const;

// Export Formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel',
  PDF: 'pdf',
  JSON: 'json',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
  
  // Form specific errors
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  FILE_TOO_LARGE: 'File is too large.',
  
  // Upload specific errors
  UPLOAD_FAILED: 'File upload failed.',
  UPLOAD_IN_PROGRESS: 'Upload in progress.',
  NO_FILE_SELECTED: 'Please select a file.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  CREATE_SUCCESS: 'Created successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
  DELETE_SUCCESS: 'Deleted successfully!',
  UPLOAD_SUCCESS: 'Upload successful!',
  SAVE_SUCCESS: 'Saved successfully!',
  EXPORT_SUCCESS: 'Export successful!',
  IMPORT_SUCCESS: 'Import successful!',
  RESET_SUCCESS: 'Reset successful!',
} as const;

// Route Paths
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  ABOUT: '/about',
  COURSES: '/courses',
  DOMAINS: '/domains',
  HERO: '/hero',
  PROJECTS: '/projects',
  TESTIMONIALS: '/testimonials',
  TECH_STACK: '/tech-stack',
  STUDY_MATERIALS: '/study-materials',
  CERTIFICATES: '/certificates',
  CAREER_IMPACT: '/career-impact',
  STUDENT_SUCCESS: '/student-success',
  VIDEO_TESTIMONIALS: '/video-testimonials',
  TRAINER_ABOUT: '/trainer-about',
  NOTICES: '/notices',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

// API Endpoints (for reference)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/admin/login',
  SIGNUP: '/admin/signup',
  
  // Main Resources
  ABOUT: '/about',
  COURSES: '/courses',
  DOMAINS: '/domains',
  HERO: '/hero',
  PROJECTS: '/projects',
  TESTIMONIALS: '/testimonials',
  TECH_STACK: '/tech-stack',
  STUDY_MATERIALS: '/study-materials',
  CERTIFICATES: '/certificates',
  CAREER_IMPACT: '/career-impact',
  STUDENT_SUCCESS: '/student-success',
  VIDEO_TESTIMONIALS: '/video-testimonials',
  TRAINER_ABOUT: '/trainer-about',
  NOTICES: '/notices',
  MODULES: '/modules',
} as const;

// Icon Names (mapping for lucide-react icons)
export const ICONS = {
  // Navigation
  DASHBOARD: 'LayoutDashboard',
  ABOUT: 'Info',
  COURSES: 'BookOpen',
  DOMAINS: 'Globe',
  HERO: 'Image',
  PROJECTS: 'FolderKanban',
  TESTIMONIALS: 'Users',
  TECH_STACK: 'Cpu',
  STUDY_MATERIALS: 'FileText',
  CERTIFICATES: 'Award',
  CAREER_IMPACT: 'TrendingUp',
  STUDENT_SUCCESS: 'GraduationCap',
  VIDEO_TESTIMONIALS: 'Video',
  TRAINER_ABOUT: 'UserCog',
  NOTICES: 'Bell',
  SETTINGS: 'Settings',
  PROFILE: 'User',
  
  // Actions
  ADD: 'Plus',
  EDIT: 'Edit',
  DELETE: 'Trash2',
  VIEW: 'Eye',
  SAVE: 'Save',
  CANCEL: 'X',
  SEARCH: 'Search',
  FILTER: 'Filter',
  SORT: 'ArrowUpDown',
  DOWNLOAD: 'Download',
  UPLOAD: 'Upload',
  EXPORT: 'DownloadCloud',
  IMPORT: 'UploadCloud',
  REFRESH: 'RefreshCw',
  PRINT: 'Printer',
  COPY: 'Copy',
  SHARE: 'Share2',
  
  // Status
  SUCCESS: 'CheckCircle',
  ERROR: 'XCircle',
  WARNING: 'AlertCircle',
  INFO: 'Info',
  LOADING: 'Loader2',
  
  // File Types
  PDF: 'FileText',
  DOC: 'File',
  IMAGE: 'Image',
  VIDEO: 'Video',
  AUDIO: 'Music',
  ARCHIVE: 'Archive',
  
  // User Interface
  MENU: 'Menu',
  CLOSE: 'X',
  CHEVRON_RIGHT: 'ChevronRight',
  CHEVRON_LEFT: 'ChevronLeft',
  CHEVRON_UP: 'ChevronUp',
  CHEVRON_DOWN: 'ChevronDown',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_LEFT: 'ArrowLeft',
  MORE_VERTICAL: 'MoreVertical',
  MORE_HORIZONTAL: 'MoreHorizontal',
  
  // Authentication
  LOGIN: 'LogIn',
  LOGOUT: 'LogOut',
  LOCK: 'Lock',
  UNLOCK: 'Unlock',
  KEY: 'Key',
  USER: 'User',
  USERS: 'Users',
} as const;

// Default Values
export const DEFAULTS = {
  COURSE: {
    DOMAIN_ID: 0,
    PRICE: '0.00',
    DURATION: '3 months',
    IS_ACTIVE: true,
  },
  DOMAIN: {
    DOMAIN_ID: 0,
    COURSE_ID: 0,
    IS_ACTIVE: true,
  },
  HERO: {
    DOMAIN_ID: 0,
    COURSE_ID: 0,
    CTA_TEXT: 'Learn More',
    CTA_LINK: '/courses',
    IS_ACTIVE: true,
  },
  PROJECT: {
    DOMAIN_ID: 0,
    COURSE_ID: 0,
    ORDER: 0,
    IS_ACTIVE: true,
  },
  TESTIMONIAL: {
    DOMAIN_ID: 0,
    IS_ACTIVE: true,
  },
  TECH_STACK: {
    DOMAIN_ID: 0,
    COURSE_ID: 0,
    ORDER: 0,
    IS_ACTIVE: true,
  },
  STUDY_MATERIAL: {
    DOMAIN_ID: 0,
    COURSE_ID: 0,
    FILE_TYPE: 'PDF',
    IS_ACTIVE: true,
  },
  CERTIFICATE: {
    DOMAIN_ID: 0,
    COURSE_ID: 0,
    IS_ACTIVE: true,
  },
  CAREER_IMPACT: {
    DOMAIN_ID: 0,
    COURSE_ID: 0,
    IS_ACTIVE: true,
  },
  STUDENT_SUCCESS: {
    DOMAIN_ID: 0,
    COURSE_ID: 0,
    RATING: 5,
    IS_ACTIVE: true,
  },
  VIDEO_TESTIMONIAL: {
    DOMAIN_ID: 0,
    COURSE_ID: 0,
    ORDER: 0,
    IS_ACTIVE: true,
  },
  TRAINER_ABOUT: {
    DOMAIN_ID: 0,
    COURSE_ID: 0,
    IS_ACTIVE: true,
  },
  NOTICE: {
    IS_ACTIVE: true,
  },
} as const;

// Environment
export const ENVIRONMENT = {
  IS_TEST: import.meta.env.NODE_ENV === 'test',
  API_URL: import.meta.env.VITE_ADMIN_BASE_URL || 'http://localhost:5000/api',
  APP_NAME: import.meta.env.REACT_APP_NAME || 'GreenTech Admin',
  APP_VERSION: import.meta.env.REACT_APP_VERSION || '1.0.0',
} as const;

// Export all constants
// export default {
//   API_CONFIG,
//   STORAGE_KEYS,
//   FILE_CONFIG,
//   VALIDATION,
//   DOMAIN_IDS,
//   FILE_TYPES,
//   FILE_TYPE_LABELS,
//   STATUS,
//   STATUS_COLORS,
//   STATUS_LABELS,
//   PAGINATION,
//   SORT_OPTIONS,
//   SORT_BY,
//   UI,
//   THEME,
//   COLORS,
//   NOTIFICATION_TYPES,
//   DATE_FORMATS,
//   LANGUAGES,
//   LANGUAGE_NAMES,
//   FEATURE_FLAGS,
//   DASHBOARD,
//   EXPORT_FORMATS,
//   ERROR_MESSAGES,
//   SUCCESS_MESSAGES,
//   ROUTES,
//   API_ENDPOINTS,
//   ICONS,
//   DEFAULTS,
//   ENVIRONMENT,
// };