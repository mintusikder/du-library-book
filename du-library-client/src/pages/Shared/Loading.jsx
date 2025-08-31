import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        {/* Text */}
        <p className="text-orange-500 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
