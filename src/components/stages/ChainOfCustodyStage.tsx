/**
 * DETs — Earth System Investigation Lab
 * Stage 4: Chain of Custody & Data Provenance
 * 
 * Goal: Make every scientific finding traceable to its data and analysis steps.
 * 
 * Chronological Evidence Ledger covering 7 stages:
 * 1. Source registered.
 * 2. Dataset version and retrieval details recorded.
 * 3. Data quality and coverage checked.
 * 4. Processing and transformations documented.
 * 5. Analysis method and configuration recorded.
 * 6. Statistical outputs linked to their input data.
 * 7. Finding linked to the exact evidence and limitations used.
 * 
 * Rules:
 * - Each entry shows: Step ID, description, status (complete/pending/warning/failed),
 *   timestamp, inputs/outputs references, method details, validation notes, and limitations.
 * - Inspectable entry drawer for deep forensic review.
 * - Clearly labeled as PROTOTYPE / ILLUSTRATIVE RECORDS.
 * - Strict segregation of data provenance from scientific validity.
 */

import React, { useState } from 'react';
import { CustodyLedgerStep, AuditLogEntry } from '../../types/investigation';
import { CUSTODY_LEDGER_STEPS, SCIENTIFIC_DISCLAIMER } from '../../data/demoData';
import { 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Hash, 
  ExternalLink, 
  Layers, 
  Database, 
  Search, 
  Filter, 
  X, 
  ChevronRight, 
  ArrowLeft, 
  Info, 
  AlertCircle,
  FileCode,
  Tag
} from 'lucide-react';

interface ChainOfCustodyStageProps {
  auditLogs: AuditLogEntry[];
  onAddAuditLog: (action: string, details: string) => void;
  reviewedEvidenceIds: string[];
  onAdvanceStage: () => void;
  onNavigateToEvidence?: () => void;
}

export const ChainOfCustodyStage: React.FC<ChainOfCustodyStageProps> = ({
  auditLogs,
  onAddAuditLog,
  reviewedEvidenceIds,
  onAdvanceStage,
  onNavigateToEvidence
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string | null>('COC-STEP-01');
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'warning' | 'pending' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom log modal
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newLogAction, setNewLogAction] = useState('');
  const [newLogDetails, setNewLogDetails] = useState('');

  const selectedStep = CUSTODY_LEDGER_STEPS.find(s => s.stepId === selectedStepId) || CUSTODY_LEDGER_STEPS[0];

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogAction.trim() || !newLogDetails.trim()) return;
    onAddAuditLog(newLogAction.trim(), newLogDetails.trim());
    setNewLogAction('');
    setNewLogDetails('');
    setIsAddingLog(false);
  };

  // Filtered steps
  const filteredSteps = CUSTODY_LEDGER_STEPS.filter(step => {
    const matchesStatus = statusFilter === 'all' || step.status === statusFilter;
    const matchesQuery = 
      step.stepId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.stageTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.methodDetails.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: CustodyLedgerStep['status']) => {
    switch (status) {
      case 'complete':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#26845B]/20 text-[#26845B] border border-[#26845B]/30 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Complete</span>
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#E8A23A]/15 text-[#E8A23A] border border-[#E8A23A]/30 font-semibold">
            <AlertTriangle className="w-3 h-3" />
            <span>Warning</span>
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#20394D] text-[#667789] border border-[#20394D]">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#C84A4A]/20 text-[#C84A4A] border border-[#C84A4A]/30 font-semibold">
            <AlertCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Scientific Traceability Charter */}
      <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#20394D] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#42C8F5] uppercase tracking-wider">
                Stage 04 / 05 · Chain of Custody &amp; Data Provenance
              </span>
              <span className="text-xs text-[#667789]">·</span>
              <span className="text-xs font-mono text-[#E8A23A] bg-[#E8A23A]/10 px-2 py-0.5 rounded border border-[#E8A23A]/25">
                {SCIENTIFIC_DISCLAIMER.status}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#F7F9FB] mt-2 tracking-tight">
              Chronological Evidence Ledger &amp; Provenance Trail
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToEvidence && (
              <button
                onClick={onNavigateToEvidence}
                className="px-3.5 py-2 bg-[#20394D] text-[#42C8F5] hover:bg-[#20394D]/80 border border-[#20394D] font-mono text-xs rounded transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Evidence</span>
              </button>
            )}

            <button
              onClick={onAdvanceStage}
              className="px-4 py-2 bg-[#42C8F5] text-[#10283D] font-bold text-xs rounded hover:bg-[#34b4df] transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Advance to Findings &amp; Verdict</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Core Principle Callout: Provenance vs Scientific Validity */}
        <div className="p-4 rounded-lg bg-[#162E44] border border-[#20394D] flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#42C8F5] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#42C8F5]" />
              Scientific Principle: Provenance is Distinct from Scientific Validity
            </span>
            <p className="text-xs text-[#F7F9FB] leading-relaxed">
              Every scientific finding in DETs must be traceable back through its data sources, retrieval coordinates, quality checks, and transformations. However, <strong>complete provenance does not equate to scientific certainty</strong>: a fully documented and auditable pipeline may still contain genuine observational limitations, historical coverage voids, or yield an inconclusive physical result.
            </p>
          </div>

          <div className="p-2.5 rounded bg-[#10283D] border border-[#20394D] text-[11px] font-mono text-[#E8A23A] space-y-1 shrink-0 max-w-xs">
            <span className="font-bold block">Prototype Notice:</span>
            <span>Ledger records and hash identifiers are illustrative demo structures demonstrating end-to-end auditability.</span>
          </div>
        </div>
      </div>

      {/* 2. 7-Stage Chronological Evidence Ledger & Detailed Inspector Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chronological Ledger Steps List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#42C8F5]" />
                <h3 className="text-xs font-mono font-bold text-[#F7F9FB] uppercase tracking-wider">
                  7-Stage Custody Ledger
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#667789]">
                {filteredSteps.length} of {CUSTODY_LEDGER_STEPS.length} Steps
              </span>
            </div>

            {/* Filter & Search Bar */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#667789] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search ledger steps, methods, or IDs..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#162E44] border border-[#20394D] rounded text-[#F7F9FB] placeholder-[#667789] focus:outline-none focus:border-[#42C8F5] font-mono"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
                {(['all', 'complete', 'warning', 'pending'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-2 py-0.5 rounded capitalize transition-colors ${
                      statusFilter === f
                        ? 'bg-[#42C8F5] text-[#10283D] font-bold'
                        : 'text-[#667789] hover:text-[#F7F9FB] bg-[#162E44]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Cards List */}
            <div className="space-y-2 pt-1">
              {filteredSteps.map((step) => {
                const isSelected = selectedStepId === step.stepId;

                return (
                  <div
                    key={step.stepId}
                    onClick={() => setSelectedStepId(step.stepId)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#162E44] border-[#42C8F5] shadow-md'
                        : 'bg-[#10283D] border-[#20394D] hover:border-[#667789]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-[#42C8F5]">
                          Stage {step.stageNumber}.
                        </span>
                        <span className="text-xs font-bold text-[#F7F9FB]">
                          {step.stageTitle}
                        </span>
                      </div>
                      {getStatusBadge(step.status)}
                    </div>

                    <p className="mt-1.5 text-xs text-[#667789] line-clamp-2 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#20394D]/60 flex items-center justify-between text-[11px] font-mono text-[#667789]">
                      <span>{step.stepId}</span>
                      <div className="flex items-center gap-1.5 text-[#42C8F5]">
                        <span>Inspect details</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Forensic Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-6 space-y-6">
            {/* Inspector Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#20394D] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#42C8F5] bg-[#162E44] px-2 py-0.5 rounded border border-[#20394D]">
                    {selectedStep.stepId}
                  </span>
                  <span className="text-xs text-[#667789]">·</span>
                  <span className="text-xs font-mono text-[#667789]">Stage {selectedStep.stageNumber} of 7</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#F7F9FB] mt-1">
                  {selectedStep.stageTitle}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {getStatusBadge(selectedStep.status)}
              </div>
            </div>

            {/* Description & Real Timestamp */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase text-[#667789] font-bold block">
                Step Description &amp; Objective
              </span>
              <p className="text-xs sm:text-sm text-[#F7F9FB] leading-relaxed">
                {selectedStep.description}
              </p>
              {selectedStep.timestamp && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#667789] pt-1">
                  <Clock className="w-3.5 h-3.5 text-[#42C8F5]" />
                  <span>Recorded: {selectedStep.timestamp}</span>
                </div>
              )}
            </div>

            {/* Inputs & Outputs References */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#20394D]">
              {/* Inputs */}
              <div className="p-3.5 rounded-lg bg-[#162E44] border border-[#20394D] space-y-2">
                <span className="text-xs font-mono uppercase text-[#42C8F5] font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  Input Data References
                </span>
                {selectedStep.inputs && selectedStep.inputs.length > 0 ? (
                  <div className="space-y-2">
                    {selectedStep.inputs.map((inp, i) => (
                      <div key={i} className="text-xs font-mono text-[#667789] border-b border-[#20394D]/60 pb-1.5 last:border-0 last:pb-0">
                        <span className="text-[#F7F9FB] font-medium block truncate">{inp.name}</span>
                        <div className="flex justify-between text-[11px] mt-0.5">
                          <span className="text-[#667789] truncate max-w-[180px]">{inp.reference}</span>
                          <span className="text-[#42C8F5] uppercase">[{inp.format}]</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-[#667789] italic">None declared</span>
                )}
              </div>

              {/* Outputs */}
              <div className="p-3.5 rounded-lg bg-[#162E44] border border-[#20394D] space-y-2">
                <span className="text-xs font-mono uppercase text-[#26845B] font-bold flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  Output Derived Artifacts
                </span>
                {selectedStep.outputs && selectedStep.outputs.length > 0 ? (
                  <div className="space-y-2">
                    {selectedStep.outputs.map((out, i) => (
                      <div key={i} className="text-xs font-mono text-[#667789] border-b border-[#20394D]/60 pb-1.5 last:border-0 last:pb-0">
                        <span className="text-[#F7F9FB] font-medium block truncate">{out.name}</span>
                        <div className="flex justify-between text-[11px] mt-0.5">
                          <span className="text-[#667789] truncate max-w-[180px]">{out.reference}</span>
                          <span className="text-[#26845B] uppercase">[{out.format}]</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-[#667789] italic">None declared</span>
                )}
              </div>
            </div>

            {/* Method or Transformation Details */}
            <div className="space-y-2 pt-2 border-t border-[#20394D]">
              <span className="text-xs font-mono uppercase text-[#667789] font-bold block">
                Method &amp; Mathematical Transformation Specifications
              </span>
              <p className="text-xs text-[#F7F9FB] leading-relaxed">
                {selectedStep.methodDetails}
              </p>

              {selectedStep.transformationSteps && (
                <div className="mt-2 space-y-1 text-xs font-mono text-[#667789] pl-3 border-l-2 border-[#20394D]">
                  {selectedStep.transformationSteps.map((stepDesc, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-[#42C8F5]">•</span>
                      <span>{stepDesc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Validation Notes & Audit Verification */}
            <div className="p-4 rounded-lg bg-[#162E44] border border-[#20394D] space-y-1.5">
              <span className="text-xs font-mono uppercase text-[#26845B] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#26845B]" />
                Verification &amp; Quality Audit Notes
              </span>
              <p className="text-xs text-[#F7F9FB] leading-relaxed">
                {selectedStep.validationNotes}
              </p>
            </div>

            {/* Limitations & Caveats */}
            <div className="p-4 rounded-lg bg-[#162E44] border border-[#E8A23A]/30 space-y-1.5">
              <span className="text-xs font-mono uppercase text-[#E8A23A] font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#E8A23A]" />
                Documented Constraints &amp; Limitations
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#667789] leading-relaxed">
                {selectedStep.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>

            {/* Checksum / Digest Banner (With Explicit Prototype Disclaimer) */}
            <div className="pt-2 border-t border-[#20394D] space-y-1.5 text-[11px] font-mono text-[#667789]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#42C8F5]" />
                  <span className="text-[#F7F9FB]">{selectedStep.checksumPlaceholder}</span>
                </div>
                <span className="text-[#E8A23A]">PROTOTYPE ILLUSTRATION</span>
              </div>
              <p className="text-[10px] text-[#667789] leading-relaxed">
                Notice: Checksums in this prototype are illustrative placeholders demonstrating data provenance tracking. Operational immutability requires a production HSM or cryptographic ledger.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Manual Investigator Audit Logging Subsystem */}
      <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#20394D] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F7F9FB] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#42C8F5]" />
              <span>Investigator Sign-Off Chronology</span>
            </h3>
            <p className="text-xs text-[#667789]">
              Chronological log of investigator actions, transitions, and peer reviews
            </p>
          </div>

          <button
            onClick={() => setIsAddingLog(!isAddingLog)}
            className="px-3 py-1.5 rounded text-xs font-mono bg-[#20394D] text-[#42C8F5] hover:bg-[#20394D]/80 border border-[#20394D] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Investigator Note</span>
          </button>
        </div>

        {/* Add Log Modal/Form */}
        {isAddingLog && (
          <form
            onSubmit={handleCreateLog}
            className="p-4 rounded-lg bg-[#162E44] border border-[#42C8F5] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F7F9FB] flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#42C8F5]" />
                Log Formal Investigation Note to Chain of Custody
              </span>
              <button
                type="button"
                onClick={() => setIsAddingLog(false)}
                className="text-xs text-[#667789] hover:text-[#F7F9FB]"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-xs font-mono text-[#667789] block mb-1">
                Milestone Title:
              </label>
              <input
                type="text"
                value={newLogAction}
                onChange={e => setNewLogAction(e.target.value)}
                placeholder="e.g., Arctic vs Mediterranean slope divergence test cross-verified"
                className="w-full px-3 py-2 text-xs bg-[#10283D] border border-[#20394D] rounded text-[#F7F9FB] focus:border-[#42C8F5] focus:outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#667789] block mb-1">
                Technical Details &amp; Validation Caveats:
              </label>
              <textarea
                value={newLogDetails}
                onChange={e => setNewLogDetails(e.target.value)}
                placeholder="Document observed empirical anomalies, limitations, or cross-checks performed..."
                rows={3}
                className="w-full px-3 py-2 text-xs bg-[#10283D] border border-[#20394D] rounded text-[#F7F9FB] focus:border-[#42C8F5] focus:outline-none font-mono"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#42C8F5] text-[#10283D] font-bold text-xs rounded hover:bg-[#34b4df] transition-colors"
              >
                Record Entry in Custody Ledger
              </button>
            </div>
          </form>
        )}

        {/* Existing Audit Logs List */}
        <div className="space-y-2">
          {auditLogs.slice(0, 4).map((log, idx) => (
            <div
              key={log.id}
              className="p-3 rounded bg-[#162E44] border border-[#20394D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#42C8F5] font-bold">
                  #{String(auditLogs.length - idx).padStart(3, '0')}
                </span>
                <span className="font-semibold text-[#F7F9FB]">{log.action}</span>
                <span className="text-[#667789] hidden sm:inline">·</span>
                <span className="text-[#667789] truncate max-w-md hidden sm:inline">{log.details}</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-[#667789] shrink-0">
                <span>{log.timestamp}</span>
                <span className="px-1.5 py-0.5 rounded bg-[#26845B]/15 text-[#26845B]">
                  {log.validationStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
