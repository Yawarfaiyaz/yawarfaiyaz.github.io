import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Mesh, Points } from 'three';

function Particles({ count = 900 }: { count?: number }) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += delta * 0.03;
    p.position.x += (state.pointer.x * 0.5 - p.position.x) * 0.03;
    p.position.y += (state.pointer.y * 0.3 - p.position.y) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e8d7a1" size={0.025} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

/** Interactive wireframe centrepiece that tilts toward the pointer. */
function Centerpiece() {
  const ref = useRef<Mesh>(null);
  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.x += delta * 0.12;
    m.rotation.y += delta * 0.18;
    m.rotation.z = state.pointer.x * 0.25;
  });
  return (
    <mesh ref={ref} position={[2.4, 0, -1]}>
      <icosahedronGeometry args={[1.25, 1]} />
      <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.25} wireframe />
    </mesh>
  );
}

export default function ParticleField({ className }: { className?: string }) {
  return (
    <Canvas className={className} camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 5]} intensity={1.2} color="#e8d7a1" />
      <Particles />
      <Centerpiece />
    </Canvas>
  );
}
