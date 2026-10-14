/**
 * DETs — Earth System Investigation Lab
 * Stage 2: Case Intake
 * 
 * Case ID: DEMO-001
 * Case Title: The Uneven Warming Case
 * Variable: Temperature anomaly
 * 
 * Features:
 * - Clear research question: "How do observed temperature anomaly trends differ across the selected regions?"
 * - Time range selection with explicit [DEMO CONFIGURATION] labels
 * - Climatological baseline metadata selection (1951-1980 vs 1991-2020)
 * - Candidate regions selector (enforces min 2 regions)
 * - Source metadata & data availability status (clearly labeled synthetic demo data)
 * - Connected 3D Earth Globe reflecting active candidate region selections in real time
 * - Strict progression gate (unlocks Evidence Examination only when configuration is complete)
 */

import React, { useState } from 'react';
import { CandidateRegion, CaseFile } from '../../types/investigation';
import { CANDIDATE_REGIONS, SCIENTIFIC_DISCLAIMER } from '../../data/demoData';
import { EarthGlobe } from '../globe/EarthGlobe';
import { 
  Check, 
  ArrowRight, 
  AlertCircle, 
  Calendar, 
  Globe, 
  SlidersHorizontal, 
  HelpCircle, 
  Database, 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  Clock,
  Compass
} from 'lucide-react';

interface IntakeStageProps {
  activeCase: CaseFile;
  baseline: '1951-1980' | '1991-2020';
  onChangeBaseline: (baseline: '1951-1980' | '1991-2020') => void;
  timeRange: [number, number];
  onChangeTimeRange: (range: [number, number]) => void;
  selectedRegionIds: string[];
  onToggleRegion: (regionId: string) => void;
  selectedHypothesis: string;
  onChangeHypothesis: (hypothesis: string) => void;
  highlightedRegionId: string | null;
  onHoverRegion: (regionId: string | null) => void;
  onAdvanceStage: () => void;
}

export const IntakeStage: React.FC<IntakeStageProps> = ({
  activeCase,
  baseline,
  onChangeBaseline,
  timeRange,
  onChangeTimeRange,
  selectedRegionIds,
  onToggleRegion,
  selectedHypothesis,
  onChangeHypothesis,
  highlightedRegionId,
  onHoverRegion,
  onAdvanceStage
}) => {
  const isReadyToAdvance = selectedRegionIds.length >= 2;

  // Time range presets clearly labeled as demo configuration
  const timeRangePresets: { label: string; range: [number, number]; desc: string }[] = [
    { 
      label: '1970–2024', 
      range: [1970, 2024], 
      desc: 'Modern satellite sounders & global buoy coverage era [DEMO CONFIGURATION]' 
    },
    { 
      label: '1990–2024', 
      range: [1990, 2024], 
      desc: 'Post-1990 accelerated regional divergence window [DEMO CONFIGURATION]' 
    },
    { 
      label: '2000–2024', 
      range: [2000, 2024], 
      desc: '21st-century polar amplification and marine extremes [DEMO CONFIGURATION]' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Case Intake Header & Core Research Question Card */}
      <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#20394D] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#42C8F5] bg-[#20394D] px-2.5 py-1 rounded">
                CASE ID: {activeCase.caseNumber}
              </span>
              <span className="text-xs text-[#667789]">·</span>
              <span className="text-xs font-mono text-[#E8A23A] bg-[#E8A23A]/10 px-2 py-0.5 rounded border border-[#E8A23A]/25">
                {SCIENTIFIC_DISCLAIMER.status}
              </span>
              <span className="text-xs text-[#667789] hidden sm:inline">·</span>
              <span className="text-xs font-mono text-[#26845B] hidden sm:inline">
                Status: {activeCase.status}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#F7F9FB] mt-2 tracking-tight">
              {activeCase.title}
            </h1>

            <div className="flex items-center gap-2 mt-1 text-xs font-mono text-[#667789]">
              <span>Investigated Variable: <strong className="text-[#F7F9FB] font-semibold">{activeCase.variable}</strong></span>
              <span>·</span>
              <span>Unit: <strong className="text-[#F7F9FB] font-semibold">{activeCase.unit}</strong></span>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-[11px] font-mono text-[#667789] block">Lead Scientific Group:</span>
            <span className="text-xs font-mono text-[#F7F9FB]">{activeCase.leadInvestigator}</span>
            <span className="text-[10px] font-mono text-[#667789] block mt-0.5">Stage 02 / 05 · Case Intake</span>
          </div>
        </div>

        {/* Highlighted Research Question Banner */}
        <div className="p-4 rounded-lg bg-[#162E44] border border-[#42C8F5]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#42C8F5] font-bold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Core Scientific Research Question
            </span>
            <p className="text-sm sm:text-base font-semibold text-[#F7F9FB] italic">
              "{activeCase.researchQuestion}"
            </p>
          </div>

          <div className="text-xs text-[#667789] font-mono sm:text-right shrink-0">
            <span>Falsification Criterion:</span>
            <span className="text-[#F7F9FB] block">Regional rate divergence &gt; 95% CI</span>
          </div>
        </div>
      </div>

      {/* 2. Main Intake Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Intake Configuration Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Baseline Metadata Selection */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#42C8F5]" />
                <h3 className="text-xs font-mono font-bold text-[#F7F9FB] uppercase tracking-wider">
                  1. Climatological Baseline Metadata
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#42C8F5]">
                Active: {baseline}
              </span>
            </div>

            <p className="text-xs text-[#667789]">
              Define the 30-year climatological reference window. Temperature anomalies are calculated as the local departure from this reference mean.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onChangeBaseline('1951-1980')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  baseline === '1951-1980'
                    ? 'bg-[#162E44] border-[#42C8F5] shadow-sm'
                    : 'bg-[#10283D] border-[#20394D] hover:border-[#667789]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F7F9FB]">1951–1980 Reference</span>
                  {baseline === '1951-1980' && <Check className="w-4 h-4 text-[#42C8F5]" />}
                </div>
                <span className="text-[11px] font-mono text-[#42C8F5] block mt-1">NASA GISTEMP Standard</span>
                <p className="text-[11px] text-[#667789] mt-1.5 leading-relaxed">
                  Historical mid-century baseline. Global absolute mean surface temperature approximately 14.0°C.
                </p>
              </button>

              <button
                onClick={() => onChangeBaseline('1991-2020')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  baseline === '1991-2020'
                    ? 'bg-[#162E44] border-[#42C8F5] shadow-sm'
                    : 'bg-[#10283D] border-[#20394D] hover:border-[#667789]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F7F9FB]">1991–2020 Reference</span>
                  {baseline === '1991-2020' && <Check className="w-4 h-4 text-[#42C8F5]" />}
                </div>
                <span className="text-[11px] font-mono text-[#42C8F5] block mt-1">WMO Standard Climatology</span>
                <p className="text-[11px] text-[#667789] mt-1.5 leading-relaxed">
                  Recent 30-year operational baseline. Globally ~0.55°C warmer than 1951–1980 reference.
                </p>
              </button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#42C8F5]" />
                <h3 className="text-xs font-mono font-bold text-[#F7F9FB] uppercase tracking-wider">
                  2. Observational Time Range
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#E8A23A] bg-[#E8A23A]/10 px-2 py-0.5 rounded border border-[#E8A23A]/25">
                DEMO CONFIGURATION
              </span>
            </div>

            <p className="text-xs text-[#667789]">
              Select the observational span to examine empirical time-series trends and calculate non-parametric decadal rates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {timeRangePresets.map(preset => {
                const isSelected =
                  timeRange[0] === preset.range[0] && timeRange[1] === preset.range[1];

                return (
                  <button
                    key={preset.label}
                    onClick={() => onChangeTimeRange(preset.range)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-[#162E44] border-[#42C8F5]'
                        : 'bg-[#10283D] border-[#20394D] hover:border-[#667789]'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold text-[#F7F9FB] block">
                      {preset.label}
                    </span>
                    <p className="text-[10px] text-[#667789] mt-1 leading-snug">
                      {preset.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Candidate Regions Selector */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#42C8F5]" />
                <h3 className="text-xs font-mono font-bold text-[#F7F9FB] uppercase tracking-wider">
                  3. Candidate Regions Matrix (Min 2 Required)
                </h3>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  isReadyToAdvance
                    ? 'bg-[#26845B]/20 text-[#26845B]'
                    : 'bg-[#E8A23A]/15 text-[#E8A23A]'
                }`}
              >
                {selectedRegionIds.length} Selected
              </span>
            </div>

            <p className="text-xs text-[#667789]">
              To address the research question ("How do trends differ across regions?"), choose at least two candidate zones for comparative anomaly modeling.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CANDIDATE_REGIONS.map(region => {
                const isSelected = selectedRegionIds.includes(region.id);

                return (
                  <div
                    key={region.id}
                    onClick={() => onToggleRegion(region.id)}
                    onMouseEnter={() => onHoverRegion(region.id)}
                    onMouseLeave={() => onHoverRegion(null)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#162E44] border-[#42C8F5] shadow-sm'
                        : 'bg-[#10283D] border-[#20394D] hover:border-[#667789]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: region.color }}
                        />
                        <span className="text-xs font-bold text-[#F7F9FB]">
                          {region.name}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#42C8F5] border-[#42C8F5] text-[#10283D]'
                            : 'border-[#667789]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] font-mono text-[#667789] flex items-center justify-between">
                      <span>{region.code}</span>
                      <span className="text-[#42C8F5] font-semibold">
                        +{region.currentAnomaly2024.toFixed(2)}°C
                      </span>
                    </div>

                    <div className="mt-1 text-[10px] text-[#667789] font-mono flex items-center justify-between">
                      <span>Rate: +{region.warmingRatePerDecade.toFixed(2)}°C/dec</span>
                      <span>±{region.uncertaintyMargin.toFixed(2)}°C</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {!isReadyToAdvance && (
              <div className="p-3 rounded-lg bg-[#E8A23A]/10 border border-[#E8A23A]/25 text-xs text-[#E8A23A] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Please select at least <strong>two candidate regions</strong> to enable the comparative scientific workflow.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Globe Sync, Source Metadata & Progression Gate (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Synchronized 3D Earth Globe Viewport */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#42C8F5]" />
                <h3 className="text-xs font-mono font-bold text-[#F7F9FB] uppercase tracking-wider">
                  Spatial Markers In Situ
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#667789]">
                Live synchronized
              </span>
            </div>

            <EarthGlobe
              regions={CANDIDATE_REGIONS}
              selectedRegionIds={selectedRegionIds}
              highlightedRegionId={highlightedRegionId}
              onSelectRegion={onToggleRegion}
              onHoverRegion={onHoverRegion}
            />

            <div className="p-2.5 rounded bg-[#162E44] border border-[#20394D] text-[11px] font-mono text-[#667789] flex items-center justify-between">
              <span>Selected on Globe: {selectedRegionIds.length} regions</span>
              <span className="text-[#42C8F5]">Click pin to toggle</span>
            </div>
          </div>

          {/* Source Metadata & Data Availability Status */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#42C8F5]" />
                <h3 className="text-xs font-mono font-bold text-[#F7F9FB] uppercase tracking-wider">
                  Data Availability &amp; Metadata
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#26845B] bg-[#26845B]/15 px-2 py-0.5 rounded border border-[#26845B]/30 font-bold">
                DEMO DATA READY
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#20394D]">
                <span className="text-[#667789]">Source Lineage:</span>
                <span className="text-[#F7F9FB]">NASA GISTEMP v4 / GHCNv4 / ERSSTv5</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#20394D]">
                <span className="text-[#667789]">Spatial Resolution:</span>
                <span className="text-[#F7F9FB]">2° × 2° Grid (250km smoothing)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#20394D]">
                <span className="text-[#667789]">Temporal Resolution:</span>
                <span className="text-[#F7F9FB]">Monthly &amp; Annual Anomaly</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#20394D]">
                <span className="text-[#667789]">Instrument Types:</span>
                <span className="text-[#F7F9FB]">Weather stations + Argo CTD + Buoys</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#667789]">Missing Data Policy:</span>
                <span className="text-[#E8A23A]">Interpolation bounds explicit</span>
              </div>
            </div>

            <p className="text-[11px] text-[#667789] leading-relaxed pt-1 border-t border-[#20394D]">
              <strong>Demo Disclaimer:</strong> All data in this prototype represents synthetic demonstration datasets configured to validate scientific investigation UX. No real-world scientific discoveries are claimed.
            </p>
          </div>

          {/* Progression Gate Card */}
          <div className="bg-[#162E44] rounded-xl border border-[#20394D] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#42C8F5]">
                Intake Configuration Status
              </h4>
              <span
                className={`text-[11px] font-mono font-bold ${
                  isReadyToAdvance ? 'text-[#26845B]' : 'text-[#E8A23A]'
                }`}
              >
                {isReadyToAdvance ? '● Configuration Valid' : '▲ Action Required'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-[#667789] font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#26845B]" />
                <span>Case DEMO-001 Loaded</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#26845B]" />
                <span>Baseline ({baseline}) Locked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#26845B]" />
                <span>Time Range ({timeRange[0]}–{timeRange[1]}) Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isReadyToAdvance ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#26845B]" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-[#E8A23A]" />
                )}
                <span className={isReadyToAdvance ? 'text-[#F7F9FB]' : 'text-[#E8A23A]'}>
                  {selectedRegionIds.length} Candidate Regions ({isReadyToAdvance ? 'Pass' : 'Need ≥ 2'})
                </span>
              </div>
            </div>

            {/* Advance Button (Gated) */}
            <button
              disabled={!isReadyToAdvance}
              onClick={onAdvanceStage}
              className={`w-full py-3 px-4 font-bold text-xs rounded transition-all flex items-center justify-center gap-2 ${
                isReadyToAdvance
                  ? 'bg-[#42C8F5] text-[#10283D] hover:bg-[#34b4df] shadow-md cursor-pointer'
                  : 'bg-[#20394D] text-[#667789] cursor-not-allowed border border-[#20394D]'
              }`}
            >
              <span>Proceed to Evidence Examination</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
