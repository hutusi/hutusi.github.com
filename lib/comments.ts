import commentData from "@/data/comments.json";

const comments = commentData as Record<string, number>;

export function getCommentCount(pathname: string): number {
  return comments[pathname] ?? 0;
}

export function getCommentCounts(): Record<string, number> {
  return comments;
}
