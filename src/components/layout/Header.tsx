// import React from 'react';
// import { LogOut } from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth';

// const Header: React.FC = () => {
//   const { logout, admin } = useAuth();

//   return (
//     <header className="sticky top-0 z-10 flex h-16 justify-end items-end gap-4 border-b bg-white px-4 shadow-sm">
   
//       <div className="flex items-center gap-4">
       
//         <div className="h-8 w-px bg-gray-300" />
//         <div className="flex items-center gap-3">
//           <div className="text-right">
//             <p className="text-sm font-medium text-gray-900">{admin?.username}</p>
//             <p className="text-xs text-gray-500">Administrator</p>
//           </div>
//           <button
//             onClick={logout}
//             className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600"
//             title="Logout"
//           >
//             <LogOut size={20} />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { logout, admin } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 justify-between md:justify-end items-center border-b bg-white px-4 shadow-sm">
      <div className="hidden md:flex items-center gap-4">
        <div className="h-8 w-px bg-gray-300" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{admin?.username}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;