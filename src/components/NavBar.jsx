import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-900 py-3">
      <div className="flex items-center justify-between ml-7">
        {/* Left Side: Links */}
        <div className="flex items-center space-x-8">
          <NavLink
            to="./"
            exact="true"
            className="text-white text-xl font-bold no-underline"
          >
            MCL
          </NavLink>
          <NavLink
            to="all"
            exact="true"
            className="text-white text-lg hover:text-gray-400 no-underline"
          >
            All Players
          </NavLink>
          <NavLink
            to="eligible"
            exact="true"
            className="text-white text-lg hover:text-gray-400 no-underline"
          >
            Bidding Page
          </NavLink>
        </div>

        {/* Right Side: Dropdown */}
        <div className="relative mr-3">
          <button
            className="text-white focus:outline-none"
            onClick={toggleDropdown}
          >
            <i className="fas fa-user"></i>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <a
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                href="https://docs.google.com/spreadsheets/d/1GqJfbPYwLsAPW3XKSOgCLZy5QXeci-0IG331Ak34rNc/edit#gid=0"
                target="_blank"
                rel="noreferrer"
              >
                Database
              </a>
              <a
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                href="https://www.instagram.com/white_pegasus_/?hl=en"
                target="_blank"
                rel="noreferrer"
              >
                Creator
              </a>
              <a
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                href="https://www.instagram.com/mcl_msit/"
                target="_blank"
                rel="noreferrer"
              >
                Contact Us
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
