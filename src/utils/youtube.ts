const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  thumbnailUrl: string;
  viewCount: string;
  likeCount: string;
  publishedAt: string;
  duration: string; // 영상 길이 (ISO 8601 형식)
}

export interface YouTubeResponse {
  videos: YouTubeVideo[];
  nextPageToken: string | null;
}

export interface YouTubeCategory {
  id: string;
  title: string;
}

const categoryTranslations: { [key: string]: string } = {
  '1': '영화 & 애니메이션',
  '2': '자동차 & 차량',
  '10': '음악',
  '15': '애완동물 & 동물',
  '17': '스포츠',
  '18': '짧은 영화',
  '19': '여행 & 이벤트',
  '20': '게임',
  '21': '비디오 블로그',
  '22': '사람 & 블로그',
  '23': '코미디',
  '24': '엔터테인먼트',
  '25': '뉴스 & 정치',
  '26': '스타일',
  '27': '교육',
  '28': '과학 & 기술',
  '29': '비영리 단체 & 활동',
  '30': '영화',
  '31': '애니메이션',
  '32': '액션/어드벤처',
  '33': '클래식',
  '34': '코미디',
  '35': '다큐멘터리',
  '36': '드라마',
  '37': '가족',
  '38': '외국어',
  '39': '공포',
  '40': '공상과학/판타지',
  '41': '스릴러',
  '42': '쇼츠',
  '43': '쇼',
  '44': '예고편',
};

export async function fetchTrendingVideos(
  regionCode: string = 'US',
  categoryId: string = '',
  pageToken: string = ''
): Promise<YouTubeResponse> {
  try {
    const params = new URLSearchParams({
      part: 'snippet,statistics,contentDetails',
      chart: 'mostPopular',
      regionCode,
      maxResults: '50',
      type: 'video',
      key: YOUTUBE_API_KEY || '',
    });

    if (categoryId && categoryId !== 'all') {
      params.append('videoCategoryId', categoryId);
    }

    if (pageToken) {
      params.append('pageToken', pageToken);
    }

    const response = await fetch(`${BASE_URL}/videos?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'YouTube API 요청 실패');
    }

    return {
      videos: data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount || '0',
        publishedAt: item.snippet.publishedAt,
        duration: item.contentDetails.duration,
      })),
      nextPageToken: data.nextPageToken || null,
    };
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    return {
      videos: [],
      nextPageToken: null,
    };
  }
}

export async function fetchVideoCategories(
  regionCode: string = 'US'
): Promise<YouTubeCategory[]> {
  try {
    const params = new URLSearchParams({
      part: 'snippet',
      regionCode,
      key: YOUTUBE_API_KEY || '',
    });

    const response = await fetch(`${BASE_URL}/videoCategories?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'YouTube API 요청 실패');
    }

    return data.items.map((item: any) => ({
      id: item.id,
      title: categoryTranslations[item.id] || item.snippet.title,
    }));
  } catch (error) {
    console.error('Error fetching video categories:', error);
    return [];
  }
} 