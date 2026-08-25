import React, { useState, useRef, useEffect } from 'react';
import { useCompanyOS } from '../../context/CompanyOSContext';
import { 
  Terminal as TerminalIcon, 
  X, 
  Maximize2, 
  Minimize2, 
  Play, 
  Trash2, 
  HelpCircle,
  Copy,
  Check,
  Cpu,
  Server
} from 'lucide-react';

export const ITTerminalModal: React.FC = () => {
  const { 
    isTerminalOpen, 
    setIsTerminalOpen, 
    terminalTarget, 
    executeTerminalCommand 
  } = useCompanyOS();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [lines, setLines] = useState<Array<{ type: 'input' | 'output' | 'error' | 'system'; text: string; time: string }>>([
    {
      type: 'system',
      text: `CompanyOS IT Terminal v4.2 - Sessão conectada ao nó: ${terminalTarget?.name || 'infra-gateway.internal'}`,
      time: new Date().toLocaleTimeString()
    },
    {
      type: 'system',
      text: 'Digite "help" para listar comandos ou "ai-investigate" para diagnóstico autônomo.',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTerminalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isTerminalOpen, terminalTarget]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  if (!isTerminalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const time = new Date().toLocaleTimeString();
    
    // Add command to history
    setHistory(prev => [cmd, ...prev]);
    setHistoryIdx(-1);

    // Execute command
    const res = executeTerminalCommand(cmd);

    if (res.output === '__CLEAR__') {
      setLines([]);
      setInputVal('');
      return;
    }

    setLines(prev => [
      ...prev,
      { type: 'input', text: `$ ${cmd}`, time },
      { type: res.exitCode === 0 ? 'output' : 'error', text: res.output, time }
    ]);

    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || '');
      } else {
        setHistoryIdx(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete
      const common = ['kubectl get pods', 'kubectl describe pod ', 'systemctl status nginx', 'systemctl restart nginx', 'docker ps', 'ai-investigate', 'auto-remediate', 'ping ', 'traceroute '];
      const match = common.find(c => c.startsWith(inputVal.trim()));
      if (match) setInputVal(match);
    }
  };

  const copyTerminalOutput = () => {
    const text = lines.map(l => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runPreset = (cmd: string) => {
    setInputVal(cmd);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`flex flex-col bg-[#080d1a] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 ${
          isMaximized ? 'w-[98vw] h-[95vh]' : 'w-full max-w-4xl h-[620px]'
        }`}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0c1427] border-b border-white/10 select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:opacity-80" onClick={() => setIsTerminalOpen(false)} />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 cursor-pointer hover:opacity-80" onClick={() => setLines([])} />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 cursor-pointer hover:opacity-80" onClick={() => setIsMaximized(!isMaximized)} />
            </div>

            <div className="h-4 w-px bg-white/15 mx-1" />

            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                root@{terminalTarget?.name || 'infra-gateway'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                {terminalTarget?.type?.toUpperCase() || 'HOST_CLI'}
              </span>
            </div>
          </div>

          {/* Preset Quick Commands */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-md">
            <button 
              onClick={() => runPreset('kubectl get pods')}
              className="px-2 py-1 text-[11px] font-mono bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10 hover:border-cyan-400/40 cursor-pointer transition-colors"
            >
              k8s pods
            </button>
            <button 
              onClick={() => runPreset('systemctl status nginx')}
              className="px-2 py-1 text-[11px] font-mono bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10 hover:border-cyan-400/40 cursor-pointer transition-colors"
            >
              nginx status
            </button>
            <button 
              onClick={() => runPreset('ai-investigate node-03')}
              className="px-2 py-1 text-[11px] font-mono bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 rounded border border-purple-500/40 cursor-pointer transition-colors flex items-center gap-1"
            >
              🤖 IA Diagnosticar
            </button>
            <button 
              onClick={() => runPreset('auto-remediate inc-2026-001')}
              className="px-2 py-1 text-[11px] font-mono bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 rounded border border-emerald-500/40 cursor-pointer transition-colors"
            >
              ⚡ Auto-Remediar
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={copyTerminalOutput}
              title="Copiar saída"
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? "Restaurar" : "Maximizar"}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsTerminalOpen(false)}
              title="Fechar Terminal"
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className="flex-1 p-4 bg-[#050811] overflow-y-auto font-mono text-xs leading-relaxed select-text cursor-text scrollbar-thin scrollbar-thumb-cyan-900"
        >
          {lines.map((line, idx) => (
            <div key={idx} className="mb-1.5">
              {line.type === 'system' && (
                <div className="text-cyan-400/90 font-medium">
                  {line.text}
                </div>
              )}
              {line.type === 'input' && (
                <div className="flex items-center gap-2 text-white font-bold">
                  <span className="text-emerald-400">root@{terminalTarget?.name || 'infra'}:~#</span>
                  <span className="text-cyan-100">{line.text.replace('$ ', '')}</span>
                  <span className="text-[10px] text-slate-500 ml-auto font-normal">{line.time}</span>
                </div>
              )}
              {line.type === 'output' && (
                <pre className="text-slate-300 whitespace-pre-wrap font-mono mt-0.5 pl-2 border-l-2 border-cyan-500/20">
                  {line.text}
                </pre>
              )}
              {line.type === 'error' && (
                <pre className="text-rose-400 whitespace-pre-wrap font-mono mt-0.5 pl-2 border-l-2 border-rose-500/40 bg-rose-950/20 p-2 rounded">
                  {line.text}
                </pre>
              )}
            </div>
          ))}

          {/* Active Command Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2 pt-1 border-t border-white/5">
            <span className="text-emerald-400 font-bold shrink-0">
              root@{terminalTarget?.name || 'infra'}:~#
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite um comando (ex: kubectl get pods, ping 10.0.1.13, ai-investigate)..."
              className="flex-1 bg-transparent text-cyan-200 outline-none font-mono text-xs placeholder:text-slate-600"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="px-2.5 py-1 text-[11px] bg-cyan-600/30 hover:bg-cyan-600/60 text-cyan-300 rounded border border-cyan-500/40 cursor-pointer flex items-center gap-1 font-sans"
            >
              <Play className="w-3 h-3" /> Executar
            </button>
          </form>
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#090f20] border-t border-white/10 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sessão Ativa (SSH/gRPC Simulado)</span>
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline">Use <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-300">Tab</kbd> para autocompletar</span>
            <span className="hidden sm:inline">Use <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-300">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-300">↓</kbd> para histórico</span>
          </div>

          <button 
            onClick={() => setLines([])}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Limpar
          </button>
        </div>
      </div>
    </div>
  );
};
