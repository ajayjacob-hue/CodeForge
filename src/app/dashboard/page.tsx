'use client';
import { useState, useEffect } from 'react';
import { Flame, Target, BookOpen, Clock, Activity, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/user/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const data = stats || {
    totalQuestions: 150,
    solvedQuestions: 0,
    streak: 0,
    topicMastery: [],
    recentActivity: []
  };

  const progressPercentage = Math.round((data.solvedQuestions / data.totalQuestions) * 100);

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Dashboard</h1>
        <p className="text-slate-400">Track your progress, view recent submissions, and keep your streak alive.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Streak Card */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-24 h-24 text-orange-500" />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-slate-400 font-medium">Current Streak</h3>
              <div className="text-2xl font-bold text-white">{data.streak} Days</div>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-orange-600 to-orange-400 h-2 rounded-full" style={{ width: `${Math.min(data.streak * 10, 100)}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Solve 1 more problem today to keep it going!</p>
        </div>

        {/* Total Solved Card */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-24 h-24 text-blue-500" />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-slate-400 font-medium">Problems Solved</h3>
              <div className="text-2xl font-bold text-white">{data.solvedQuestions} <span className="text-sm text-slate-500">/ {data.totalQuestions}</span></div>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">You have completed {progressPercentage}% of the curriculum.</p>
        </div>

        {/* Time Spent Card */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-slate-400 font-medium">Total Attempts</h3>
              <div className="text-2xl font-bold text-white">{data.recentActivity.length > 1 ? data.recentActivity.length : data.solvedQuestions}</div>
            </div>
          </div>
          <p className="text-sm text-emerald-400 font-medium mt-4 flex items-center">
            <Activity className="w-4 h-4 mr-1" />
            Keep it up!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Topic Progress */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
            Topic Mastery
          </h2>
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {data.topicMastery.length > 0 ? data.topicMastery.map((topic: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium">{topic.name}</span>
                  <span className="text-slate-500">{topic.solved} / {topic.total}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className={`${topic.color || 'bg-blue-500'} h-2 rounded-full`} style={{ width: `${(topic.solved / topic.total) * 100}%` }}></div>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-sm">Start solving problems to see topic progress.</p>
            )}
          </div>
          <Link href="/practice" className="block w-full text-center py-3 mt-6 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 transition-colors">
            Continue Practicing
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            Recent Submissions
          </h2>
          <div className="space-y-4">
            {data.recentActivity.length > 0 ? data.recentActivity.map((activity: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                <div>
                  <h3 className="text-white font-medium mb-1">{activity.title}</h3>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-500">{activity.topic}</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-slate-500">{activity.time}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'Passed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {activity.status}
                </span>
              </div>
            )) : (
              <p className="text-slate-500 text-sm">No submissions yet.</p>
            )}
          </div>
          <button className="w-full text-center py-3 mt-4 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
