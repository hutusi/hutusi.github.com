import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/content";
import { formatDate, getImageUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import Comments from "@/components/comments/Comments";
import ReadingProgress from "@/components/posts/ReadingProgress";
import MDXImage from "@/components/MDXImage";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Not Found" };
  }

  return {
    title: post.title,
    description: post.description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [siteConfig.author.name],
      images: post.image ? [getImageUrl(post.image)] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || post.excerpt,
      images: post.image ? [getImageUrl(post.image)] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = await getAdjacentPosts(slug, "post");

  return (
    <>
      <ReadingProgress />
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="text-xl text-[var(--foreground-secondary)] mb-4">{post.subtitle}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
            {post.category && (
              <>
                <span>·</span>
                <Link
                  href={`/category/${post.category}`}
                  className="text-[var(--accent)] hover:underline"
                >
                  {post.category}
                </Link>
              </>
            )}
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="tag"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(post.image)}
              alt={post.title}
              className="w-full"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote
            source={post.content}
            components={{
              img: MDXImage,
            }}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypePrettyCode,
                    {
                      theme: {
                        dark: "github-dark",
                        light: "github-light",
                      },
                      keepBackground: false,
                    },
                  ],
                ],
                format: "md",
              },
            }}
          />
        </div>

        {/* Author */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-4">
            <img
              src={siteConfig.author.avatar}
              alt={siteConfig.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-medium text-[var(--foreground)]">
                {siteConfig.author.fullName}
              </div>
              <div className="text-sm text-[var(--foreground-muted)]">{siteConfig.author.bio}</div>
            </div>
          </div>

          {siteConfig.social.wechat && (
            <div className="flex flex-col items-center gap-2">
              <img
                src={siteConfig.social.wechat}
                alt="WeChat QR Code"
                className="w-24 h-24 rounded-lg border border-[var(--border-light)] shadow-sm"
              />
              <span className="text-xs text-[var(--foreground-muted)]">关注公众号：胡涂说</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex justify-between gap-4">
            {prev ? (
              <Link
                href={prev.url}
                className="flex-1 p-4 bg-[var(--background)] rounded-lg hover:bg-[var(--border-light)] border border-[var(--border-light)] transition-colors"
              >
                <div className="text-sm text-[var(--foreground-muted)] mb-1">← 上一篇</div>
                <div className="font-medium text-[var(--foreground)] line-clamp-2">
                  {prev.title}
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                href={next.url}
                className="flex-1 p-4 bg-[var(--background)] rounded-lg hover:bg-[var(--border-light)] border border-[var(--border-light)] transition-colors text-right"
              >
                <div className="text-sm text-[var(--foreground-muted)] mb-1">下一篇 →</div>
                <div className="font-medium text-[var(--foreground)] line-clamp-2">
                  {next.title}
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </nav>

        {/* Comments */}
        <Comments url={post.url} identifier={post.slug} title={post.title} />
      </article>
    </>
  );
}