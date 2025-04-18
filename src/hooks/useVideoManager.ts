import { useState, useEffect } from 'react';
import { YouTubeVideo } from '@/types';
import { fetchTrendingVideos } from '@/utils/youtube';

interface UseVideoManagerProps {
  selectedCountry: string;
  selectedCategory: string;
  showShorts: boolean;
}

export const useVideoManager = ({ selectedCountry, selectedCategory, showShorts }: UseVideoManagerProps) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);
  const [popularVideos, setPopularVideos] = useState<YouTubeVideo[]>([]);

  // Helper functions
  const isShorts = (duration: string): boolean => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return false;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds <= 60;
  };

  const filteredVideos = showShorts
    ? videos.filter(video => isShorts(video.duration))
    : videos;

  const loadVideos = async (pageToken: string = ''): Promise<void> => {
    try {
      const response = await fetchTrendingVideos(selectedCountry, selectedCategory, pageToken);
      
      if (pageToken) {
        setVideos(prev => [...prev, ...response.videos]);
      } else {
        setVideos(response.videos);
      }
      setNextPageToken(response.nextPageToken);
    } catch (err) {
      setError('비디오를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleLoadMore = async (): Promise<void> => {
    if (!nextPageToken || loadingMore) return;
    
    setLoadingMore(true);
    await loadVideos(nextPageToken);
    setLoadingMore(false);
  };

  const loadPopularVideos = async (channelId: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&channelId=${channelId}&order=viewCount&part=snippet&type=video&maxResults=2`
      );
      const data = await response.json();
      
      if (data.items) {
        const popularVideosData = await Promise.all(
          data.items.map(async (item: any) => {
            const videoResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&id=${item.id.videoId}&part=snippet,statistics,contentDetails`
            );
            const videoData = await videoResponse.json();
            const video = videoData.items[0];
            
            return {
              id: video.id,
              title: video.snippet.title,
              channelTitle: video.snippet.channelTitle,
              channelId: video.snippet.channelId,
              thumbnailUrl: video.snippet.thumbnails.high.url,
              viewCount: video.statistics.viewCount,
              likeCount: video.statistics.likeCount || '0',
              publishedAt: video.snippet.publishedAt,
              duration: video.contentDetails.duration,
            };
          })
        );
        setPopularVideos(popularVideosData);
      }
    } catch (err) {
      console.error('인기 비디오를 불러오는 중 오류가 발생했습니다.', err);
    }
  };

  const handleOpenVideo = async (videoId: string) => {
    try {
      const videoIndex = filteredVideos.findIndex(video => video.id === videoId);
      if (videoIndex !== -1) {
        setActiveVideoIndex(videoIndex);
        setActiveVideo(filteredVideos[videoIndex]);
        await loadPopularVideos(filteredVideos[videoIndex].channelId);
      }
    } catch (err) {
      console.error('비디오를 불러오는 중 오류가 발생했습니다.', err);
    }
  };

  const handleCloseVideo = () => {
    setActiveVideoIndex(null);
    setActiveVideo(null);
  };

  const handlePreviousVideo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeVideoIndex !== null && activeVideoIndex > 0) {
      const newIndex = activeVideoIndex - 1;
      setActiveVideoIndex(newIndex);
      const selectedVideo = filteredVideos[newIndex];
      setActiveVideo(selectedVideo);
      await loadPopularVideos(selectedVideo.channelId);
    }
  };

  const handleNextVideo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeVideoIndex !== null && activeVideoIndex < filteredVideos.length - 1) {
      const newIndex = activeVideoIndex + 1;
      setActiveVideoIndex(newIndex);
      const selectedVideo = filteredVideos[newIndex];
      setActiveVideo(selectedVideo);
      await loadPopularVideos(selectedVideo.channelId);
    }
  };

  // Initial load
  useEffect(() => {
    const initialLoad = async (): Promise<void> => {
      setLoading(true);
      setError('');
      await loadVideos();
      setLoading(false);
    };

    initialLoad();
  }, [selectedCategory, selectedCountry]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeVideoIndex === null) return;

      if (e.key === 'ArrowLeft' && activeVideoIndex > 0) {
        const newIndex = activeVideoIndex - 1;
        setActiveVideoIndex(newIndex);
        setActiveVideo(filteredVideos[newIndex]);
        loadPopularVideos(filteredVideos[newIndex].channelId);
      } else if (e.key === 'ArrowRight' && activeVideoIndex < filteredVideos.length - 1) {
        const newIndex = activeVideoIndex + 1;
        setActiveVideoIndex(newIndex);
        setActiveVideo(filteredVideos[newIndex]);
        loadPopularVideos(filteredVideos[newIndex].channelId);
      } else if (e.key === 'Escape') {
        handleCloseVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoIndex, filteredVideos]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (activeVideoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeVideoIndex]);

  return {
    videos: filteredVideos,
    loading,
    loadingMore,
    error,
    nextPageToken,
    activeVideo,
    popularVideos,
    handleLoadMore,
    handleOpenVideo,
    handleCloseVideo,
    handlePreviousVideo,
    handleNextVideo,
  };
}; 