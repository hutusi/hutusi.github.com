# hutusi.com (胡涂说) - Next.js Blog

This is the personal blog and newsletter application for [hutusi.com](https://hutusi.com), built with **Next.js 16** and **React 19**.

## Features

- **Static Site Generation (SSG)**: Fast, SEO-friendly, and easy to deploy via `output: "export"`.
- **MDX Powered Content**: Write posts in Markdown or MDX with support for custom React components.
- **Clean URLs**: Slugs are generated without date prefixes for a cleaner structure.
- **Responsive Design**: Built with **Tailwind CSS v4** and a mobile-first approach.
- **Dark Mode**: Seamless theme switching with system preference detection.
- **Enhanced MDX Components**:
  - `MDXImage`: Automatic CDN resolution, lazy loading, and shadow effects.
  - `MDXLink`: Smart handling of external links (opens in new tab) and internal links.
- **Random Featured Posts**: Shuffled featured content on the homepage to keep it fresh.
- **Dual Comment System**: Integrated with **Giscus** (GitHub Discussions) and **Disqus**.
- **SEO Ready**: Automatic sitemap, RSS feed, and OpenGraph/Twitter meta tags.
- **System Fonts**: Optimized typography using system fonts (no Google Fonts dependencies).

## Getting Started

### Installation

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### Development

```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the results.

### Production Build

```bash
bun run build
```
The static files will be generated in the `out/` directory.

## Deployment

The project is configured for deployment to a Linux server with Nginx.

1.  Configure your server details in `deploy.sh`.
2.  Run the deployment script:
    ```bash
    ./deploy.sh
    ```
See [README_DEPLOY.md](README_DEPLOY.md) for detailed instructions.

## License

Personal content. Code is available under the MIT license.
