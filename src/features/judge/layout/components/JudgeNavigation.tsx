import React from "react";
import Link from "next/link";
import { BaseButton } from "@/components/ui/BaseButton";
import { Home, LogOut, BookOpen } from "lucide-react";

interface JudgeNavigationProps {
  pathname: string;
  onSignOut: () => void;
}

export const JudgeNavigation: React.FC<JudgeNavigationProps> = ({
  pathname,
  onSignOut,
}) => {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl mr-2 text-primary-600">
                Contest Judge Portal
              </span>
            </div>
            <div className="ml-6 flex space-x-4">
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
          </div>
          <div className="flex items-center">
            <BaseButton
              onClick={onSignOut}
              variant="ghost"
              size="sm"
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Sign out
            </BaseButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper component for navigation links
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
