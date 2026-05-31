"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown, Loader2, Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function DashboardClient({ repos }: { repos: any[] }) {
  const [open, setOpen] = useState(false);
  const [repoValue, setRepoValue] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [successSlug, setSuccessSlug] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!repoValue || !dateRange.from || !dateRange.to) {
      setError("Please select a repository and a complete date range.");
      return;
    }
    
    setError("");
    setLoading(true);
    setGenerating(false);
    setSuccessSlug("");

    try {
      // Step 1: Fetch Commits
      const res = await fetch("/api/github/commits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_full_name: repoValue,
          start_date: dateRange.from.toISOString(),
          end_date: new Date(new Date(dateRange.to).setHours(23, 59, 59, 999)).toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      if (data.error) throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
      
      if (data.length === 0) {
        throw new Error("No commits found in the selected date range.");
      }

      // Step 2: Generate Changelog with AI
      setLoading(false);
      setGenerating(true);

      const aiRes = await fetch("/api/changelog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_full_name: repoValue,
          commits: data
        }),
      });

      if (!aiRes.ok) {
        const errText = await aiRes.text();
        throw new Error(errText);
      }

      const aiData = await aiRes.json();
      if (aiData.error) throw new Error(typeof aiData.error === 'string' ? aiData.error : JSON.stringify(aiData.error));
      
      setSuccessSlug(aiData.slug);

    } catch (err: any) {
      try {
        const parsed = JSON.parse(err.message);
        const errVal = parsed.error || "Failed to generate changelog.";
        setError(typeof errVal === 'string' ? errVal : JSON.stringify(errVal));
      } catch {
        setError(typeof err?.message === 'string' ? err.message : "Failed to generate changelog.");
      }
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    const url = `${window.location.origin}/changelog/${successSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSuccessSlug("");
    setRepoValue("");
    setDateRange({ from: undefined, to: undefined });
  };

  const selectedRepo = repos?.find((repo) => repo.full_name === repoValue);

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-pulse">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 rounded-full"></div>
          <div className="relative bg-stone-900 border border-stone-700 p-4 rounded-full">
            <Sparkles className="w-10 h-10 text-indigo-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">
          AI is parsing your commits...
        </h2>
        <p className="text-stone-400">Synthesizing features, fixes, and improvements.</p>
      </div>
    );
  }

  if (successSlug) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade-in-up">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Changelog Generated Successfully!</h2>
          <p className="text-stone-400">Your AI-curated release notes are ready to be shared.</p>
        </div>
        
        <div className="w-full max-w-md bg-stone-900/80 border border-stone-700 p-2 rounded-xl flex items-center justify-between shadow-lg">
          <span className="text-stone-300 truncate pl-4 text-sm font-mono">
             {`${typeof window !== 'undefined' ? window.location.origin : ''}/changelogs/${successSlug}`}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        <Button 
          variant="outline" 
          onClick={handleReset}
          className="border-stone-700 text-stone-300 hover:bg-stone-800"
        >
          Generate Another
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Repo Select */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full sm:w-[350px] justify-between bg-stone-900 border-stone-800 text-stone-200 hover:bg-stone-800 hover:text-white"
            >
              <span className="truncate">
                {selectedRepo ? selectedRepo.full_name : "Select repository..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[350px] p-0 bg-stone-900 border-stone-800 text-stone-200">
            <Command className="bg-transparent text-stone-200">
              <CommandInput placeholder="Search repository..." className="text-stone-200 border-b border-stone-800" />
              <CommandList>
                <CommandEmpty>No repository found.</CommandEmpty>
                <CommandGroup>
                  {repos?.map((repo) => (
                    <CommandItem
                      key={repo.id}
                      value={repo.full_name}
                      onSelect={(currentValue) => {
                        setRepoValue(currentValue === repoValue ? "" : currentValue);
                        setOpen(false);
                      }}
                      className="text-stone-200 hover:bg-stone-800 hover:text-white cursor-pointer data-[selected=true]:bg-stone-800 data-[selected=true]:text-white"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          repoValue === repo.full_name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {repo.full_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[300px] justify-start text-left font-normal bg-stone-900 border-stone-800 text-stone-200 hover:bg-stone-800 hover:text-white",
                !dateRange.from && "text-stone-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-stone-900 border-stone-800 text-stone-200" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
              numberOfMonths={2}
              className="bg-transparent text-stone-200"
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button 
        onClick={handleGenerate} 
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Fetching Commits..." : "Generate Changelog"}
      </Button>

      {error && <p className="text-rose-500 font-medium text-sm">{error}</p>}
    </div>
  );
}
