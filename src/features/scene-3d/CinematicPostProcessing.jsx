import React, { useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const KidsVibrantGradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uChromaticAberration: { value: 0.0008 },
    uVignetteDarkness: { value: 0.45 },
    uVignetteOffset: { value: 0.25 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uChromaticAberration;
    uniform float uVignetteDarkness;
    uniform float uVignetteOffset;
    varying vec2 vUv;

    void main() {
      // Gentle Chromatic Aberration for glossy pop feel
      vec2 distFromCenter = vUv - 0.5;
      vec2 offset = distFromCenter * uChromaticAberration;
      
      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;
      vec3 color = vec3(r, g, b);

      // Soft Kids Studio Vignette
      float len = length(distFromCenter * vec2(1.1, 1.0));
      float vignette = smoothstep(0.9, uVignetteOffset, len * uVignetteDarkness);
      color = mix(color * vignette, color, 0.35);

      // Cheerful Color Saturation & Contrast
      color = (color - 0.5) * 1.04 + 0.5;

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

export const CinematicPostProcessing = React.memo(function CinematicPostProcessing() {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => {
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
    });

    const comp = new EffectComposer(gl, renderTarget);
    comp.addPass(new RenderPass(scene, camera));

    // Vibrant Party Balloon & Keycap Bloom Pass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.85, // Strength (Cheery soft bloom)
      0.65, // Radius
      0.48  // Luminance Threshold
    );
    comp.addPass(bloomPass);

    // Colorful Grade & Soft Vignette Pass
    const gradePass = new ShaderPass(KidsVibrantGradeShader);
    comp.addPass(gradePass);

    return comp;
  }, [gl, scene, camera]);

  useEffect(() => {
    if (composer) {
      composer.setSize(size.width, size.height);
    }
  }, [composer, size]);

  useFrame(() => {
    if (composer) {
      composer.render();
    }
  }, 1);

  return null;
});
