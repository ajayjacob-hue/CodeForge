import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Terminal className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              CodeForge
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/practice" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Practice
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <div className="h-6 w-px bg-slate-700 mx-2"></div>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
