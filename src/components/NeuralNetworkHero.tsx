import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface NodeData {
  position: THREE.Vector3;
  connections: number[];
  layer: number;
}

const NeuralNodes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Generate neural network structure
  const network = useMemo(() => {
    const nodes: NodeData[] = [];
    const layers = [4, 6, 8, 6, 4]; // Node counts per layer
    const layerSpacing = 2.5;
    
    let nodeIndex = 0;
    layers.forEach((nodeCount, layerIndex) => {
      const layerX = (layerIndex - (layers.length - 1) / 2) * layerSpacing;
      
      for (let i = 0; i < nodeCount; i++) {
        const nodeY = (i - (nodeCount - 1) / 2) * 0.8;
        const nodeZ = Math.sin(i * 0.5) * 0.3;
        
        // Connect to previous layer nodes
        const connections: number[] = [];
        if (layerIndex > 0) {
          const prevLayerStart = nodes.length - layers[layerIndex - 1];
          for (let j = 0; j < layers[layerIndex - 1]; j++) {
            if (Math.random() > 0.3) { // Random connectivity
              connections.push(prevLayerStart + j);
            }
          }
        }
        
        nodes.push({
          position: new THREE.Vector3(layerX, nodeY, nodeZ),
          connections,
          layer: layerIndex
        });
        nodeIndex++;
      }
    });
    
    return nodes;
  }, []);

  // Generate connection lines
  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    
    network.forEach((node, i) => {
      node.connections.forEach(targetIndex => {
        const target = network[targetIndex];
        positions.push(
          node.position.x, node.position.y, node.position.z,
          target.position.x, target.position.y, target.position.z
        );
      });
    });
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [network]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smooth rotation following mouse
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouseRef.current.x * 0.3,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouseRef.current.y * 0.2,
      0.05
    );
    
    // Subtle floating animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  // Add mouse listener
  useMemo(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <group ref={groupRef} scale={0.8}>
      {/* Connection lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      
      {/* Nodes */}
      {network.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial 
            color={node.layer === 2 ? '#00ffff' : '#ffffff'} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {/* Animated pulse particles */}
      <PulseParticles network={network} />
    </group>
  );
};

const PulseParticles = ({ network }: { network: NodeData[] }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const paths = new Array(count);
    
    for (let i = 0; i < count; i++) {
      // Random start node
      const startNode = Math.floor(Math.random() * network.length);
      const node = network[startNode];
      positions[i * 3] = node.position.x;
      positions[i * 3 + 1] = node.position.y;
      positions[i * 3 + 2] = node.position.z;
      speeds[i] = 0.5 + Math.random() * 1.5;
      paths[i] = { start: startNode, progress: Math.random() };
    }
    
    return { positions, speeds, paths };
  }, [network]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particles.paths.length; i++) {
      const path = particles.paths[i];
      path.progress += particles.speeds[i] * 0.01;
      
      if (path.progress >= 1) {
        // Move to next node
        const currentNode = network[path.start];
        if (currentNode.connections.length > 0) {
          path.start = currentNode.connections[Math.floor(Math.random() * currentNode.connections.length)];
        } else {
          path.start = Math.floor(Math.random() * network.length);
        }
        path.progress = 0;
      }
      
      const node = network[path.start];
      const targetIndex = node.connections[0] || path.start;
      const target = network[targetIndex];
      
      positions[i * 3] = THREE.MathUtils.lerp(node.position.x, target?.position.x || node.position.x, path.progress);
      positions[i * 3 + 1] = THREE.MathUtils.lerp(node.position.y, target?.position.y || node.position.y, path.progress);
      positions[i * 3 + 2] = THREE.MathUtils.lerp(node.position.z, target?.position.z || node.position.z, path.progress);
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05}
        color="#00ffff"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const NeuralNetworkHero = () => {
  return (
    <div className="neural-network-container">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <NeuralNodes />
      </Canvas>
      
      {/* Labels */}
      <div className="neural-labels">
        <span className="neural-label input">INPUT</span>
        <span className="neural-label hidden">HIDDEN LAYERS</span>
        <span className="neural-label output">OUTPUT</span>
      </div>
    </div>
  );
};

export default NeuralNetworkHero;
