import React, { useState } from 'react';
import {  NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Info, BookOpen, Globe, Image, FolderKanban,
  Users, Cpu, FileText,Mail , Award, TrendingUp, GraduationCap,
  Video, UserCog, Bell, Menu, X, Bot,
  BookType, BookImage, LogOut,Youtube 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Hero Sections', href: '/hero', icon: Image },
  { name: 'About Sections', href: '/about', icon: Info },
  { name: 'Domains', href: '/domains', icon: Globe },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Testimonials', href: '/testimonials', icon: Users },
  { name: 'Video Testimonials', href: '/video-testimonials', icon: Video },
  { name: 'Tech Stack', href: '/tech-stack', icon: Cpu },
  { name: 'Study Materials', href: '/study-materials', icon: FileText },
  { name: 'Certificates', href: '/certificates', icon: Award },
  { name: 'Career Impact', href: '/career-impact', icon: TrendingUp },
  { name: 'Student Success', href: '/student-success', icon: GraduationCap },
  { name: 'Trainer About', href: '/trainer-about', icon: UserCog },
  { name: 'Notices', href: '/notices', icon: Bell },
  { name: 'Modules', href: '/modules', icon: BookOpen },
  { name: 'EnrollCard', href: '/enroll-card', icon: BookType },
  { name: 'Enrollment', href: '/enrollment', icon: BookImage },
  { name: 'FAQ', href: '/faq', icon: Bot },
  {name: 'Mail',href:'/mail' ,icon:Mail },
  {name:'Youtube Short',href:'/youtube-short',icon:Youtube }
];

const Sidebar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();

  const NavItems = ({ onClick }: { onClick?: () => void }) => (
    <div className="space-y-1.5">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group ${
              isActive
                ? 'bg-white/15 text-white shadow-lg backdrop-blur-md'
                : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110 flex-shrink-0`} />
          <span className="truncate tracking-wide">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <>
      {/* --- MOBILE VIEW --- */}
      <div className="md:hidden z-50">
        {/* Mobile Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-20 flex h-16 items-center justify-between bg-[var(--brand-dark)] px-4 shadow-lg border-b border-white/10">
          <button onClick={() => setSidebarOpen(true)} className="text-white p-2 hover:bg-white/10 rounded-lg">
            <Menu size={24} />
          </button>
          <img src={logo} alt="Greens Tech" className="h-10 object-contain" />
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}

        {/* Mobile Slide-out */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 transform shadow-2xl transition duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`} style={{ backgroundColor: 'var(--brand-dark)' }}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
              <span className="text-xl font-bold text-white tracking-tight">Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="text-white/70 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar">
              <NavItems onClick={() => setSidebarOpen(false)} />
            </nav>

            {/* Mobile Logout Section */}
            <div className="p-4 border-t border-white/10 bg-black/20">
               <button 
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-all border border-red-500/20"
               >
                 <LogOut size={20} />
                 <span>Sign Out</span>
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-50">
        <div className="flex flex-col h-full shadow-2xl border-r border-white/5" style={{ backgroundColor: 'var(--brand-dark)' }}>
          
          {/* Sidebar Header */}
          <div className="flex h-20 flex-shrink-0 items-center px-8">
            <div className="flex items-center gap-2">

                <img src={logo} alt="Greens Tech" className="h-14 object-contain" />
            </div>
          </div>

          {/* Navigation with Custom Scrollbar hide */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 no-scrollbar">
            <NavItems />
          </nav>

          {/* User Profile Info Footer */}
          <div className="m-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                {admin?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{admin?.username || 'Admin'}</p>
                <p className="text-[10px] text-emerald-400/80 truncate font-medium uppercase tracking-wider">
                    {admin?.email?.split('@')[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;