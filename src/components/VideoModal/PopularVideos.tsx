import { YouTubeVideo } from '@/utils/youtube';

interface PopularVideosProps {
  popularVideos: YouTubeVideo[];
  onOpenVideo: (videoId: string) => void;
}

const PopularVideos: React.FC<PopularVideosProps> = ({ popularVideos, onOpenVideo }) => {
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

  if (popularVideos.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mt-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">인기 비디오</h3>
        <div className="grid grid-cols-2 gap-4">
          {popularVideos.map((video) => (
            <div 
              key={video.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                onOpenVideo(video.id);
              }}
            >
              <div className="relative w-24 h-16 flex-shrink-0">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-2 text-gray-900 dark:text-white">{video.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{video.channelTitle}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>{formatCount(video.viewCount)} 조회수</span>
                  <span>•</span>
                  <span>{formatDate(video.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularVideos; 