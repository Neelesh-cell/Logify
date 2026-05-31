import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { Sparkles, Bug, Zap, ArrowRight, GitBranch } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const revalidate = 60; // optionally cache for 60 seconds

export default async function ChangelogPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch the changelog from Supabase using the server client
  const { data: changelog, error } = await supabaseServer
    .from("changelogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !changelog) {
    notFound();
  }

  const { repo_full_name, created_at, changelog_content } = changelog;
  const { overallSummary, categories } = changelog_content;

  const hasFeatures = categories?.features?.items?.length > 0;
  const hasFixes = categories?.fixes?.items?.length > 0;
  const hasImprovements = categories?.improvements?.items?.length > 0;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-50 flex flex-col relative overflow-hidden font-sans">
      {/* Background aesthetics */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <main className="flex-grow z-10 flex flex-col items-center pt-12 pb-16 px-6 max-w-4xl mx-auto w-full space-y-10 md:space-y-16 animate-fade-in-up">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-medium text-stone-400 mb-2">
            <GitBranch className="w-4 h-4" />
            <span>{repo_full_name}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-stone-200 to-stone-500 pb-2">
            Release Notes
          </h1>
          <p className="text-stone-500 font-medium">
            Published on {format(new Date(created_at), "MMMM do, yyyy")}
          </p>
        </header>

        {/* Hero Card for Summary */}
        <div className="w-full bg-stone-900/60 border border-stone-800 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Summary</h2>
              <p className="text-stone-300 leading-relaxed">{overallSummary}</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="w-full space-y-12">
          {/* Features */}
          {hasFeatures && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
                <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold text-emerald-400">New Features</h3>
              </div>
              <p className="text-stone-400 font-medium pl-2">{categories.features.summary}</p>
              <ul className="space-y-4 pl-2">
                {categories.features.items.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-stone-300">
                    <ArrowRight className="w-5 h-5 text-emerald-500/50 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Improvements */}
          {hasImprovements && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
                <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-blue-400">Improvements</h3>
              </div>
              <p className="text-stone-400 font-medium pl-2">{categories.improvements.summary}</p>
              <ul className="space-y-4 pl-2">
                {categories.improvements.items.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-stone-300">
                    <ArrowRight className="w-5 h-5 text-blue-500/50 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Fixes */}
          {hasFixes && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
                <div className="bg-rose-500/20 p-2 rounded-lg border border-rose-500/30">
                  <Bug className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-2xl font-semibold text-rose-400">Bug Fixes</h3>
              </div>
              <p className="text-stone-400 font-medium pl-2">{categories.fixes.summary}</p>
              <ul className="space-y-4 pl-2">
                {categories.fixes.items.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-stone-300">
                    <ArrowRight className="w-5 h-5 text-rose-500/50 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="z-10 py-8 border-t border-stone-800/50 mt-auto">
        <div className="flex justify-center">
          <Link 
            href="/" 
            className="group flex items-center gap-2 px-4 py-2 bg-stone-900 border border-stone-800 rounded-full hover:bg-stone-800 hover:border-stone-700 transition-all duration-300"
          >
            <span className="text-sm text-stone-400 group-hover:text-stone-300 transition-colors">Generated with</span>
            <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Logify</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
