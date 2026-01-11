export interface PostFrontmatter {
  title: string;
  subtitle?: string;
  date: string;
  category: "essay" | "tech" | "weekly";
  tags: string[];
  image?: string;
  featured?: boolean;
  description?: string;
  gh_discussion?: number;
  redirect_from?: string[];
  rating?: number;
  toc?: boolean;
  beforetoc?: string;
  last_modified_at?: string;
  commentable?: boolean;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  excerpt: string;
  url: string;
  readingTime: number;
  type: "post" | "weekly";
}

export interface Weekly extends PostFrontmatter {
  slug: string;
  content: string;
  excerpt: string;
  url: string;
  readingTime: number;
  type: "weekly";
}

export interface PageFrontmatter {
  title: string;
  description?: string;
  commentable?: boolean;
}

export interface Page extends PageFrontmatter {
  slug: string;
  content: string;
}
