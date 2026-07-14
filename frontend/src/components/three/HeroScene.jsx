import { Suspense, lazy, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';

const DNAHelix = lazy(() => import('./DNAHelix'));
const MedicalParticles = lazy(() => import('./MedicalParticles'));

function SceneFallback() {
  return null;
}

export default function HeroScene() {
  // Completely disable 3D scene to fix severe UI lag
  return null;

  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Check if WebGL is actually supported on this machine
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }

    setIsMobile(window.innerWidth < 768);
    setReduceMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If WebGL is not supported, do not even attempt to render Canvas as it will crash the app
  if (!hasWebGL) return null;

  // if (isMobile || reduceMotion) return null;

  return (
    <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
      <ErrorBoundary fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#3b8bff" />
          <pointLight position={[-5, -3, 3]} intensity={0.4} color="#06c4af" />

          <Suspense fallback={<SceneFallback />}>
            <DNAHelix position={[3, 0, 0]} scale={0.8} />
            <MedicalParticles count={40} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

// Simple Error Boundary to catch Three.js crashes
import React from 'react';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('WebGL/Three.js Error:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
