'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows, Text, PerspectiveCamera, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

function OrbitingButton({ label, angle, radius, onAnswer, color }) {
  const [hovered, setHovered] = useState(false);
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  return (
    <group position={[x, 1, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
      <mesh 
        onClick={() => onAnswer(label)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.2, 0.6, 0.1]} />
        <meshStandardMaterial 
          color={hovered ? color : "#222222"} 
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/robotomono/v22/L0tkDFo6GF1D6C1KnS7dfRLXv85at0On.woff"
      >
        {label}
      </Text>
    </group>
  );
}

function CricketBall({ question, isThinking }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += isThinking ? 0.08 : 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={[0, 1, 0]}>
        <mesh ref={meshRef} castShadow>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial 
            color="#8B0000" 
            roughness={0.3}
            metalness={0.8}
            emissive={isThinking ? "#ff3300" : "#000000"}
            emissiveIntensity={isThinking ? 1 : 0}
          />
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.21, 0.02, 16, 100]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </mesh>

        <Text
          position={[0, 2.5, 0]}
          fontSize={0.3}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={5}
          textAlign="center"
          font="https://fonts.gstatic.com/s/robotomono/v22/L0tkDFo6GF1D6C1KnS7dfRLXv85at0On.woff"
        >
          {isThinking ? ">>> CALCULATING PROBABILITIES <<<" : question}
        </Text>
      </group>
    </Float>
  );
}

function CandidateFielders({ candidates }) {
  return candidates.slice(0, 8).map((c, i) => {
    const distance = 5 + (100 - c.probability) * 0.05;
    const angle = (i / 8) * Math.PI * 2;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    
    return (
      <group key={c.name} position={[x, -1, z]}>
        <mesh castShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.08, 1, 8]} />
          <meshStandardMaterial 
            color={c.probability > 70 ? "#00ff00" : "#00ffff"} 
            emissive={c.probability > 70 ? "#00ff00" : "#00ffff"}
            emissiveIntensity={c.probability / 100}
          />
        </mesh>
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
        >
          {c.name}
        </Text>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshStandardMaterial color={c.probability > 70 ? "#00ff00" : "#00ffff"} transparent opacity={0.3} />
        </mesh>
      </group>
    );
  });
}

export default function StadiumScene({ question, candidates, isThinking, confidence, onAnswer }) {
  const answers = [
    { label: 'Yes', color: '#00ff88' },
    { label: 'No', color: '#ff006e' },
    { label: 'Maybe', color: '#00ffff' },
    { label: 'Unknown', color: '#ffcc00' }
  ];

  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <Canvas shadows camera={{ position: [0, 8, 15], fov: 40 }}>
        <PerspectiveCamera makeDefault position={[0, 8, 15]} fov={40} />
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 20, 10]} angle={0.2} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#00ffff" />
        
        <Environment preset="night" />
        
        <CricketBall question={question} isThinking={isThinking} />
        
        <group rotation={[0, -Math.PI / 4, 0]}>
          {answers.map((ans, i) => (
            <OrbitingButton 
              key={ans.label} 
              label={ans.label} 
              angle={(i / 4) * Math.PI * 2} 
              radius={4} 
              color={ans.color} 
              onAnswer={onAnswer}
            />
          ))}
        </group>

        {/* Pitch */}
        <group position={[0, -1, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[12, 64]} />
            <meshStandardMaterial color="#1a3a1a" roughness={1} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <planeGeometry args={[2, 6]} />
            <meshStandardMaterial color="#c2a47c" roughness={1} />
          </mesh>
        </group>

        <CandidateFielders candidates={candidates} />
        
        <ContactShadows position={[0, -0.99, 0]} opacity={0.6} scale={30} blur={2} far={10} />
        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2.2} 
          minDistance={10} 
          maxDistance={25} 
          autoRotate={!isThinking}
          autoRotateSpeed={0.3}
        />
      </Canvas>
      
      {/* HUD Overlay */}
      <div className="absolute bottom-8 left-8 pointer-events-none font-mono z-20">
        <div className="text-cyan-400 text-[10px] tracking-[0.3em] mb-2 opacity-50 uppercase">Neural Integrity Matrix</div>
        <div className="bg-cyan/10 border-l-2 border-cyan p-4 backdrop-blur-sm">
          <div className="text-white text-3xl font-bold leading-none mb-1">
            {confidence.toFixed(1)}%
          </div>
          <div className="text-cyan-500 text-[10px] uppercase font-bold tracking-widest">Confidence Level</div>
        </div>
      </div>
      
      <div className="absolute top-8 right-8 text-right pointer-events-none font-mono z-20">
        <div className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Field Tracking</div>
        <div className="text-green-500 text-xs animate-pulse font-bold tracking-tighter">● SATELLITE LINK ACTIVE</div>
      </div>
    </div>
  );
}
