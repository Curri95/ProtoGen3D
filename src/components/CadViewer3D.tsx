import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCcw, 
  Layers, 
  Maximize2, 
  Eye, 
  Flame, 
  Box, 
  Scissors, 
  ZoomIn, 
  ZoomOut,
  Sparkles
} from 'lucide-react';

interface CadViewer3DProps {
  fileName?: string;
  hasCriticalThickness?: boolean;
}

export default function CadViewer3D({ 
  fileName = 'carcasa_valvula_colector.step', 
  hasCriticalThickness = true 
}: CadViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'solid' | 'heatmap' | 'wireframe'>('solid');
  const [sectionCut, setSectionCut] = useState(false);
  const [isRotating, setIsRotating] = useState(true);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const solidMeshRef = useRef<THREE.Mesh | null>(null);
  const heatmapMeshRef = useRef<THREE.Mesh | null>(null);
  const wireframeMeshRef = useRef<THREE.LineSegments | null>(null);
  const clipPlaneRef = useRef<THREE.Plane | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 320;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xF8FAFC); // Slate-50 background

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(130, 90, 140);
    camera.lookAt(0, 5, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(100, 150, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffedd5, 1.0); // warm industrial backlight
    dirLight2.position.set(-100, -50, -80);
    scene.add(dirLight2);

    // 5. Grid plane floor
    const gridHelper = new THREE.GridHelper(200, 20, 0xCBD5E1, 0xE2E8F0);
    gridHelper.position.y = -35;
    scene.add(gridHelper);

    // 6. Build High-Precision CAD Model Geometry (Industrial Manifold / Valve Housing)
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;

    // Main body: flanged cylinder + housing block with bore
    const bodyGeom = new THREE.CylinderGeometry(28, 32, 45, 32);
    const topFlangeGeom = new THREE.CylinderGeometry(38, 38, 8, 32);
    topFlangeGeom.translate(0, 24, 0);
    const sidePortGeom = new THREE.CylinderGeometry(14, 14, 40, 24);
    sidePortGeom.rotateZ(Math.PI / 2);
    sidePortGeom.translate(25, 0, 0);

    // Thin rib section (specifically creates the < 0.8 mm critical zone)
    const ribGeom = new THREE.BoxGeometry(4, 30, 48);
    ribGeom.translate(-22, 5, 0);

    // Internal bore cavity
    const boreGeom = new THREE.CylinderGeometry(18, 18, 55, 32);

    // Merge geometries into single composite buffer geometry
    const geometries = [bodyGeom, topFlangeGeom, sidePortGeom, ribGeom];
    
    // Create base composite geometry
    let compositeGeom = new THREE.BufferGeometry();
    const posList: number[] = [];
    const normList: number[] = [];
    const colorHeatmapList: number[] = [];

    geometries.forEach((g) => {
      const gPos = g.attributes.position;
      const gNorm = g.attributes.normal;
      for (let i = 0; i < gPos.count; i++) {
        const x = gPos.getX(i);
        const y = gPos.getY(i);
        const z = gPos.getZ(i);
        posList.push(x, y, z);

        if (gNorm) {
          normList.push(gNorm.getX(i), gNorm.getY(i), gNorm.getZ(i));
        } else {
          normList.push(0, 1, 0);
        }

        // Color coding for Heatmap mode:
        // Rib and upper thin edges are simulated < 0.8 mm (RED/ORANGE)
        // Nominal thickness (>1.2 mm) is TEAL/GREEN
        const isThinZone = (x < -18 && y > 0) || (y > 22 && Math.abs(x) > 28);
        if (isThinZone) {
          // Alert Red / Coral (#FF3B30 / #FF5722)
          colorHeatmapList.push(1.0, 0.22, 0.12);
        } else if (y > 15) {
          // Transition Warning Amber (#F59E0B)
          colorHeatmapList.push(0.96, 0.62, 0.08);
        } else {
          // Optimal Thickness Teal / Emerald (#10B981)
          colorHeatmapList.push(0.12, 0.68, 0.52);
        }
      }
    });

    compositeGeom.setAttribute('position', new THREE.Float32BufferAttribute(posList, 3));
    compositeGeom.setAttribute('normal', new THREE.Float32BufferAttribute(normList, 3));
    compositeGeom.setAttribute('color', new THREE.Float32BufferAttribute(colorHeatmapList, 3));
    compositeGeom.computeVertexNormals();

    // Clipping plane for section view
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
    clipPlaneRef.current = clipPlane;

    // Material 1: Solid Anodized / Technical Aluminum PBR
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x64748B,
      metalness: 0.75,
      roughness: 0.35,
      clippingPlanes: sectionCut ? [clipPlane] : [],
      clipShadows: true,
      side: THREE.DoubleSide
    });
    const solidMesh = new THREE.Mesh(compositeGeom, solidMat);
    solidMeshRef.current = solidMesh;
    modelGroup.add(solidMesh);

    // Material 2: Heatmap Material (Vertex Colors)
    const heatmapMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.2,
      roughness: 0.5,
      clippingPlanes: sectionCut ? [clipPlane] : [],
      side: THREE.DoubleSide
    });
    const heatmapMesh = new THREE.Mesh(compositeGeom, heatmapMat);
    heatmapMesh.visible = false;
    heatmapMeshRef.current = heatmapMesh;
    modelGroup.add(heatmapMesh);

    // Material 3: Wireframe overlay
    const wireframeGeom = new THREE.WireframeGeometry(compositeGeom);
    const wireframeMat = new THREE.LineBasicMaterial({ 
      color: 0x0F172A, 
      linewidth: 1,
      transparent: true,
      opacity: 0.35 
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeom, wireframeMat);
    wireframeMesh.visible = false;
    wireframeMeshRef.current = wireframeMesh;
    modelGroup.add(wireframeMesh);

    scene.add(modelGroup);

    // 7. Interactive Mouse / Touch Drag Orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modelGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      modelGroupRef.current.rotation.y += deltaX * 0.01;
      modelGroupRef.current.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(70, Math.min(260, camera.position.z + e.deltaY * 0.15));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Touch support
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = true;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !modelGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      modelGroupRef.current.rotation.y += deltaX * 0.012;
      modelGroupRef.current.rotation.x += deltaY * 0.012;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove);
    container.addEventListener('touchend', onTouchEnd);

    // 8. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isRotating && !isDragging && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      compositeGeom.dispose();
      solidMat.dispose();
      heatmapMat.dispose();
      wireframeMat.dispose();
    };
  }, []);

  // Update view mode (solid vs heatmap vs wireframe)
  useEffect(() => {
    if (!solidMeshRef.current || !heatmapMeshRef.current || !wireframeMeshRef.current) return;

    if (viewMode === 'solid') {
      solidMeshRef.current.visible = true;
      heatmapMeshRef.current.visible = false;
      wireframeMeshRef.current.visible = false;
    } else if (viewMode === 'heatmap') {
      solidMeshRef.current.visible = false;
      heatmapMeshRef.current.visible = true;
      wireframeMeshRef.current.visible = false;
    } else if (viewMode === 'wireframe') {
      solidMeshRef.current.visible = true;
      heatmapMeshRef.current.visible = false;
      wireframeMeshRef.current.visible = true;
    }
  }, [viewMode]);

  // Update Section Cut clipping
  useEffect(() => {
    if (!clipPlaneRef.current || !solidMeshRef.current || !heatmapMeshRef.current) return;
    const solidMat = solidMeshRef.current.material as THREE.MeshStandardMaterial;
    const heatmapMat = heatmapMeshRef.current.material as THREE.MeshStandardMaterial;

    if (sectionCut) {
      solidMat.clippingPlanes = [clipPlaneRef.current];
      heatmapMat.clippingPlanes = [clipPlaneRef.current];
    } else {
      solidMat.clippingPlanes = [];
      heatmapMat.clippingPlanes = [];
    }
    solidMat.needsUpdate = true;
    heatmapMat.needsUpdate = true;
  }, [sectionCut]);

  const resetCamera = () => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0.2, 0.4, 0);
    }
  };

  return (
    <div className="relative w-full bg-slate-100 border border-slate-300 overflow-hidden shadow-inner">
      
      {/* 3D WebGL Canvas Mount Container */}
      <div 
        ref={mountRef} 
        className="w-full h-72 sm:h-80 cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating Toolbar on Top Left */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={() => setViewMode('solid')}
          className={`px-2.5 py-1 text-xs font-mono transition-colors shadow-xs ${
            viewMode === 'solid'
              ? 'bg-industrial-accent text-white font-semibold'
              : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-300'
          }`}
          title="Vista de sólido metálico"
        >
          <Box className="w-3.5 h-3.5 inline mr-1" />
          Sólido
        </button>

        <button
          type="button"
          onClick={() => setViewMode('heatmap')}
          className={`px-2.5 py-1 text-xs font-mono transition-colors shadow-xs ${
            viewMode === 'heatmap'
              ? 'bg-industrial-accent text-white font-semibold'
              : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-300'
          }`}
          title="Mapa de calor de espesores DFM"
        >
          <Flame className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
          Heatmap Espesor
        </button>

        <button
          type="button"
          onClick={() => setViewMode('wireframe')}
          className={`px-2.5 py-1 text-xs font-mono transition-colors shadow-xs ${
            viewMode === 'wireframe'
              ? 'bg-industrial-accent text-white font-semibold'
              : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-300'
          }`}
          title="Malla de triángulos"
        >
          <Layers className="w-3.5 h-3.5 inline mr-1" />
          Malla
        </button>

        <button
          type="button"
          onClick={() => setSectionCut(!sectionCut)}
          className={`px-2 py-1 text-xs font-mono transition-colors shadow-xs ${
            sectionCut
              ? 'bg-slate-900 text-white font-semibold'
              : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-300'
          }`}
          title="Corte transversal para ver cavidades interiores"
        >
          <Scissors className="w-3 h-3 inline mr-1" />
          {sectionCut ? 'Quitar corte' : 'Sección 1/2'}
        </button>
      </div>

      {/* Camera Controls on Top Right */}
      <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 text-xs font-mono shadow-xs border border-slate-300 ${
            isRotating ? 'bg-orange-50 text-industrial-accent' : 'bg-white text-slate-600'
          }`}
          title={isRotating ? 'Pausar rotación automática' : 'Activar rotación automática'}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>
        <button
          type="button"
          onClick={resetCamera}
          className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs text-xs font-mono"
          title="Restablecer vista isométrica"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Heatmap Legend Bar (Visible when in Heatmap mode) */}
      {viewMode === 'heatmap' && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-slate-300 px-3 py-1.5 shadow-md flex items-center gap-3 text-[11px] font-mono z-10">
          <span className="font-bold text-slate-700">Espesor DFM:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#FF3B30] border border-red-600" />
            <span className="text-red-700 font-semibold">&lt; 0.8 mm (Crítico)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#F59E0B] border border-amber-600" />
            <span className="text-amber-700">0.8 - 1.2 mm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#10B981] border border-emerald-600" />
            <span className="text-emerald-700">&gt; 1.2 mm (Óptimo)</span>
          </div>
        </div>
      )}

      {/* CAD File Metadata Tag on Bottom Right */}
      <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white font-mono text-[10px] px-2.5 py-1 shadow-md pointer-events-none hidden sm:block z-10">
        WebGL 3D · 14.820 vtx · Arrastrar para rotar
      </div>

    </div>
  );
}
