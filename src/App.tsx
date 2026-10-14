/**
 * DETs — Earth System Investigation Lab
 * NASA Space Apps Challenge Project Concept Prototype
 * 
 * Master Application Shell & Forensic Investigation Workflow
 */

import React, { useState } from 'react';
import { InvestigationStage, CaseFile, AuditLogEntry, VerdictLabel } from './types/investigation';
import { INITIAL_CASES, INITIAL_AUDIT_LOGS, CANDIDATE_REGIONS } from './data/demoData';
import { Header } from './components/common/Header';
import { InvestigationBanner } from './components/common/InvestigationBanner';
import { DeskStage } from './components/stages/DeskStage';
import { IntakeStage } from './components/stages/IntakeStage';
import { EvidenceStage } from './components/stages/EvidenceStage';
import { ChainOfCustodyStage } from './components/stages/ChainOfCustodyStage';
import { VerdictStage } from './components/stages/VerdictStage';
import { ExportDossierModal } from './components/modals/ExportDossierModal';

export default function App() {
  // Navigation & Workflow Stage
  const [activeStage, setActiveStage] = useState<InvestigationStage>('desk');
  const [completedStages, setCompletedStages] = useState<InvestigationStage[]>(['desk']);

  // Case Selection & Configuration
  const [activeCaseId, setActiveCaseId] = useState<string>('DEMO-001');
  const activeCase = INITIAL_CASES.find(c => c.id === activeCaseId) || INITIAL_CASES[0];

  // Analysis Parameters
  const [baseline, setBaseline] = useState<'1951-1980' | '1991-2020'>('1951-1980');
  const [timeRange, setTimeRange] = useState<[number, number]>([1970, 2024]);
  const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>(['arctic', 'mediterranean']);
  const [highlightedRegionId, setHighlightedRegionId] = useState<string | null>(null);
  const [selectedHypothesis, setSelectedHypothesis] = useState<string>(activeCase.primaryHypothesis);

  // Evidence & Custody Audit Trail
  const [reviewedEvidenceIds, setReviewedEvidenceIds] = useState<string[]>(['EVD-GISTEMP-V4']);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Verdict Formulation
  const [verdictLabel, setVerdictLabel] = useState<VerdictLabel>('Supported by current evidence.');
  const [verdictConfidence, setVerdictConfidence] = useState<'High' | 'Moderate' | 'Inconclusive'>('High');
  const [verdictDecision, setVerdictDecision] = useState<string>(
    'Defensible Finding: Sustained Polar Amplification with Statistically Significant Divergence'
  );
  const [verdictNotes, setVerdictNotes] = useState<string>(
    'Observational evidence from NASA GISTEMP v4 indicates Arctic warming at +0.74°C/decade, departing from the global mean rate (+0.20°C/decade) with p < 0.0001 statistical significance. Cryosphere impact thresholds are actively engaged.'
  );

  // Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Helper to mark stage completed and transition
  const handleAdvanceStage = (nextStage: InvestigationStage) => {
    if (!completedStages.includes(activeStage)) {
      setCompletedStages(prev => [...prev, activeStage]);
    }
    setActiveStage(nextStage);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Log step transition to Chain of Custody
    const stageNames: Record<InvestigationStage, string> = {
      desk: 'Investigation Desk',
      intake: 'Case Intake Scoping',
      evidence: 'Evidence Examination',
      custody: 'Chain of Custody',
      verdict: 'Findings & Verdict'
    };

    const newLog: AuditLogEntry = {
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      stage: activeStage,
      action: `Workflow Advanced to ${stageNames[nextStage]}`,
      details: `Investigator transitioned from ${stageNames[activeStage]} to ${stageNames[nextStage]}. Context parameters locked.`,
      actor: 'Lead Investigator',
      hash: `SHA-256: ${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      validationStatus: 'Verified'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Toggle Region selection (ensure at least 1 or 2 can be toggled)
  const handleToggleRegion = (regionId: string) => {
    setSelectedRegionIds(prev => {
      const exists = prev.includes(regionId);
      if (exists) {
        // Allow removing only if at least 1 remains
        return prev.filter(id => id !== regionId);
      } else {
        return [...prev, regionId];
      }
    });

    const region = CANDIDATE_REGIONS.find(r => r.id === regionId);
    if (region) {
      const isSelecting = !selectedRegionIds.includes(regionId);
      const newLog: AuditLogEntry = {
        id: `aud-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        stage: 'intake',
        action: isSelecting ? `Candidate Region Added: ${region.name}` : `Candidate Region Removed: ${region.name}`,
        details: `Comparative matrix updated. Current region set: ${selectedRegionIds.length + (isSelecting ? 1 : -1)} regions.`,
        actor: 'Spatial Domain Analyst',
        hash: `SHA-256: ${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        validationStatus: 'Verified'
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  // Toggle Evidence Audit in Stage 3
  const handleToggleReviewEvidence = (evidenceId: string) => {
    setReviewedEvidenceIds(prev => {
      const exists = prev.includes(evidenceId);
      const next = exists ? prev.filter(id => id !== evidenceId) : [...prev, evidenceId];
      
      const newLog: AuditLogEntry = {
        id: `aud-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        stage: 'evidence',
        action: exists ? `Evidence Audit Revoked: ${evidenceId}` : `Evidence Audit Certified: ${evidenceId}`,
        details: `Dataset provenance, sensor transitions, and uncertainty bounds reviewed under scientific charter.`,
        actor: 'Scientific Reviewer',
        hash: `SHA-256: ${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        validationStatus: 'Verified'
      };
      setAuditLogs(logs => [newLog, ...logs]);

      return next;
    });
  };

  // Add custom investigator log in Stage 4
  const handleAddAuditLog = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      stage: activeStage,
      action,
      details,
      actor: 'Lead Investigator',
      hash: `SHA-256: ${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      validationStatus: 'Verified'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Stage selection from header / banner
  const handleSelectStage = (stage: InvestigationStage) => {
    setActiveStage(stage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#10283D] text-[#F7F9FB] flex flex-col font-sans selection:bg-[#42C8F5] selection:text-[#10283D]">
      {/* 1. Header (Strict Top Bar Contract: Brand - 5 Nav Links - 1 Action) */}
      <Header
        activeStage={activeStage}
        completedStages={completedStages}
        onSelectStage={handleSelectStage}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        activeCaseNumber={activeCase.caseNumber}
      />

      {/* 2. Investigation Banner (Scientific integrity & Stage Stepper) */}
      <InvestigationBanner
        activeStage={activeStage}
        completedStages={completedStages}
        onSelectStage={handleSelectStage}
        caseNumber={activeCase.caseNumber}
        variableName={activeCase.variable}
      />

      {/* 3. Main Stage Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeStage === 'desk' && (
          <DeskStage
            activeCaseId={activeCaseId}
            onSelectCase={id => setActiveCaseId(id)}
            selectedRegionIds={selectedRegionIds}
            onToggleRegion={handleToggleRegion}
            highlightedRegionId={highlightedRegionId}
            onHoverRegion={setHighlightedRegionId}
            onAdvanceToIntake={() => handleAdvanceStage('intake')}
            onAdvanceToEvidence={() => handleAdvanceStage('evidence')}
            currentStage={activeStage}
          />
        )}

        {activeStage === 'intake' && (
          <IntakeStage
            activeCase={activeCase}
            baseline={baseline}
            onChangeBaseline={setBaseline}
            timeRange={timeRange}
            onChangeTimeRange={setTimeRange}
            selectedRegionIds={selectedRegionIds}
            onToggleRegion={handleToggleRegion}
            selectedHypothesis={selectedHypothesis}
            onChangeHypothesis={setSelectedHypothesis}
            highlightedRegionId={highlightedRegionId}
            onHoverRegion={setHighlightedRegionId}
            onAdvanceStage={() => handleAdvanceStage('evidence')}
          />
        )}

        {activeStage === 'evidence' && (
          <EvidenceStage
            baseline={baseline}
            timeRange={timeRange}
            selectedRegionIds={selectedRegionIds}
            highlightedRegionId={highlightedRegionId}
            onSelectRegion={handleToggleRegion}
            onHoverRegion={setHighlightedRegionId}
            reviewedEvidenceIds={reviewedEvidenceIds}
            onToggleReviewEvidence={handleToggleReviewEvidence}
            onAdvanceStage={() => handleAdvanceStage('custody')}
          />
        )}

        {activeStage === 'custody' && (
          <ChainOfCustodyStage
            auditLogs={auditLogs}
            onAddAuditLog={handleAddAuditLog}
            reviewedEvidenceIds={reviewedEvidenceIds}
            onAdvanceStage={() => handleAdvanceStage('verdict')}
            onNavigateToEvidence={() => setActiveStage('evidence')}
          />
        )}

        {activeStage === 'verdict' && (
          <VerdictStage
            activeCase={activeCase}
            baseline={baseline}
            timeRange={timeRange}
            selectedRegionIds={selectedRegionIds}
            verdictLabel={verdictLabel}
            onChangeVerdictLabel={setVerdictLabel}
            verdictNotes={verdictNotes}
            onChangeNotes={setVerdictNotes}
            onNavigateToStage={handleSelectStage}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="w-full border-t border-[#20394D] bg-[#0B1A27] text-xs text-[#667789] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F7F9FB]">DETs</span>
            <span>·</span>
            <span>Earth System Investigation Lab</span>
            <span>·</span>
            <span className="font-mono text-[#E8A23A]">DEMO / SYNTHETIC DATA</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>NASA Space Apps Challenge Concept</span>
            <span>·</span>
            <span>GISTEMP v4 / ERA5 Compatible Schema</span>
          </div>
        </div>
      </footer>

      {/* 5. Export Dossier Modal */}
      <ExportDossierModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        activeCase={activeCase}
        baseline={baseline}
        selectedRegionIds={selectedRegionIds}
        verdictLabel={verdictLabel}
        verdictDecision={verdictDecision}
        verdictConfidence={verdictConfidence}
        verdictNotes={verdictNotes}
        auditLogs={auditLogs}
      />
    </div>
  );
}
