import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FireIcon } from '@heroicons/react/solid';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, HeartIcon, SunIcon, MoonIcon } from '@heroicons/react/outline';
import VideoCard from '@/components/VideoCard';
import { fetchTrendingVideos, fetchVideoCategories, YouTubeVideo, YouTubeCategory } from '@/utils/youtube';
import VideoModal from '@/components/VideoModal';
import Header from '@/components/Header';
import Filters from '@/components/Filters';
import VideoGrid from '@/components/VideoGrid';

// Types
interface Country {
  code: string;
  name: string;
}

// Constants
const COUNTRIES: Country[] = [
  { code: 'KR', name: '한국' },
  { code: 'US', name: '미국' },
  { code: 'JP', name: '일본' },
  { code: 'GB', name: '영국' },
];

export default function Home() {
  // State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('KR');
  const [showShorts, setShowShorts] = useState(false);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [categories, setCategories] = useState<YouTubeCategory[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [popularVideos, setPopularVideos] = useState<YouTubeVideo[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

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

  const handleVideoChange = (index: number) => {
    setSelectedVideoIndex(index);
  };

  const handleOpenVideo = async (videoId: string) => {
    try {
      // 현재 비디오의 인덱스 찾기
      const videoIndex = filteredVideos.findIndex(video => video.id === videoId);
      if (videoIndex !== -1) {
        setActiveVideoIndex(videoIndex);
      }

      // 선택된 비디오 정보 가져오기
      const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&id=${videoId}&part=snippet,statistics,contentDetails`);
      const videoData = await videoResponse.json();
      const video = videoData.items[0];
      
      const selectedVideo = {
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

      // 인기 비디오 로드
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&channelId=${selectedVideo.channelId}&order=viewCount&part=snippet&type=video&maxResults=2`);
      const data = await response.json();
      
      if (data.items) {
        const popularVideosData = await Promise.all(
          data.items.map(async (item: any) => {
            const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&id=${item.id.videoId}&part=snippet,statistics,contentDetails`);
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

      // 현재 재생 중인 비디오 업데이트
      setActiveVideo(selectedVideo);
    } catch (err) {
      console.error('비디오를 불러오는 중 오류가 발생했습니다.', err);
    }
  };

  // Effects
  useEffect(() => {
    const loadCategories = async (): Promise<void> => {
      try {
        const categories = await fetchVideoCategories(selectedCountry);
        setCategories(categories);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();
  }, [selectedCountry]);

  useEffect(() => {
    const initialLoad = async (): Promise<void> => {
      setLoading(true);
      setError('');
      await loadVideos();
      setLoading(false);
    };

    initialLoad();
  }, [selectedCategory, selectedCountry]);

  // 다크모드 상태 초기화
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // 다크모드 토글 핸들러
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Computed values
  const filteredVideos = showShorts
    ? videos.filter(video => isShorts(video.duration))
    : videos;

  const shortsCount = videos.filter(video => isShorts(video.duration)).length;
  const totalCount = videos.length;

  // Video modal handlers
  const handleCloseVideo = () => {
    setActiveVideoIndex(null);
    setActiveVideo(null);
  };

  const handlePreviousVideo = async (e: React.MouseEvent) => {
    console.log('Previous button clicked');
    console.log('Current activeVideoIndex:', activeVideoIndex);
    e.stopPropagation();
    if (activeVideoIndex !== null && activeVideoIndex > 0) {
      const newIndex = activeVideoIndex - 1;
      console.log('New index:', newIndex);
      setActiveVideoIndex(newIndex);
      
      // 새 비디오 설정
      const selectedVideo = filteredVideos[newIndex];
      console.log('Selected video:', selectedVideo);
      setActiveVideo(selectedVideo);
      
      // 인기 비디오 업데이트
      try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&channelId=${selectedVideo.channelId}&order=viewCount&part=snippet&type=video&maxResults=2`);
        const data = await response.json();
        
        if (data.items) {
          const popularVideosData = await Promise.all(
            data.items.map(async (item: any) => {
              const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&id=${item.id.videoId}&part=snippet,statistics,contentDetails`);
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
    }
  };

  const handleNextVideo = async (e: React.MouseEvent) => {
    console.log('Next button clicked');
    console.log('Current activeVideoIndex:', activeVideoIndex);
    e.stopPropagation();
    if (activeVideoIndex !== null && activeVideoIndex < filteredVideos.length - 1) {
      const newIndex = activeVideoIndex + 1;
      console.log('New index:', newIndex);
      setActiveVideoIndex(newIndex);
      
      // 새 비디오 설정
      const selectedVideo = filteredVideos[newIndex];
      console.log('Selected video:', selectedVideo);
      setActiveVideo(selectedVideo);
      
      // 인기 비디오 업데이트
      try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&channelId=${selectedVideo.channelId}&order=viewCount&part=snippet&type=video&maxResults=2`);
        const data = await response.json();
        
        if (data.items) {
          const popularVideosData = await Promise.all(
            data.items.map(async (item: any) => {
              const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&id=${item.id.videoId}&part=snippet,statistics,contentDetails`);
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
    }
  };

  // Keyboard events for video navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeVideoIndex === null) return;

      if (e.key === 'ArrowLeft' && activeVideoIndex > 0) {
        setActiveVideoIndex(activeVideoIndex - 1);
      } else if (e.key === 'ArrowRight' && activeVideoIndex < filteredVideos.length - 1) {
        setActiveVideoIndex(activeVideoIndex + 1);
      } else if (e.key === 'Escape') {
        setActiveVideoIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoIndex, filteredVideos.length]);

  // Format helpers for the modal
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

  // 모달이 열렸을 때 body 스크롤 막기
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

  return (
    <>
      <Head>
        <title>YouTube Explorer - 트렌드 탐색기</title>
        <meta name="description" content="YouTube 트렌드와 인기 채널을 탐색해보세요" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen p-4 md:p-8 bg-white dark:bg-gray-900">
        <Header
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <div className="max-w-7xl mx-auto">
          <Filters
            selectedCategory={selectedCategory}
            selectedCountry={selectedCountry}
            showShorts={showShorts}
            categories={categories}
            shortsCount={shortsCount}
            totalCount={totalCount}
            onCategoryChange={setSelectedCategory}
            onCountryChange={setSelectedCountry}
            onShowShortsChange={setShowShorts}
          />

          <VideoGrid
            videos={filteredVideos}
            onOpenVideo={handleOpenVideo}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            nextPageToken={nextPageToken}
            onLoadMore={handleLoadMore}
          />
        </div>

        <VideoModal
          activeVideo={activeVideo}
          filteredVideos={filteredVideos}
          popularVideos={popularVideos}
          onClose={handleCloseVideo}
          onPreviousVideo={handlePreviousVideo}
          onNextVideo={handleNextVideo}
          onOpenVideo={handleOpenVideo}
        />
      </main>
    </>
  );
} 