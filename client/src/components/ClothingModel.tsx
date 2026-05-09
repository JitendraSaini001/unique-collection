import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// Fix for "Property does not exist on type 'JSX.IntrinsicElements'"
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      primitive: any;
      meshPhysicalMaterial: any;
      meshStandardMaterial: any;
    }
  }
}

interface ClothingModelProps {
  modelUrl?: string;
  material?: 'silk' | 'denim' | 'cotton' | 'wool' | 'linen' | 'polyester';
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  onHover?: (hovered: boolean) => void;
  interactive?: boolean;
}

const getMaterialProperties = (material: string) => {
  const properties: Record<string, THREE.MeshStandardMaterialParameters> = {
    silk: {
      color: '#111111',
      metalness: 0.6,
      roughness: 0.2,
      emissive: '#111111',
      emissiveIntensity: 0.1,
    },
    denim: {
      color: '#1a2a3a',
      metalness: 0.1,
      roughness: 0.8,
    },
    cotton: {
      color: '#f5f5f5',
      metalness: 0,
      roughness: 0.9,
    },
    gold: {
      color: '#D97706',
      metalness: 1.0,
      roughness: 0.1,
      emissive: '#D97706',
      emissiveIntensity: 0.2,
    },
    wool: {
      color: '#2a2a2a',
      metalness: 0,
      roughness: 0.95,
    }
  };

  return properties[material] || properties.cotton;
};

const ClothingModel: React.FC<ClothingModelProps> = ({
  modelUrl,
  material = 'cotton',
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onHover,
  interactive = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [gltf, setGltf] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load GLTF model if URL provided
  useEffect(() => {
    if (!modelUrl) {
      setLoading(false);
      return;
    }

    const loadModel = async () => {
      try {
        const result = await useGLTF.preload(modelUrl);
        setGltf(result);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load model:', error);
        setLoading(false);
      }
    };

    loadModel();
  }, [modelUrl]);

  // Apply material properties
  useEffect(() => {
    if (!groupRef.current) return;

    const materialProps = getMaterialProperties(material);

    groupRef.current.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial(materialProps);
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [material]);

  // Hover animation
  useFrame(() => {
    if (!groupRef.current || !interactive) return;

    if (hovered) {
      gsap.to(groupRef.current.rotation, {
        y: groupRef.current.rotation.y + 0.01,
        duration: 0.1,
        overwrite: false,
      });

      gsap.to(groupRef.current.position, {
        y: groupRef.current.position.y + Math.sin(Date.now() * 0.001) * 0.002,
        duration: 0.1,
        overwrite: false,
      });
    }
  });

  const handlePointerEnter = () => {
    setHovered(true);
    onHover?.(true);
  };

  const handlePointerLeave = () => {
    setHovered(false);
    onHover?.(false);
  };

  // Fallback 3D shape if no model provided
  const renderFallback = () => {
    const MeshComponent = 'mesh' as any;
    const BoxGeometry = 'boxGeometry' as any;
    const MeshStandardMaterial = 'meshStandardMaterial' as any;
    return (
      <MeshComponent castShadow receiveShadow>
        <BoxGeometry args={[1, 2, 0.5]} />
        <MeshStandardMaterial {...getMaterialProperties(material)} />
      </MeshComponent>
    );
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {loading || !modelUrl ? (
        renderFallback()
      ) : (
        gltf && <primitive object={gltf.scene} />
      )}
    </group>
  );
};

export default ClothingModel;
