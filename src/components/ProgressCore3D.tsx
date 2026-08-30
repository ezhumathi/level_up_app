import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ProgressCore3DProps {
  score: number;
  maxScore?: number;
  onCoreClick?: () => void;
}

export const ProgressCore3D: React.FC<ProgressCore3DProps> = ({
  score,
  maxScore = 100,
  onCoreClick,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 320;
    let height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Outer wireframe icosahedron
    const geometry = new THREE.IcosahedronGeometry(1.55, 3);
    const material = new THREE.MeshPhongMaterial({
      color: 0x007aff,
      emissive: 0x0044ff,
      shininess: 120,
      transparent: true,
      opacity: 0.85,
      wireframe: true,
    });
    const core = new THREE.Mesh(geometry, material);
    group.add(core);

    // Second orbital wireframe ring
    const ringGeom = new THREE.TorusGeometry(1.85, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4edea3,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });
    const orbitalRing = new THREE.Mesh(ringGeom, ringMat);
    orbitalRing.rotation.x = Math.PI / 3;
    group.add(orbitalRing);

    // Inner glow sphere
    const innerGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.22,
    });
    const innerSphere = new THREE.Mesh(innerGeom, innerMat);
    group.add(innerSphere);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x007aff, 2.5, 12);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    const greenLight = new THREE.PointLight(0x4edea3, 1.5, 8);
    greenLight.position.set(-3, -2, 2);
    scene.add(greenLight);

    let animationFrameId: number;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotationY = x * 0.6;
      targetRotationX = -y * 0.6;
    };

    window.addEventListener('mousemove', handlePointerMove);

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      group.rotation.y += 0.006;
      group.rotation.z += 0.003;
      orbitalRing.rotation.z -= 0.008;

      group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;

      const pulse = Math.sin(Date.now() * 0.0025) * 0.07 + 1.0;
      core.scale.set(pulse, pulse, pulse);
      innerSphere.scale.set(pulse * 0.95, pulse * 0.95, pulse * 0.95);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
    };
  }, []);

  // Calculate SVG circular arc offset
  const radius = 48;
  const circumference = 2 * Math.PI * radius; // ~301.59
  const progressPercent = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      onClick={onCoreClick}
      className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center cursor-pointer select-none group"
      title="Click to trigger Level Up Surge!"
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-500 group-hover:scale-105"
      />

      {/* Circular HUD Ring Overlay */}
      <div className="absolute inset-0 rounded-full border border-white/10 shadow-[inset_0_0_40px_rgba(46,123,255,0.2)] flex flex-col items-center justify-center backdrop-blur-[1px] group-hover:border-primary/40 transition-all duration-300">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="2.5"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#4edea3"
            strokeWidth="3.2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(78, 222, 163, 0.7))',
            }}
          />
        </svg>

        {/* Score HUD Content */}
        <div className="flex flex-col items-center z-10 pointer-events-none text-center">
          <span className="font-mono text-[11px] md:text-xs font-semibold text-[#c2c6d7] tracking-[0.2em] uppercase mb-1">
            TODAY'S SCORE
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
              {score}
            </span>
            <span className="font-mono text-sm md:text-base text-[#8c90a0]">
              / {maxScore}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#4edea3] tracking-widest mt-1 opacity-90 animate-pulse">
            SYSTEM OPTIMAL
          </span>
        </div>
      </div>
    </div>
  );
};
