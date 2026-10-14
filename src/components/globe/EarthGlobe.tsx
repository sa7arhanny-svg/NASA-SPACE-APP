/**
 * DETs — Earth System Investigation Lab
 * Central 3D Interactive Earth Globe
 * 
 * Powered by Three.js with offline canvas-generated scientific Earth texture,
 * graticules, candidate region telemetry markers, orbit controls, and raycasting.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CandidateRegion } from '../../types/investigation';
import { RotateCw, ZoomIn, ZoomOut, Compass, Info, Eye } from 'lucide-react';

interface EarthGlobeProps {
  regions: CandidateRegion[];
  selectedRegionIds: string[];
  highlightedRegionId: string | null;
  onSelectRegion: (regionId: string) => void;
  onHoverRegion?: (regionId: string | null) => void;
  showThermalOverlay?: boolean;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  regions,
  selectedRegionIds,
  highlightedRegionId,
  onSelectRegion,
  onHoverRegion,
  showThermalOverlay = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<{
    region: CandidateRegion;
    x: number;
    y: number;
  } | null>(null);

  // References to keep between renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // Helper to convert lat/lng to 3D Cartesian coordinates
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Generate procedural scientific Earth texture
  const createScientificEarthTexture = (thermalHeat: boolean): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Deep Ocean Background
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#0B1C2B');
    oceanGrad.addColorStop(0.5, '#10283D');
    oceanGrad.addColorStop(1, '#081420');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Graticule lines (Latitude & Longitude grid)
    ctx.strokeStyle = 'rgba(66, 200, 245, 0.12)';
    ctx.lineWidth = 1;

    // Meridians (every 30 degrees)
    for (let x = 0; x <= canvas.width; x += canvas.width / 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Parallels (every 30 degrees)
    for (let y = 0; y <= canvas.height; y += canvas.height / 6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Highlight Equator, Tropics, and Polar Circles
    const equatorY = canvas.height / 2;
    ctx.strokeStyle = 'rgba(66, 200, 245, 0.28)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, equatorY);
    ctx.lineTo(canvas.width, equatorY);
    ctx.stroke();

    // Polar circles (66.5° N/S)
    const arcticY = equatorY - (66.5 / 90) * (canvas.height / 2);
    const antarcticY = equatorY + (66.5 / 90) * (canvas.height / 2);
    ctx.strokeStyle = 'rgba(232, 162, 58, 0.35)'; // Amber for Arctic
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, arcticY);
    ctx.lineTo(canvas.width, arcticY);
    ctx.moveTo(0, antarcticY);
    ctx.lineTo(canvas.width, antarcticY);
    ctx.stroke();
    ctx.setLineDash([]); // reset dash

    // Draw Continents approximation using simplified scientific polygon projections
    ctx.fillStyle = '#20394D';
    ctx.strokeStyle = 'rgba(66, 200, 245, 0.4)';
    ctx.lineWidth = 1.5;

    // Helper to map lat/lng to canvas
    const project = (lat: number, lng: number): [number, number] => {
      const x = ((lng + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      return [x, y];
    };

    const drawPoly = (points: [number, number][], fill = '#1A3347', stroke = 'rgba(66,200,245,0.45)') => {
      if (points.length < 3) return;
      ctx.beginPath();
      const [firstX, firstY] = project(points[0][0], points[0][1]);
      ctx.moveTo(firstX, firstY);
      for (let i = 1; i < points.length; i++) {
        const [px, py] = project(points[i][0], points[i][1]);
        ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.stroke();
    };

    // North America
    drawPoly([
      [70, -165], [72, -130], [68, -85], [58, -60], [45, -60], 
      [30, -80], [25, -80], [18, -95], [15, -92], [28, -112], 
      [35, -122], [50, -128], [60, -140], [65, -168]
    ]);

    // Greenland
    drawPoly([
      [82, -40], [80, -20], [70, -20], [60, -45], [70, -55], [78, -68]
    ], '#1D3B52');

    // South America
    drawPoly([
      [12, -75], [5, -52], [-5, -35], [-20, -40], [-40, -58], 
      [-55, -68], [-45, -75], [-18, -70], [-5, -80], [8, -78]
    ]);

    // Eurasia
    drawPoly([
      [70, 25], [75, 60], [72, 100], [75, 140], [68, 175], 
      [55, 155], [45, 140], [35, 120], [22, 115], [20, 105], 
      [10, 100], [15, 80], [25, 65], [30, 50], [38, 30], 
      [42, 15], [38, 0], [45, -5], [55, -5], [60, 5], [68, 15]
    ]);

    // Africa
    drawPoly([
      [35, -5], [36, 12], [32, 32], [12, 51], [5, 48], 
      [-10, 40], [-25, 33], [-34, 20], [-34, 18], [-15, 12], 
      [5, 8], [5, 0], [12, -15], [20, -17], [30, -10]
    ]);

    // Australia
    drawPoly([
      [-12, 130], [-12, 138], [-18, 146], [-28, 153], [-38, 145], 
      [-35, 118], [-22, 114], [-16, 122]
    ]);

    // Antarctica
    drawPoly([
      [-65, -60], [-68, 0], [-65, 60], [-68, 120], [-68, 180], 
      [-72, -140], [-70, -100]
    ], '#162C3D');

    // Thermal Heat Anomaly Overlay if enabled
    if (thermalHeat) {
      // Arctic Thermal Anomaly Glow (High-latitude warmth)
      const arcticGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.12, 20,
        canvas.width / 2, canvas.height * 0.12, canvas.width * 0.45
      );
      arcticGrad.addColorStop(0, 'rgba(232, 162, 58, 0.45)'); // Amber
      arcticGrad.addColorStop(0.5, 'rgba(232, 162, 58, 0.18)');
      arcticGrad.addColorStop(1, 'rgba(232, 162, 58, 0.0)');
      ctx.fillStyle = arcticGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.35);

      // Subtropical Heat Belts (Mediterranean / Sahel / Western NA)
      const subTropGrad = ctx.createLinearGradient(0, canvas.height * 0.25, 0, canvas.height * 0.55);
      subTropGrad.addColorStop(0, 'rgba(200, 74, 74, 0.08)');
      subTropGrad.addColorStop(0.5, 'rgba(232, 162, 58, 0.14)');
      subTropGrad.addColorStop(1, 'rgba(66, 200, 245, 0.02)');
      ctx.fillStyle = subTropGrad;
      ctx.fillRect(0, canvas.height * 0.25, canvas.width, canvas.height * 0.3);
    }

    // Grid dots / calibration crosshairs
    ctx.fillStyle = 'rgba(247, 249, 251, 0.25)';
    for (let x = 50; x < canvas.width; x += 120) {
      for (let y = 40; y < canvas.height; y += 80) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 3.8);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x42c8f5, 1.4);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xe8a23a, 0.6);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // 5. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 6. Earth Mesh
    const earthRadius = 1.35;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthTexture = createScientificEarthTexture(showThermalOverlay);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.85,
      metalness: 0.15,
      bumpScale: 0.05
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 7. Atmospheric Glow Shell
    const atmosGeometry = new THREE.SphereGeometry(earthRadius * 1.025, 48, 48);
    const atmosMaterial = new THREE.MeshBasicMaterial({
      color: 0x42c8f5,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
    globeGroup.add(atmosMesh);

    // 8. Markers Group
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // Render Markers for each candidate region
    regions.forEach(region => {
      if (region.id === 'global_mean') return; // Skip global mean on spatial globe
      const pos = latLngToVector3(region.lat, region.lng, earthRadius * 1.015);
      
      const isSelected = selectedRegionIds.includes(region.id);
      const isHighlighted = highlightedRegionId === region.id;

      const markerObj = new THREE.Group();
      markerObj.position.copy(pos);
      markerObj.userData = { region };

      // Pin Needle
      const needleHeight = isSelected ? 0.18 : 0.12;
      const needleGeom = new THREE.CylinderGeometry(0.006, 0.002, needleHeight, 8);
      needleGeom.translate(0, needleHeight / 2, 0);
      needleGeom.rotateX(Math.PI / 2);
      const needleMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(region.color)
      });
      const needle = new THREE.Mesh(needleGeom, needleMat);
      needle.lookAt(new THREE.Vector3(0, 0, 0));
      markerObj.add(needle);

      // Pin Head Sphere
      const headGeom = new THREE.SphereGeometry(isSelected ? 0.045 : 0.03, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(region.color),
        emissive: new THREE.Color(region.color),
        emissiveIntensity: isSelected ? 0.8 : 0.3,
        roughness: 0.2
      });
      const head = new THREE.Mesh(headGeom, headMat);
      const headOffset = pos.clone().normalize().multiplyScalar(needleHeight);
      head.position.copy(headOffset);
      markerObj.add(head);

      // Outer Ring for Selected / High Anomaly Regions
      if (isSelected || isHighlighted) {
        const ringGeom = new THREE.RingGeometry(0.05, 0.07, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(region.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.position.copy(headOffset);
        ring.lookAt(camera.position);
        markerObj.add(ring);
      }

      markersGroup.add(markerObj);
    });

    // Handle Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isRotating && globeGroupRef.current && !isDraggingRef.current) {
        globeGroupRef.current.rotation.y += delta * 0.15;
      }

      renderer.render(scene, camera);
    };
    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
    };
  }, [regions, selectedRegionIds, highlightedRegionId, showThermalOverlay, isRotating]);

  // Mouse interaction: Drag to rotate
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !globeGroupRef.current) {
      // Raycasting for hover tooltip
      checkRaycast(e.clientX, e.clientY);
      return;
    }

    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    globeGroupRef.current.rotation.y += deltaX * 0.008;
    globeGroupRef.current.rotation.x += deltaY * 0.008;

    // Clamp vertical tilt to avoid flipping
    globeGroupRef.current.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroupRef.current.rotation.x));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Raycast to detect hover/click on region markers
  const checkRaycast = (clientX: number, clientY: number, isClick = false) => {
    if (!mountRef.current || !cameraRef.current || !markersGroupRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);
    if (intersects.length > 0) {
      let topObj: THREE.Object3D | null = intersects[0].object;
      while (topObj && !topObj.userData?.region && topObj.parent) {
        topObj = topObj.parent;
      }
      if (topObj && topObj.userData?.region) {
        const region = topObj.userData.region as CandidateRegion;
        if (isClick) {
          onSelectRegion(region.id);
        } else {
          setActiveTooltip({
            region,
            x: clientX - rect.left,
            y: clientY - rect.top
          });
          onHoverRegion?.(region.id);
        }
        return;
      }
    }

    if (!isClick) {
      setActiveTooltip(null);
      onHoverRegion?.(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    checkRaycast(e.clientX, e.clientY, true);
  };

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const currentZ = cameraRef.current.position.z;
    const targetZ = direction === 'in' ? Math.max(2.0, currentZ - 0.5) : Math.min(6.0, currentZ + 0.5);
    cameraRef.current.position.z = targetZ;
  };

  const handleResetOrientation = () => {
    if (!globeGroupRef.current || !cameraRef.current) return;
    globeGroupRef.current.rotation.set(0, 0, 0);
    cameraRef.current.position.set(0, 1.2, 3.8);
  };

  return (
    <div className="relative w-full h-[460px] lg:h-[520px] bg-[#0B1A27] rounded-xl border border-[#20394D] overflow-hidden select-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setActiveTooltip(null);
        }}
        onClick={handleClick}
      />

      {/* Scientific Globe HUD Header Overlay */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#42C8F5]">
            Forensic Spatial Telemetry
          </span>
          <span className="text-xs text-[#667789]">·</span>
          <span className="text-xs text-[#667789] font-mono">Orthographic 3D Viewport</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#F7F9FB] pointer-events-auto bg-[#10283D]/80 backdrop-blur px-2.5 py-1 rounded border border-[#20394D]">
          <span className="text-[#E8A23A]">Arctic Amplification</span>
          <span className="text-[#667789]">vs</span>
          <span className="text-[#42C8F5]">Subtropical & Tropical</span>
        </div>
      </div>

      {/* Floating HUD Controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-[#10283D]/90 backdrop-blur p-1 rounded-lg border border-[#20394D] text-[#F7F9FB]">
        <button
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Pause rotation' : 'Resume auto-rotation'}
          className={`p-2 rounded text-xs transition-colors flex items-center gap-1.5 ${
            isRotating ? 'bg-[#20394D] text-[#42C8F5]' : 'hover:bg-[#20394D]/60 text-[#667789]'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          <span className="text-[11px] font-mono">{isRotating ? 'Rotate ON' : 'Paused'}</span>
        </button>

        <div className="h-4 w-px bg-[#20394D] mx-0.5" />

        <button
          onClick={() => handleZoom('in')}
          title="Zoom In"
          className="p-2 rounded hover:bg-[#20394D] text-[#F7F9FB] transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleZoom('out')}
          title="Zoom Out"
          className="p-2 rounded hover:bg-[#20394D] text-[#F7F9FB] transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetOrientation}
          title="Reset Orientation"
          className="p-2 rounded hover:bg-[#20394D] text-[#F7F9FB] transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Region Legend Overlay */}
      <div className="absolute bottom-4 right-4 bg-[#10283D]/90 backdrop-blur p-2.5 rounded-lg border border-[#20394D] max-w-[280px]">
        <div className="text-[11px] font-mono text-[#667789] uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Active Markers ({selectedRegionIds.length})</span>
          <span className="text-[#42C8F5] text-[10px]">Click pin to toggle</span>
        </div>
        <div className="space-y-1">
          {regions.filter(r => r.id !== 'global_mean').map(region => {
            const isSelected = selectedRegionIds.includes(region.id);
            return (
              <button
                key={region.id}
                onClick={() => onSelectRegion(region.id)}
                className={`w-full flex items-center justify-between text-left text-xs px-2 py-1 rounded transition-colors ${
                  isSelected ? 'bg-[#20394D] text-[#F7F9FB]' : 'text-[#667789] hover:bg-[#20394D]/40'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: region.color }}
                  />
                  <span className="truncate">{region.name}</span>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-[#42C8F5] ml-2 shrink-0">
                  +{region.currentAnomaly2024.toFixed(2)}°C
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hover Tooltip HUD */}
      {activeTooltip && (
        <div
          className="absolute z-20 pointer-events-none bg-[#10283D] border border-[#42C8F5] shadow-2xl p-3 rounded-lg text-xs w-64 transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${activeTooltip.x}px`,
            top: `${activeTooltip.y - 12}px`
          }}
        >
          <div className="flex items-center justify-between border-b border-[#20394D] pb-1.5 mb-1.5">
            <span className="font-semibold text-[#F7F9FB] flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeTooltip.region.color }}
              />
              {activeTooltip.region.name}
            </span>
            <span className="font-mono text-[10px] text-[#42C8F5]">
              {activeTooltip.region.code}
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#667789]">Coordinates:</span>
              <span className="text-[#F7F9FB]">
                {activeTooltip.region.lat.toFixed(1)}°N, {Math.abs(activeTooltip.region.lng).toFixed(1)}°{activeTooltip.region.lng >= 0 ? 'E' : 'W'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667789]">2024 Anomaly:</span>
              <span className="text-[#E8A23A] font-semibold tabular-nums">
                +{activeTooltip.region.currentAnomaly2024.toFixed(2)}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667789]">Warming Rate:</span>
              <span className="text-[#F7F9FB] tabular-nums">
                +{activeTooltip.region.warmingRatePerDecade.toFixed(2)}°C / decade
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667789]">Uncertainty (95% CI):</span>
              <span className="text-[#667789] tabular-nums">
                ±{activeTooltip.region.uncertaintyMargin.toFixed(2)}°C
              </span>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-[#20394D] text-[10px] text-[#42C8F5] flex items-center gap-1">
            <Info className="w-3 h-3 shrink-0" />
            <span>Click pin to add/remove from comparative matrix</span>
          </div>
        </div>
      )}
    </div>
  );
};
