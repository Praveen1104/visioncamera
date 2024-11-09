import React from "react";

function EnlargeView({ images = [] }) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="bg-black relative shadow-lg h-48 sm:h-64 lg:h-80"
          >
            <img
              src={image.url}
              alt={`CCTV Footage ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-xl">
                CCTV Footage {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EnlargeView;
