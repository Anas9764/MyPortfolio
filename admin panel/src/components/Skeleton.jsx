import React from 'react';

const Skeleton = ({ className, width, height, borderRadius = "rounded-lg" }) => {
  return (
    <div 
      className={`animate-pulse bg-white/5 ${borderRadius} ${className}`}
      style={{ width: width, height: height }}
    ></div>
  );
};

export default Skeleton;
