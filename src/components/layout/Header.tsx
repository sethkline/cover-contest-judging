// import React, { useState } from 'react';
// import Link from 'next/link';
// import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';

// // Simple utility function to merge classNames
// const cn = (...classes: string[]) => {
//   return classes.filter(Boolean).join(" ");
// };

// export interface HeaderProps {
//   userRole?: 'admin' | 'judge' | 'guest';
//   userName?: string;
//   onLogout?: () => void;
//   logo?: React.ReactNode;
//   children?: React.ReactNode;
//   className?: string;
// }

// export function Header({
//   userRole = 'guest',
//   userName,
//   onLogout,
//   logo,
//   children,
//   className
// }: HeaderProps) {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);

//   // Navigation links based on user role
//   const getNavItems = () => {
//     switch (userRole) {
//       case 'admin':
//         return [
//           { href: '/admin/contests', label: 'Contests' },
//           { href: '/admin/entries', label: 'Entries' },
//           { href: '/admin/judges', label: 'Judges' },
//           { href: '/admin/settings', label: 'Settings' },
//         ];
//       case 'judge':
//         return [
//           { href: '/judge/dashboard', label: 'Dashboard' },
//           { href: '/judge/entries', label: 'Entries to Judge' },
//           { href: '/judge/completed', label: 'Completed' },
//         ];
//       default:
//         return [
//           { href: '/', label: 'Home' },
//           { href: '/contests', label: 'Contests' },
//           { href: '/about', label: 'About' },
//         ];
//     }
//   };

//   const navItems = getNavItems();

//   return (
//     <header className={cn(
//       "bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm",
//       className
//     )}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo & Desktop Navigation */}
//           <div className="flex">
//             {/* Logo */}
//             <div className="flex-shrink-0 flex items-center">
//               {logo ? (
//                 logo
//               ) : (
//                 <Link href="/" className="text-primary-600 font-bold text-xl">
//                   ContestJudge
//                 </Link>
//               )}
//             </div>

//             {/* Desktop Nav */}
//             <nav className="hidden md:ml-6 md:flex md:space-x-4 items-center">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//               {/* Custom children for additional menu items */}
//               {children}
//             </nav>
//           </div>

//           {/* User Menu & Mobile Menu Button */}
//           <div className="flex items-center">
//             {/* User Menu (if logged in) */}
//             {userName && (
//               <div className="ml-3 relative">
//                 <div>
//                   <button
//                     type="button"
//                     className="flex items-center max-w-xs rounded-full text-sm focus:outline-none"
//                     onClick={() => setUserMenuOpen(!userMenuOpen)}
//                   >
//                     <span className="sr-only">Open user menu</span>
//                     <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 mr-2">
//                       <User size={16} />
//                     </div>
//                     <span className="text-neutral-700 dark:text-neutral-300 hidden sm:block">
//                       {userName}
//                     </span>
//                     <ChevronDown size={16} className="ml-1 text-neutral-500" />
//                   </button>
//                 </div>

//                 {/* User Dropdown */}
//                 {userMenuOpen && (
//                   <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-10">
//                     <div className="py-1">
//                       <Link
//                         href="/profile"
//                         className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
//                         onClick={() => setUserMenuOpen(false)}
//                       >
//                         Your Profile
//                       </Link>
//                       {userRole === 'admin' && (
//                         <Link
//                           href="/admin/settings"
//                           className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
//                           onClick={() => setUserMenuOpen(false)}
//                         >
//                           Settings
//                         </Link>
//                       )}
//                       <button
//                         className="w-full text-left block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
//                         onClick={() => {
//                           setUserMenuOpen(false);
//                           onLogout && onLogout();
//                         }}
//                       >
//                         <div className="flex items-center">
//                           <LogOut size={16} className="mr-2" />
//                           Sign out
//                         </div>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Login / Register (if not logged in) */}
//             {!userName && (
//               <div className="hidden md:flex items-center space-x-2">
//                 <Link
//                   href="/login"
//                   className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
//                 >
//                   Log in
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}

//             {/* Mobile menu button */}
//             <div className="flex md:hidden ml-4">
//               <button
//                 type="button"
//                 className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               >
//                 <span className="sr-only">
//                   {mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
//                 </span>
//                 {mobileMenuOpen ? (
//                   <X className="block h-6 w-6" />
//                 ) : (
//                   <Menu className="block h-6 w-6" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800">
//           <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6 lg:px-8">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 {item.label}
//               </Link>
//             ))}
//             {!userName && (
//               <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-col space-y-2">
//                 <Link
//                   href="/login"
//                   className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Log in
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 text-center"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }
import React from "react";

interface HeaderProps {
  title?: string;
  logoOnly?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Révérence Studios",
  logoOnly = false,
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-center">
        <h1 className="text-2xl font-serif italic text-primary-600">{title}</h1>

        {!logoOnly && (
          <div className="ml-auto">
            {/* Additional header content can go here */}
          </div>
        )}
      </div>
    </header>
  );
};
