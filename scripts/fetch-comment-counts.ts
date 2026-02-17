/**
 * Fetches comment counts from GitHub Discussions (Giscus) and writes to data/comments.json.
 *
 * Usage: GITHUB_TOKEN=xxx bun run scripts/fetch-comment-counts.ts
 * Or: bun run fetch-comments (if gh CLI is authenticated)
 */

import { writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const REPO_OWNER = "hutusi";
const REPO_NAME = "hutusi.github.com";
const CATEGORY_ID = "DIC_kwDOADgjas4COYln"; // "Comments" category

function getToken(): string {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }
  try {
    return execSync("gh auth token", { encoding: "utf-8" }).trim();
  } catch {
    console.error("No GITHUB_TOKEN env var and gh CLI not authenticated.");
    process.exit(1);
  }
}

interface Discussion {
  title: string;
  comments: { totalCount: number };
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface GraphQLResponse {
  data: {
    repository: {
      discussions: {
        nodes: Discussion[];
        pageInfo: PageInfo;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

async function fetchDiscussions(token: string): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const afterClause = cursor ? `, after: "${cursor}"` : "";
    const query = `{
      repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
        discussions(first: 100, categoryId: "${CATEGORY_ID}"${afterClause}) {
          nodes {
            title
            comments {
              totalCount
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }`;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const json = (await response.json()) as GraphQLResponse;

    if (json.errors) {
      throw new Error(`GraphQL errors: ${json.errors.map((e) => e.message).join(", ")}`);
    }

    const { nodes, pageInfo } = json.data.repository.discussions;

    for (const discussion of nodes) {
      // Giscus sets the discussion title to the page pathname
      const pathname = discussion.title.startsWith("/")
        ? discussion.title
        : `/${discussion.title}`;
      counts.set(pathname, discussion.comments.totalCount);
    }

    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return counts;
}

async function main() {
  const token = getToken();
  console.log("Fetching comment counts from GitHub Discussions...");

  const counts = await fetchDiscussions(token);
  const data: Record<string, number> = {};

  // Sort by pathname for stable output
  const sorted = [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
  for (const [pathname, count] of sorted) {
    data[pathname] = count;
  }

  const outPath = join(import.meta.dirname, "..", "data", "comments.json");
  writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(data).length} entries to data/comments.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
