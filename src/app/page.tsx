import Link from 'next/link';
import { Terminal, Code2, Cpu, Trophy, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 px-4">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>The Ultimate C/C++ Prep Platform</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">C & C++</span><br className="hidden sm:block"/> Like a Pro.
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400">
            Topic-wise practice, real-time compilation, and progress tracking. Build your logic and ace your technical interviews.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/practice" className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
              Start Practicing Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-slate-300 transition-all duration-200 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 backdrop-blur-sm">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl glass-panel group hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Topic-wise Prep</h3>
              <p className="text-slate-400">From 1D Arrays to STL, practice questions curated systematically to build your foundations.</p>
            </div>
            
            <div className="p-8 rounded-2xl glass-panel group hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Integrated Sandbox</h3>
              <p className="text-slate-400">Write, compile, and execute C/C++ code directly in the browser with our high-speed evaluation engine.</p>
            </div>

            <div className="p-8 rounded-2xl glass-panel group hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Progress Tracking</h3>
              <p className="text-slate-400">Monitor your daily streak, track solved questions, and watch your skills improve over time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
