import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold">PodcastGen</p>
            <p className="text-sm text-gray-400">Create amazing podcasts with AI</p>
          </div>
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} PodcastGen. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;