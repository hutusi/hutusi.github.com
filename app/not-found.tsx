import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-medium text-gray-600 mb-8">页面未找到</h2>
      <p className="text-gray-500 mb-8">您访问的页面不存在或已被移动。</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
}
