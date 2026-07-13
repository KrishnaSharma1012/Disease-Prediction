import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MedicalParticles({ count = 60 }) {
  const meshRef = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
        ],
        speed: 0.1 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        size: 0.03 + Math.random() * 0.04,
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 0.5,
        p.position[1] + Math.cos(t * p.speed * 0.7 + p.offset) * 0.3,
        p.position[2] + Math.sin(t * p.speed * 0.5 + p.offset) * 0.2
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#3b8bff"
        emissive="#3b8bff"
        emissiveIntensity={0.6}
        transparent
        opacity={0.5}
      />
    </instancedMesh>
  );
}
