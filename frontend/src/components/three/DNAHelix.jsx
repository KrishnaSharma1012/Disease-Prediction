import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DNAHelix({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef();
  const sphereCount = 40;
  const connectorCount = 20;

  const { spherePositions, connectorData } = useMemo(() => {
    const positions = [];
    const connectors = [];
    for (let i = 0; i < sphereCount; i++) {
      const t = (i / sphereCount) * Math.PI * 4;
      const y = (i / sphereCount) * 6 - 3;
      const x1 = Math.cos(t) * 1.2;
      const z1 = Math.sin(t) * 1.2;
      const x2 = Math.cos(t + Math.PI) * 1.2;
      const z2 = Math.sin(t + Math.PI) * 1.2;
      positions.push(
        { pos: [x1, y, z1], strand: 0 },
        { pos: [x2, y, z2], strand: 1 }
      );
      if (i % 2 === 0) {
        connectors.push({ start: [x1, y, z1], end: [x2, y, z2] });
      }
    }
    return { spherePositions: positions, connectorData: connectors };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {spherePositions.map((sp, i) => (
        <mesh key={i} position={sp.pos}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            color={sp.strand === 0 ? '#3b8bff' : '#06c4af'}
            emissive={sp.strand === 0 ? '#3b8bff' : '#06c4af'}
            emissiveIntensity={0.4}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
      {connectorData.map((c, i) => {
        const mid = [
          (c.start[0] + c.end[0]) / 2,
          (c.start[1] + c.end[1]) / 2,
          (c.start[2] + c.end[2]) / 2,
        ];
        const dir = new THREE.Vector3(
          c.end[0] - c.start[0],
          c.end[1] - c.start[1],
          c.end[2] - c.start[2]
        );
        const len = dir.length();
        dir.normalize();
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

        return (
          <mesh key={`c-${i}`} position={mid} quaternion={quaternion}>
            <cylinderGeometry args={[0.02, 0.02, len, 6]} />
            <meshStandardMaterial
              color="#94a3b8"
              transparent
              opacity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}
