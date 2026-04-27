'use client';
import { useState, useEffect, use, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, CheckCircle2, XCircle, AlertTriangle, Loader2, Terminal } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';

export default function ProblemWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const [question, setQuestion] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'problem' | 'submissions' | 'theory'>('problem');
  
  const [code, setCode] = useState<string>('#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}');
  const [language, setLanguage] = useState<'c' | 'cpp'>('c');
  const [customInput, setCustomInput] = useState<string>('');
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState<any>(null);
  
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (output && consoleRef.current) {
      consoleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  useEffect(() => {
    fetch(`/api/questions/${resolvedParams.id}`)
      .then(res => res.json())
      .then(data => {
        setQuestion(data);
        if (data.sampleInput) setCustomInput(data.sampleInput);
        
        const cppTopics = [
          'Class and Objects', 'Constructors and Destructors', 'Static Data Members', 
          'Inline Functions', 'Call by Reference', 'Functions with Default Arguments', 
          'Friend Functions and Friend Class', 'Single Inheritance', 'Multiple Inheritance', 
          'Multi-level Inheritance', 'Hierarchical Inheritance', 'Multipath Inheritance', 
          'Inheritance and Constructors', 'Function Overloading', 'Operator Overloading', 
          'Virtual Functions', 'Pure Virtual Functions', 'Abstract Classes', 
          'Function Templates', 'Class Templates', 'Standard Template Library'
        ];

        if (data.topicId && cppTopics.includes(data.topicId.name)) {
          setLanguage('cpp');
          setCode('#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}');
        } else {
          setLanguage('c');
          setCode('#include <stdio.h>\n\nint main() {\n    // Write your C code here\n    return 0;\n}');
        }
      });
  }, [resolvedParams.id]);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/execute/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, stdin: customInput })
      });
      const data = await res.json();
      setOutput({ type: 'run', data });
    } catch (e: any) {
      setOutput({ type: 'run', data: { success: false, errorType: 'System Error', output: e.message }});
    }
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/execute/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, questionId: question._id })
      });
      const data = await res.json();
      setOutput({ type: 'submit', data });
    } catch (e: any) {
      setOutput({ type: 'submit', data: { success: false, verdict: 'System Error', output: e.message }});
    }
    setIsSubmitting(false);
  };

  if (!question) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      
      {/* Left Pane: Problem Description */}
      <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-800 bg-slate-900">
        <div className="flex bg-slate-950 px-4 border-b border-slate-800">
          <button onClick={() => setActiveTab('problem')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'problem' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Problem</button>
          <button onClick={() => setActiveTab('theory')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'theory' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Theory</button>
          <button onClick={() => setActiveTab('submissions')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'submissions' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Submissions</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'problem' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{question.title}</h1>
                <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                    question.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                    question.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {question.difficulty}
                </span>
              </div>
              
              <div className="prose prose-invert max-w-none text-slate-300">
                <p className="whitespace-pre-wrap">{question.statement}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Input Format</h3>
                <p className="whitespace-pre-wrap text-slate-400 bg-slate-800/50 p-3 rounded-lg">{question.inputFormat}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Output Format</h3>
                <p className="whitespace-pre-wrap text-slate-400 bg-slate-800/50 p-3 rounded-lg">{question.outputFormat}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Constraints</h3>
                <pre className="text-slate-300 bg-slate-800 p-3 rounded-lg font-mono text-sm">{question.constraints}</pre>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-2">Samples</h3>
                {question.testcases && question.testcases.slice(0, 3).map((tc: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-800 pb-4 last:border-0">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Sample Input {index + 1}</h4>
                      <pre className="text-slate-300 bg-slate-950 p-4 rounded-lg font-mono border border-slate-800 text-sm overflow-x-auto">{tc.input}</pre>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Sample Output {index + 1}</h4>
                      <pre className="text-slate-300 bg-slate-950 p-4 rounded-lg font-mono border border-slate-800 text-sm overflow-x-auto">{tc.expectedOutput}</pre>
                    </div>
                  </div>
                ))}
              </div>

              {question.explanation && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Explanation</h3>
                  <p className="whitespace-pre-wrap text-slate-300 bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg">{question.explanation}</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'theory' && (
            <div className="text-slate-400 text-center pt-10">Theory content will be loaded here.</div>
          )}
          {activeTab === 'submissions' && (
            <div className="text-slate-400 text-center pt-10">
              {session ? 'Your submissions will appear here.' : 'Please sign in to view your submissions.'}
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Editor & Output */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-900 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-slate-900 text-slate-200 text-xs px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="c">C (GCC 11.4.0)</option>
            <option value="cpp">C++ (GCC 11.4.0)</option>
          </select>
          <div className="flex space-x-2">
            <button 
              onClick={handleRun}
              disabled={isRunning || isSubmitting}
              className="flex items-center space-x-1 px-3 py-1 bg-slate-800 text-slate-200 text-xs font-bold rounded hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <Play className="w-3 h-3 text-emerald-400" />
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isRunning || isSubmitting}
              className="flex items-center space-x-1 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors shadow-[0_0_10px_rgba(37,99,235,0.3)] disabled:opacity-50"
            >
              <Terminal className="w-3 h-3" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 relative border-b border-slate-800">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              scrollbar: { alwaysConsumeMouseWheel: false }
            }}
          />
        </div>

        <div className="h-[250px] flex flex-col bg-slate-950 overflow-hidden" ref={consoleRef}>
          <div className="px-4 py-2 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-300">Console & Output</span>
            {output && <button onClick={() => setOutput(null)} className="text-xs text-blue-400 hover:underline">Clear</button>}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {!output ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block uppercase font-bold tracking-wider">Custom Input</label>
                  <textarea 
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full h-[100px] bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Enter input for your program..."
                  />
                </div>
                <div className="text-slate-500 text-xs italic">Use the "Run" button to test with this input.</div>
              </div>
            ) : output.type === 'run' ? (
              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  {output.data.success ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span className={`font-bold ${output.data.success ? 'text-emerald-500' : 'text-red-500'}`}>
                    {output.data.success ? 'Execution Finished' : output.data.errorType}
                  </span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 whitespace-pre-wrap text-slate-300">
                  {output.data.output || <span className="text-slate-600 italic">No output</span>}
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  {output.data.verdict === 'Passed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : 
                   output.data.verdict === 'Compilation Error' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : 
                   <XCircle className="w-5 h-5 text-red-500" />}
                  <h2 className={`text-lg font-bold ${
                    output.data.verdict === 'Passed' ? 'text-emerald-500' : 
                    output.data.verdict === 'Compilation Error' ? 'text-amber-500' : 'text-red-500'
                  }`}>{output.data.verdict}</h2>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 whitespace-pre-wrap text-slate-300">
                  {output.data.output || <span className="text-slate-600 italic">No output details</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
