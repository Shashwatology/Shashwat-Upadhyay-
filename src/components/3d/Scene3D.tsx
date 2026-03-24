import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Float, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Floating geometric shapes with subtle glow
const FloatingGeometry = ({ position, rotation, scale, color }: { 
  position: [number, number, number]; 
  rotation: [number, number, number];
  scale: number;
  color: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color={color}
          transparent
          opacity={0.15}
          wireframe
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
};

// Animated torus knot
const FloatingTorus = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scrollY = window.scrollY || 0;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 + scrollY * 0.001;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15 + scrollY * 0.0005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={0.8}>
        <torusKnotGeometry args={[1, 0.3, 100, 16]} />
        <meshStandardMaterial 
          color="#00ffff"
          transparent
          opacity={0.08}
          wireframe
          emissive="#00ffff"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
};

// Particle field
const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;
  
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      const scrollY = window.scrollY || 0;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02 + scrollY * 0.0002;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color="#00ffff" 
        transparent 
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

const Scene3D = () => {
  return (
    <div className="scene-3d-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff00ff" />
          
          {/* Floating geometries scattered around */}
          <FloatingGeometry position={[-6, 3, -5]} rotation={[0.5, 0.3, 0]} scale={1.2} color="#00ffff" />
          <FloatingGeometry position={[5, -2, -8]} rotation={[0.2, 0.8, 0]} scale={0.8} color="#ff00ff" />
          <FloatingGeometry position={[-4, -4, -6]} rotation={[0.7, 0.1, 0]} scale={1} color="#00ff88" />
          <FloatingGeometry position={[6, 4, -10]} rotation={[0.3, 0.5, 0]} scale={1.5} color="#00ffff" />
          
          {/* Torus knot accent */}
          <FloatingTorus position={[0, 0, -15]} />
          
          {/* Particle field */}
          <ParticleField />
          
          {/* Subtle star background */}
          <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
