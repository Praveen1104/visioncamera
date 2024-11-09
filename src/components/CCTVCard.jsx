import React from "react";

const CCTVCard = ({ title, location, imageUrl }) => {
  return (
    <div className="w-full md:w-auto p-1 mx-1.5 flex flex-col items-center hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <div className="rounded-lg shadow-md overflow-hidden bg-opacity-50 backdrop-blur-lg backdrop-filter">
        <img src={imageUrl} alt={title} className="w-full h-50 object-cover" />
      </div>
      <p className="text-gray-300 mt-2 text-center">{location}</p>
    </div>
  );
};

export default CCTVCard;
