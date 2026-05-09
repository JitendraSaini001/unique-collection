import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// Fix for "Property does not exist on type 'JSX.IntrinsicElements'"
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      directionalLight: any;
      color: any;
      group: any;
      mesh: any;
      primitive: any;
    }
  }
}

interface Canvas3DProps {
  children?: React.ReactNode;
  cameraPosition?: [number, number, number];
  autoRotate?: boolean;
  lighting?: 'intro' | 'casual' | 'formal' | 'streetwear';
  onCameraChange?: (position: THREE.Vector3) => void;
}

const PremiumLighting = ({ type }: { type: string }) => {
  return (
    <>
      <ambientLight intensity={0.2} />
      {/* Main Key Light */}
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
      />
      {/* Rim Lights for Obsidian feel */}
      <pointLight position={[-10, 5, -10]} intensity={3} color="#D97706" />
      <pointLight position={[10, 5, -10]} intensity={2} color="#ffffff" />
      <pointLight position={[0, -5, 5]} intensity={1} color="#D97706" />
      
      {/* Fill Light */}
      <directionalLight position={[-5, 5, 5]} intensity={0.5} />
    </>
  );
};

const Canvas3D: React.FC<Canvas3DProps> = ({
  children,
  cameraPosition = [0, 0, 5],
  autoRotate = false,
  lighting = 'intro',
  onCameraChange,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-[#050505] overflow-hidden"
      style={{
        pointerEvents: 'auto',
      }}
    >
      <Canvas
        shadows
        camera={{
          position: cameraPosition,
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: false, // Performance with post-processing
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          {/* Environment for realistic reflections */}
          <Environment preset="city" />
          
          {/* Lighting */}
          <PremiumLighting type={lighting} />

          {/* Background - Deep Dark */}
          <color attach="background" args={['#050505']} />

          {/* Scene content */}
          <group position={[0, -1, 0]}>
            {children}
            <ContactShadows 
              opacity={0.4} 
              scale={10} 
              blur={2.4} 
              far={4.5} 
              color="#000000" 
            />
          </group>

          {/* Post-processing */}
          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={1} 
              mipmapBlur 
              intensity={0.5} 
              radius={0.4} 
            />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>

          {/* Camera controls */}
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            enableZoom={true}
            enablePan={false}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Canvas3D;
