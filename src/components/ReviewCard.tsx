import React from 'react';
import { useThemeStore } from '../stores/theme';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  review: {
    name: string;
    rating: number;
    date: string;
    content: string;
    tags: string[];
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { isDark } = useThemeStore();

  return (
    <div className={`p-6 rounded-2xl ${
      isDark ? 'bg-dark-800' : 'bg-gray-50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-medium ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {review.name}
            </span>
            <span className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              • {new Date(review.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-500 fill-current"
              />
            ))}
          </div>
        </div>
      </div>
      <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {review.content}
      </p>
      <div className="flex flex-wrap gap-2">
        {review.tags.map((tag, index) => (
          <span
            key={index}
            className={`text-sm px-3 py-1.5 rounded-lg ${
              isDark
                ? 'bg-dark-700 text-gray-300'
                : 'bg-white text-gray-700'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}