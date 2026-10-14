/**
 * DETs — Earth System Investigation Lab
 * Comparative Regional Temperature Anomaly Chart
 * 
 * High-precision SVG time series chart with 95% confidence intervals,
 * zero baseline reference, interactive year scrubber, and statistical trend indicators.
 */

import React, { useState, useMemo } from 'react';
import { CandidateRegion, TimeSeriesPoint } from '../../types/investigation';
import { generateSyntheticTimeSeries } from '../../data/demoData';

interface RegionalAnomalyChartProps {
  selectedRegions: CandidateRegion[];
  baseline: '1951-1980' | '1991-2020';
  timeRange?: [number, number];
  highlightedRegionId: string | null;
  onHoverRegion?: (regionId: string | null) => void;
}

export const RegionalAnomalyChart: React.FC<RegionalAnomalyChartProps> = ({
  selectedRegions,
  baseline,
  timeRange = [1970, 2024],
  highlightedRegionId,
  onHoverRegion
}) => {
  const [showUncertaintyBands, setShowUncertaintyBands] = useState(true);
  const minYear = timeRange[0];
  const maxYear = timeRange[1];

  const [hoveredYear, setHoveredYear] = useState<number | null>(maxYear);

  // Generate series data for each selected region, filtered to timeRange
  const seriesData = useMemo(() => {
    return selectedRegions.map(region => {
      const allPoints = generateSyntheticTimeSeries(region.id, baseline);
      const filtered = allPoints.filter(p => p.year >= minYear && p.year <= maxYear);
      return {
        region,
        points: filtered
      };
    });
  }, [selectedRegions, baseline, minYear, maxYear]);

  // Chart dimensions and margins
  const width = 800;
  const height = 360;
  const padding = { top: 24, right: 32, bottom: 44, left: 54 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Find min and max anomalies for Y scale
  const { minY, maxY } = useMemo(() => {
    let min = -0.6;
    let max = 3.2;
    seriesData.forEach(({ points }) => {
      points.forEach(p => {
        if (p.uncertaintyLower < min) min = p.uncertaintyLower;
        if (p.uncertaintyUpper > max) max = p.uncertaintyUpper;
      });
    });
    // Add margin
    return {
      minY: Math.floor(min * 2) / 2 - 0.2,
      maxY: Math.ceil(max * 2) / 2 + 0.2
    };
  }, [seriesData]);

  // Scale helpers
  const scaleX = (year: number) => {
    if (maxYear === minYear) return padding.left;
    return padding.left + ((year - minYear) / (maxYear - minYear)) * innerWidth;
  };

  const scaleY = (val: number) => {
    return padding.top + innerHeight - ((val - minY) / (maxY - minY)) * innerHeight;
  };

  // Generate path data
  const generateLinePath = (points: TimeSeriesPoint[]) => {
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.year).toFixed(1)} ${scaleY(p.anomaly).toFixed(1)}`)
      .join(' ');
  };

  const generateAreaPath = (points: TimeSeriesPoint[]) => {
    const upper = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.year).toFixed(1)} ${scaleY(p.uncertaintyUpper).toFixed(1)}`)
      .join(' ');
    const lower = [...points]
      .reverse()
      .map(p => `L ${scaleX(p.year).toFixed(1)} ${scaleY(p.uncertaintyLower).toFixed(1)}`)
      .join(' ');
    return `${upper} ${lower} Z`;
  };

  // Generate Y axis ticks
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let val = -0.5; val <= 3.5; val += 0.5) {
      if (val >= minY && val <= maxY) ticks.push(val);
    }
    return ticks;
  }, [minY, maxY]);

  // Generate X axis ticks based on timeRange span
  const xTicks = useMemo(() => {
    const span = maxYear - minYear;
    const step = span <= 15 ? 2 : (span <= 30 ? 5 : 10);
    const ticks: number[] = [];
    for (let y = minYear; y <= maxYear; y += step) {
      ticks.push(y);
    }
    if (ticks[ticks.length - 1] !== maxYear) ticks.push(maxYear);
    return ticks;
  }, [minYear, maxYear]);

  // Mouse move handler for scrubber
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = (mouseX - padding.left) / innerWidth;
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    const year = Math.round(minYear + clampedRatio * (maxYear - minYear));
    setHoveredYear(year);
  };

  return (
    <div className="bg-[#10283D] rounded-xl border border-[#20394D] p-4 text-[#F7F9FB]">
      {/* Chart Top Controls & Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#20394D]">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold tracking-wide text-[#F7F9FB]">
              Regional Temperature Anomaly Trajectories ({minYear}–{maxYear})
            </h4>
            <span className="text-xs text-[#667789]">·</span>
            <span className="text-xs font-mono text-[#E8A23A] bg-[#20394D]/60 px-2 py-0.5 rounded">
              DEMO / SYNTHETIC DATA
            </span>
          </div>
          <p className="text-xs text-[#667789] mt-0.5">
            Annual surface anomaly relative to {baseline} climatological baseline. Shaded envelopes denote 95% confidence intervals.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-2 text-xs font-mono text-[#667789] hover:text-[#F7F9FB] cursor-pointer">
            <input
              type="checkbox"
              checked={showUncertaintyBands}
              onChange={e => setShowUncertaintyBands(e.target.checked)}
              className="rounded border-[#20394D] bg-[#20394D] text-[#42C8F5] focus:ring-0 focus:ring-offset-0"
            />
            <span>Show 95% Confidence Bounds</span>
          </label>
        </div>
      </div>

      {/* SVG Time Series Chart */}
      <div className="relative w-full overflow-x-auto mt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[620px] select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredYear(2024)}
        >
          <defs>
            {/* Subtle clip path */}
            <clipPath id="chart-area">
              <rect x={padding.left} y={padding.top} width={innerWidth} height={innerHeight} />
            </clipPath>
          </defs>

          {/* Background Grid Lines (Horizontal Y-ticks) */}
          {yTicks.map(val => (
            <g key={val} transform={`translate(0, ${scaleY(val)})`}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                stroke={val === 0 ? 'rgba(247, 249, 251, 0.45)' : 'rgba(32, 57, 77, 0.8)'}
                strokeWidth={val === 0 ? 1.5 : 1}
                strokeDasharray={val === 0 ? undefined : '3,3'}
              />
              <text
                x={padding.left - 10}
                y={4}
                textAnchor="end"
                className="text-[11px] font-mono fill-[#667789]"
              >
                {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}°C
              </text>
            </g>
          ))}

          {/* Zero Climatological Baseline Annotation */}
          <text
            x={width - padding.right - 8}
            y={scaleY(0) - 6}
            textAnchor="end"
            className="text-[10px] font-mono fill-[#667789]"
          >
            0.0°C Baseline ({baseline})
          </text>

          {/* Vertical X-ticks (Decades) */}
          {xTicks.map(year => (
            <g key={year} transform={`translate(${scaleX(year)}, 0)`}>
              <line
                y1={padding.top}
                y2={height - padding.bottom}
                stroke="rgba(32, 57, 77, 0.6)"
                strokeWidth={1}
                strokeDasharray="2,2"
              />
              <text
                y={height - padding.bottom + 18}
                textAnchor="middle"
                className="text-[11px] font-mono fill-[#667789]"
              >
                {year}
              </text>
            </g>
          ))}

          {/* Uncertainty Area Bands */}
          {showUncertaintyBands &&
            seriesData.map(({ region, points }) => (
              <path
                key={`band-${region.id}`}
                d={generateAreaPath(points)}
                fill={region.color}
                fillOpacity={0.12}
                clipPath="url(#chart-area)"
              />
            ))}

          {/* Anomaly Trend Lines */}
          {seriesData.map(({ region, points }) => {
            const isHighlighted = highlightedRegionId === region.id;
            const strokeWidth = isHighlighted ? 3 : (region.id === 'global_mean' ? 2 : 2.2);
            return (
              <g key={`line-${region.id}`}>
                <path
                  d={generateLinePath(points)}
                  fill="none"
                  stroke={region.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={region.id === 'global_mean' ? '4,4' : undefined}
                  clipPath="url(#chart-area)"
                  opacity={highlightedRegionId && !isHighlighted ? 0.45 : 1}
                />
              </g>
            );
          })}

          {/* Interactive Scrubber Line */}
          {hoveredYear !== null && (
            <g transform={`translate(${scaleX(hoveredYear)}, 0)`}>
              <line
                y1={padding.top}
                y2={height - padding.bottom}
                stroke="#42C8F5"
                strokeWidth={1.5}
                strokeDasharray="3,3"
              />
              {/* Year label box at bottom */}
              <rect
                x={-24}
                y={height - padding.bottom + 4}
                width={48}
                height={20}
                fill="#20394D"
                rx={4}
                className="stroke border border-[#42C8F5]"
              />
              <text
                x={0}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                className="text-[11px] font-mono font-bold fill-[#42C8F5]"
              >
                {hoveredYear}
              </text>

              {/* Data points on scrubber */}
              {seriesData.map(({ region, points }) => {
                const pt = points.find(p => p.year === hoveredYear);
                if (!pt) return null;
                return (
                  <circle
                    key={`dot-${region.id}`}
                    cx={0}
                    cy={scaleY(pt.anomaly)}
                    r={4}
                    fill={region.color}
                    stroke="#10283D"
                    strokeWidth={2}
                  />
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Scrubber Readout Tray (Values for Hovered Year) */}
      {hoveredYear !== null && (
        <div className="mt-3 pt-3 border-t border-[#20394D]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#667789] uppercase tracking-wider">
              Scrubber Readout: Year {hoveredYear}
            </span>
            <span className="text-[11px] text-[#667789] font-mono">
              Hover across chart to inspect any year
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {seriesData.map(({ region, points }) => {
              const pt = points.find(p => p.year === hoveredYear);
              if (!pt) return null;
              return (
                <div
                  key={region.id}
                  onMouseEnter={() => onHoverRegion?.(region.id)}
                  onMouseLeave={() => onHoverRegion?.(null)}
                  className={`p-2 rounded bg-[#20394D]/60 border transition-colors ${
                    highlightedRegionId === region.id ? 'border-[#42C8F5]' : 'border-[#20394D]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="text-[11px] text-[#F7F9FB] font-medium truncate">
                      {region.name}
                    </span>
                  </div>

                  <div className="mt-1 flex items-baseline justify-between font-mono">
                    <span className="text-sm font-semibold tabular-nums text-[#42C8F5]">
                      {pt.anomaly > 0 ? `+${pt.anomaly.toFixed(2)}` : pt.anomaly.toFixed(2)}°C
                    </span>
                    <span className="text-[10px] text-[#667789] tabular-nums">
                      ±{((pt.uncertaintyUpper - pt.uncertaintyLower) / 2).toFixed(2)}°C
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
