import React, { useState } from 'react';
import { useCompanyOS } from '../../context/CompanyOSContext';
import { 
  X, 
  Terminal, 
  Search, 
  Zap, 
  AlertTriangle, 
  Bot, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  ShieldAlert,
  Server,
  Layers,
  Database
} from 'lucide-react';

interface CommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandCenterModal: React.FC<CommandCenterModalProps> = ({ isOpen, onClose }) => {
  const { 
    executeNaturalCommand, 
    resolveIncident, 
    rebootServer, 
    openTerminalForTarget,
    currentRole,
    setCurrentRole
  } = useCompanyOS();

  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [riskConfirmation, setRiskConfirmation] = useState<{
    message: string;
    actionPayload: string;
  } | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Verifique o servidor 03.',
    'Por que a API está lenta?',
    'Mostre os pods com problema.',
    'Investigue o node-03.',
    'Reinicie o servidor 03.',
    'Verifique se o banco está saudável.',
    'Compare a latência dos servidores.',
    'Analise esse incidente.'
  ];

  const handleExecute = async (commandText: string, confirmed: boolean = false) => {
    if (!commandText.trim()) return;
    setIsProcessing(true);
    setExecutionResult(null);

    try {
      const res = await executeNaturalCommand(commandText, confirmed);
      if (res.requiresConfirmation && !confirmed) {
        setRiskConfirmation({
          message: res.confirmationMessage || 'Esta é uma ação de alto risco para a infraestrutura.',
          actionPayload: commandText
        });
      } else {
        setRiskConfirmation(null);
        setExecutionResult(res.message);
      }
    } catch (err: any) {
      setExecutionResult(`Erro: ${err?.message || 'Falha na execução'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmRisk = () => {
    if (riskConfirmation) {
      handleExecute(riskConfirmation.actionPayload, true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#080d1a] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-200 select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0c1427] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white">
                  CENTRAL DE COMANDO DE TI & IA EM LINGUAGEM NATURAL
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Ctrl+K
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Interpretação e execução de comandos de observabilidade, infraestrutura e remediação.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-[#050811] space-y-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleExecute(inputVal);
            }} 
            className="flex items-center gap-3 p-3 bg-black/60 border-2 border-cyan-500/40 focus-within:border-cyan-400 rounded-2xl shadow-inner"
          >
            <Bot className="w-5 h-5 text-cyan-400 shrink-0 ml-1" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Escreva sua ordem técnica (ex: 'Verifique o servidor 03', 'Investigue o node-03')..."
              className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder:text-slate-600"
              autoFocus
            />
            <button
              type="submit"
              disabled={isProcessing || !inputVal.trim()}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
            >
              <Play className="w-3.5 h-3.5" /> Executar
            </button>
          </form>

          {/* Quick Prompts Suggestions */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 block mb-2 font-bold">SUGESTÕES DE COMANDOS:</span>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputVal(prompt);
                    handleExecute(prompt);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 text-xs font-mono cursor-pointer transition-all"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Risk Confirmation Dialog */}
          {riskConfirmation && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border-2 border-rose-500/80 shadow-xl text-rose-200 animate-in fade-in space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-sm">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
                <span>⚠️ AÇÃO DE RISCO CRÍTICO</span>
              </div>
              <p className="text-xs font-mono">{riskConfirmation.message}</p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setRiskConfirmation(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-mono font-bold cursor-pointer"
                >
                  [Cancelar]
                </button>
                <button
                  onClick={handleConfirmRisk}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold cursor-pointer shadow-lg animate-pulse"
                >
                  [Confirmar Execução]
                </button>
              </div>
            </div>
          )}

          {/* Execution Result Terminal Block */}
          {executionResult && (
            <div className="p-4 rounded-2xl bg-black/80 border border-cyan-500/30 font-mono text-xs text-slate-200 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-cyan-400 text-[11px] pb-2 border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resultado da Execução:</span>
                </span>
                <button 
                  onClick={() => setExecutionResult(null)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  Limpar
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
                {executionResult}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#090f20] border-t border-white/10 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Perfil Operacional:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as any)}
              className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-cyan-300 font-bold outline-none cursor-pointer"
            >
              <option value="NOC_DIRECTOR">NOC DIRECTOR (Root)</option>
              <option value="SRE_LEAD">SRE LEAD</option>
              <option value="DEVOPS_ENG">DEVOPS ENGINEER</option>
              <option value="SECOPS_ANALYST">SECOPS ANALYST</option>
              <option value="DBA_ADMIN">DBA ADMIN</option>
              <option value="VIEWER">VIEWER (Read-Only)</option>
            </select>
          </div>

          <span className="text-slate-500">Pressione ESC para fechar</span>
        </div>

      </div>
    </div>
  );
};
