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
          </div>
        )}
      </div>
    </header>
  );
};
