"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github, Sparkles, Activity, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />

      <main className="z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-sm font-medium text-emerald-400 mb-4 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span>Introducing Logify</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500 pb-2">
            AI Changelog Generator
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Automatically generate beautiful, comprehensive changelogs from your GitHub repositories using advanced AI. Keep your users informed with zero manual effort.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Button 
            size="lg" 
            className="bg-white text-slate-950 hover:bg-slate-200 transition-all duration-300 font-semibold px-8 h-14 rounded-xl text-lg flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]"
            onClick={() => signIn('github')}
          >
            <Github className="w-6 h-6" />
            Sign in with GitHub
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-slate-800/50 w-full text-left">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Activity className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold">Automated Tracking</h3>
            <p className="text-slate-400">Connect your repo and let our AI analyze commits, pull requests, and issues automatically.</p>
          </div>
          
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold">AI Summarization</h3>
            <p className="text-slate-400">Generates human-readable, engaging release notes categorized by features, fixes, and chores.</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <Lock className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-xl font-semibold">Secure by Design</h3>
            <p className="text-slate-400">We only request the permissions we need. Your code stays secure and private.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
