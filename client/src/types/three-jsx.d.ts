import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      primitive: any;
      boxGeometry: any;
      sphereGeometry: any;
      planeGeometry: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      spotLight: any;
      rectAreaLight: any;
      color: any;
      canvas: any;
      perspectiveCamera: any;
      orbitControls: any;
      contactShadows: any;
    }
  }
}

// React 19 specific
declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      primitive: any;
      boxGeometry: any;
      sphereGeometry: any;
      planeGeometry: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      spotLight: any;
      rectAreaLight: any;
      color: any;
      canvas: any;
      perspectiveCamera: any;
      orbitControls: any;
      contactShadows: any;
    }
  }
}

export {};
