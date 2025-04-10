// src/components/AdBanner.tsx
import React from "react";

interface AdBannerProps {
  position: "top" | "bottom";
  imageUrl?: string; // URL to the banner image
  linkUrl?: string;  // URL where clicking the banner should lead
  altText?: string;  // Alternative text for the image
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  position, 
  imageUrl, 
  linkUrl, 
  altText = "Advertisement" 
}) => {
  // If we have both an image and a link, render a linked banner
  if (imageUrl && linkUrl) {
    return (
      <div className={`w-full p-4 text-center ${position === "bottom" ? "mt-8" : "mb-8"}`}>
        <a 
          href={linkUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block"
        >
          <img 
            src={imageUrl} 
            alt={altText} 
            className="w-full max-h-32 object-contain mx-auto rounded-md"
          />
        </a>
      </div>
    );
  }
  
  // If we only have an image but no link
  if (imageUrl) {
    return (
      <div className={`w-full p-4 text-center ${position === "bottom" ? "mt-8" : "mb-8"}`}>
        <img 
          src={imageUrl} 
          alt={altText} 
          className="w-full max-h-32 object-contain mx-auto rounded-md"
        />
      </div>
    );
  }
  
  // Fallback to placeholder if no image is provided
  return (
    <div className={`w-full bg-gray-100 p-4 text-center ${position === "bottom" ? "mt-8" : "mb-8"}`}>
      <div className="border-2 border-dashed border-gray-300 py-8 rounded-md">
        <p className="text-gray-500 font-medium">Advertisement Space</p>
        <p className="text-sm text-gray-400">Banner {position === "top" ? "Top" : "Bottom"}</p>
      </div>
    </div>
  );
};

export default AdBanner;