import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized or token missing" }, { status: 401 });
    }

    // @ts-ignore
    const accessToken = session.accessToken;
    const body = await req.json();
    const { repo_full_name, start_date, end_date } = body;

    if (!repo_full_name || !start_date || !end_date) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    let allCommits: any[] = [];
    let page = 1;
    const MAX_PAGES = 5;

    // Use URL object for clean parameter construction
    let url = new URL(`https://api.github.com/repos/${repo_full_name}/commits`);
    url.searchParams.append("since", start_date);
    url.searchParams.append("until", end_date);
    url.searchParams.append("per_page", "100");

    let nextUrl: string | null = url.toString();

    while (nextUrl && page <= MAX_PAGES) {
      const response = await fetch(nextUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.json({ error: "GitHub token expired or invalid." }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to fetch from GitHub API" }, { status: response.status });
      }

      const commits = await response.json();
      
      const mappedCommits = commits.map((item: any) => ({
        message: item.commit.message,
        date: item.commit.committer.date,
        author: item.commit.author?.name || item.commit.committer?.name || "Unknown",
      }));

      allCommits = allCommits.concat(mappedCommits);

      // Check Link header for pagination
      const linkHeader = response.headers.get("Link");
      nextUrl = null;
      if (linkHeader) {
        const links = linkHeader.split(",");
        const nextLink = links.find((link) => link.includes('rel="next"'));
        if (nextLink) {
          const match = nextLink.match(/<([^>]+)>/);
          if (match) {
            nextUrl = match[1];
          }
        }
      }

      page++;
    }

    return NextResponse.json(allCommits);

  } catch (error) {
    console.error("Commits API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
