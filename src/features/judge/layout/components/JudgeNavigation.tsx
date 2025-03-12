import React, { useState } from "react";
import Link from "next/link";
import { BaseButton } from "@/components/ui/BaseButton";
import { Home, LogOut, BookOpen, Menu, X } from "lucide-react";

interface JudgeNavigationProps {
  pathname: string;
  onSignOut: () => void;
}

export const JudgeNavigation: React.FC<JudgeNavigationProps> = ({
  pathname,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <span className="font-bold text-lg md:text-xl text-primary-600 truncate">
              Contest Judge Portal
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-4 mr-4">
              <NavLink
                href="/judge/dashboard"
                isActive={pathname === "/judge/dashboard"}
                icon={<Home className="mr-1.5 h-4 w-4" />}
                label="Dashboard"
              />
              <NavLink
                href="/judge/instructions"
                isActive={pathname === "/judge/instructions"}
                icon={<BookOpen className="mr-1.5 h-4 w-4" />}
                label="Instructions"
              />
            </div>
            <BaseButton
              onClick={onSignOut}
              variant="ghost"
              size="sm"
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Sign out
            </BaseButton>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <MobileNavLink
            href="/judge/dashboard"
            isActive={pathname === "/judge/dashboard"}
            icon={<Home className="mr-2 h-5 w-5" />}
            label="Dashboard"
            onClick={() => setMobileMenuOpen(false)}
          />
          <MobileNavLink
            href="/judge/instructions"
            isActive={pathname === "/judge/instructions"}
            icon={<BookOpen className="mr-2 h-5 w-5" />}
            label="Instructions"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="px-3 py-2">
            <BaseButton
              onClick={() => {
                setMobileMenuOpen(false);
                onSignOut();
              }}
              variant="ghost"
              size="sm"
              leftIcon={<LogOut className="h-4 w-4" />}
              className="w-full justify-start"
            >
              Sign out
            </BaseButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper component for desktop navigation links
interface NavLinkProps {
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, isActive, icon, label }) => {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive
          ? "bg-primary-50 text-primary-600"
          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
      }`}
    >
      <span className="mr-1">{icon}</span>
      {label}
    </Link>
  );
};

// Helper component for mobile navigation links
interface MobileNavLinkProps extends NavLinkProps {
  onClick?: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  href,
  isActive,
  icon,
  label,
  onClick,
}) => {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
        isActive
          ? "bg-primary-50 text-primary-600"
          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
      }`}
      onClick={onClick}
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
};
