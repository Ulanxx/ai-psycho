import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../stores/theme';
import { Star, Video, Shield } from 'lucide-react';

export interface Therapist {
  id: string;
  name: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  videoAvailable: boolean;
  insurance: string[];
  availability: {
    today: number;
    tomorrow: number;
    nextDay: number;
  };
  waitTime: string;
  isSponsored?: boolean;
}

interface TherapistCardProps {
  therapist: Therapist;
}

export function TherapistCard({ therapist }: TherapistCardProps) {
  const { isDark } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div
      className={`rounded-xl p-3 sm:p-4 ${isDark ? 'bg-dark-800/50' : 'bg-white'
        } cursor-pointer`}
      onClick={() => navigate(`/therapist/${therapist.id}`)}
    >
      {/* 头部：头像、名称、标题 */}
      <div className="flex gap-3">
        <div className="relative">
          <img
            src={therapist.image}
            alt={therapist.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
          />
          {therapist.videoAvailable && (
            <Video className="w-4 h-4 absolute bottom-0 right-0 text-blue-500 bg-white rounded-full p-0.5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  {therapist.name}
                </h3>
                {therapist.isSponsored && (
                  <span className="text-xs text-gray-400">Sponsored</span>
                )}
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {therapist.title}
              </p>
            </div>
          </div>

          {/* 评分和评论数 */}
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {therapist.rating}
            </span>
            <span className="text-sm text-gray-400">
              · {therapist.reviewCount} reviews
            </span>
          </div>
        </div>
      </div>

      {/* 保险和视频就诊信息 */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <Video className="w-4 h-4" />
          <span>Video Visit · External</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <Shield className="w-4 h-4" />
          <span>In-network · {therapist.insurance.join(', ')}</span>
        </div>
      </div>

      {/* 预约信息 */}
      <div className="mt-3">
        <p className="text-sm text-gray-400 mb-2">
          New patient appointments · {therapist.waitTime}
        </p>
        <div className="flex gap-2 text-sm">
          {Object.entries(therapist.availability).map(([day, slots]) => (
            <div
              key={day}
              className={`flex-1 p-2 rounded-lg text-center ${slots > 0
                ? 'bg-yellow-100 text-gray-700'
                : isDark ? 'bg-dark-700' : 'bg-gray-100'
                }`}
            >
              <div className="capitalize">{day}</div>
              <div>{slots > 0 ? `${slots} appts` : 'No appts'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}