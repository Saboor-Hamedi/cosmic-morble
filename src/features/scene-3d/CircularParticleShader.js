import * as THREE from 'three';

export const CircularParticleShader = {
  uniforms: {
    uOpacity: { value: 1.0 },
    uBaseSize: { value: 2.0 }
  },
  vertexShader: `
    uniform float uBaseSize;
    attribute float size;
    varying vec3 vColor;

    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = (size * uBaseSize) * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uOpacity;
    varying vec3 vColor;

    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) {
        discard;
      }
      float alpha = pow(1.0 - dist * 2.0, 1.8);
      gl_FragColor = vec4(vColor, alpha * uOpacity);
    }
  `
};
