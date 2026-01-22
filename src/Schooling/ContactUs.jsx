import React from "react";

const ContactUs = () => {
  return (
    <div className="pt-24 flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-r from-purple-100 to-purple-300">
      <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
      <p className="mt-4 text-lg text-gray-600">
        Have questions? Reach out to us for more information.
      </p>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-lg">
        <h2 className="text-2xl font-semibold">Get in Touch</h2>
        <ul className="mt-4 list-disc list-inside text-gray-600">
          <li>Email: support@schooling.com</li>
          <li>Phone: +1 (555) 123-4567</li>
          <li>Location: 123 School Lane, City, Country</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactUs;
