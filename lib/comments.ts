import commentData from "@/data/comments.json";

const comments = commentData as Record<string, number>;

export function getCommentCount(pathname: string): number {
  // Try exact match first, then with/without trailing slash
  return comments[pathname]
    ?? comments[pathname.replace(/\/$/, "")]
    ?? comments[pathname + "/"]
    ?? 0;
}

export function getCommentCounts(): Record<string, number> {
  return comments;
}
