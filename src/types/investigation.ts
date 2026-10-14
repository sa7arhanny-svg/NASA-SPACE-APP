/**
 * DETs — Earth System Investigation Lab
 * Core Data Models & Scientific Investigation Types
 */

export type InvestigationStage = 
  | 'desk'
  | 'intake'
  | 'evidence'
  | 'custody'
  | 'verdict';

export type VerdictLabel = 
  | 'Supported by current evidence.'
  | 'Evidence is inconclusive.'
  | 'Not supported by current evidence.'
  | 'Analysis incomplete.';

export interface CandidateRegion {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  latBounds: [number, number]; // [minLat, maxLat]
  lngBounds: [number, number]; // [minLng, maxLng]
  color: string;
  description: string;
  baselineMeanTemp: number; // in °C for selected baseline
  currentAnomaly2024: number; // in °C
  warmingRatePerDecade: number; // in °C / decade
  uncertaintyMargin: number; // in ±°C
  stationDensity: 'High' | 'Moderate' | 'Sparse' | 'Oceanic Buoy';
  keyVulnerability: string;
}

export interface TimeSeriesPoint {
  year: number;
  anomaly: number; // in °C
  uncertaintyUpper: number; // 95% CI upper bound
  uncertaintyLower: number; // 95% CI lower bound
  isRecord?: boolean;
}

export interface RegionTimeSeries {
  regionId: string;
  data: TimeSeriesPoint[];
}

export interface StatisticalMetric {
  name: string;
  value: string | number;
  unit?: string;
  confidenceInterval?: string;
  interpretation: string;
  type: 'statistical' | 'practical';
}

export interface EvidenceItem {
  id: string;
  title: string;
  category: 'Satellite Gridded' | 'In-Situ Weather Station' | 'Ocean Profiler' | 'Reanalysis Benchmark';
  sourceAgency: string;
  instrument: string;
  spatialResolution: string;
  temporalCoverage: string;
  baseline: string;
  uncertaintyMethod: string;
  limitations: string[];
  status: 'Validated' | 'Under Review' | 'Synthetic Demo';
  checksum: string;
}

export interface CustodyLedgerStep {
  stepId: string;
  stageNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  stageTitle: string;
  description: string;
  status: 'complete' | 'pending' | 'warning' | 'failed';
  timestamp?: string; // only when real or illustrative timestamp is recorded
  inputs?: { name: string; reference: string; format: string }[];
  outputs?: { name: string; reference: string; format: string }[];
  methodDetails: string;
  transformationSteps?: string[];
  validationNotes: string;
  limitations: string[];
  checksumPlaceholder?: string;
  isIllustrativeDemoRecord: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  stage: InvestigationStage;
  action: string;
  details: string;
  actor: string;
  hash: string;
  validationStatus: 'Verified' | 'Pending Review' | 'Notice';
}

export interface CaseFile {
  id: string;
  caseNumber: string;
  title: string;
  variable: string;
  unit: string;
  status: 'In Progress' | 'Open' | 'Pending Data';
  openedDate: string;
  leadInvestigator: string;
  summary: string;
  researchQuestion: string;
  baselineDefault: string;
  timeRangeDefault: [number, number];
  primaryHypothesis: string;
  competingHypotheses: string[];
}

export interface InvestigationState {
  activeStage: InvestigationStage;
  completedStages: InvestigationStage[];
  activeCaseId: string;
  timeRange: [number, number];
  baseline: '1951-1980' | '1991-2020';
  selectedRegionIds: string[];
  highlightedRegionId: string | null;
  selectedHypothesis: string;
  customAnalystNotes: string;
  verdictConfidence: 'High' | 'Moderate' | 'Inconclusive';
  verdictDecision: string;
  verdictNotes: string;
  reviewedEvidenceIds: string[];
  auditLogs: AuditLogEntry[];
}
