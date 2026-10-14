/**
 * DETs — Earth System Investigation Lab
 * Scientific Integrity & Investigation Stage Ribbon
 */

import React from 'react';
import { InvestigationStage } from '../../types/investigation';
import { AlertCircle, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface InvestigationBannerProps {
  activeStage: InvestigationStage;
  completedStages: InvestigationStage[];
  onSelectStage: (stage: InvestigationStage) => void;
  caseNumber: string;
  variableName: string;
}

export const InvestigationBanner: React.FC<InvestigationBannerProps> = ({
  activeStage,
  completedStages,
  onSelectStage,
  caseNumber,
  variableName
}) => {
  const stages: { id: InvestigationStage; name: string; short: string }[] = [
    { id: 'desk', name: 'Desk', short: '01' },
    { id: 'intake', name: 'Intake', short: '02' },
    { id: 'evidence', name: 'Evidence', short: '03' },
    { id: 'custody', name: 'Chain of Custody', short: '04' },
    { id: 'verdict', name: 'Findings & Verdict', short: '05' }
  ];

  return (
    <div className="bg-[#162E44] border-b border-[#20394D] text-[#F7F9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Scientific Integrity Notice */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="font-mono px-2 py-0.5 rounded bg-[#E8A23A]/15 text-[#E8A23A] border border-[#E8A23A]/30 font-bold shrink-0">
            DEMO / SYNTHETIC DATA
          </span>
          <span className="text-[#667789] hidden sm:inline">|</span>
          <span className="text-[#F7F9FB] truncate">
            <span className="text-[#667789] font-mono mr-1.5">{caseNumber}:</span>
            <span className="font-medium">{variableName}</span>
          </span>
        </div>

        {/* Right: Stage Stepper */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-mono">
          {stages.map((stage, idx) => {
            const isActive = activeStage === stage.id;
            const isCompleted = completedStages.includes(stage.id);

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => onSelectStage(stage.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#42C8F5] text-[#10283D] font-bold'
                      : isCompleted
                      ? 'bg-[#26845B]/20 text-[#26845B] hover:bg-[#26845B]/30'
                      : 'text-[#667789] hover:text-[#F7F9FB] hover:bg-[#20394D]/50'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-[#26845B]" />
                  ) : (
                    <span>{stage.short}.</span>
                  )}
                  <span>{stage.name}</span>
                </button>
                {idx < stages.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-[#20394D] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
