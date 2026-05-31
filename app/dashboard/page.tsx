import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardClient from "./DashboardClient";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // @ts-ignore
  const accessToken = session.accessToken;

  // Fetch top 100 updated repositories
  let repos = [];
  try {
    const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 60 }
    });

    if (res.ok) {
      repos = await res.json();
    } else {
      console.error("Failed to fetch repos", res.status, await res.text());
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pt-8 pb-4 md:p-8 md:pt-12 md:pb-6">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-stone-400 mt-2">Select a repository and date range to generate a changelog.</p>
          </div>
          <SignOutButton />
        </div>
        
        <DashboardClient repos={repos} />
      </div>
    </div>
  );
}
