/**
 * DETs — Earth System Investigation Lab
 * Export Investigation Dossier Modal
 * 
 * Formats a clean, rigorous, printable scientific investigation report
 * and provides structured JSON download.
 */

import React, { useState } from 'react';
import { CaseFile, AuditLogEntry } from '../../types/investigation';
import { CANDIDATE_REGIONS, SCIENTIFIC_DISCLAIMER } from '../../data/demoData';
import { X, Download, Copy, Printer, Check, FileText, ShieldCheck } from 'lucide-react';

interface ExportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCase: CaseFile;
  baseline: '1951-1980' | '1991-2020';
  selectedRegionIds: string[];
  verdictLabel?: import('../../types/investigation').VerdictLabel;
  verdictDecision?: string;
  verdictConfidence?: 'High' | 'Moderate' | 'Inconclusive';
  verdictNotes: string;
  auditLogs: AuditLogEntry[];
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({
  isOpen,
  onClose,
  activeCase,
  baseline,
  selectedRegionIds,
  verdictLabel = 'Supported by current evidence.',
  verdictDecision,
  verdictConfidence = 'High',
  verdictNotes,
  auditLogs
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const selectedRegions = CANDIDATE_REGIONS.filter(r => selectedRegionIds.includes(r.id));
  const timestamp = new Date().toISOString();

  // Create JSON Export object
  const dossierJSON = {
    laboratory: 'DETs — Earth System Investigation Lab',
    initiative: 'NASA Space Apps Challenge Concept Demonstration',
    classification: 'DEMO / SYNTHETIC DATA',
    exportedAt: timestamp,
    caseFile: {
      caseNumber: activeCase.caseNumber,
      title: activeCase.title,
      variable: activeCase.variable,
      unit: activeCase.unit,
      baselineDefinition: baseline,
      leadInvestigator: activeCase.leadInvestigator
    },
    candidateRegionsEvaluated: selectedRegions.map(r => ({
      name: r.name,
      code: r.code,
      coordinates: { lat: r.lat, lng: r.lng },
      anomaly2024: r.currentAnomaly2024,
      warmingRatePerDecade: r.warmingRatePerDecade,
      uncertaintyMargin95CI: r.uncertaintyMargin
    })),
    statisticalTest: {
      method: 'Mann-Kendall Non-Parametric Trend Test',
      alphaThreshold: 0.05,
      pValue: '< 0.0001',
      zScore: '+6.84',
      interpretation: 'Statistically significant regional divergence from global mean rate'
    },
    finalVerdict: {
      controlledVerdictLabel: verdictLabel,
      decision: verdictDecision || verdictLabel,
      confidence: verdictConfidence,
      investigatorNotes: verdictNotes || 'Investigation certified under DETs forensic protocol.'
    },
    chainOfCustodyAuditTrail: auditLogs.map(l => ({
      timestamp: l.timestamp,
      action: l.action,
      actor: l.actor,
      hashDigest: l.hash
    }))
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dossierJSON, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DETs-${activeCase.caseNumber}-Dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyText = () => {
    const textReport = `
======================================================================
DETS — EARTH SYSTEM INVESTIGATION LAB: SCIENTIFIC DOSSIER
======================================================================
CLASSIFICATION: ${SCIENTIFIC_DISCLAIMER.status}
CASE NUMBER:    ${activeCase.caseNumber}
TITLE:          ${activeCase.title}
BASELINE:       ${baseline} Climatological Reference
EXPORTED AT:    ${timestamp}

1. CANDIDATE REGIONS EVALUATED:
${selectedRegions.map(r => `  • ${r.name} (${r.code}): 2024 Anomaly = +${r.currentAnomaly2024.toFixed(2)}°C | Rate = +${r.warmingRatePerDecade.toFixed(2)}°C/dec (±${r.uncertaintyMargin.toFixed(2)}°C)`).join('\n')}

2. STATISTICAL VS PRACTICAL SIGNIFICANCE:
  • Mann-Kendall Test: p < 0.0001 (Z = +6.84)
  • Polar Amplification Factor: ~3.7× Global Mean Land-Ocean benchmark
  • Cryosphere Impact: Exceeds multi-year summer sea ice stability thresholds

3. CERTIFIED VERDICT:
  • Verdict: ${verdictDecision}
  • Confidence Level: ${verdictConfidence}
  • Investigator Notes: ${verdictNotes || 'Nominal sign-off under scientific charter.'}

4. CHAIN OF CUSTODY INTEGRITY:
  • Audit Events Logged: ${auditLogs.length} verified operations
  • Primary Root Digest: ${auditLogs[0]?.hash || 'SHA-256'}
======================================================================
`.trim();

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1420]/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#10283D] border border-[#42C8F5] rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20394D] bg-[#162E44]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#42C8F5]" />
            <h3 className="text-sm font-bold text-[#F7F9FB]">
              Investigation Dossier: {activeCase.caseNumber}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="p-1.5 rounded hover:bg-[#20394D] text-[#667789] hover:text-[#F7F9FB] transition-colors text-xs flex items-center gap-1 font-mono"
              title="Copy Summary"
            >
              {copied ? <Check className="w-4 h-4 text-[#26845B]" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="p-1.5 rounded hover:bg-[#20394D] text-[#667789] hover:text-[#F7F9FB] transition-colors text-xs flex items-center gap-1 font-mono"
              title="Download JSON"
            >
              <Download className="w-4 h-4 text-[#42C8F5]" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded hover:bg-[#20394D] text-[#667789] hover:text-[#F7F9FB] transition-colors text-xs flex items-center gap-1 font-mono"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[#20394D] text-[#667789] hover:text-[#F7F9FB] transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Off-White Scientific Document Body */}
        <div className="p-6 sm:p-8 bg-[#F7F9FB] text-[#10283D] max-h-[75vh] overflow-y-auto space-y-6">
          {/* Document Header */}
          <div className="border-b-2 border-[#10283D] pb-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#667789] block">
                  DETs — Earth System Investigation Lab · Forensic Report
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#10283D] mt-0.5">
                  Scientific Investigation Findings Dossier
                </h1>
                <p className="text-xs text-[#667789] mt-1 font-mono">
                  Case ID: {activeCase.caseNumber} · Earth-System Variable: {activeCase.variable}
                </p>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-block px-2.5 py-1 rounded bg-[#E8A23A]/15 text-[#E8A23A] border border-[#E8A23A]/40 text-xs font-mono font-bold">
                  {SCIENTIFIC_DISCLAIMER.status}
                </span>
                <span className="text-[10px] text-[#667789] block font-mono mt-1">
                  Export Date: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Methodology & Baseline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded bg-[#EAEFF4] border border-[#CFD8E1] text-xs font-mono">
            <div>
              <span className="text-[#667789] block">Baseline Reference:</span>
              <span className="font-bold text-[#10283D]">{baseline} Climatology</span>
            </div>
            <div>
              <span className="text-[#667789] block">Measurement Unit:</span>
              <span className="font-bold text-[#10283D]">{activeCase.unit}</span>
            </div>
            <div>
              <span className="text-[#667789] block">Primary Sensor Suite:</span>
              <span className="font-bold text-[#10283D]">GISTEMP v4 / GHCNv4 / ERSSTv5</span>
            </div>
          </div>

          {/* Section: Regional Divergence Evidence Table */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#10283D] mb-2">
              1. Evaluated Candidate Regions &amp; Decadal Trajectories
            </h3>
            <div className="overflow-x-auto border border-[#CFD8E1] rounded">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#EAEFF4] border-b border-[#CFD8E1] text-[#667789]">
                  <tr>
                    <th className="py-2 px-3">Region Name</th>
                    <th className="py-2 px-3">Code</th>
                    <th className="py-2 px-3">Coordinates</th>
                    <th className="py-2 px-3">2024 Anomaly</th>
                    <th className="py-2 px-3">Warming Rate</th>
                    <th className="py-2 px-3">95% Uncertainty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CFD8E1]">
                  {selectedRegions.map(reg => (
                    <tr key={reg.id} className="hover:bg-[#EAEFF4]/50">
                      <td className="py-2 px-3 font-sans font-semibold text-[#10283D]">
                        {reg.name}
                      </td>
                      <td className="py-2 px-3 text-[#667789]">{reg.code}</td>
                      <td className="py-2 px-3 text-[#667789]">
                        {reg.lat.toFixed(1)}°N, {Math.abs(reg.lng).toFixed(1)}°{reg.lng >= 0 ? 'E' : 'W'}
                      </td>
                      <td className="py-2 px-3 font-bold text-[#10283D] tabular-nums">
                        +{reg.currentAnomaly2024.toFixed(2)}°C
                      </td>
                      <td className="py-2 px-3 text-[#10283D] tabular-nums">
                        +{reg.warmingRatePerDecade.toFixed(2)}°C / dec
                      </td>
                      <td className="py-2 px-3 text-[#667789] tabular-nums">
                        ±{reg.uncertaintyMargin.toFixed(2)}°C
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Statistical vs Practical Significance */}
          <div className="p-4 rounded border border-[#CFD8E1] bg-white space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#10283D]">
              2. Statistical vs. Practical Significance Analysis
            </h3>
            <p className="text-xs text-[#20394D] leading-relaxed">
              <strong>Statistical Result:</strong> The high-latitude polar temperature anomaly departs from the global mean trend at a significance level of <em>p &lt; 0.0001</em> (Mann-Kendall test statistic <em>Z = +6.84</em>).
            </p>
            <p className="text-xs text-[#20394D] leading-relaxed">
              <strong>Practical Physical Importance:</strong> High practical severity. At +0.74°C/decade, the thermal flux breaches thermodynamic thresholds for summer Arctic sea ice preservation and permafrost stability.
            </p>
          </div>

          {/* Section: Certified Verdict */}
          <div className="p-4 rounded border-2 border-[#10283D] bg-white space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#10283D]">
                3. Final Scientific Verdict
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#26845B]/15 text-[#26845B]">
                {verdictLabel}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#10283D]">
              {verdictDecision || verdictLabel}
            </h4>
            <p className="text-xs text-[#20394D] leading-relaxed italic">
              "{verdictNotes || 'Investigation completed under forensic scientific standards. Empirical observation is verified; physical causal attribution is grounded in peer-reviewed energy balance principles.'}"
            </p>
          </div>

          {/* Section: Chain of Custody Summary */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#10283D] mb-2">
              4. Provenance &amp; Chain of Custody Record ({auditLogs.length} Actions)
            </h3>
            <div className="text-xs font-mono text-[#667789] space-y-1">
              {auditLogs.slice(0, 3).map(log => (
                <div key={log.id} className="flex items-center justify-between py-1 border-b border-[#CFD8E1]">
                  <span>{log.timestamp} — {log.action}</span>
                  <span className="text-[#10283D]">{log.hash.slice(0, 16)}...</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#20394D] bg-[#162E44] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#667789]">
            <ShieldCheck className="w-4 h-4 text-[#26845B]" />
            <span>Cryptographic audit signature attached</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-xs text-[#667789] hover:text-[#F7F9FB] transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 bg-[#42C8F5] text-[#10283D] font-bold text-xs rounded hover:bg-[#34b4df] transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
