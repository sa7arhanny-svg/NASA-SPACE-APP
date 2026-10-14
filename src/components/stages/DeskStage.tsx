/**
 * DETs — Earth System Investigation Lab
 * Stage 1: Investigation Desk
 * 
 * Command Center Tri-Split Layout:
 * - Left: Compact Case Navigation Panel (Case ID, variable, status, stage, case switcher)
 * - Center: Interactive Earth Globe with geographic markers
 * - Right: Contextual Evidence Preview Panel with progressive disclosure
 */

import React, { useState } from 'react';
import { CandidateRegion, CaseFile, InvestigationStage } from '../../types/investigation';
import { INITIAL_CASES, CANDIDATE_REGIONS, EVIDENCE_DOSSIER, SCIENTIFIC_DISCLAIMER, METHODOLOGY_PRINCIPLES } from '../../data/demoData';
import { EarthGlobe } from '../globe/EarthGlobe';
import { 
  FolderKanban, 
  ArrowRight, 
  AlertTriangle, 
  Layers, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Compass, 
  Radio, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  SlidersHorizontal,
  Activity
} from 'lucide-react';

interface DeskStageProps {
  activeCaseId: string;
  onSelectCase: (caseId: string) => void;
  selectedRegionIds: string[];
  onToggleRegion: (regionId: string) => void;
  highlightedRegionId: string | null;
  onHoverRegion: (regionId: string | null) => void;
  onAdvanceToIntake: () => void;
  onAdvanceToEvidence: () => void;
  currentStage: InvestigationStage;
}

export const DeskStage: React.FC<DeskStageProps> = ({
  activeCaseId,
  onSelectCase,
  selectedRegionIds,
  onToggleRegion,
  highlightedRegionId,
  onHoverRegion,
  onAdvanceToIntake,
  onAdvanceToEvidence,
  currentStage
}) => {
  const activeCase = INITIAL_CASES.find(c => c.id === activeCaseId) || INITIAL_CASES[0];

  // Selected region for contextual evidence preview panel (defaults to arctic or first selected)
  const [inspectedRegionId, setInspectedRegionId] = useState<string>(
    selectedRegionIds[0] || 'arctic'
  );

  // Progressive disclosure states
  const [showCaseDetails, setShowCaseDetails] = useState(false);
  const [showEvidenceLineage, setShowEvidenceLineage] = useState(false);
  const [showMethodologyDrawer, setShowMethodologyDrawer] = useState(false);

  const inspectedRegion = CANDIDATE_REGIONS.find(r => r.id === inspectedRegionId) || CANDIDATE_REGIONS[0];
  const isInspectedSelected = selectedRegionIds.includes(inspectedRegion.id);

  // Handle marker selection from globe
  const handleMarkerClick = (regionId: string) => {
    setInspectedRegionId(regionId);
    onToggleRegion(regionId);
  };

  return (
    <div className="space-y-6">
      {/* Top Desk Telemetry Banner */}
      <div className="bg-[#10283D] rounded-xl border border-[#20394D] px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-mono text-[#42C8F5] bg-[#20394D] px-2.5 py-1 rounded">
            <Radio className="w-3.5 h-3.5 text-[#42C8F5] animate-pulse" />
            <span className="font-bold">{activeCase.caseNumber}</span>
          </div>
          <span className="text-[#667789]">·</span>
          <span className="font-medium text-[#F7F9FB]">{activeCase.title}</span>
          <span className="text-[#667789]">·</span>
          <span className="text-[#667789] font-mono">Variable: <strong className="text-[#F7F9FB] font-normal">{activeCase.variable}</strong></span>
          <span className="text-[#667789]">·</span>
          <span className="text-[#26845B] font-mono font-medium">Status: {activeCase.status}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
          <span className="text-[#667789]">Current Stage:</span>
          <span className="px-2 py-0.5 rounded bg-[#42C8F5]/15 text-[#42C8F5] border border-[#42C8F5]/30 font-bold">
            01 / Investigation Desk
          </span>
          <button
            onClick={() => setShowMethodologyDrawer(!showMethodologyDrawer)}
            className="text-[#667789] hover:text-[#42C8F5] flex items-center gap-1 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Charter</span>
            {showMethodologyDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Progressive Disclosure: Methodology Drawer */}
      {showMethodologyDrawer && (
        <div className="bg-[#162E44] rounded-xl border border-[#20394D] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
            <span className="text-xs font-mono font-bold text-[#42C8F5] uppercase tracking-wider">
              Scientific Principles & Forensic Charter
            </span>
            <span className="text-[11px] font-mono text-[#E8A23A] bg-[#E8A23A]/10 px-2 py-0.5 rounded border border-[#E8A23A]/30">
              {SCIENTIFIC_DISCLAIMER.status}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#667789]">
            {METHODOLOGY_PRINCIPLES.slice(0, 3).map((p, idx) => (
              <div key={idx} className="p-3 rounded bg-[#10283D] border border-[#20394D]">
                <strong className="text-[#F7F9FB] block mb-1">{p.title}</strong>
                <p className="leading-relaxed">{p.rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Tri-Split Layout: Left Case Nav | Center 3D Earth Globe | Right Contextual Evidence Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Compact Case Navigation Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-3">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#42C8F5]" />
                <h3 className="text-xs font-mono font-bold text-[#F7F9FB] uppercase tracking-wider">
                  Case Registry
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#667789]">
                {INITIAL_CASES.length} Dossiers
              </span>
            </div>

            {/* Case List Switcher */}
            <div className="space-y-2">
              {INITIAL_CASES.map(c => {
                const isActive = c.id === activeCaseId;
                const isPending = c.status === 'Pending Data';

                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCase(c.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#162E44] border-[#42C8F5] shadow-sm'
                        : 'bg-[#10283D] border-[#20394D] hover:border-[#667789]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-[#42C8F5]">
                        {c.caseNumber}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-[#26845B]/20 text-[#26845B]'
                            : 'bg-[#E8A23A]/15 text-[#E8A23A]'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <h4 className="mt-1.5 text-xs font-bold text-[#F7F9FB] line-clamp-1">
                      {c.title}
                    </h4>

                    <div className="mt-1 text-[11px] font-mono text-[#667789] truncate">
                      {c.variable}
                    </div>

                    {isActive && (
                      <div className="mt-3 pt-2 border-t border-[#20394D] flex items-center justify-between text-[11px]">
                        <span className="text-[#667789] font-mono">Stage: 01 / Desk</span>
                        <span className="text-[#42C8F5] font-semibold flex items-center gap-1">
                          <span>Active</span>
                          <CheckCircle2 className="w-3 h-3 text-[#26845B]" />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progressive Disclosure: Active Case Overview Details */}
            <div className="pt-2 border-t border-[#20394D]">
              <button
                onClick={() => setShowCaseDetails(!showCaseDetails)}
                className="w-full flex items-center justify-between text-xs text-[#667789] hover:text-[#F7F9FB] py-1 transition-colors"
              >
                <span className="font-mono">Case Dossier Details</span>
                {showCaseDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showCaseDetails && (
                <div className="mt-2 p-3 rounded bg-[#162E44] border border-[#20394D] text-[11px] space-y-2 text-[#667789]">
                  <div>
                    <span className="text-[#F7F9FB] font-medium block">Lead Investigator:</span>
                    <span>{activeCase.leadInvestigator}</span>
                  </div>
                  <div>
                    <span className="text-[#F7F9FB] font-medium block">Research Question:</span>
                    <span className="italic text-[#F7F9FB]">"{activeCase.researchQuestion}"</span>
                  </div>
                  <div>
                    <span className="text-[#F7F9FB] font-medium block">Default Baseline:</span>
                    <span className="font-mono">{activeCase.baselineDefault}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button: Open Case Intake */}
            <button
              onClick={onAdvanceToIntake}
              className="w-full py-2.5 px-3 bg-[#42C8F5] text-[#10283D] font-bold text-xs rounded hover:bg-[#34b4df] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Open Case Intake (DEMO-001)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Marker Roster in Left Panel */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#F7F9FB] uppercase tracking-wider">
                Geographic Markers
              </span>
              <span className="text-[10px] font-mono text-[#42C8F5]">
                {selectedRegionIds.length} Active
              </span>
            </div>

            <div className="space-y-1.5">
              {CANDIDATE_REGIONS.filter(r => r.id !== 'global_mean').map(region => {
                const isSelected = selectedRegionIds.includes(region.id);
                const isInspected = inspectedRegionId === region.id;

                return (
                  <button
                    key={region.id}
                    onClick={() => {
                      setInspectedRegionId(region.id);
                      onHoverRegion(region.id);
                    }}
                    className={`w-full flex items-center justify-between text-left text-xs px-2.5 py-1.5 rounded transition-all ${
                      isInspected
                        ? 'bg-[#162E44] border border-[#42C8F5] text-[#F7F9FB]'
                        : isSelected
                        ? 'bg-[#20394D]/70 text-[#F7F9FB] border border-[#20394D]'
                        : 'text-[#667789] hover:bg-[#20394D]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: region.color }}
                      />
                      <span className="truncate">{region.name}</span>
                    </div>

                    <span className="text-[10px] font-mono text-[#42C8F5] shrink-0 ml-1">
                      +{region.currentAnomaly2024.toFixed(2)}°C
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Central Interactive Earth Globe (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#42C8F5]" />
                <h3 className="text-xs font-mono font-bold text-[#F7F9FB] uppercase tracking-wider">
                  Visual Center · Planetary Investigation Sphere
                </h3>
              </div>
              <div className="text-[11px] font-mono text-[#667789] flex items-center gap-1.5">
                <span className="text-[#E8A23A]">● Click marker to inspect</span>
              </div>
            </div>

            {/* Existing Three.js Interactive Earth Globe */}
            <EarthGlobe
              regions={CANDIDATE_REGIONS}
              selectedRegionIds={selectedRegionIds}
              highlightedRegionId={highlightedRegionId || inspectedRegionId}
              onSelectRegion={handleMarkerClick}
              onHoverRegion={regionId => {
                if (regionId) setInspectedRegionId(regionId);
                onHoverRegion(regionId);
              }}
            />

            {/* Globe Telemetry Footer */}
            <div className="p-2.5 rounded-lg bg-[#162E44] border border-[#20394D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#667789]">
              <div className="flex items-center gap-2">
                <span className="text-[#42C8F5]">Target Marker:</span>
                <span className="text-[#F7F9FB] font-semibold">{inspectedRegion.name}</span>
                <span>({inspectedRegion.lat > 0 ? `${inspectedRegion.lat}°N` : `${Math.abs(inspectedRegion.lat)}°S`}, {Math.abs(inspectedRegion.lng)}°{inspectedRegion.lng >= 0 ? 'E' : 'W'})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#E8A23A]">Anomaly: +{inspectedRegion.currentAnomaly2024.toFixed(2)}°C</span>
                <span>·</span>
                <span className="text-[#667789]">±{inspectedRegion.uncertaintyMargin.toFixed(2)}°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contextual Evidence Preview Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#42C8F5]" />
                <h3 className="text-xs font-mono font-bold text-[#F7F9FB] uppercase tracking-wider">
                  Evidence Preview
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#E8A23A] bg-[#E8A23A]/10 px-1.5 py-0.5 rounded border border-[#E8A23A]/25">
                DEMO DATA
              </span>
            </div>

            {/* Selected Region Telemetry Card */}
            <div className="p-3.5 rounded-lg bg-[#162E44] border border-[#20394D] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: inspectedRegion.color }}
                  />
                  <h4 className="text-xs font-bold text-[#F7F9FB]">
                    {inspectedRegion.name}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[#42C8F5]">
                  {inspectedRegion.code}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[#20394D]/60">
                  <span className="text-[#667789]">2024 Anomaly:</span>
                  <span className="text-[#E8A23A] font-bold tabular-nums">
                    +{inspectedRegion.currentAnomaly2024.toFixed(2)}°C
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#20394D]/60">
                  <span className="text-[#667789]">Decadal Rate:</span>
                  <span className="text-[#F7F9FB] tabular-nums">
                    +{inspectedRegion.warmingRatePerDecade.toFixed(2)}°C / dec
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#20394D]/60">
                  <span className="text-[#667789]">95% Uncertainty:</span>
                  <span className="text-[#667789] tabular-nums">
                    ±{inspectedRegion.uncertaintyMargin.toFixed(2)}°C
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#667789]">Station Density:</span>
                  <span className="text-[#F7F9FB]">{inspectedRegion.stationDensity}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#667789] leading-relaxed pt-1 border-t border-[#20394D]/60">
                {inspectedRegion.description}
              </p>

              {/* Toggle Region in Investigation Matrix */}
              <button
                onClick={() => onToggleRegion(inspectedRegion.id)}
                className={`w-full py-1.5 px-3 rounded text-xs font-mono transition-colors flex items-center justify-center gap-1.5 ${
                  isInspectedSelected
                    ? 'bg-[#26845B]/20 text-[#26845B] border border-[#26845B]/40 hover:bg-[#26845B]/30'
                    : 'bg-[#20394D] text-[#F7F9FB] hover:bg-[#20394D]/80 border border-[#20394D]'
                }`}
              >
                {isInspectedSelected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Included in Intake Matrix</span>
                  </>
                ) : (
                  <span>+ Add to Intake Matrix</span>
                )}
              </button>
            </div>

            {/* Progressive Disclosure: Dataset Lineage & Calibration */}
            <div className="pt-2 border-t border-[#20394D]">
              <button
                onClick={() => setShowEvidenceLineage(!showEvidenceLineage)}
                className="w-full flex items-center justify-between text-xs text-[#667789] hover:text-[#F7F9FB] py-1 transition-colors"
              >
                <span className="font-mono">Sensor Lineage &amp; Constraints</span>
                {showEvidenceLineage ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showEvidenceLineage && (
                <div className="mt-2 p-3 rounded bg-[#162E44] border border-[#20394D] text-[11px] space-y-2 text-[#667789]">
                  <div>
                    <span className="text-[#F7F9FB] font-medium block">Reference Dataset:</span>
                    <span>NASA GISTEMP v4 (GHCNv4 + ERSSTv5)</span>
                  </div>
                  <div>
                    <span className="text-[#F7F9FB] font-medium block">Key Vulnerability:</span>
                    <span>{inspectedRegion.keyVulnerability}</span>
                  </div>
                  <div className="p-2 rounded bg-[#10283D] border border-[#20394D] text-[10px] text-[#E8A23A]">
                    <span className="font-semibold block mb-0.5">Known Limitation:</span>
                    Historical polar sampling sparsity prior to satellite era introduces broader uncertainty envelopes.
                  </div>
                </div>
              )}
            </div>

            {/* Fast Nav to Stages */}
            <div className="space-y-2 pt-2 border-t border-[#20394D]">
              <button
                onClick={onAdvanceToIntake}
                className="w-full py-2 px-3 bg-[#20394D] text-[#42C8F5] hover:bg-[#20394D]/80 border border-[#20394D] rounded text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <span>Configure in Case Intake</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onAdvanceToEvidence}
                className="w-full py-2 px-3 bg-[#10283D] text-[#667789] hover:text-[#F7F9FB] border border-[#20394D] rounded text-xs flex items-center justify-between transition-colors"
              >
                <span>Jump to Evidence Matrix</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
