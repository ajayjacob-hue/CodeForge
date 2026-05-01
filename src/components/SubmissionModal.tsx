'use client';
import { X, Copy, Check, Download } from 'lucide-react';
import { useState } from 'react';
import Editor from '@monaco-editor/react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: {
    code: string;
    language: string;
    verdict: string;
    submittedAt?: string | Date;
    title?: string;
  } | null;
}

export default function SubmissionModal({ isOpen, onClose, submission }: SubmissionModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !submission) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(submission.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([submission.code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `submission_${submission.language}.${submission.language === 'cpp' ? 'cpp' : 'c'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formattedDate = submission.submittedAt 
    ? new Date(submission.submittedAt).toLocaleString() 
    : 'Unknown date';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center">
              Submission Details
              <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                submission.verdict === 'Passed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {submission.verdict}
              </span>
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {submission.title && <span className="text-slate-300 font-medium mr-2">{submission.title}</span>}
              Submitted on {formattedDate}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
            <span className="uppercase">{submission.language}</span>
            <span className="text-slate-700">|</span>
            <span>{submission.code ? submission.code.split('\n').length : 0} lines</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 bg-slate-950 relative border-t border-slate-800 min-h-0">
          <Editor
            key={submission.submittedAt?.toString() || 'default'}
            height="100%"
            language={submission.language === 'cpp' ? 'cpp' : 'c'}
            theme="vs-dark"
            value={submission.code || ''}
            options={{
              readOnly: true,
              minimap: { enabled: true },
              fontSize: 14,
              padding: { top: 20, bottom: 20 },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderWhitespace: 'none',
              contextmenu: false,
              fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
              automaticLayout: true,
            }}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
