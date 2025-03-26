import React from "react";

interface NavItemProps {
  className?: string;
  href: string;
  text: string;
}

const NavItem: React.FC<NavItemProps> = ({ className, href, text }) => {
  return (
    <div id="nav-item" className={`nav-item ${className}`}>
      <a href={href}>{text}</a>
    </div>
  );
};

export default NavItem;
