import { useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface SkillNode {
  id: string;
  label: string;
  category: string;
  level: number;
  x: number;
  y: number;
  z: number;
  connections: string[];
}

const SKILLS: SkillNode[] = [
  // Core ML
  { id: 'ml', label: 'Machine Learning', category: 'core', level: 95, x: 0, y: 0, z: 0, connections: ['dl', 'cv', 'nlp', 'python'] },
  { id: 'dl', label: 'Deep Learning', category: 'ml', level: 90, x: 2, y: 1, z: 0.5, connections: ['cnn', 'yolo', 'pytorch', 'tensorflow'] },
  { id: 'cv', label: 'Computer Vision', category: 'ml', level: 88, x: 2, y: -1, z: -0.5, connections: ['yolo', 'clip', 'opencv'] },
  { id: 'nlp', label: 'NLP', category: 'ml', level: 85, x: -2, y: 1, z: 0.5, connections: ['blip', 'llm', 'transformers'] },
  
  // Specific models
  { id: 'yolo', label: 'YOLO', category: 'model', level: 88, x: 3.5, y: 0, z: 1, connections: [] },
  { id: 'cnn', label: 'CNN', category: 'model', level: 90, x: 3.5, y: 2, z: 0, connections: [] },
  { id: 'clip', label: 'CLIP', category: 'model', level: 82, x: 3.5, y: -2, z: 0, connections: [] },
  { id: 'blip', label: 'BLIP', category: 'model', level: 80, x: -3.5, y: 2, z: 0, connections: [] },
  { id: 'llm', label: 'LLMs', category: 'model', level: 85, x: -3.5, y: 0, z: 1, connections: [] },
  { id: 'transformers', label: 'Transformers', category: 'model', level: 83, x: -3.5, y: -1, z: -0.5, connections: [] },
  
  // Frameworks
  { id: 'pytorch', label: 'PyTorch', category: 'framework', level: 85, x: 1, y: 2.5, z: -1, connections: [] },
  { id: 'tensorflow', label: 'TensorFlow', category: 'framework', level: 87, x: 2, y: 2.5, z: 0, connections: [] },
  { id: 'opencv', label: 'OpenCV', category: 'framework', level: 85, x: 3, y: -2.5, z: 0, connections: [] },
  
  // Languages
  { id: 'python', label: 'Python', category: 'lang', level: 95, x: -1, y: -2, z: 1, connections: ['pandas', 'numpy'] },
  { id: 'pandas', label: 'Pandas', category: 'data', level: 92, x: -2, y: -2.5, z: 0, connections: [] },
  { id: 'numpy', label: 'NumPy', category: 'data', level: 90, x: 0, y: -2.5, z: 0, connections: [] },
];

const SkillNodeMesh = ({ skill, isHovered, onHover }: { 
  skill: SkillNode; 
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const color = useMemo(() => {
    switch (skill.category) {
      case 'core': return '#00ffff';
      case 'ml': return '#00ccff';
      case 'model': return '#ff00ff';
      case 'framework': return '#00ff88';
      case 'lang': return '#ffcc00';
      case 'data': return '#ff8800';
      default: return '#ffffff';
    }
  }, [skill.category]);

  const size = useMemo(() => {
    if (skill.category === 'core') return 0.3;
    return 0.15 + (skill.level / 100) * 0.1;
  }, [skill.category, skill.level]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.scale.setScalar(isHovered ? size * 1.5 : size * 10);
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
  });

  return (
    <group position={[skill.x, skill.y, skill.z]}>
      <mesh 
        ref={meshRef}
        onPointerEnter={() => onHover(skill.id)}
        onPointerLeave={() => onHover(null)}
      >
        <dodecahedronGeometry args={[0.1, 0]} />
        <meshBasicMaterial 
          color={color} 
          wireframe={!isHovered}
          transparent
          opacity={isHovered ? 1 : 0.8}
        />
      </mesh>
      
      {/* Glow */}
      <mesh scale={isHovered ? 1.8 : 1.2}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={isHovered ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Label */}
      {isHovered && (
        <Html center distanceFactor={10}>
          <div className="knowledge-tooltip">
            <span className="tooltip-label">{skill.label}</span>
            <span className="tooltip-level">{skill.level}%</span>
          </div>
        </Html>
      )}
    </group>
  );
};

const ConnectionLines = ({ skills, hoveredId }: { skills: SkillNode[]; hoveredId: string | null }) => {
  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    
    skills.forEach(skill => {
      skill.connections.forEach(targetId => {
        const target = skills.find(s => s.id === targetId);
        if (target) {
          positions.push(skill.x, skill.y, skill.z);
          positions.push(target.x, target.y, target.z);
        }
      });
    });
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [skills]);

  const isConnected = useCallback((skill: SkillNode) => {
    if (!hoveredId) return false;
    const hoveredSkill = skills.find(s => s.id === hoveredId);
    if (!hoveredSkill) return false;
    return hoveredSkill.connections.includes(skill.id) || skill.connections.includes(hoveredId);
  }, [hoveredId, skills]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial 
        color="#00ffff" 
        transparent 
        opacity={hoveredId ? 0.5 : 0.2}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

const GraphContent = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      <ConnectionLines skills={SKILLS} hoveredId={hoveredId} />
      {SKILLS.map(skill => (
        <SkillNodeMesh 
          key={skill.id}
          skill={skill}
          isHovered={hoveredId === skill.id}
          onHover={setHoveredId}
        />
      ))}
    </group>
  );
};

const KnowledgeGraph = () => {
  return (
    <section id="skills" className="knowledge-graph-section">
      <div className="knowledge-header">
        <motion.span 
          className="section-tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          [ NEURAL ARCHITECTURE ]
        </motion.span>
        <motion.h2 
          className="section-title-mono"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Knowledge Graph
        </motion.h2>
        <motion.p 
          className="section-subtitle-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Hover to explore the interconnected skill network
        </motion.p>
      </div>
      
      <div className="knowledge-canvas">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <GraphContent />
        </Canvas>
      </div>
      
      {/* Legend */}
      <div className="knowledge-legend">
        <div className="legend-item"><span className="dot core" /> Core</div>
        <div className="legend-item"><span className="dot ml" /> ML/AI</div>
        <div className="legend-item"><span className="dot model" /> Models</div>
        <div className="legend-item"><span className="dot framework" /> Frameworks</div>
        <div className="legend-item"><span className="dot lang" /> Languages</div>
      </div>
    </section>
  );
};

export default KnowledgeGraph;
