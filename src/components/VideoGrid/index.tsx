import { YouTubeVideo } from '@/utils/youtube';
import VideoCard from '@/components/VideoCard';

interface VideoGridProps {
  videos: YouTubeVideo[];
  onOpenVideo: (videoId: string) => void;
  loading: boolean;
  loadingMore: boolean;
  error: string;
  nextPageToken: string | null;
  onLoadMore: () => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  onOpenVideo,
  loading,
  loadingMore,
  error,
  nextPageToken,
  onLoadMore,
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-youtube-red border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 mb-8">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            videoId={video.id}
            title={video.title}
            channelTitle={video.channelTitle}
            thumbnailUrl={video.thumbnailUrl}
            viewCount={video.viewCount}
            likeCount={video.likeCount}
            publishedAt={video.publishedAt}
            duration={video.duration}
            onOpenVideo={onOpenVideo}
          />
        ))}
      </div>

      {/* Load More Button */}
      {nextPageToken && !loadingMore && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-[#FF0000] text-white rounded-lg hover:bg-[#CC0000] transition-colors shadow-md font-medium text-lg border-2 border-white"
          >
            더 많은 영상 보기
          </button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="text-center mt-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-youtube-red border-t-transparent"></div>
        </div>
      )}
    </>
  );
};

export default VideoGrid; 