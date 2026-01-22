import logo from '../assets/Logo.webp';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Make sure to import your logo image correctly
// import logo from '../assets/Logo.webp'; 

const Navbar = () => {
  // Get the current page path to determine which link is active
  const location = useLocation();
  const path = location.pathname;

  // Define the common styles for all navigation buttons
  // px-3 py-2: Padding for the button size
  // rounded-md: Rounded corners like in your screenshot
  // text-sm font-medium: Font styling
  // transition-colors: Smooth fade for hover effects
  const baseLinkStyle = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  
  // Style for the button that matches the current page (Blue background)
  const activeLinkStyle = "bg-blue-600 text-white";
  
  // Style for buttons that are not active (Gray text, light gray hover)
  const inactiveLinkStyle = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  // Helper function to combine styles based on the URL
  const getLinkStyle = (linkPath) => {
    // If the current path matches the link, use active style, otherwise use inactive
    return `${baseLinkStyle} ${path === linkPath ? activeLinkStyle : inactiveLinkStyle}`;
  };

  return (
    // Fixed navbar with shadow and white background
    <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo and Brand Name */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Link to="/" className="flex items-center">
            <img className="h-10 w-auto" src={logo} alt="EduHub Logo" />
            <span className="ml-2 text-xl font-bold text-gray-900">New Education Era</span>
            </Link>
          </div>

          {/* Navigation Links - Hidden on mobile, flex on desktop */}
          <div className="hidden md:block">
            {/* space-x-2 adds uniform spacing between all buttons */}
            <div className="ml-10 flex items-baseline space-x-2">
              <Link to="/" className={getLinkStyle('/')}>Home</Link>
              <Link to="/about" className={getLinkStyle('/about')}>About</Link>
              {/* Assuming you have a contact route, if not, this will just be a button */}
              <Link to="/contact" className={getLinkStyle('/contact')}>Contact Us</Link>
              
              {/* New Links with the same consistent styling */}
              <Link to="/early-warning" className={getLinkStyle('/early-warning')}>
                Early Warning
              </Link>
              <Link to="/admin/school-dropout" className={getLinkStyle('/admin/school-dropout')}>
                Dropout Analytics
              </Link>
              <Link to="/subadmin/student-details" className={getLinkStyle('/subadmin/student-details')}>
                Student Monitoring
              </Link>
            </div>
          </div>

          {/* Sign In Button - Points specifically to /signup */}
          <div className="hidden md:block">
            <Link 
            to="/signup" 
            className="ml-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors duration-200"
            >
              Sign In
            </Link>
            </div>
          
          {/* Mobile Menu Button (Hamburger) - Placeholder for future */}
          <div className="-mr-2 flex md:hidden">
              <button type="button" className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">Open main menu</span>
                {/* Icon for hamburger menu would go here */}
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;