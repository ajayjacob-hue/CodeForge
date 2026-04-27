'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, LayoutList, CheckCircle2 } from 'lucide-react';

export default function PracticePage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/topics')
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        if (data.length > 0) setActiveTopic(data[0]._id);
      });
  }, []);

  useEffect(() => {
    if (activeTopic) {
      fetch(`/api/questions?topicId=${activeTopic}`)
        .then(res => res.json())
        .then(data => setQuestions(data));
    }
  }, [activeTopic]);

  return (
    <div className="flex flex-col flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Practice Space</h1>
        <p className="text-slate-400">Select a topic and start solving to build your streak.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Topics Sidebar */}
        <div className="w-full lg:w-1/4 flex-shrink-0 glass-panel rounded-2xl p-4 sticky top-24">
          <div className="flex items-center space-x-2 mb-4 px-2">
            <LayoutList className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Topics</h2>
          </div>
          <div className="space-y-1">
            {topics.map(topic => (
              <button
                key={topic._id}
                onClick={() => setActiveTopic(topic._id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeTopic === topic._id 
                    ? 'bg-blue-600 text-white font-medium shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{topic.name}</span>
                <ChevronRight className={`w-4 h-4 ${activeTopic === topic._id ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 w-full space-y-4">
          {questions.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
              No questions found for this topic.
            </div>
          ) : (
            questions.map((q, idx) => (
              <Link 
                href={`/practice/${q._id}`} 
                key={q._id}
                className="group block glass-panel rounded-2xl p-6 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{q.title}</h3>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className={`px-2.5 py-0.5 rounded-full font-medium ${
                          q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                          q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center">
                    <span className="text-blue-400 font-medium group-hover:underline mr-2 opacity-0 group-hover:opacity-100 transition-opacity">Solve Challenge</span>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
