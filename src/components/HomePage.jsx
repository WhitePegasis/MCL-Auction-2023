import React from 'react';
import homepageimg from '../assets/homepageimg.png';

const HomePage = () => {
  return (
    <div className="flex items-center justify-center bg-[#040215] bg-cover">
      <img 
        src={homepageimg} 
        alt="Homepage" 
        className="w-4/5 h-[750px]" 
      />
    </div>
  );
};

export default HomePage;
