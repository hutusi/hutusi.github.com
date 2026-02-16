# Gemini Context: Hutusi Next.js Blog

This file provides context for the AI agent (Gemini) interacting with this codebase.

## Project Overview

This is a personal blog and newsletter application built with **Next.js 16** (App Router) and **React 19**. It is designed as a static site (`output: "export"`) optimized for performance and SEO.

**Core Stack:**
*   **Framework:** Next.js 16.1.1
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4
*   **Content:** MDX (via `@next/mdx`, `next-mdx-remote`)
*   **State Management:** React Context (for Theme)

## Building and Running

*   **Development Server:**
    ```bash
    npm run dev
    ```
    Starts the server at `http://localhost:3000`.

*   **Production Build:**
    ```bash
    npm run build
    ```
    Generates the static export in the `out/` directory (standard behavior for `output: "export"`).

*   **Linting:**
    ```bash
    npm run lint
    ```

## Deployment

The project is configured for deployment to a remote Linux server using Nginx.

*   **Script:** `deploy.sh` handles building and syncing files via `rsync`.
*   **Config:** `server_nginx.conf` provides a production-ready Nginx configuration with HTTPS (SSL placeholders), HTTP redirection, and caching.
*   **Guide:** See `README_DEPLOY.md` for detailed instructions.

## Project Structure

*   **`app/`**: Next.js App Router pages and API routes.
    *   `layout.tsx`: Root layout including `ThemeProvider`, Analytics, Header, and Footer. Uses system fonts (no Google Fonts dependency).
    *   `[year]/`, `articles/`, `weeklies/`: Dynamic routes for content.
*   **`content/`**: Source of truth for blog content.
    *   `posts/`: Blog articles (`.mdx` or `.md`).
    *   `weeklies/`: Weekly newsletter editions (`.mdx` or `.md`).
    *   `pages/`: Static pages like About, Links (`.mdx`).
*   **`lib/content.ts`**: Core logic for reading MDX files. Handles **clean slugs** (stripping date prefixes from filenames) and multi-extension support.
*   **`components/`**: Reusable UI components.
    *   `MDXImage.tsx`: Enhanced image component with CDN support (`imagesBaseUrl`), lazy loading, and shadow styling.
    *   `MDXLink.tsx`: Smart link component that opens external links in new tabs with security attributes.
    *   `posts/FeaturedSection.tsx`: Displays a **random selection** of featured posts (shuffled on build and client-side refresh).
*   **`config/`**: Static configuration.
    *   `site.ts`: Central config for site metadata, author info, **logo** (text/icon/image), and `imagesBaseUrl`.

## Development Conventions

*   **Content Creation:**
    *   Create new posts in `content/posts/` or `content/weeklies/`.
    *   Files should have `.md` or `.mdx` extensions.
    *   Files must have YAML frontmatter containing `title`, `date`, `category`, `tags` (as a list), etc.
    *   **URLs:** URLs are generated without date prefixes (e.g., `/articles/my-post` instead of `/articles/2024-01-01-my-post`).
    *   **Images:** Use relative paths in Markdown. They are automatically prefixed with `siteConfig.imagesBaseUrl`.

*   **Theming & Styling:**
    *   **Fonts:** Relies on a robust system font stack defined in `globals.css` (no external font requests).
    *   **Typography:** Prose content uses `font-weight: 400`. Blockquotes are styled with a muted color (`--foreground-muted`), weight `500`, and italic style.
    *   **Dark Mode:** Supported via `ThemeProvider` and Tailwind's `dark:` variant.

*   **Data Fetching:**
    *   Content is fetched at build time using Node.js `fs` module (via `lib/content.ts`).
    *   Featured posts are selected randomly for the homepage to keep content fresh.
