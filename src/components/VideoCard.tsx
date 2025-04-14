import { useState, useEffect } from 'react';
import Image from 'next/image';
import { EyeIcon, HeartIcon } from '@heroicons/react/outline';
import { YouTubeVideo } from '@/types/youtube';

// Types
interface VideoCardProps {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  viewCount: string;
  likeCount: string;
  publishedAt: string;
  duration: string;
  onOpenVideo: (videoId: string) => void;
}

// Helper functions
const formatCount = (count: string): string => {
  const num = parseInt(count);
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return count;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDuration = (duration: string) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Main component
export default function VideoCard({
  videoId,
  title,
  channelTitle,
  thumbnailUrl,
  viewCount,
  likeCount,
  publishedAt,
  duration,
  onOpenVideo,
}: VideoCardProps) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onOpenVideo(videoId)}
    >
      <div className="relative">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(duration)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {channelTitle}
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            {formatCount(viewCount)}
          </span>
          <span className="flex items-center">
            <HeartIcon className="h-4 w-4 mr-1" />
            {formatCount(likeCount)}
          </span>
          <span>{formatDate(publishedAt)}</span>
        </div>
      </div>
    </div>
  );
} 