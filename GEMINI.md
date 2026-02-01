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

## Project Structure

*   **`app/`**: Next.js App Router pages and API routes.
    *   `layout.tsx`: Root layout including `ThemeProvider`, Analytics, Header, and Footer.
    *   `[year]/`, `articles/`, `weeklies/`: Dynamic routes for content.
*   **`content/`**: Source of truth for blog content.
    *   `posts/`: Blog articles (`.mdx`).
    *   `weeklies/`: Weekly newsletter editions (`.mdx`).
    *   `pages/`: Static pages like About, Links (`.mdx`).
*   **`lib/content.ts`**: Core logic for reading MDX files from the filesystem, parsing frontmatter (with `gray-matter`), and handling sorting/filtering.
*   **`components/`**: Reusable UI components.
    *   `theme/`: Dark/Light mode logic (`ThemeProvider.tsx`).
    *   `analytics/`: Google and Umami analytics components.
*   **`config/`**: Static configuration (site metadata, navigation links).

## Development Conventions

*   **Content Creation:**
    *   Create new posts in `content/posts/` or `content/weeklies/`.
    *   Files should have `.md` or `.mdx` extensions.
    *   Files must have YAML frontmatter containing `title`, `date`, `category`, `tags`, etc.
    *   The filename slug is used as the URL path.

*   **Theming:**
    *   The site supports Light, Dark, and System themes.
    *   It uses a custom `ThemeProvider` that toggles the `dark` class on the `<html>` element.
    *   A script in `app/layout.tsx` prevents theme flashing on load.

*   **Data Fetching:**
    *   Content is fetched at build time using Node.js `fs` module (via `lib/content.ts`).
    *   Since this is a static export, all data fetching happens during `next build`.
