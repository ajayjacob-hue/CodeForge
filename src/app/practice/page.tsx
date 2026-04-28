'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, LayoutList, CheckCircle2, Loader2 } from 'lucide-react';

export default function PracticePage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from cache on mount for "instant" feel
  useEffect(() => {
    const cachedTopics = localStorage.getItem('codeforge_topics');
    const cachedLastTopic = localStorage.getItem('codeforge_last_topic');
    
    if (cachedTopics) {
      const parsedTopics = JSON.parse(cachedTopics);
      setTopics(parsedTopics);
      if (cachedLastTopic) {
        setActiveTopic(cachedLastTopic);
      } else if (parsedTopics.length > 0) {
        setActiveTopic(parsedTopics[0]._id);
      }
    }
  }, []);

  useEffect(() => {
    fetch('/api/topics')
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        localStorage.setItem('codeforge_topics', JSON.stringify(data));
        if (data.length > 0 && !activeTopic) {
          setActiveTopic(data[0]._id);
        }
      });
  }, []);

  useEffect(() => {
    if (activeTopic) {
      localStorage.setItem('codeforge_last_topic', activeTopic);
      
      // Check for cached questions for this topic
      const cachedQuestions = localStorage.getItem(`codeforge_questions_${activeTopic}`);
      if (cachedQuestions) {
        setQuestions(JSON.parse(cachedQuestions));
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      fetch(`/api/questions?topicId=${activeTopic}`)
        .then(res => res.json())
        .then(data => {
          setQuestions(data);
          localStorage.setItem(`codeforge_questions_${activeTopic}`, JSON.stringify(data));
          setIsLoading(false);
        });
    }
  }, [activeTopic]);

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex flex-col flex-1 min-h-0">
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-3xl font-bold text-white mb-2">Practice Space</h1>
          <p className="text-slate-400">Select a topic and start solving to build your streak.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
          {/* Topics Sidebar */}
          <div className="w-full lg:w-1/4 flex-shrink-0 glass-panel rounded-2xl p-4 flex flex-col min-h-0 max-h-[300px] lg:max-h-full">
            <div className="flex items-center space-x-2 mb-4 px-2 flex-shrink-0">
              <LayoutList className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Topics</h2>
            </div>
            <div className="flex flex-row overflow-x-auto lg:overflow-x-hidden pb-2 lg:pb-0 lg:flex-col lg:space-y-1 gap-2 lg:gap-0 custom-scrollbar lg:overflow-y-auto flex-1 scrollbar-hide">
              {topics.map(topic => (
                <button
                  key={topic._id}
                  onClick={() => setActiveTopic(topic._id)}
                  className={`flex-shrink-0 whitespace-nowrap lg:w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTopic === topic._id 
                      ? 'bg-blue-600 text-white font-medium shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{topic.name}</span>
                  <ChevronRight className={`hidden lg:block w-4 h-4 ${activeTopic === topic._id ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="flex-1 w-full space-y-4 overflow-y-auto pr-2 custom-scrollbar pb-10">
            {isLoading && questions.length === 0 ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : questions.length === 0 ? (
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
    </div>
  );
}
