import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/content";
import { formatDate, getImageUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Comments from "@/components/comments/Comments";
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
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-xl text-gray-600 mb-4">{post.subtitle}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
          {post.category && (
            <>
              <span>·</span>
              <Link
                href={`/category/${post.category}/`}
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
                href={`/tag/${encodeURIComponent(tag)}/`}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-[var(--accent)] hover:text-white transition-colors"
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
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              format: "md",
            },
          }}
        />
      </div>

      {/* Author */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src={siteConfig.author.avatar}
            alt={siteConfig.author.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="font-medium text-gray-900">
              {siteConfig.author.fullName}
            </div>
            <div className="text-sm text-gray-500">{siteConfig.author.bio}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between gap-4">
          {prev ? (
            <Link
              href={prev.url}
              className="flex-1 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-sm text-gray-500 mb-1">← 上一篇</div>
              <div className="font-medium text-gray-900 line-clamp-2">
                {prev.title}
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={next.url}
              className="flex-1 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-right"
            >
              <div className="text-sm text-gray-500 mb-1">下一篇 →</div>
              <div className="font-medium text-gray-900 line-clamp-2">
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
  );
}
