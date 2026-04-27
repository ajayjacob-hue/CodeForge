'use client';
import Link from 'next/link';
import { Terminal, LogOut, User as UserIcon } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

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
            {session && (
              <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            )}
            <div className="h-6 w-px bg-slate-700 mx-2"></div>
            
            {status === 'loading' ? (
              <div className="w-20 h-8 bg-slate-800 animate-pulse rounded-lg"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">{session.user?.name}</span>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href="/signin" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
