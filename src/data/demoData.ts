/**
 * DETs — Earth System Investigation Lab
 * Scientific Reference Datasets (Synthetic Demo Data)
 * 
 * NOTICE: All datasets here are synthetic demo data modeled after NASA GISTEMP v4,
 * NOAA NCEI GHCNv4, and ECMWF ERA5 reanalysis structures for concept demonstration.
 * They are clearly tagged as DEMO / SYNTHETIC DATA in accordance with scientific principles.
 */

import { CandidateRegion, CaseFile, EvidenceItem, AuditLogEntry, TimeSeriesPoint } from '../types/investigation';

export const SCIENTIFIC_DISCLAIMER = {
  status: 'DEMO / SYNTHETIC DATA',
  note: 'This prototype demonstrates product thinking, forensic analytical workflows, and uncertainty modeling. It does not claim new scientific findings, citations, or operational NASA data feeds.',
  principles: [
    'Empirical observations are segregated from statistical tests and causal claims.',
    'Statistical significance (p-values) is strictly distinguished from practical physical importance.',
    'All data series display uncertainty intervals (±95% confidence bounds).',
    'Uncertainties, missing data, and instrumentation transitions are documented.',
    'Pending computations are shown transparently rather than fabricating conclusions.'
  ]
};

export const INITIAL_CASES: CaseFile[] = [
  {
    id: 'DEMO-001',
    caseNumber: 'DEMO-001',
    title: 'The Uneven Warming Case',
    variable: 'Temperature anomaly',
    unit: '°C anomaly relative to baseline',
    status: 'In Progress',
    openedDate: '2026-10-12',
    leadInvestigator: 'DETs Forensic Investigation Group',
    summary: 'Investigating pronounced decadal divergence in surface temperature anomalies between high-latitude polar regions and mid-latitude/tropical domains.',
    researchQuestion: 'How do observed temperature anomaly trends differ across the selected regions?',
    baselineDefault: '1951-1980',
    timeRangeDefault: [1970, 2024],
    primaryHypothesis: 'H_POLAR: High-latitude positive surface-albedo and atmospheric feedback mechanisms induce amplified warming exceeding global baseline by >2×.',
    competingHypotheses: [
      'H_UNIFORM: Observed temperature anomalies reflect uniform radiative forcing with regional variations remaining within expected decadal internal climate noise.',
      'H_OCEANIC: Anomalies are primarily governed by multidecadal ocean heat redistribution (AMO/PDO) rather than sustained regional secular warming.'
    ]
  },
  {
    id: 'DEMO-002',
    caseNumber: 'DEMO-002',
    title: 'North Atlantic Marine Heatwave Persistence',
    variable: 'Sea surface temperature anomaly',
    unit: '°C above climatology',
    status: 'Pending Data',
    openedDate: '2026-10-14',
    leadInvestigator: 'Marine Telemetry Taskforce',
    summary: 'Pending high-resolution Argo float profiling and AVHRR Level-4 SST raster ingestion. Analysis frozen until sensor calibration completes.',
    researchQuestion: 'Are persistent North Atlantic marine heatwaves driven by atmospheric blocking or wind-driven mixing anomalies?',
    baselineDefault: '1991-2020',
    timeRangeDefault: [2010, 2024],
    primaryHypothesis: 'Pending Data Ingestion: Surface wind attenuation coupled with aerosol reduction reduced Saharan dust shielding.',
    competingHypotheses: [
      'Natural multidecadal overturning circulation fluctuations.'
    ]
  },
  {
    id: 'DEMO-003',
    caseNumber: 'DEMO-003',
    title: 'Continental Hydrologic Deficit & Evaporative Stress',
    variable: 'Root-zone soil moisture deficit',
    unit: 'Standardized Anomaly (z-score)',
    status: 'Pending Data',
    openedDate: '2026-09-28',
    leadInvestigator: 'Terrestrial Water Balance Group',
    summary: 'Cross-comparison of GRACE-FO gravimetric terrestrial water storage anomalies and SMAP microwave radiometry across temperate agricultural belts.',
    researchQuestion: 'Does high atmospheric evaporative demand accelerate root-zone desiccation ahead of meteorological precipitation anomalies?',
    baselineDefault: '2004-2010',
    timeRangeDefault: [2002, 2024],
    primaryHypothesis: 'Pending Calibration: Compound high atmospheric evaporative demand accelerating root-zone desiccation.',
    competingHypotheses: [
      'Precipitation deficit dominant without significant vapor pressure deficit amplification.'
    ]
  }
];

export const CANDIDATE_REGIONS: CandidateRegion[] = [
  {
    id: 'arctic',
    name: 'Arctic Amplification Zone',
    code: 'ARC-66N',
    lat: 78.0,
    lng: 15.0,
    latBounds: [66.5, 90.0],
    lngBounds: [-180.0, 180.0],
    color: '#E8A23A', // telemetry amber for extreme anomaly
    description: 'High-latitude polar cap including Barents Sea, Svalbard, and Canadian Arctic archipelago. Subject to sea-ice albedo feedback and polar vortex distortion.',
    baselineMeanTemp: -14.2,
    currentAnomaly2024: 2.92,
    warmingRatePerDecade: 0.74,
    uncertaintyMargin: 0.18,
    stationDensity: 'Sparse',
    keyVulnerability: 'Permafrost thaw, sea ice collapse, sub-polar jet stream waviness'
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean Basin',
    code: 'MED-BAS',
    lat: 38.0,
    lng: 18.0,
    latBounds: [30.0, 45.0],
    lngBounds: [-10.0, 40.0],
    color: '#42C8F5', // cyan
    description: 'Enclosed semi-arid and maritime transition zone. Subject to Hadley cell poleward expansion, compound heatwaves, and summer hydrologic stress.',
    baselineMeanTemp: 15.8,
    currentAnomaly2024: 1.84,
    warmingRatePerDecade: 0.42,
    uncertaintyMargin: 0.08,
    stationDensity: 'High',
    keyVulnerability: 'Compound hot-dry extremes, coastal marine heatwaves, freshwater salinization'
  },
  {
    id: 'amazon',
    name: 'Amazon Basin',
    code: 'AMZ-HYD',
    lat: -3.5,
    lng: -60.0,
    latBounds: [-15.0, 5.0],
    lngBounds: [-75.0, -50.0],
    color: '#26845B', // scientific green
    description: 'Tropical rainforest and atmospheric river moisture pump. Sensitive to Atlantic Multidecadal Variability, ENSO teleconnections, and canopy evapotranspiration limits.',
    baselineMeanTemp: 26.1,
    currentAnomaly2024: 1.58,
    warmingRatePerDecade: 0.33,
    uncertaintyMargin: 0.12,
    stationDensity: 'Moderate',
    keyVulnerability: 'Dieback tipping point, fire weather escalation, drought-induced carbon source shift'
  },
  {
    id: 'west_na',
    name: 'Western North America',
    code: 'WNA-COR',
    lat: 44.0,
    lng: -115.0,
    latBounds: [30.0, 60.0],
    lngBounds: [-130.0, -100.0],
    color: '#C84A4A', // warning red
    description: 'Complex mountainous terrain and coastal interior transition. Governed by Pacific atmospheric ridges, snowpack ablation, and compound heat domes.',
    baselineMeanTemp: 9.4,
    currentAnomaly2024: 1.62,
    warmingRatePerDecade: 0.38,
    uncertaintyMargin: 0.09,
    stationDensity: 'High',
    keyVulnerability: 'Snowmelt advance, wildfire smoke plumes, mega-drought persistence'
  },
  {
    id: 'sahel',
    name: 'Sub-Saharan Sahel',
    code: 'SAH-ECZ',
    lat: 14.5,
    lng: 12.0,
    latBounds: [10.0, 20.0],
    lngBounds: [-20.0, 40.0],
    color: '#F59E0B',
    description: 'Ecotone between Sahara Desert and Sudanian Savanna. Highly sensitive to West African Monsoon dynamics, SST dipoles, and localized surface heating.',
    baselineMeanTemp: 28.5,
    currentAnomaly2024: 1.45,
    warmingRatePerDecade: 0.31,
    uncertaintyMargin: 0.15,
    stationDensity: 'Sparse',
    keyVulnerability: 'Monsoon onset volatility, severe dust storms, human thermal tolerance thresholds'
  },
  {
    id: 'nino34',
    name: 'Equatorial Pacific (Niño 3.4)',
    code: 'PAC-N34',
    lat: 0.0,
    lng: -145.0,
    latBounds: [-5.0, 5.0],
    lngBounds: [-170.0, -120.0],
    color: '#818CF8', // indigo
    description: 'Central-eastern equatorial ocean corridor. Engine of El Niño Southern Oscillation (ENSO) driving global atmospheric teleconnections.',
    baselineMeanTemp: 27.2,
    currentAnomaly2024: 1.12,
    warmingRatePerDecade: 0.22,
    uncertaintyMargin: 0.07,
    stationDensity: 'Oceanic Buoy',
    keyVulnerability: 'Cyclical oscillatory volatility, thermocline shoaling, global teleconnection pulses'
  },
  {
    id: 'global_mean',
    name: 'Global Mean (Land + Ocean)',
    code: 'GLB-MEAN',
    lat: 0.0,
    lng: 0.0,
    latBounds: [-90.0, 90.0],
    lngBounds: [-180.0, 180.0],
    color: '#FFFFFF', // crisp white reference
    description: 'Area-weighted planetary surface temperature anomaly benchmark combining GHCNv4 weather station observations and ERSSTv5 ocean buoy/ship measurements.',
    baselineMeanTemp: 14.0,
    currentAnomaly2024: 1.28,
    warmingRatePerDecade: 0.20,
    uncertaintyMargin: 0.05,
    stationDensity: 'High',
    keyVulnerability: 'Planetary energy imbalance, 1.5°C Paris Agreement benchmark departure'
  }
];

// Helper to generate synthetic but scientifically realistic time series (1970 - 2024)
export function generateSyntheticTimeSeries(
  regionId: string,
  baseline: '1951-1980' | '1991-2020' = '1951-1980'
): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const region = CANDIDATE_REGIONS.find(r => r.id === regionId) || CANDIDATE_REGIONS[0];
  
  // Baseline offset: 1991-2020 baseline is roughly ~0.55°C warmer than 1951-1980 baseline globally
  const baselineOffset = baseline === '1991-2020' ? -0.58 : 0.0;
  
  const baseRate = region.warmingRatePerDecade;
  const uncBase = region.uncertaintyMargin;

  for (let year = 1970; year <= 2024; year++) {
    const elapsedYears = year - 1970;
    
    // Non-linear decadal trend + natural variability
    const secularTrend = (elapsedYears / 10) * baseRate;
    
    // Natural cyclic oscillations (ENSO ~3.6 yr, solar ~11 yr, volcanic dips in 1982 El Chichon and 1991 Pinatubo)
    const ensoCycle = Math.sin((year - 1970) * (2 * Math.PI / 3.8)) * (regionId === 'nino34' ? 0.75 : 0.09);
    const solarCycle = Math.cos((year - 1970) * (2 * Math.PI / 11)) * 0.04;
    
    // Volcanic aerosols cooling dips
    let volcanicDamp = 0;
    if (year === 1982 || year === 1983) volcanicDamp = -0.18;
    if (year === 1991 || year === 1992 || year === 1993) volcanicDamp = -0.26;

    // High latitude polar amplification has accelerated post-2000
    const acceleration = (regionId === 'arctic' && year >= 2000) 
      ? Math.pow((year - 2000) / 10, 1.4) * 0.28 
      : (year >= 2005 ? ((year - 2005) / 10) * 0.08 : 0);

    // Pseudorandom deterministic noise based on year and region char codes
    const pseudoNoise = (Math.sin(year * 17.3 + regionId.charCodeAt(0) * 5.7) * 0.08);

    let anomaly = secularTrend + ensoCycle + solarCycle + volcanicDamp + acceleration + pseudoNoise + baselineOffset;
    
    // Arctic extreme anomaly in 2023-2024
    if (regionId === 'arctic' && year === 2024) anomaly = 2.92 + baselineOffset;
    if (regionId === 'global_mean' && year === 2024) anomaly = 1.28 + baselineOffset;

    // Uncertainty band shrinks in modern satellite era (post-1980s) and Argo floats (post-2004)
    const eraUncertaintyFactor = year < 1985 ? 1.4 : (year < 2005 ? 1.0 : 0.78);
    const uncertainty = Math.round((uncBase * eraUncertaintyFactor) * 100) / 100;

    points.push({
      year,
      anomaly: Math.round(anomaly * 100) / 100,
      uncertaintyUpper: Math.round((anomaly + uncertainty) * 100) / 100,
      uncertaintyLower: Math.round((anomaly - uncertainty) * 100) / 100,
      isRecord: year === 2023 || year === 2024
    });
  }

  return points;
}

export const EVIDENCE_DOSSIER: EvidenceItem[] = [
  {
    id: 'EVD-GISTEMP-V4',
    title: 'NASA GISS Surface Temperature Analysis (GISTEMP v4)',
    category: 'Satellite Gridded',
    sourceAgency: 'NASA Goddard Institute for Space Studies / Columbia Earth Institute',
    instrument: 'Combined GHCNv4 station thermometry + ERSSTv5 ocean ship/buoy observations + Antarctic SCAR records',
    spatialResolution: '2° × 2° grid (with 250km / 1200km smoothing radius options)',
    temporalCoverage: '1880–Present (Monthly & Annual resolution)',
    baseline: '1951–1980 Global Climatology (Nominal mean ~14.0°C)',
    uncertaintyMethod: 'Comprehensive 95% uncertainty envelope incorporating spatial sampling coverage, station homogenization corrections, and sea surface temperature bias corrections (Lenssen et al., 2019).',
    limitations: [
      'DEMO / SYNTHETIC DATA representation for system prototyping.',
      'Sparse station distribution in high-latitude polar interior and central Africa prior to 1950.',
      'Urban heat island corrections apply empirical population and night-light proxies, introducing slight localized variance.',
      'Ocean-land boundary interpolation smoothing can dampen sharp coastal thermal gradients.'
    ],
    status: 'Synthetic Demo',
    checksum: 'SHA-256: 4b918f28c2e91a03e5c9b68d29837a1f5928b98213e4b7e882a9910d9f0012e1'
  },
  {
    id: 'EVD-ERA5-REAN',
    title: 'ECMWF ERA5 Atmospheric Reanalysis Global Temperature Layer',
    category: 'Reanalysis Benchmark',
    sourceAgency: 'European Centre for Medium-Range Weather Forecasts (ECMWF) / Copernicus Climate Change Service',
    instrument: 'Integrated 4D-Var data assimilation combining billions of satellite sounders (AMSU, IASI, ATMS), radiosondes, aircraft, and surface barometers',
    spatialResolution: '31 km grid (~0.25°), 137 vertical pressure levels',
    temporalCoverage: '1940–Present (Hourly)',
    baseline: '1991–2020 WMO Standard Reference Climatology',
    uncertaintyMethod: '10-member Ensemble Data Assimilation (EDA) estimating model physics and observation distribution uncertainty.',
    limitations: [
      'DEMO / SYNTHETIC DATA representation.',
      'Reanalysis estimates surface air temperature (T2m) via atmospheric physical modeling rather than pure direct measurement.',
      'Surface layer parameterizations over complex alpine topography or marginal sea ice carry higher residual variance.'
    ],
    status: 'Synthetic Demo',
    checksum: 'SHA-256: 7d130a1209b558c42fa1120f8623bca019d45e782a514d7c881249b6b7201c9a'
  },
  {
    id: 'EVD-ARGO-COR',
    title: 'Argo International Profiling Float Array (Upper 2000m SST/OHC)',
    category: 'Ocean Profiler',
    sourceAgency: 'Argo Science Team / Global Ocean Observing System (GOOS)',
    instrument: 'Autonomous robotic CTD floats (~4,000 active units globally)',
    spatialResolution: 'Nominal 3° × 3° spatial distribution across ice-free global oceans',
    temporalCoverage: '2004–Present (Decadal depth profiling every 10 days)',
    baseline: 'In-situ thermal stratification referenced against WOD18 (World Ocean Database)',
    uncertaintyMethod: 'Sensor drift salinity/temperature cell calibration verified against shipborne reference CTD casts (±0.002°C instrument precision).',
    limitations: [
      'DEMO / SYNTHETIC DATA representation.',
      'Under-ice profiling in seasonal polar sea ice zones remains technically constrained.',
      'Full global coverage only robustly established post-2004.'
    ],
    status: 'Synthetic Demo',
    checksum: 'SHA-256: 3c598012ff841b9d034e892cfa7710bc820149da90192837bc9012384a89012c'
  },
  {
    id: 'EVD-GHCN4-STAT',
    title: 'NOAA Global Historical Climatology Network Monthly (GHCNm v4)',
    category: 'In-Situ Weather Station',
    sourceAgency: 'NOAA National Centers for Environmental Information (NCEI)',
    instrument: 'Curated terrestrial land surface meteorological thermometer stations (>26,000 stations globally)',
    spatialResolution: 'Point measurement coordinates with pairwise homogenization algorithm (PHA)',
    temporalCoverage: '1701–Present (Quality-controlled monthly aggregates)',
    baseline: 'Station-relative anomalies converted to grid cells',
    uncertaintyMethod: 'Pairwise difference comparison with neighboring stations to identify artificial breaks (instrument relocations, time-of-observation bias).',
    limitations: [
      'DEMO / SYNTHETIC DATA representation.',
      'Non-uniform geographic distribution with heavy concentration in North America/Europe.',
      'Station dropouts over historical conflict periods or economic disruption.'
    ],
    status: 'Synthetic Demo',
    checksum: 'SHA-256: 9e4f20819cb42817dca556819203941bc482910fa982736184920194bc028192'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-12 09:14:22 UTC',
    stage: 'desk',
    action: 'Case Initialized & Scoped',
    details: 'DEMO-001 (The Uneven Warming Case) provisioned. Earth system variable assigned to Temperature Anomaly. Research question and working hypotheses locked into investigation registry.',
    actor: 'Lead Investigator (DETs Core)',
    hash: 'SHA-256: 8a1f94d0...29b',
    validationStatus: 'Verified'
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-12 09:20:45 UTC',
    stage: 'intake',
    action: 'Baseline Standard Selected',
    details: 'Primary climatological baseline set to 1951-1980 (NASA GISTEMP Standard). Offset calibration factors logged for 1991-2020 WMO comparative evaluation.',
    actor: 'Calibration Lead',
    hash: 'SHA-256: c3e0981a...48f',
    validationStatus: 'Verified'
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-12 10:05:12 UTC',
    stage: 'intake',
    action: 'Candidate Regions Registered',
    details: 'Selected multi-region comparative matrix: Arctic Amplification Zone (ARC-66N) vs Mediterranean Basin (MED-BAS) vs Global Mean benchmark.',
    actor: 'Spatial Domain Analyst',
    hash: 'SHA-256: 59a12c8b...19e',
    validationStatus: 'Verified'
  },
  {
    id: 'aud-004',
    timestamp: '2026-10-12 11:42:01 UTC',
    stage: 'evidence',
    action: 'Evidence Ingestion & Uncertainty Calculation',
    details: 'Ingested synthetic time series arrays for candidate regions with 95% confidence intervals. Evaluated decadal warming rate divergence.',
    actor: 'Statistical QA Engine',
    hash: 'SHA-256: 12f9801c...99a',
    validationStatus: 'Verified'
  },
  {
    id: 'aud-005',
    timestamp: '2026-10-14 06:18:30 UTC',
    stage: 'evidence',
    action: 'Statistical vs Practical Significance Check',
    details: 'Completed Mann-Kendall monotonic trend test (p < 0.001) for Arctic vs Mediterranean. Flagged limitation: observational data cannot isolate radiative vs dynamic forcing without climate model attribution runs.',
    actor: 'Scientific Reviewer',
    hash: 'SHA-256: ee491209...77b',
    validationStatus: 'Notice'
  }
];

export const METHODOLOGY_PRINCIPLES = [
  {
    title: 'Separation of Evidence Classes',
    rule: 'Never conflate empirical observation with statistical inference or physical causation.',
    description: 'Empirical data demonstrates that high latitudes warm faster than low latitudes. Statistical tests verify whether this pattern is distinguishable from random walk noise. Causal attribution requires radiative-convective physics and climate model counterfactuals.'
  },
  {
    title: 'Statistical Significance vs Practical Importance',
    rule: 'A statistically significant trend (p < 0.01) may have negligible physical impact, and vice-versa.',
    description: 'In large observational time series, trivial effect sizes can achieve statistical significance. Conversely, extreme seasonal volatility can obscure emerging structural trends. We report both effect size (°C/decade) and confidence intervals alongside p-values.'
  },
  {
    title: 'Uncertainty & Spatial Bias Transparency',
    rule: 'Always display error envelopes and sensor transition boundaries.',
    description: 'Surface observational records transition from wooden bucket ocean samplers to engine room cooling intakes to satellite radiometers and autonomous Argo CTD floats. These transitions require bias corrections that widen historical uncertainty bounds.'
  },
  {
    title: 'Zero-Hallucination Integrity',
    rule: 'Missing or pending data must be rendered transparently as uncomputed.',
    description: 'When candidate datasets are uncalibrated or undergoing quality assurance, the lab displays a transparent pending state instead of fabricating artificial completeness.'
  }
];

export const CUSTODY_LEDGER_STEPS: import('../types/investigation').CustodyLedgerStep[] = [
  {
    stepId: 'COC-STEP-01',
    stageNumber: 1,
    stageTitle: 'Source registered',
    description: 'Primary meteorological and oceanographic observational registries registered and cataloged into DETs laboratory repository.',
    status: 'complete',
    timestamp: '2026-10-12 09:14:22 UTC (Prototype demo record)',
    inputs: [
      { name: 'GHCNv4 Meteorological Station Master Registry', reference: 'NOAA NCEI Station DB v4', format: 'TXT' },
      { name: 'ERSSTv5 Ocean Ship & Buoy Database', reference: 'NOAA Ocean Climate Laboratory', format: 'NetCDF-4' }
    ],
    outputs: [
      { name: 'Source Manifest Master File', reference: 'MANIFEST-2026-SRC-GISS', format: 'JSON' }
    ],
    methodDetails: 'Registration of primary atmospheric and sea-surface observation pipelines. Ingestion manifests verify station metadata, geographic coordinates, and elevation benchmarks.',
    transformationSteps: [
      'Parse NOAA NCEI station inventory files (latitude, longitude, elevation)',
      'Assign internal spatial cell identifiers',
      'Validate international meteorological station identifiers against WMO Publication 9 Volume A'
    ],
    validationNotes: 'All input networks cataloged. Instrument types categorized into terrestrial screen thermometers, ship engine-intake thermistors, and drifting ocean buoys.',
    limitations: [
      'Station records depend on voluntary national weather service submissions with variable update latencies.',
      'Ocean ship measurements historically bias towards commercial shipping routes rather than uniform gridded distribution.'
    ],
    checksumPlaceholder: 'ILLUSTRATIVE-CHECKSUM: sha256-8a1f94d0...29b (Demo placeholder)',
    isIllustrativeDemoRecord: true
  },
  {
    stepId: 'COC-STEP-02',
    stageNumber: 2,
    stageTitle: 'Dataset version and retrieval details recorded',
    description: 'Dataset version identifiers, remote retrieval endpoints, and archive extraction integrity checkpoints recorded.',
    status: 'complete',
    timestamp: '2026-10-12 09:28:10 UTC (Prototype demo record)',
    inputs: [
      { name: 'GHCNm v4.0.1 (qcf: quality controlled filtered)', reference: 'ftp://ftp.ncdc.noaa.gov/pub/data/ghcn/v4/', format: 'DAT' },
      { name: 'ERSST.v5.nc (Extended Reconstructed SST v5)', reference: 'https://www.ncei.noaa.gov/pub/data/cmb/ersst/v5/netcdf/', format: 'NetCDF-4' }
    ],
    outputs: [
      { name: 'Raw Ingestion Archive Snapshot', reference: 'raw_cache/gistemp_v4_2024_snapshot.tar', format: 'ARCHIVE' }
    ],
    methodDetails: 'Direct retrieval from operational agency mirrors with HTTP response header logging and byte-length verification. Archive snapshot preserved for reproducible replay.',
    transformationSteps: [
      'Fetch remote monthly aggregates from NOAA NCEI mirrors',
      'Verify HTTP Content-Length and Last-Modified headers',
      'Store immutable raw tar snapshot in local ingestion cache'
    ],
    validationNotes: 'Byte-length matched agency manifest. Snapshot locked in read-only staging directory.',
    limitations: [
      'NOAA NCEI periodically updates historical months retrospectively as late-arriving station reports are received, shifting historical averages by ±0.01°C.'
    ],
    checksumPlaceholder: 'ILLUSTRATIVE-CHECKSUM: sha256-c3e0981a...48f (Demo placeholder)',
    isIllustrativeDemoRecord: true
  },
  {
    stepId: 'COC-STEP-03',
    stageNumber: 3,
    stageTitle: 'Data quality and coverage checked',
    description: 'Spatial coordinate completeness, temporal station continuity, and high-latitude coverage gaps audited.',
    status: 'warning',
    timestamp: '2026-10-12 10:15:45 UTC (Prototype demo record)',
    inputs: [
      { name: 'Raw Ingestion Archive Snapshot', reference: 'raw_cache/gistemp_v4_2024_snapshot.tar', format: 'ARCHIVE' }
    ],
    outputs: [
      { name: 'Quality & Coverage Audit Report', reference: 'QA-REPORT-TEMP-2024.json', format: 'JSON' }
    ],
    methodDetails: 'Spatial matrix scan across 2° × 2° grid cells; missing-month gap detection; pairwise outlier rejection (>5σ departure from regional 30-year climatology).',
    transformationSteps: [
      'Screen for internal measurement outliers exceeding physical thermodynamic boundaries',
      'Calculate regional station count time series (1970–2024)',
      'Quantify spatial coverage percentage per 10° latitude band'
    ],
    validationNotes: 'WARNING: Spatial station density drops significantly north of 75°N. Arctic marine ice pack relies on coastal weather stations and drifting ice buoys. Modern coverage (post-1980) reaches 99.1% but historical pre-1950 polar coverage is below 75%.',
    limitations: [
      'Interpolation between sparse high-latitude stations is required (250 km smoothing applied).',
      'Southern Ocean and Antarctic interior also subject to historical observation gaps.'
    ],
    checksumPlaceholder: 'ILLUSTRATIVE-CHECKSUM: sha256-59a12c8b...19e (Demo placeholder)',
    isIllustrativeDemoRecord: true
  },
  {
    stepId: 'COC-STEP-04',
    stageNumber: 4,
    stageTitle: 'Processing and transformations documented',
    description: 'Pairwise station homogenization, 1951–1980 baseline subtraction, and 250 km radius Gaussian distance gridding applied.',
    status: 'complete',
    timestamp: '2026-10-12 11:30:00 UTC (Prototype demo record)',
    inputs: [
      { name: 'Quality Filtered Station Records', reference: 'qa_clean/station_series_filtered.parquet', format: 'PARQUET' }
    ],
    outputs: [
      { name: 'Gridded Anomaly Surface Layer', reference: 'grid_output/gistemp_anom_250km_monthly.nc', format: 'NetCDF-4' }
    ],
    methodDetails: 'NASA GISTEMP v4 homogenization algorithm (Menne & Williams 2009) to correct for artificial station relocations and thermometer changes; baseline subtraction; 250 km smoothing radius.',
    transformationSteps: [
      'Pairwise comparison with neighboring stations within 500 km to detect abrupt non-climatic shifts',
      'Adjust station monthly time series for identified undocumented discontinuities',
      'Calculate 1951–1980 station monthly normals and subtract from raw readings',
      'Grid station anomalies onto equal-area 2° × 2° coordinate grid using 250 km distance weighting'
    ],
    validationNotes: 'Homogenization removed artificial station warming artifacts. Baseline zero-check confirms global mean baseline sum is 0.000°C over 1951–1980.',
    limitations: [
      'Urban heat island corrections use satellite night-lights proxies, which carry ±0.05°C localized uncertainty in developing metropolitan fringe regions.'
    ],
    checksumPlaceholder: 'ILLUSTRATIVE-CHECKSUM: sha256-12f9801c...99a (Demo placeholder)',
    isIllustrativeDemoRecord: true
  },
  {
    stepId: 'COC-STEP-05',
    stageNumber: 5,
    stageTitle: 'Analysis method and configuration recorded',
    description: 'Analysis scope configured: time range [1970–2024], candidate region spatial bounding boxes locked, and area-weighted aggregation performed.',
    status: 'complete',
    timestamp: '2026-10-12 12:05:18 UTC (Prototype demo record)',
    inputs: [
      { name: 'Gridded Anomaly Surface Layer', reference: 'grid_output/gistemp_anom_250km_monthly.nc', format: 'NetCDF-4' },
      { name: 'Investigation Configuration', reference: 'CONFIG-DEMO-001', format: 'JSON' }
    ],
    outputs: [
      { name: 'Regional Aggregated Anomaly Arrays', reference: 'analysis/regional_series_1970_2024.json', format: 'JSON' }
    ],
    methodDetails: 'Cosine-latitude spatial area weighting: W(lat) = cos(lat) applied to all grid cells within each candidate region boundary (ARC-66N, MED-BAS, AMZ-HYD, WNA-COR, SAH-ECZ, PAC-N34, and Global Mean).',
    transformationSteps: [
      'Extract grid points falling within polygon boundaries for selected candidate regions',
      'Weight each grid point by the cosine of its latitude to adjust for meridian convergence towards poles',
      'Generate annual and decadal average time series arrays'
    ],
    validationNotes: 'Mathematical weighting verified: Arctic area integral equals 6.4% of planetary surface. Time horizon locked to 1970–2024.',
    limitations: [
      'Regional spatial bounding boxes represent administrative/geographic approximations; natural bioclimatic zones do not follow strict latitude-longitude rectangles.'
    ],
    checksumPlaceholder: 'ILLUSTRATIVE-CHECKSUM: sha256-4b918f28...012 (Demo placeholder)',
    isIllustrativeDemoRecord: true
  },
  {
    stepId: 'COC-STEP-06',
    stageNumber: 6,
    stageTitle: 'Statistical outputs linked to their input data',
    description: 'Non-parametric Mann-Kendall trend tests, Sen’s slopes, Welch’s slope divergence tests, and 95% confidence intervals linked directly to regional series.',
    status: 'complete',
    timestamp: '2026-10-14 06:18:30 UTC (Prototype demo record)',
    inputs: [
      { name: 'Regional Aggregated Anomaly Arrays', reference: 'analysis/regional_series_1970_2024.json', format: 'JSON' }
    ],
    outputs: [
      { name: 'Statistical Verification Summary', reference: 'stats/stats_results_DEMO-001.json', format: 'JSON' }
    ],
    methodDetails: 'Mann-Kendall test statistic S and normalized test statistic Z; Sen’s non-parametric slope estimator (median of all pairwise slopes); Welch’s two-sample test on decadal rates.',
    transformationSteps: [
      'Compute all N(N-1)/2 pairwise slopes for each region series',
      'Determine median slope (Sen\'s slope in °C/decade)',
      'Calculate Mann-Kendall Z-score and two-tailed p-value',
      'Propagate 95% confidence interval bounds using block-bootstrap resampling'
    ],
    validationNotes: 'Statistical metrics: Arctic Sen\'s slope = +0.74°C/dec (Z = +6.84, p < 0.0001); Global Mean = +0.20°C/dec (Z = +8.12, p < 0.0001). Pairwise slope divergence confirmed at p < 0.0001.',
    limitations: [
      'CRITICAL SCIENTIFIC DISTINCTION: Statistical significance proves that the Arctic warming rate differs non-randomly from the global mean; it does NOT identify whether the underlying mechanism is albedo feedback, moisture transport, or internal variability.'
    ],
    checksumPlaceholder: 'ILLUSTRATIVE-CHECKSUM: sha256-ee491209...77b (Demo placeholder)',
    isIllustrativeDemoRecord: true
  },
  {
    stepId: 'COC-STEP-07',
    stageNumber: 7,
    stageTitle: 'Finding linked to the exact evidence and limitations used',
    description: 'Final scientific conclusion on Arctic polar amplification linked to quantified effect sizes, evidence dossier EVD-GISTEMP-V4, and documented limitations.',
    status: 'complete',
    timestamp: '2026-10-14 07:12:00 UTC (Prototype demo record)',
    inputs: [
      { name: 'Statistical Verification Summary', reference: 'stats/stats_results_DEMO-001.json', format: 'JSON' },
      { name: 'Evidence Dossier Item', reference: 'EVD-GISTEMP-V4', format: 'DOSSIER' },
      { name: 'Coverage Quality Report', reference: 'QA-REPORT-TEMP-2024.json', format: 'JSON' }
    ],
    outputs: [
      { name: 'Certified Investigation Findings Dossier', reference: 'DOSSIER-DEMO-001-POLAR.json', format: 'DOSSIER' }
    ],
    methodDetails: 'Synthesize findings with strict epistemological categorization: observed empirical data separated from tested statistics, physical interpretation, and unresolved questions.',
    transformationSteps: [
      'Link 2024 Arctic anomaly (+2.92°C) to direct observations in Step 04',
      'Link 3.7× amplification factor (+0.74°C/dec vs +0.20°C/dec) to Step 06 statistics',
      'Bind known polar station sparsity and sensor transition limitations to verdict record',
      'Generate certified investigative audit dossier'
    ],
    validationNotes: 'Complete traceability established from raw NOAA/NASA data sources to final scientific finding. All limitations, caveats, and baseline metadata preserved.',
    limitations: [
      'Provenance transparency does NOT guarantee physical certainty: while the empirical rate is fully traceable and validated, causal attribution requires coupled Earth system model counterfactual simulations (CMIP6 DAMIP).'
    ],
    checksumPlaceholder: 'ILLUSTRATIVE-CHECKSUM: sha256-7d130a12...c9a (Demo placeholder)',
    isIllustrativeDemoRecord: true
  }
];

