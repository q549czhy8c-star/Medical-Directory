import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText, Trash2, ToggleLeft, ToggleRight, Info } from 'lucide-react';

export const TextCleaner: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [replacementToken, setReplacementToken] = useState('_________');
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [linesReplaced, setLinesReplaced] = useState(0);

  // Clean the text in real-time
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      setLinesReplaced(0);
      return;
    }

    const lines = inputText.split(/\r?\n/);
    let count = 0;
    
    const cleanedLines = lines.map(line => {
      const trimmed = line.trim();
      const isMatch = caseInsensitive 
        ? trimmed.toLowerCase() === 'reply' 
        : trimmed === 'Reply';
        
      if (isMatch) {
        count++;
        // Keep the leading whitespace, but replace the "Reply" text with the replacement token.
        // Actually, the spec says "replace that entire row with a user-specified string".
        // Let's replace the entire row (with standard indentation or just the token).
        // Spec: "replace that entire row with a user-specified string"
        return line.replace(/\bReply\b/gi, replacementToken).replace(/^\s*Reply\s*$/i, replacementToken);
      }
      return line;
    });

    setOutputText(cleanedLines.join('\n'));
    setLinesReplaced(count);
  }, [inputText, replacementToken, caseInsensitive]);

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      
      // Track session metrics in localStorage
      const stored = localStorage.getItem('aerosuite_stats');
      let stats = { cleanedLines: 0, filesProcessed: 0, queriesRun: 0, savedRows: 0 };
      if (stored) {
        try {
          stats = JSON.parse(stored);
        } catch (e) {}
      }
      stats.cleanedLines += linesReplaced;
      localStorage.setItem('aerosuite_stats', JSON.stringify(stats));
      // Trigger a window event to let other components know stats changed
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleLoadSample = () => {
    const sample = `Hi team,
Are there any updates on this client ticket?

Reply

Best,
Keith - Senior Analyst

Reply

I will check the logs and update you shortly.`;
    setInputText(sample);
  };

  const handleClear = () => {
    setInputText('');
  };

  // Utility to count lines
  const countLines = (str: string) => str ? str.split(/\r?\n/).length : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Description Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Text Cleaner & Reply Line Replacer</h2>
            <p className="text-slate-400 text-xs">Purge transcripts or chat histories of ugly system lines in real-time.</p>
          </div>
        </div>
        <button
          onClick={handleLoadSample}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/20 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          Load Demo Text
        </button>
      </div>

      {/* Control Panel / Configuration */}
      <div className="grid md:grid-cols-2 gap-4 p-5 rounded-2xl glass-panel border border-white/5">
        {/* Token Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            Replacement Token
            <span className="text-[10px] text-slate-500 font-normal">(Replaces matching lines)</span>
          </label>
          <input
            type="text"
            value={replacementToken}
            onChange={(e) => setReplacementToken(e.target.value)}
            placeholder="e.g. _________"
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-600 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
          />
        </div>

        {/* Case Toggle & Clean Trigger */}
        <div className="flex items-center justify-between md:justify-end gap-6 h-full pt-4 md:pt-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCaseInsensitive(!caseInsensitive)}>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">Case Insensitive Match</p>
              <p className="text-xs text-slate-400">Match 'reply', 'REPLY', or 'Reply'</p>
            </div>
            {caseInsensitive ? (
              <ToggleRight className="w-10 h-10 text-brand-purple" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-slate-600" />
            )}
          </div>
        </div>
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side: Input Textarea */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">Source Text</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono">
                {countLines(inputText)} lines | {inputText.length} chars
              </span>
              {inputText && (
                <button
                  onClick={handleClear}
                  className="text-xs text-slate-500 hover:text-brand-pink flex items-center gap-1 transition cursor-pointer"
                  title="Clear source text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste raw transcript rows containing 'Reply' text blocks here..."
              rows={14}
              className="w-full bg-slate-950/40 glass-panel rounded-2xl p-5 text-sm text-slate-300 font-mono leading-relaxed placeholder-slate-600 border border-white/5 focus:border-brand-purple/40 resize-y min-h-[300px]"
            />
          </div>
        </div>

        {/* Right Side: Output Preview */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 tracking-wide uppercase flex items-center gap-1.5">
              Purified Output
              {linesReplaced > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold font-mono animate-pulse">
                  {linesReplaced} replaced
                </span>
              )}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {countLines(outputText)} lines | {outputText.length} chars
            </span>
          </div>

          <div className="relative group">
            <textarea
              readOnly
              value={outputText}
              placeholder="Purified text output will materialize here in real-time..."
              rows={14}
              className="w-full bg-slate-950/60 glass-panel rounded-2xl p-5 text-sm text-brand-purple/90 font-mono leading-relaxed border border-white/5 focus:outline-none resize-y min-h-[300px]"
            />

            {/* Float Copy Button */}
            {outputText && (
              <button
                onClick={handleCopy}
                className={`absolute bottom-4 right-4 px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 border transition duration-300 shadow-2xl cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20 scale-105'
                    : 'bg-brand-purple border-brand-purple/50 text-white shadow-brand-purple/20 hover:scale-105 active:scale-95'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info Tip banner */}
      <div className="flex gap-2.5 p-4 rounded-xl bg-slate-900/30 border border-white/5 text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
        <p>
          <strong>AeroSuite logic:</strong> The parser scans text line by line. Any row consisting solely of the word <code>Reply</code> (surrounding spaces or line breaks are stripped automatically before matching) will be replaced with your replacement token. All other rows, line spacing, indentations, and special characters remain 100% untouched.
        </p>
      </div>
    </div>
  );
};
