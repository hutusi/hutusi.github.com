import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return `${basePath}/`;
    return `${basePath}/page/${page}/`;
  };

  const pages: (number | "...")[] = [];

  // Always show first page
  pages.push(1);

  // Show dots if needed
  if (currentPage > 3) {
    pages.push("...");
  }

  // Show pages around current
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  // Show dots if needed
  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  // Always show last page
  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center space-x-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-[var(--accent)] transition-colors"
        >
          ← 上一页
        </Link>
      )}

      <div className="flex items-center space-x-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                isActive
                  ? "bg-[var(--accent)] text-white"
                  : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-[var(--accent)]"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-[var(--accent)] transition-colors"
        >
          下一页 →
        </Link>
      )}
    </nav>
  );
}
