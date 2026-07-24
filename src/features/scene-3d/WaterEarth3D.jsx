import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThemeStore } from '../theme/useThemeStore.js';
import * as THREE from 'three';

// Make it a massive cylinder placed very low so only the curved top is visible at the bottom of the screen!
const riverGeometry = new THREE.CylinderGeometry(25, 25, 200, 128, 128);

export const WaterEarth3D = React.memo(function WaterEarth3D() {
  const theme = useThemeStore((s) => s.theme);
  const materialRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (materialRef.current && materialRef.current.userData.shader) {
      materialRef.current.userData.shader.uniforms.uTime.value = t;
    }
  });

  const waterColor = theme.ambientColor || theme.bubbleColor || '#00aaff';

  return (
    // Position it deep below the screen (y=-30) so the top edge (y=-5) sits in the bottom quarter of the view
    <group position={[0, -29, -10]} rotation={[0, 0, Math.PI / 2]}>
      <mesh geometry={riverGeometry} receiveShadow>
        <meshPhysicalMaterial
          ref={materialRef}
          color={waterColor}
          transmission={0.15} // Minimal transmission so it doesn't distort or block the theme
          opacity={0.5} // Extremely transparent so the beautiful background themes shine through perfectly!
          transparent={true}
          roughness={0.05} // Very low roughness for high specular shine!
          metalness={0.8} // High metalness to reflect light off the wave peaks
          onBeforeCompile={(shader) => {
            shader.uniforms.uTime = { value: 0 };
            materialRef.current.userData.shader = shader;
            
            // We need to pass the local position from vertex to fragment shader
            shader.vertexShader = `
              varying vec3 vLocalPos;
              uniform float uTime;
              
              // Simplistic 3D noise for organic displacement
              vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
              vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
              vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
              vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
              float snoise(vec3 v) {
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i); 
                vec4 p = permute( permute( permute( 
                           i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                         + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                         + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857;
                vec3  ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
              }

              // ----------------------------------------------------
              // Realistic Ridged Ocean Wave fBM (Fractal Brownian Motion)
              // ----------------------------------------------------
              float ridge(float h, float offset) {
                h = abs(h);
                h = offset - h;
                h = h * h;
                return h;
              }

              float ridgedMF(vec3 p) {
                float sum = 0.0;
                float freq = 1.0;
                float amp = 0.5;
                float weight = 1.0;
                for(int i = 0; i < 4; i++) {
                  float n = snoise(p * freq);
                  n = ridge(n, 1.0);
                  sum += n * amp * weight;
                  weight = n; // Ridges have highest frequency noise
                  freq *= 2.0;
                  amp *= 0.5;
                }
                return sum;
              }

              ${shader.vertexShader}
            `.replace(
              '#include <begin_vertex>',
              `
              #include <begin_vertex>
              
              // Only move through time (Z-axis of noise) so the waves boil in place instead of streaking into lines!
              vec3 wavePos = vec3(position.x * 1.5, position.y * 1.5, uTime * 0.4);
              
              // Calculate realistic ridged ocean displacement!
              float waveHeight = ridgedMF(wavePos) * 0.8; 
              
              // Displace outwards along the physical cylinder curve!
              transformed += normal * waveHeight; 
              vLocalPos = position; // Pass local coordinates for edge fading
              
              // Recalculate normal roughly for specular highlights (crucial for that shiny water look!)
              float d = 0.02;
              float waveHeightX = ridgedMF(vec3((position.x+d) * 1.5, position.y * 1.5, uTime * 0.4)) * 0.8;
              float waveHeightY = ridgedMF(vec3(position.x * 1.5, (position.y+d) * 1.5, uTime * 0.4)) * 0.8;
              
              vec3 dx = vec3(d, 0.0, waveHeightX - waveHeight);
              vec3 dy = vec3(0.0, d, waveHeightY - waveHeight);
              objectNormal = normalize(cross(dx, dy));
              `
            );

            // Add the fragment shader fade logic
            shader.fragmentShader = `
              varying vec3 vLocalPos;
              ${shader.fragmentShader}
            `.replace(
              '#include <dithering_fragment>',
              `
              #include <dithering_fragment>
              // The cylinder's local Y axis runs left-to-right across the screen. 
              // We gently fade out the far left and right edges so it doesn't look artificially cut off!
              float edgeAlphaFade = smoothstep(90.0, 45.0, abs(vLocalPos.y));
              gl_FragColor = vec4(gl_FragColor.rgb, gl_FragColor.a * edgeAlphaFade);
              `
            );
          }}
        />
      </mesh>
    </group>
  );
});
