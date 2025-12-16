import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PostImage {
  id: string;
  image_url: string;
  image_order: number;
}

interface PostImageSliderProps {
  images: PostImage[];
  className?: string;
}

const PostImageSlider: React.FC<PostImageSliderProps> = ({ images, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!images || images.length === 0) return null;

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.image_order - b.image_order);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sortedImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === sortedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (sortedImages.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={sortedImages[0].image_url}
          alt="Post image"
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {sortedImages.map((image, index) => (
            <div key={image.id} className="w-full flex-shrink-0">
              <img
                src={image.image_url}
                alt={`Post image ${index + 1}`}
                className="w-full h-96 object-cover"
              />
            </div>
          ))}
        </div>

        {sortedImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Dots indicator */}
      {sortedImages.length > 1 && sortedImages.length <= 5 && (
        <div className="flex justify-center mt-3 space-x-2">
          {sortedImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip for many images */}
      {sortedImages.length > 5 && (
        <div className="flex mt-3 space-x-2 overflow-x-auto pb-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex ? 'border-blue-600' : 'border-gray-200'
              }`}
            >
              <img
                src={image.image_url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostImageSlider;