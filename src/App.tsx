import React, { useState, useEffect } from 'react';
import { CompanyOSProvider, useCompanyOS } from './context/CompanyOSContext';
import { OfficeCanvas } from './components/office/OfficeCanvas';
import { OfficeHUD } from './components/office/OfficeHUD';
import { ITEntityDrawer } from './components/common/ITEntityDrawer';
import { ITTerminalModal } from './components/terminal/ITTerminalModal';
import { CommandCenterModal } from './components/common/CommandCenterModal';
import { NetworkTopologyModal } from './components/views/NetworkTopologyModal';
import { KubernetesExplorerModal } from './components/views/KubernetesExplorerModal';
import { DatacenterRacksModal } from './components/views/DatacenterRacksModal';
import { IncidentsBoardModal } from './components/views/IncidentsBoardModal';
import { LiveLogStreamModal } from './components/views/LiveLogStreamModal';
import { AuditTrailModal } from './components/views/AuditTrailModal';

const MainApp: React.FC = () => {
  const { 
    isTerminalOpen, 
    setIsTerminalOpen,
    openTerminalForTarget,
    activeOverlayModal,
    setActiveOverlayModal
  } = useCompanyOS();

  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState<boolean>(false);

  // Global keyboard shortcuts:
  // - Ctrl+K / Cmd+K: Command Center
  // - Backtick (`): CLI Terminal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandCenterOpen(prev => !prev);
      }
      if (e.key === '`' && !isCommandCenterOpen) {
        // Toggle terminal only if not typing in an input
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          setIsTerminalOpen(!isTerminalOpen);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isTerminalOpen, isCommandCenterOpen, setIsTerminalOpen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#03060f] text-slate-100 select-none">
      {/* Discreet IT Telemetry HUD Bar & Navigation */}
      <OfficeHUD 
        onOpenCommandCenter={() => setIsCommandCenterOpen(true)}
      />

      {/* Interactive IT Infrastructure Virtual Office Canvas */}
      <OfficeCanvas />

      {/* Contextual Resource Inspection & Command Drawer */}
      <ITEntityDrawer />

      {/* Simulated CLI Terminal Modal */}
      <ITTerminalModal />

      {/* Natural Language Command Center Modal (Ctrl+K) */}
      <CommandCenterModal 
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
      />

      {/* Dedicated IT View Modals */}
      <NetworkTopologyModal />
      <KubernetesExplorerModal />
      <DatacenterRacksModal />
      <IncidentsBoardModal />
      <LiveLogStreamModal />
      <AuditTrailModal />
    </div>
  );
};

export default function App() {
  return (
    <CompanyOSProvider>
      <MainApp />
    </CompanyOSProvider>
  );
}
