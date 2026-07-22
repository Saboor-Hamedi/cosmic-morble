import * as THREE from 'three';

export const EngineFireShader = {
  uniforms: {
    uTime: { value: 0 },
    uThrottle: { value: 0.25 }, // 0.0 to 1.0 based on speed / maxSpeed
    uColorIdle: { value: new THREE.Color('#ff3300') },
    uColorMid: { value: new THREE.Color('#ff007f') },
    uColorPeak: { value: new THREE.Color('#00ffff') },
    uColorCore: { value: new THREE.Color('#ffffff') }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uThrottle;
    varying vec2 vUv;
    varying vec3 vPosition;

    // Pseudo-random simplex-like noise
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + .1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                     mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                 mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                     mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
    }

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Distort the exhaust cone along its length (vUv.y or position.y/z)
      float n = noise(vec3(pos.x * 5.0, pos.y * 5.0, uTime * 15.0 * (0.5 + uThrottle)));
      float expansion = mix(0.1, 0.45, uThrottle);
      pos.x += n * expansion * vUv.y;
      pos.z += n * expansion * vUv.y;

      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uThrottle;
    uniform vec3 uColorIdle;
    uniform vec3 uColorMid;
    uniform vec3 uColorPeak;
    uniform vec3 uColorCore;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      // Longitudinal gradient from nozzle base (uv.y = 0) to tip (uv.y = 1)
      float intensity = (1.0 - vUv.y) * (0.6 + uThrottle * 0.8);
      
      // Radial core intensity (brighter in center)
      float radial = 1.0 - smoothstep(0.0, 0.55, abs(vUv.x - 0.5));
      intensity *= (radial * radial + 0.3);

      // Color transition from idle -> mid -> peak/core based on uThrottle and intensity
      vec3 color = mix(uColorIdle, uColorMid, clamp(uThrottle * 1.5, 0.0, 1.0));
      color = mix(color, uColorPeak, clamp(uThrottle * 1.2 - 0.2, 0.0, 1.0));
      
      if (intensity > 0.75) {
        color = mix(color, uColorCore, (intensity - 0.75) * 4.0);
      }

      float alpha = smoothstep(1.0, 0.1, vUv.y) * intensity * (0.7 + uThrottle * 0.5);
      gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
    }
  `
};
