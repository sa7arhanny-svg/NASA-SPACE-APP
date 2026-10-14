/**
 * DETs — Earth System Investigation Lab
 * Stage 5: Findings & Verdict
 * 
 * Concise, professional scientific case report summarizing the investigation
 * without overstating what the data support.
 * 
 * Structure:
 * - CASE QUESTION: State exact research question, selected regions, and time period.
 * - OBSERVED PATTERN: Summarize patterns directly supported by input data.
 * - STATISTICAL EVIDENCE: Display only computed results (method, estimates, uncertainty, p-values).
 * - REGIONAL COMPARISON: Explain comparisons made & whether trend difference was directly tested.
 * - INTERPRETATION: Explain what evidence may suggest, clearly separated from demonstrated results.
 * - LIMITATIONS: Coverage issues, baseline choices, assumptions, and missing evidence.
 * - CURRENT VERDICT: Controlled labels (Supported, Inconclusive, Not supported, Incomplete).
 *   In demo mode, prominently displays: "ILLUSTRATIVE RESULT — NOT A SCIENTIFIC FINDING."
 * - COMPACT EVIDENCE TRAIL: Links each conclusion to relevant chart, data source, and analysis step.
 */

import React, { useState } from 'react';
import { CandidateRegion, CaseFile, InvestigationStage, VerdictLabel } from '../../types/investigation';
import { CANDIDATE_REGIONS, SCIENTIFIC_DISCLAIMER } from '../../data/demoData';
import { 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Scale, 
  Layers, 
  ShieldCheck, 
  ExternalLink, 
  ArrowLeft, 
  Activity, 
  Database, 
  Clock, 
  AlertCircle,
  Link2
} from 'lucide-react';

interface VerdictStageProps {
  activeCase: CaseFile;
  baseline: '1951-1980' | '1991-2020';
  timeRange?: [number, number];
  selectedRegionIds: string[];
  verdictLabel: VerdictLabel;
  onChangeVerdictLabel: (label: VerdictLabel) => void;
  verdictNotes: string;
  onChangeNotes: (notes: string) => void;
  onNavigateToStage: (stage: InvestigationStage) => void;
  onOpenExportModal: () => void;
}

export const VerdictStage: React.FC<VerdictStageProps> = ({
  activeCase,
  baseline,
  timeRange = [1970, 2024],
  selectedRegionIds,
  verdictLabel,
  onChangeVerdictLabel,
  verdictNotes,
  onChangeNotes,
  onNavigateToStage,
  onOpenExportModal
}) => {
  const selectedRegions = CANDIDATE_REGIONS.filter(r => selectedRegionIds.includes(r.id));
  const arcticRegion = CANDIDATE_REGIONS.find(r => r.id === 'arctic');
  const globalRegion = CANDIDATE_REGIONS.find(r => r.id === 'global_mean');

  const isConfigurationComplete = selectedRegionIds.length >= 2;

  // Controlled verdict options
  const verdictOptions: { label: VerdictLabel; desc: string; tone: 'green' | 'amber' | 'red' | 'slate' }[] = [
    {
      label: 'Supported by current evidence.',
      desc: 'Observed high-latitude warming rate (+0.74°C/dec) exceeds global baseline (+0.20°C/dec) with statistical significance (p < 0.0001) under stated baseline and uncertainty bounds.',
      tone: 'green'
    },
    {
      label: 'Evidence is inconclusive.',
      desc: 'Observational divergence is present, but missing counterfactual modeling or spatial coverage gaps prevent a definitive conclusion on attribution.',
      tone: 'amber'
    },
    {
      label: 'Not supported by current evidence.',
      desc: 'Empirical data do not demonstrate regional warming rate differences distinguishable from natural internal climate variability.',
      tone: 'red'
    },
    {
      label: 'Analysis incomplete.',
      desc: 'Required candidate regions, time range, or data quality audits have not been completed.',
      tone: 'slate'
    }
  ];

  // Auto-switch to incomplete if fewer than 2 regions
  const effectiveVerdictLabel: VerdictLabel = !isConfigurationComplete ? 'Analysis incomplete.' : verdictLabel;

  return (
    <div className="space-y-8">
      {/* 1. Scientific Case Report Header Banner */}
      <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#20394D] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#42C8F5] uppercase tracking-wider">
                Stage 05 / 05 · Scientific Findings &amp; Verdict Report
              </span>
              <span className="text-xs text-[#667789]">·</span>
              <span className="text-xs font-mono text-[#E8A23A] bg-[#E8A23A]/10 px-2.5 py-0.5 rounded border border-[#E8A23A]/30 font-bold">
                ILLUSTRATIVE RESULT — NOT A SCIENTIFIC FINDING
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#F7F9FB] mt-2 tracking-tight">
              Case Report: {activeCase.caseNumber} — {activeCase.title}
            </h1>
            <p className="text-xs text-[#667789] mt-1 font-mono">
              Lead Group: {activeCase.leadInvestigator} · Variable: {activeCase.variable}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToStage('evidence')}
              className="px-3.5 py-2 bg-[#20394D] text-[#42C8F5] hover:bg-[#20394D]/80 border border-[#20394D] font-mono text-xs rounded transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Evidence</span>
            </button>

            <button
              onClick={onOpenExportModal}
              className="px-4 py-2 bg-[#42C8F5] text-[#10283D] font-bold text-xs rounded hover:bg-[#34b4df] transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Mandatory Demo Mode Disclaimer Banner */}
        <div className="p-3.5 rounded-lg bg-[#E8A23A]/10 border border-[#E8A23A]/30 text-xs text-[#E8A23A] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              ILLUSTRATIVE RESULT — NOT A SCIENTIFIC FINDING.
            </span>
            <span className="text-[#F7F9FB] hidden md:inline">
              This report demonstrates the forensic workflow and uncertainty traceability. It does not state operational NASA findings or peer-reviewed climate discoveries.
            </span>
          </div>

          <span className="text-[10px] font-mono shrink-0 uppercase tracking-wider text-[#667789] hidden sm:inline">
            NASA Space Apps Concept
          </span>
        </div>
      </div>

      {/* 2. Structured Scientific Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 6 Core Scientific Sections (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: CASE QUESTION */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#42C8F5] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Case Question &amp; Observational Scope
              </span>
              <span className="text-[10px] font-mono text-[#667789]">Section 01</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded bg-[#162E44] border border-[#20394D]">
                <span className="text-[#667789] block font-mono text-[10px] uppercase">Exact Research Question:</span>
                <p className="text-sm font-semibold text-[#F7F9FB] italic mt-0.5">
                  "{activeCase.researchQuestion}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px] pt-1">
                <div className="p-2.5 rounded bg-[#162E44] border border-[#20394D]">
                  <span className="text-[#667789] block text-[10px]">Time Period:</span>
                  <span className="text-[#F7F9FB] font-bold">{timeRange[0]}–{timeRange[1]}</span>
                  <span className="text-[10px] text-[#667789] block mt-0.5">({timeRange[1] - timeRange[0]} observational years)</span>
                </div>

                <div className="p-2.5 rounded bg-[#162E44] border border-[#20394D]">
                  <span className="text-[#667789] block text-[10px]">Baseline Definition:</span>
                  <span className="text-[#42C8F5] font-bold">{baseline} Climatology</span>
                  <span className="text-[10px] text-[#667789] block mt-0.5">Unit: °C surface anomaly</span>
                </div>

                <div className="p-2.5 rounded bg-[#162E44] border border-[#20394D]">
                  <span className="text-[#667789] block text-[10px]">Regions Evaluated:</span>
                  <span className="text-[#26845B] font-bold">{selectedRegions.length} Candidate Zones</span>
                  <span className="text-[10px] text-[#667789] block mt-0.5">Spatial masks applied</span>
                </div>
              </div>

              {/* Selected Regions Tag List */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[#667789] text-[11px] font-mono mr-1">Active Regions:</span>
                {selectedRegions.map(reg => (
                  <span
                    key={reg.id}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#162E44] border border-[#20394D] text-[#F7F9FB] flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: reg.color }} />
                    <span>{reg.name} ({reg.code})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: OBSERVED PATTERN */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#42C8F5] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Observed Pattern (Directly Supported by Input Data)
              </span>
              <span className="text-[10px] font-mono text-[#667789]">Section 02</span>
            </div>

            <p className="text-xs text-[#F7F9FB] leading-relaxed">
              The calibrated input data (GISTEMP v4 / GHCNv4 / ERSSTv5 structure) directly confirm the following empirical realities over the {timeRange[0]}–{timeRange[1]} period relative to the {baseline} baseline:
            </p>

            <ul className="space-y-2 text-xs text-[#667789]">
              <li className="flex items-start gap-2">
                <span className="text-[#42C8F5] font-mono mt-0.5">•</span>
                <span>
                  <strong>High-Latitude Departure:</strong> The Arctic Amplification Zone anomaly reached <strong>+{arcticRegion?.currentAnomaly2024.toFixed(2)}°C</strong> in 2024, exhibiting positive annual departures in 52 of 54 observed years.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#42C8F5] font-mono mt-0.5">•</span>
                <span>
                  <strong>Global Mean Comparison:</strong> Over the identical period and baseline, the Global Mean land-ocean benchmark reached <strong>+{globalRegion?.currentAnomaly2024.toFixed(2)}°C</strong> in 2024.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#42C8F5] font-mono mt-0.5">•</span>
                <span>
                  <strong>Post-2000 Acceleration:</strong> Regional trajectory curves show pronounced visual divergence after the year 2000, with polar latitude anomalies accelerating at a steeper slope than equatorial or mid-latitude trajectories.
                </span>
              </li>
            </ul>

            <div className="p-2.5 rounded bg-[#162E44] border border-[#20394D] flex items-center justify-between text-[11px] font-mono text-[#667789]">
              <span>Direct Link: Regional Time Series Chart (Stage 03)</span>
              <button
                onClick={() => onNavigateToStage('evidence')}
                className="text-[#42C8F5] hover:underline flex items-center gap-1"
              >
                <span>Inspect Chart</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* SECTION 3: STATISTICAL EVIDENCE */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#26845B] flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                Statistical Evidence (Computed Mathematical Results)
              </span>
              <span className="text-[10px] font-mono text-[#26845B]">p &lt; 0.0001</span>
            </div>

            <p className="text-xs text-[#F7F9FB] leading-relaxed">
              Only formal mathematical evaluations computed from the observational series are reported below (α = 0.05):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded bg-[#162E44] border border-[#20394D] space-y-1">
                <span className="text-[#42C8F5] font-bold block">Mann-Kendall Trend Test (Arctic)</span>
                <div className="flex justify-between text-[#667789]">
                  <span>Sen's Slope:</span>
                  <span className="text-[#F7F9FB] font-bold">+0.74°C / decade</span>
                </div>
                <div className="flex justify-between text-[#667789]">
                  <span>95% Confidence Interval:</span>
                  <span className="text-[#F7F9FB]">[+0.56°C, +0.92°C]</span>
                </div>
                <div className="flex justify-between text-[#667789]">
                  <span>Test Statistic / p-value:</span>
                  <span className="text-[#26845B] font-bold">Z = +6.84 (p &lt; 0.0001)</span>
                </div>
              </div>

              <div className="p-3 rounded bg-[#162E44] border border-[#20394D] space-y-1">
                <span className="text-[#42C8F5] font-bold block">Mann-Kendall Trend Test (Global Mean)</span>
                <div className="flex justify-between text-[#667789]">
                  <span>Sen's Slope:</span>
                  <span className="text-[#F7F9FB] font-bold">+0.20°C / decade</span>
                </div>
                <div className="flex justify-between text-[#667789]">
                  <span>95% Confidence Interval:</span>
                  <span className="text-[#F7F9FB]">[+0.15°C, +0.25°C]</span>
                </div>
                <div className="flex justify-between text-[#667789]">
                  <span>Test Statistic / p-value:</span>
                  <span className="text-[#26845B] font-bold">Z = +8.12 (p &lt; 0.0001)</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#10283D] border border-[#20394D] text-[11px] text-[#667789]">
              <strong>Methodological Note:</strong> Both time series exhibit monotonic positive trends that firmly reject the null hypothesis of unforced random noise.
            </div>
          </div>

          {/* SECTION 4: REGIONAL COMPARISON */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#42C8F5] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Regional Comparison &amp; Hypothesis Testing
              </span>
              <span className="text-[10px] font-mono text-[#667789]">Section 04</span>
            </div>

            <p className="text-xs text-[#F7F9FB] leading-relaxed">
              <strong>Testing Specification:</strong> Rather than assuming that visually separated plotted curves imply a meaningful difference, the difference between regional decadal slopes was directly evaluated:
            </p>

            <div className="p-3 rounded bg-[#162E44] border border-[#20394D] space-y-2 text-xs font-mono">
              <div className="flex justify-between items-baseline border-b border-[#20394D]/60 pb-1.5">
                <span className="text-[#667789]">Pairwise Evaluation:</span>
                <span className="text-[#F7F9FB] font-bold">Arctic (ARC-66N) vs. Global Mean (GLB-MEAN)</span>
              </div>
              <div className="flex justify-between text-[#667789]">
                <span>Hypothesis Test:</span>
                <span className="text-[#F7F9FB]">Welch's Two-Sample t-test on Sen's slope estimators</span>
              </div>
              <div className="flex justify-between text-[#667789]">
                <span>Rate Difference (Δ Slope):</span>
                <span className="text-[#42C8F5] font-bold">+0.54°C / decade</span>
              </div>
              <div className="flex justify-between text-[#667789]">
                <span>Test Statistic &amp; Significance:</span>
                <span className="text-[#26845B] font-bold">t = +7.31, df = 98 (p &lt; 0.0001)</span>
              </div>
            </div>

            <p className="text-xs text-[#667789] leading-relaxed">
              <strong>Comparison Outcome:</strong> The observed Arctic decadal rate (+0.74°C/decade) is approximately <strong>3.7× higher</strong> than the global rate, and the rate difference is statistically significant beyond the 95% confidence interval of internal variability.
            </p>
          </div>

          {/* SECTION 5: INTERPRETATION */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E8A23A] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#E8A23A]" />
                Interpretation (Plausible Supporting Explanations)
              </span>
              <span className="text-[10px] font-mono text-[#E8A23A]">Segregated from Facts</span>
            </div>

            <p className="text-xs text-[#F7F9FB] leading-relaxed">
              The following mechanisms are consistent with the observed empirical divergence, but are <em>interpretative hypotheses</em> rather than proven causal facts of the time series alone:
            </p>

            <ul className="space-y-2 text-xs text-[#667789]">
              <li className="flex items-start gap-2">
                <span className="text-[#E8A23A] font-mono mt-0.5">•</span>
                <span>
                  <strong>Surface-Albedo Feedback:</strong> Declining seasonal Arctic sea ice reduces surface albedo from ~0.60 to ~0.08, transferring solar radiation into ocean heat content and releasing longwave radiation during autumn freeze-up.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E8A23A] font-mono mt-0.5">•</span>
                <span>
                  <strong>Lapse-Rate &amp; Moisture Advection:</strong> Stable high-latitude vertical atmospheric stratification traps thermal energy near the surface, while atmospheric moisture transport from mid-latitudes increases downward longwave irradiance.
                </span>
              </li>
            </ul>

            <div className="p-2.5 rounded bg-[#10283D] border border-[#20394D] text-[11px] text-[#667789]">
              <strong className="text-[#F7F9FB]">Epistemological Boundary:</strong> A statistical trend demonstrates non-random regional divergence; physical causal attribution requires counterfactual coupled climate modeling (CMIP6 DAMIP) to prove radiative forcing dominance.
            </div>
          </div>

          {/* SECTION 6: LIMITATIONS */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C84A4A] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#C84A4A]" />
                Documented Limitations &amp; Caveats
              </span>
              <span className="text-[10px] font-mono text-[#C84A4A]">Audit Caveats</span>
            </div>

            <div className="space-y-2 text-xs text-[#667789]">
              <p>
                1. <strong>Spatial Station Sparsity:</strong> High-latitude weather station density in the central Arctic Ocean is sparse. GISTEMP applies a 250 km smoothing radius to interpolate between coastal stations, introducing spatial variance.
              </p>
              <p>
                2. <strong>Baseline Choice Impact:</strong> The 1951–1980 baseline defines a mid-century reference mean (~14.0°C). Switching to the 1991–2020 WMO baseline reduces reported anomaly numbers uniformly by ~0.55°C globally.
              </p>
              <p>
                3. <strong>Historical Sensor Transitions:</strong> Observational SST records shifted from uninsulated canvas buckets to engine intakes, satellites, and Argo floats, requiring empirical bias adjustments that widen pre-1980 uncertainty envelopes.
              </p>
              <p>
                4. <strong>Multidecadal Internal Variability:</strong> Observational data alone cannot unilaterally separate the fraction of Arctic warming driven by multidecadal ocean oscillations (AMO) from greenhouse gas forcing.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Controlled Verdict & Compact Evidence Trail (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* CURRENT VERDICT CARD */}
          <div className="bg-[#10283D] rounded-xl border-2 border-[#42C8F5] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#42C8F5] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#42C8F5]" />
                Current Investigation Verdict
              </span>
              <span className="text-[10px] font-mono text-[#E8A23A] bg-[#E8A23A]/10 px-1.5 py-0.5 rounded border border-[#E8A23A]/25">
                CONTROLLED
              </span>
            </div>

            {/* Controlled Verdict Selector */}
            <div className="space-y-2.5">
              {verdictOptions.map(opt => {
                const isSelected = effectiveVerdictLabel === opt.label;
                const isDisabled = !isConfigurationComplete && opt.label !== 'Analysis incomplete.';

                return (
                  <div
                    key={opt.label}
                    onClick={() => {
                      if (!isDisabled) onChangeVerdictLabel(opt.label);
                    }}
                    className={`p-3 rounded-lg border transition-all ${
                      isDisabled
                        ? 'opacity-40 cursor-not-allowed bg-[#10283D] border-[#20394D]'
                        : isSelected
                        ? opt.tone === 'green'
                          ? 'bg-[#162E44] border-[#26845B] shadow-md cursor-pointer'
                          : opt.tone === 'amber'
                          ? 'bg-[#162E44] border-[#E8A23A] shadow-md cursor-pointer'
                          : 'bg-[#162E44] border-[#42C8F5] shadow-md cursor-pointer'
                        : 'bg-[#10283D] border-[#20394D] hover:border-[#667789] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isSelected 
                          ? opt.tone === 'green' ? 'text-[#26845B]' : opt.tone === 'amber' ? 'text-[#E8A23A]' : 'text-[#F7F9FB]'
                          : 'text-[#F7F9FB]'
                      }`}>
                        {opt.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#42C8F5]" />}
                    </div>
                    <p className="mt-1 text-[11px] text-[#667789] leading-snug">
                      {opt.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Custom Investigator Sign-Off Notes */}
            <div className="pt-2 border-t border-[#20394D] space-y-1.5">
              <span className="text-xs font-mono text-[#667789] block">
                Investigator Case Notes &amp; Synthesis:
              </span>
              <textarea
                value={verdictNotes}
                onChange={e => onChangeNotes(e.target.value)}
                rows={3}
                placeholder="Document final conclusions, peer review recommendations, or pending analyses..."
                className="w-full px-2.5 py-1.5 text-xs bg-[#162E44] border border-[#20394D] rounded text-[#F7F9FB] focus:border-[#42C8F5] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* COMPACT EVIDENCE TRAIL */}
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F7F9FB] flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-[#42C8F5]" />
                Compact Evidence Trail
              </span>
              <span className="text-[10px] font-mono text-[#667789]">Traceable</span>
            </div>

            <p className="text-xs text-[#667789] leading-relaxed">
              Every finding is indexed directly to its underlying visual chart, raw dataset, and custody transformation step:
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#162E44] border border-[#20394D] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#42C8F5] font-semibold">1. Visual Time Series</span>
                  <button
                    onClick={() => onNavigateToStage('evidence')}
                    className="text-[#667789] hover:text-[#42C8F5] text-[10px] flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
                <span className="text-[11px] text-[#667789] block font-sans">
                  Regional Anomaly Trajectory Chart (1970–2024 with 95% CI bands)
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#162E44] border border-[#20394D] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#42C8F5] font-semibold">2. Primary Ingested Data</span>
                  <span className="text-[10px] text-[#667789]">EVD-GISTEMP-V4</span>
                </div>
                <span className="text-[11px] text-[#667789] block font-sans">
                  NASA GISTEMP v4 / GHCNm v4 / ERSSTv5 gridded surface dataset
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#162E44] border border-[#20394D] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#42C8F5] font-semibold">3. Custody Transformation</span>
                  <button
                    onClick={() => onNavigateToStage('custody')}
                    className="text-[#667789] hover:text-[#42C8F5] text-[10px] flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
                <span className="text-[11px] text-[#667789] block font-sans">
                  COC-STEP-04 (Gridding) · COC-STEP-05 (Cosine Weighting) · COC-STEP-06 (Trend Test)
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#162E44] border border-[#20394D] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#42C8F5] font-semibold">4. Documented Audit Hash</span>
                  <span className="text-[10px] text-[#667789]">Step 07 Link</span>
                </div>
                <span className="text-[10px] text-[#667789] truncate block">
                  Digest: sha256-7d130a12...c9a (Illustrative demo)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
