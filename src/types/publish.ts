export interface Plan {
  id: string;
  name?: string;
  startDate: string;
  endDate: string;
  count: number;
  notes: Note[];
  accountId?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  contentType?: '产品介绍' | '使用体验' | '生活记录' | '探店安利' | '干货分享';
  tone?: '轻松随意' | '专业正式' | '感性文艺' | '幽默诙谐';
  tags?: string[];
  scheduledTime?: string;
  status?: 'published' | 'unpublished';
}

export interface XHSAccount {
  id: string;
  avatar: string;
  nickname: string;
  followers: number;
  posts: number;
  status: 'active' | 'inactive';
  growth: {
    followers: number;
    views: number;
    likes: number;
    comments: number;
    saves: number;
  };
  recentPosts: {
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    saves: number;
  }[];
}

export interface PublishStrategy {
  mode: 'additional' | 'replace';
  priorities: string[];
}

export interface ImageMaterial {
  id: string;
  url: string;
  createTime: string;
  tags: string[];
  usagePlan?: {
    date: string;
    title: string;
    contentType: string;
  };
}
