/**
 * DETs — Earth System Investigation Lab
 * Header Component strictly adhering to the Top Bar Contract:
 * [Zone 1: Brand Title] — [Zone 2: 5 Nav Links] — [Zone 3: 1 Primary Action]
 */

import React from 'react';
import { InvestigationStage } from '../../types/investigation';
import { FileText, CheckCircle2, Clock } from 'lucide-react';

interface HeaderProps {
  activeStage: InvestigationStage;
  completedStages: InvestigationStage[];
  onSelectStage: (stage: InvestigationStage) => void;
  onOpenExportModal: () => void;
  activeCaseNumber: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeStage,
  completedStages,
  onSelectStage,
  onOpenExportModal,
  activeCaseNumber
}) => {
  const navItems: { id: InvestigationStage; label: string; stepNum: string }[] = [
    { id: 'desk', label: 'Investigation Desk', stepNum: '01' },
    { id: 'intake', label: 'Case Intake', stepNum: '02' },
    { id: 'evidence', label: 'Evidence Examination', stepNum: '03' },
    { id: 'custody', label: 'Chain of Custody', stepNum: '04' },
    { id: 'verdict', label: 'Findings & Verdict', stepNum: '05' }
  ];

  return (
    <header className="w-full bg-[#10283D] border-b border-[#20394D] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-7 h-7 rounded bg-[#20394D] border border-[#42C8F5] flex items-center justify-center text-[#42C8F5] font-mono font-bold text-xs">
            DET
          </div>
          <button
            onClick={() => onSelectStage('desk')}
            className="text-base font-bold tracking-tight text-[#F7F9FB] hover:text-[#42C8F5] transition-colors whitespace-nowrap shrink-0 text-left"
          >
            DETs — Earth System Investigation Lab
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map(item => {
            const isActive = activeStage === item.id;
            const isCompleted = completedStages.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => onSelectStage(item.id)}
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'border-[#42C8F5] text-[#42C8F5] font-semibold'
                    : isCompleted
                    ? 'border-transparent text-[#26845B] hover:text-[#F7F9FB]'
                    : 'border-transparent text-[#667789] hover:text-[#F7F9FB]'
                }`}
              >
                <span className="font-mono text-xs opacity-75">{item.stepNum}.</span>
                <span>{item.label}</span>
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#26845B] shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExportModal}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#10283D] bg-[#42C8F5] rounded hover:bg-[#34b4df] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>
    </header>
  );
};
