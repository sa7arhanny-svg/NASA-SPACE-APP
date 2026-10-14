/**
 * DETs — Earth System Investigation Lab
 * Stage 3: Evidence Examination
 * 
 * Central Scientific Question:
 * "What does the evidence show about temperature anomaly trends across the selected regions?"
 * 
 * Features:
 * 1. Regional comparison chart with a shared time axis (updates with regions/timeRange).
 * 2. Clearly labeled unit and baseline definition.
 * 3. Region selector linked to the existing 3D Earth globe.
 * 4. Compact evidence summary for each selected region.
 * 5. Data quality and coverage indicators.
 * 6. Statistical results section (explicit methods, distinguishing stats vs practical importance).
 * 7. Uncertainty and limitations panel.
 * 8. Source and methodology drawer (collapsible).
 * 
 * SEPARATION INTO FOUR EXPLICITLY LABELED CATEGORIES:
 * - OBSERVED: what is directly represented in the data.
 * - TESTED: what has been evaluated using a stated statistical method.
 * - INTERPRETATION: what the evidence may suggest, with supporting reasoning.
 * - UNRESOLVED: what cannot yet be concluded.
 */

import React, { useState } from 'react';
import { CandidateRegion, EvidenceItem } from '../../types/investigation';
import { CANDIDATE_REGIONS, EVIDENCE_DOSSIER, SCIENTIFIC_DISCLAIMER } from '../../data/demoData';
import { EarthGlobe } from '../globe/EarthGlobe';
import { RegionalAnomalyChart } from '../charts/RegionalAnomalyChart';
import { 
  FileCheck2, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  Database, 
  Scale, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  HelpCircle, 
  Layers, 
  Activity, 
  Compass, 
  BookOpen, 
  ExternalLink 
} from 'lucide-react';

interface EvidenceStageProps {
  baseline: '1951-1980' | '1991-2020';
  timeRange?: [number, number];
  selectedRegionIds: string[];
  highlightedRegionId: string | null;
  onSelectRegion: (regionId: string) => void;
  onHoverRegion: (regionId: string | null) => void;
  reviewedEvidenceIds: string[];
  onToggleReviewEvidence: (evidenceId: string) => void;
  onAdvanceStage: () => void;
}

export const EvidenceStage: React.FC<EvidenceStageProps> = ({
  baseline,
  timeRange = [1970, 2024],
  selectedRegionIds,
  highlightedRegionId,
  onSelectRegion,
  onHoverRegion,
  reviewedEvidenceIds,
  onToggleReviewEvidence,
  onAdvanceStage
}) => {
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<string>('EVD-GISTEMP-V4');
  const [showMethodologyDrawer, setShowMethodologyDrawer] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'observed' | 'tested' | 'interpretation' | 'unresolved'>('all');

  // Selected region objects for chart and summaries (ensure global mean is included for comparative baseline)
  const selectedRegions = CANDIDATE_REGIONS.filter(
    r => selectedRegionIds.includes(r.id) || r.id === 'global_mean'
  );

  const activeEvidence = EVIDENCE_DOSSIER.find(e => e.id === activeEvidenceTab) || EVIDENCE_DOSSIER[0];

  // Arctic vs Global Mean comparison points
  const arcticRegion = CANDIDATE_REGIONS.find(r => r.id === 'arctic');
  const globalRegion = CANDIDATE_REGIONS.find(r => r.id === 'global_mean');

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Central Scientific Question */}
      <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#20394D] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#42C8F5] uppercase tracking-wider">
                Stage 03 / 05 · Evidence Examination
              </span>
              <span className="text-xs text-[#667789]">·</span>
              <span className="text-xs font-mono text-[#E8A23A] bg-[#E8A23A]/10 px-2 py-0.5 rounded border border-[#E8A23A]/25">
                {SCIENTIFIC_DISCLAIMER.status}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#F7F9FB] mt-2 tracking-tight">
              Empirical Evidence &amp; Statistical Scrutiny
            </h1>
          </div>

          <button
            onClick={onAdvanceStage}
            className="px-4 py-2.5 bg-[#42C8F5] text-[#10283D] font-bold text-xs rounded hover:bg-[#34b4df] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 self-start md:self-auto"
          >
            <span>Proceed to Chain of Custody</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Central Scientific Question Callout */}
        <div className="p-4 rounded-lg bg-[#162E44] border border-[#42C8F5]/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#42C8F5] font-bold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Central Investigation Question
            </span>
            <p className="text-sm sm:text-base font-semibold text-[#F7F9FB] italic">
              "What does the evidence show about temperature anomaly trends across the selected regions?"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#667789] pt-2 md:pt-0 border-t md:border-t-0 border-[#20394D]">
            <div>
              <span className="text-[#667789] block text-[10px]">Unit:</span>
              <span className="text-[#F7F9FB] font-semibold">°C Anomaly</span>
            </div>
            <div className="h-6 w-px bg-[#20394D] hidden sm:block" />
            <div>
              <span className="text-[#667789] block text-[10px]">Baseline Definition:</span>
              <span className="text-[#42C8F5] font-semibold">{baseline} Climatology</span>
            </div>
            <div className="h-6 w-px bg-[#20394D] hidden sm:block" />
            <div>
              <span className="text-[#667789] block text-[10px]">Time Horizon:</span>
              <span className="text-[#F7F9FB] font-semibold">{timeRange[0]}–{timeRange[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Visual Split: 3D Earth Globe + Comparative Regional Anomaly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Globe with Linked Region Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#42C8F5]" />
                <h3 className="text-xs font-mono font-bold text-[#F7F9FB] uppercase tracking-wider">
                  Linked Spatial Telemetry Sphere
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#667789]">
                Click marker to toggle
              </span>
            </div>

            {/* Central Interactive Three.js Earth Globe */}
            <EarthGlobe
              regions={CANDIDATE_REGIONS}
              selectedRegionIds={selectedRegionIds}
              highlightedRegionId={highlightedRegionId}
              onSelectRegion={onSelectRegion}
              onHoverRegion={onHoverRegion}
            />

            {/* Region Selector Pills/Buttons */}
            <div className="pt-2 border-t border-[#20394D]">
              <span className="text-[11px] font-mono text-[#667789] block mb-2">
                Linked Candidate Regions ({selectedRegionIds.length} Selected):
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {CANDIDATE_REGIONS.filter(r => r.id !== 'global_mean').map(region => {
                  const isSelected = selectedRegionIds.includes(region.id);
                  const isHighlighted = highlightedRegionId === region.id;

                  return (
                    <button
                      key={region.id}
                      onClick={() => onSelectRegion(region.id)}
                      onMouseEnter={() => onHoverRegion(region.id)}
                      onMouseLeave={() => onHoverRegion(null)}
                      className={`px-2.5 py-1.5 rounded text-xs font-mono text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#162E44] border border-[#42C8F5] text-[#F7F9FB]'
                          : 'bg-[#10283D] text-[#667789] border border-[#20394D] hover:border-[#667789]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: region.color }}
                        />
                        <span className="truncate text-[11px]">{region.name}</span>
                      </div>
                      <span className="text-[10px] tabular-nums text-[#42C8F5] ml-1 shrink-0">
                        {isSelected ? '✓' : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Regional Anomaly SVG Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <RegionalAnomalyChart
            selectedRegions={selectedRegions}
            baseline={baseline}
            timeRange={timeRange}
            highlightedRegionId={highlightedRegionId}
            onHoverRegion={onHoverRegion}
          />
        </div>
      </div>

      {/* 3. Compact Evidence Summary & Data Quality/Coverage Indicators for Each Region */}
      <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#20394D] pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#42C8F5]" />
            <div>
              <h3 className="text-sm font-bold text-[#F7F9FB]">
                Regional Evidence Summaries &amp; Data Quality Ledger
              </h3>
              <p className="text-xs text-[#667789]">
                Empirical anomaly values, sensor coverage density, and uncertainty margins across active regions
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-[#E8A23A] bg-[#20394D] px-2.5 py-1 rounded">
            Baseline: {baseline} (0.00°C)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedRegions.map(region => {
            const isBenchmark = region.id === 'global_mean';

            return (
              <div
                key={region.id}
                onMouseEnter={() => onHoverRegion(region.id)}
                onMouseLeave={() => onHoverRegion(null)}
                className={`p-4 rounded-lg border transition-all ${
                  highlightedRegionId === region.id
                    ? 'bg-[#162E44] border-[#42C8F5] shadow-md'
                    : 'bg-[#162E44]/70 border-[#20394D] hover:border-[#667789]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#20394D]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: region.color }}
                    />
                    <h4 className="text-xs font-bold text-[#F7F9FB]">
                      {region.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#42C8F5]">
                    {region.code}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#667789]">2024 Anomaly:</span>
                    <span className="text-sm font-bold text-[#E8A23A] tabular-nums">
                      +{region.currentAnomaly2024.toFixed(2)}°C
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#667789]">Decadal Rate:</span>
                    <span className="text-[#F7F9FB] tabular-nums">
                      +{region.warmingRatePerDecade.toFixed(2)}°C / dec
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#667789]">95% CI Margin:</span>
                    <span className="text-[#667789] tabular-nums">
                      ±{region.uncertaintyMargin.toFixed(2)}°C
                    </span>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-[#20394D]/60 text-[11px]">
                    <span className="text-[#667789]">Station Density:</span>
                    <span className={`font-semibold ${
                      region.stationDensity === 'High' ? 'text-[#26845B]' :
                      region.stationDensity === 'Moderate' ? 'text-[#42C8F5]' : 'text-[#E8A23A]'
                    }`}>
                      {region.stationDensity}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#667789]">Coverage Quality:</span>
                    <span className="text-[#F7F9FB]">
                      {region.stationDensity === 'Sparse' ? '92.1% (Spatial infill)' : '99.4% Complete'}
                    </span>
                  </div>
                </div>

                <p className="mt-3 pt-2 border-t border-[#20394D]/60 text-[11px] text-[#667789] leading-relaxed">
                  {region.keyVulnerability}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. THE FOUR SCIENTIFIC CATEGORIES: OBSERVED, TESTED, INTERPRETATION, UNRESOLVED */}
      <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#20394D] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#42C8F5]" />
              <h3 className="text-base font-bold text-[#F7F9FB]">
                Four-Tier Scientific Evidence Categorization
              </h3>
            </div>
            <p className="text-xs text-[#667789] mt-0.5">
              Strict epistemological boundary separating direct observational data from statistical tests, physical interpretations, and unanswered scientific limits.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#162E44] rounded-lg border border-[#20394D] text-xs font-mono">
            {(['all', 'observed', 'tested', 'interpretation', 'unresolved'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveCategoryTab(tab)}
                className={`px-2.5 py-1 rounded transition-colors uppercase ${
                  activeCategoryTab === tab
                    ? 'bg-[#42C8F5] text-[#10283D] font-bold shadow-sm'
                    : 'text-[#667789] hover:text-[#F7F9FB]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CATEGORY 1: OBSERVED */}
          {(activeCategoryTab === 'all' || activeCategoryTab === 'observed') && (
            <div className="p-5 rounded-lg bg-[#162E44] border border-[#42C8F5]/30 space-y-3">
              <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#42C8F5]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#42C8F5]">
                    [OBSERVED]
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#667789]">
                  Direct Empirical Representations
                </span>
              </div>

              <p className="text-xs text-[#F7F9FB] leading-relaxed font-medium">
                Facts directly recorded in the calibrated instrument record ({baseline} baseline, {timeRange[0]}–{timeRange[1]}):
              </p>

              <ul className="space-y-2 text-xs text-[#667789]">
                <li className="flex items-start gap-2">
                  <span className="text-[#42C8F5] font-mono mt-0.5">•</span>
                  <span>
                    <strong>Positive Departures:</strong> Arctic annual temperature anomalies have been positive relative to the 1951–1980 baseline in 52 out of the past 54 years.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#42C8F5] font-mono mt-0.5">•</span>
                  <span>
                    <strong>2024 Magnitudes:</strong> Arctic anomaly in 2024 is observed at <strong>+2.92°C</strong>, compared to <strong>+1.28°C</strong> for the Global Mean land-ocean benchmark.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#42C8F5] font-mono mt-0.5">•</span>
                  <span>
                    <strong>Visual Separation:</strong> Plotted trajectory curves for high latitudes and tropical latitudes diverge noticeably after year 2000.
                  </span>
                </li>
              </ul>

              <div className="p-2.5 rounded bg-[#10283D] border border-[#20394D] text-[11px] text-[#667789]">
                <strong className="text-[#F7F9FB]">Boundary Note:</strong> Plotted divergence represents empirical measurements; it does not constitute mathematical proof of statistical significance or physical causation.
              </div>
            </div>
          )}

          {/* CATEGORY 2: TESTED */}
          {(activeCategoryTab === 'all' || activeCategoryTab === 'tested') && (
            <div className="p-5 rounded-lg bg-[#162E44] border border-[#26845B]/30 space-y-3">
              <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#26845B]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#26845B]">
                    [TESTED]
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#667789]">
                  Evaluated with Stated Statistical Methods
                </span>
              </div>

              <p className="text-xs text-[#F7F9FB] leading-relaxed font-medium">
                Formal hypothesis tests using defined mathematical criteria (α = 0.05):
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#10283D] border border-[#20394D] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#667789]">Mann-Kendall Trend Test (Arctic):</span>
                    <span className="text-[#26845B] font-bold">p &lt; 0.0001 (Z = +6.84)</span>
                  </div>
                  <span className="text-[11px] text-[#667789] block">
                    Null hypothesis of no monotonic secular trend rejected at &gt;99.99% confidence.
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#10283D] border border-[#20394D] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#667789]">Pairwise Slope Divergence Test:</span>
                    <span className="text-[#26845B] font-bold">p &lt; 0.001 (Welch's t)</span>
                  </div>
                  <span className="text-[11px] text-[#667789] block">
                    Arctic Sen's slope (+0.74°C/dec) differs significantly from Global Mean slope (+0.20°C/dec).
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#10283D] border border-[#20394D] text-[11px] text-[#667789]">
                <strong className="text-[#F7F9FB]">Methodological Rule:</strong> A statistically significant trend (p &lt; 0.001) proves non-randomness within the time series, but does not identify the specific physical feedback mechanisms.
              </div>
            </div>
          )}

          {/* CATEGORY 3: INTERPRETATION */}
          {(activeCategoryTab === 'all' || activeCategoryTab === 'interpretation') && (
            <div className="p-5 rounded-lg bg-[#162E44] border border-[#E8A23A]/30 space-y-3">
              <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E8A23A]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E8A23A]">
                    [INTERPRETATION]
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#667789]">
                  Plausible Hypotheses with Supporting Logic
                </span>
              </div>

              <p className="text-xs text-[#F7F9FB] leading-relaxed font-medium">
                Theoretical mechanisms that explain the observed and tested divergence:
              </p>

              <ul className="space-y-2 text-xs text-[#667789]">
                <li className="flex items-start gap-2">
                  <span className="text-[#E8A23A] font-mono mt-0.5">•</span>
                  <span>
                    <strong>Surface-Albedo Feedback:</strong> Sea ice retreat exposes darker ocean surface water (albedo drop from ~0.60 to ~0.08), increasing shortwave heat absorption and warming autumn air temperatures.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E8A23A] font-mono mt-0.5">•</span>
                  <span>
                    <strong>Lapse-Rate &amp; Moisture Influx:</strong> Polar atmospheric inversions trap thermal energy near the surface, while enhanced moisture transport from mid-latitudes increases downward longwave radiation.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E8A23A] font-mono mt-0.5">•</span>
                  <span>
                    <strong>Subtropical Drying:</strong> Mediterranean thermal anomalies reflect poleward expansion of the descending branch of the Hadley circulation.
                  </span>
                </li>
              </ul>

              <div className="p-2.5 rounded bg-[#10283D] border border-[#20394D] text-[11px] text-[#667789]">
                <strong className="text-[#F7F9FB]">Causality Guard:</strong> Physical causation requires climate model counterfactuals (e.g., CMIP6 DAMIP runs with GHG-only vs all-forcing simulations) to isolate individual mechanisms.
              </div>
            </div>
          )}

          {/* CATEGORY 4: UNRESOLVED */}
          {(activeCategoryTab === 'all' || activeCategoryTab === 'unresolved') && (
            <div className="p-5 rounded-lg bg-[#162E44] border border-[#C84A4A]/30 space-y-3">
              <div className="flex items-center justify-between border-b border-[#20394D] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C84A4A]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C84A4A]">
                    [UNRESOLVED]
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#667789]">
                  Limits, Ambiguities &amp; Incomplete Data
                </span>
              </div>

              <p className="text-xs text-[#F7F9FB] leading-relaxed font-medium">
                Questions that cannot yet be concluded from this evidence base alone:
              </p>

              <ul className="space-y-2 text-xs text-[#667789]">
                <li className="flex items-start gap-2">
                  <span className="text-[#C84A4A] font-mono mt-0.5">•</span>
                  <span>
                    <strong>Internal Multidecadal Partitioning:</strong> Observational data cannot precisely disentangle the relative percentages of Atlantic Multidecadal Variability (AMV) vs secular anthropogenic forcing in Arctic warming.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C84A4A] font-mono mt-0.5">•</span>
                  <span>
                    <strong>Pre-1950 Polar Sampling:</strong> Sparse high-latitude station density prior to 1950 creates wide uncertainty bands for early 20th-century rate comparisons.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C84A4A] font-mono mt-0.5">•</span>
                  <span>
                    <strong>Aerosol Masking Timing:</strong> The exact regional timing of European and North American sulfate aerosol reductions on localized Mediterranean and North Atlantic warming rates remains an open research topic.
                  </span>
                </li>
              </ul>

              <div className="p-2.5 rounded bg-[#10283D] border border-[#20394D] text-[11px] text-[#667789]">
                <strong className="text-[#F7F9FB]">Zero-Hallucination Policy:</strong> DETs displays these limitations prominently rather than fabricating a false sense of scientific finality.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Formal Statistical Results Section */}
      <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#20394D] pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#42C8F5]" />
            <div>
              <h3 className="text-sm font-bold text-[#F7F9FB]">
                Statistical Results &amp; Hypothesis Testing Matrix
              </h3>
              <p className="text-xs text-[#667789]">
                Mathematical evaluations distinguishing statistical significance (p-values) from practical physical magnitude
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#E8A23A] bg-[#20394D] px-2 py-0.5 rounded border border-[#20394D]">
            DEMO / SYNTHETIC STATISTICAL MODEL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#20394D] text-[#667789]">
                <th className="py-2.5 px-3">Statistical Evaluation</th>
                <th className="py-2.5 px-3">Stated Method</th>
                <th className="py-2.5 px-3">Test Statistic</th>
                <th className="py-2.5 px-3">p-value</th>
                <th className="py-2.5 px-3">Effect Size (Slope)</th>
                <th className="py-2.5 px-3">Practical Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20394D]/60">
              <tr className="hover:bg-[#162E44]/40">
                <td className="py-2.5 px-3 font-sans font-medium text-[#F7F9FB]">
                  Arctic Anomaly Secular Trend
                </td>
                <td className="py-2.5 px-3 text-[#667789]">Mann-Kendall Monotonic</td>
                <td className="py-2.5 px-3 text-[#F7F9FB]">Z = +6.84</td>
                <td className="py-2.5 px-3 text-[#26845B] font-bold">p &lt; 0.0001</td>
                <td className="py-2.5 px-3 text-[#E8A23A] font-bold">+0.74°C / decade</td>
                <td className="py-2.5 px-3 text-[#E8A23A]">High (3.7× Global Mean; Cryosphere impact)</td>
              </tr>
              <tr className="hover:bg-[#162E44]/40">
                <td className="py-2.5 px-3 font-sans font-medium text-[#F7F9FB]">
                  Global Mean Planetary Benchmark
                </td>
                <td className="py-2.5 px-3 text-[#667789]">Mann-Kendall Monotonic</td>
                <td className="py-2.5 px-3 text-[#F7F9FB]">Z = +8.12</td>
                <td className="py-2.5 px-3 text-[#26845B] font-bold">p &lt; 0.0001</td>
                <td className="py-2.5 px-3 text-[#F7F9FB] font-bold">+0.20°C / decade</td>
                <td className="py-2.5 px-3 text-[#F7F9FB]">High (Earth energy imbalance departure)</td>
              </tr>
              <tr className="hover:bg-[#162E44]/40">
                <td className="py-2.5 px-3 font-sans font-medium text-[#F7F9FB]">
                  Arctic vs. Global Slope Divergence
                </td>
                <td className="py-2.5 px-3 text-[#667789]">Welch's Two-Sample Test</td>
                <td className="py-2.5 px-3 text-[#F7F9FB]">t = +7.31 (df = 98)</td>
                <td className="py-2.5 px-3 text-[#26845B] font-bold">p &lt; 0.0001</td>
                <td className="py-2.5 px-3 text-[#42C8F5]">Δ = +0.54°C / dec</td>
                <td className="py-2.5 px-3 text-[#26845B]">Significant Polar Amplification Divergence</td>
              </tr>
              <tr className="hover:bg-[#162E44]/40">
                <td className="py-2.5 px-3 font-sans font-medium text-[#F7F9FB]">
                  Mediterranean vs. Global Slope
                </td>
                <td className="py-2.5 px-3 text-[#667789]">Welch's Two-Sample Test</td>
                <td className="py-2.5 px-3 text-[#F7F9FB]">t = +4.19 (df = 104)</td>
                <td className="py-2.5 px-3 text-[#26845B] font-bold">p &lt; 0.001</td>
                <td className="py-2.5 px-3 text-[#42C8F5]">Δ = +0.22°C / dec</td>
                <td className="py-2.5 px-3 text-[#E8A23A]">Subtropical land warming exceeds oceanic</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-3 rounded bg-[#162E44] border border-[#20394D] text-xs text-[#667789] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#42C8F5] shrink-0 mt-0.5" />
          <span>
            <strong>Statistical Constraint Reminder:</strong> A small p-value rejects the hypothesis of equal slopes with mathematical confidence. However, correlation and trend divergence do not prove causation. Radiative forcing, sea-ice albedo feedback, and atmospheric dynamics must be modeled physically.
          </span>
        </div>
      </div>

      {/* 6. Uncertainty & Limitations Panel */}
      <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#20394D] pb-3">
          <AlertTriangle className="w-5 h-5 text-[#E8A23A]" />
          <div>
            <h3 className="text-sm font-bold text-[#F7F9FB]">
              Uncertainty Quantification &amp; Observational Limitations
            </h3>
            <p className="text-xs text-[#667789]">
              Accounting for sensor evolution, spatial coverage gaps, and statistical error propagation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[#162E44] border border-[#20394D] space-y-2">
            <span className="font-mono text-[#E8A23A] font-bold block">1. Spatial Sampling Gaps</span>
            <p className="text-[#667789] leading-relaxed">
              Arctic weather station coverage is sparse in the marine ice pack. GISTEMP applies a 250 km or 1200 km smoothing radius to interpolate between coastal stations, introducing spatial variance.
            </p>
            <span className="text-[11px] font-mono text-[#42C8F5] block">Uncertainty: ±0.18°C (Arctic) vs ±0.05°C (Global)</span>
          </div>

          <div className="p-4 rounded-lg bg-[#162E44] border border-[#20394D] space-y-2">
            <span className="font-mono text-[#E8A23A] font-bold block">2. Historical Sensor Transitions</span>
            <p className="text-[#667789] leading-relaxed">
              Sea surface temperature measurements transitioned from uninsulated wooden canvas buckets (pre-1940) to ship engine cooling intakes to satellite radiometers and autonomous Argo profiling floats.
            </p>
            <span className="text-[11px] font-mono text-[#42C8F5] block">Bias Correction: ERSSTv5 adjustment applied</span>
          </div>

          <div className="p-4 rounded-lg bg-[#162E44] border border-[#20394D] space-y-2">
            <span className="font-mono text-[#E8A23A] font-bold block">3. Urban Heat Island &amp; Relocations</span>
            <p className="text-[#667789] leading-relaxed">
              Terrestrial station records (GHCNm v4) undergo pairwise difference homogenization to remove artificial temperature jumps caused by thermometer upgrades or station relocations.
            </p>
            <span className="text-[11px] font-mono text-[#42C8F5] block">Homogenization: NASA PHA applied</span>
          </div>
        </div>
      </div>

      {/* 7. Collapsible Source & Methodology Drawer */}
      <div className="bg-[#10283D] rounded-xl border border-[#20394D] overflow-hidden">
        <button
          onClick={() => setShowMethodologyDrawer(!showMethodologyDrawer)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-[#162E44]/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#42C8F5]" />
            <div>
              <h3 className="text-sm font-bold text-[#F7F9FB]">
                Source Lineage &amp; Analysis Methodology Drawer
              </h3>
              <p className="text-xs text-[#667789]">
                Review the step-by-step mathematical processing pipeline and primary sensor agency documentation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#42C8F5]">
            <span>{showMethodologyDrawer ? 'Hide Technical Details' : 'View Pipeline Specs'}</span>
            {showMethodologyDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showMethodologyDrawer && (
          <div className="p-6 border-t border-[#20394D] bg-[#162E44] space-y-6 text-xs">
            {/* Step-by-Step Processing Pipeline */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#42C8F5] mb-3">
                Analytical Processing Steps
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 rounded bg-[#10283D] border border-[#20394D]">
                  <span className="text-[#42C8F5] block font-bold">Step 01</span>
                  <span className="text-[#F7F9FB] block font-sans font-semibold mt-1">Raw Ingestion</span>
                  <p className="text-[11px] text-[#667789] mt-1 font-sans">
                    Ingest GHCNv4 weather stations + ERSSTv5 ocean buoy records with SHA-256 validation.
                  </p>
                </div>
                <div className="p-3 rounded bg-[#10283D] border border-[#20394D]">
                  <span className="text-[#42C8F5] block font-bold">Step 02</span>
                  <span className="text-[#F7F9FB] block font-sans font-semibold mt-1">Baseline Normalization</span>
                  <p className="text-[11px] text-[#667789] mt-1 font-sans">
                    Subtract 1951–1980 station monthly normals to produce dimensionless departure fields.
                  </p>
                </div>
                <div className="p-3 rounded bg-[#10283D] border border-[#20394D]">
                  <span className="text-[#42C8F5] block font-bold">Step 03</span>
                  <span className="text-[#F7F9FB] block font-sans font-semibold mt-1">Spatial Weighting</span>
                  <p className="text-[11px] text-[#667789] mt-1 font-sans">
                    Apply cosine latitude area weighting to prevent polar cell distortion in global aggregates.
                  </p>
                </div>
                <div className="p-3 rounded bg-[#10283D] border border-[#20394D]">
                  <span className="text-[#42C8F5] block font-bold">Step 04</span>
                  <span className="text-[#F7F9FB] block font-sans font-semibold mt-1">Trend Fitting</span>
                  <p className="text-[11px] text-[#667789] mt-1 font-sans">
                    Calculate non-parametric Sen's slope and Mann-Kendall Z-score with 95% error bands.
                  </p>
                </div>
              </div>
            </div>

            {/* Ingested Dataset Dossier Switcher */}
            <div className="pt-4 border-t border-[#20394D]">
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#F7F9FB] mb-3">
                Primary Dataset Dossiers
              </h4>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {EVIDENCE_DOSSIER.map(ev => (
                  <button
                    key={ev.id}
                    onClick={() => setActiveEvidenceTab(ev.id)}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                      activeEvidenceTab === ev.id
                        ? 'bg-[#20394D] text-[#42C8F5] font-semibold border border-[#42C8F5]'
                        : 'bg-[#10283D] text-[#667789] border border-[#20394D] hover:text-[#F7F9FB]'
                    }`}
                  >
                    <span>{ev.id}</span>
                    {reviewedEvidenceIds.includes(ev.id) && <Check className="w-3 h-3 text-[#26845B]" />}
                  </button>
                ))}
              </div>

              {/* Active Dossier Details Card */}
              <div className="p-4 rounded-lg bg-[#10283D] border border-[#20394D] space-y-3 mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#20394D] pb-2">
                  <div>
                    <span className="text-xs font-mono text-[#42C8F5] font-bold">
                      {activeEvidence.id} · {activeEvidence.category}
                    </span>
                    <h5 className="text-sm font-bold text-[#F7F9FB] mt-0.5">
                      {activeEvidence.title}
                    </h5>
                  </div>

                  <button
                    onClick={() => onToggleReviewEvidence(activeEvidence.id)}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-colors flex items-center gap-1.5 self-start sm:self-auto ${
                      reviewedEvidenceIds.includes(activeEvidence.id)
                        ? 'bg-[#26845B]/20 text-[#26845B] border border-[#26845B]/40'
                        : 'bg-[#20394D] text-[#F7F9FB] hover:bg-[#20394D]/80 border border-[#20394D]'
                    }`}
                  >
                    {reviewedEvidenceIds.includes(activeEvidence.id) ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Audited in Custody</span>
                      </>
                    ) : (
                      <>
                        <FileCheck2 className="w-3.5 h-3.5 text-[#42C8F5]" />
                        <span>Sign as Audited</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[#667789] block">Consortium / Source:</span>
                    <span className="text-[#F7F9FB]">{activeEvidence.sourceAgency}</span>
                  </div>
                  <div>
                    <span className="text-[#667789] block">Resolution &amp; Gridding:</span>
                    <span className="text-[#F7F9FB]">{activeEvidence.spatialResolution}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#20394D] text-[11px] font-mono text-[#667789]">
                  <span>SHA-256 Digest: {activeEvidence.checksum}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8. Bottom Action Bar */}
      <div className="p-5 rounded-xl bg-[#10283D] border border-[#20394D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs text-[#667789] font-mono">
          <ShieldCheck className="w-4 h-4 text-[#26845B]" />
          <span>Evidence examination certified under DETs scientific protocol.</span>
        </div>

        <button
          onClick={onAdvanceStage}
          className="px-5 py-2.5 bg-[#42C8F5] text-[#10283D] font-bold text-xs rounded hover:bg-[#34b4df] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span>Advance to Chain of Custody (Stage 04)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
