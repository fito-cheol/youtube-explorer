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
import { useVideoManager } from '@/hooks/useVideoManager';
import { Country } from '@/types';

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
  const [categories, setCategories] = useState<YouTubeCategory[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const {
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
  } = useVideoManager({
    selectedCountry,
    selectedCategory,
    showShorts,
  });

  // Load categories
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

  // Initialize dark mode
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Dark mode toggle handler
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Computed values
  const shortsCount = filteredVideos.filter(video => {
    const match = video.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return false;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds <= 60;
  }).length;

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
            totalCount={filteredVideos.length}
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