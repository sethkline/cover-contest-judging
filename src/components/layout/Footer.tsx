import React from "react";

interface FooterProps {
  company?: string;
  address?: string;
  year?: number;
}

export const Footer: React.FC<FooterProps> = ({
  company = "Reverence Studios",
  address = "5240 Simpson Ferry Rd., Mechanicsburg, PA 17050",
  year = new Date().getFullYear(),
}) => {
  return (
    <footer className="text-center text-neutral-500 text-sm mt-12">
      <p>
        © {year} {company}
      </p>
      <p>{address}</p>
    </footer>
  );
};
