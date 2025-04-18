import { ChevronLeftIcon, ChevronRightIcon, XIcon, EyeIcon, HeartIcon } from '@heroicons/react/outline';
import { YouTubeVideo } from '@/utils/youtube';
import PopularVideos from './PopularVideos';

interface VideoModalProps {
  activeVideo: YouTubeVideo | null;
  filteredVideos: YouTubeVideo[];
  popularVideos: YouTubeVideo[];
  onClose: () => void;
  onPreviousVideo: (e: React.MouseEvent) => void;
  onNextVideo: (e: React.MouseEvent) => void;
  onOpenVideo: (videoId: string) => void;
}

const VideoModal: React.FC<VideoModalProps> = ({
  activeVideo,
  filteredVideos,
  popularVideos,
  onClose,
  onPreviousVideo,
  onNextVideo,
  onOpenVideo,
}) => {
  if (!activeVideo) return null;

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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center p-4"
      onClick={(e) => {
        console.log('Modal backdrop clicked');
        onClose();
      }}
    >
      {/* 메인 비디오 컨테이너 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center w-[70vw]">
          {/* Previous Video Button */}
          {filteredVideos.length > 0 && filteredVideos.findIndex(v => v.id === activeVideo.id) > 0 && (
            <button
              onClick={(e) => {
                console.log('Previous button clicked');
                e.stopPropagation();
                onPreviousVideo(e);
              }}
              className="flex-shrink-0 mr-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-200 z-10"
            >
              <ChevronLeftIcon className="h-8 w-8" />
            </button>
          )}

          <div 
            className="bg-white dark:bg-gray-800 rounded-lg w-full overflow-hidden relative"
            onClick={(e) => {
              console.log('Video container clicked');
              e.stopPropagation();
            }}
          >
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeVideo.title}</h2>
                <button
                  onClick={(e) => {
                    console.log('Close button clicked');
                    e.stopPropagation();
                    onClose();
                  }}
                  className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  {formatCount(activeVideo.viewCount)} 조회수
                </span>
                <span className="flex items-center">
                  <HeartIcon className="h-4 w-4 mr-1" />
                  {formatCount(activeVideo.likeCount)} 좋아요
                </span>
                <span>{formatDate(activeVideo.publishedAt)}</span>
              </div>
              <p className="text-base text-gray-600 dark:text-gray-400">{activeVideo.channelTitle}</p>
            </div>
          </div>

          {/* Next Video Button */}
          {filteredVideos.length > 0 && filteredVideos.findIndex(v => v.id === activeVideo.id) < filteredVideos.length - 1 && (
            <button
              onClick={(e) => {
                console.log('Next button clicked');
                e.stopPropagation();
                onNextVideo(e);
              }}
              className="flex-shrink-0 ml-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-200 z-10"
            >
              <ChevronRightIcon className="h-8 w-8" />
            </button>
          )}
        </div>
      </div>

      {/* 인기 비디오 컨테이너 */}
      <PopularVideos 
        popularVideos={popularVideos}
        onOpenVideo={onOpenVideo}
      />
    </div>
  );
};

export default VideoModal; 