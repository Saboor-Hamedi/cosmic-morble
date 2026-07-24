import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useTypingGameStore } from './useTypingGameStore.js';
import { useThemeStore } from '../theme/useThemeStore.js';
import * as THREE from 'three';

const FUN_CANDY_COLORS = [
  '#ffed4a', // Sunny Yellow
  '#38bdf8', // Electric Aqua
  '#ff71ce', // Bubblegum Pink
  '#00ff88', // Neon Lime
  '#a78bfa', // Magical Violet
  '#ff9e64', // Bright Orange
  '#ffffff'  // Pure Snow White
];

const FloatingWaterOrbItem = React.memo(function FloatingWaterOrbItem({ balloon: item }) {
  const outerGroupRef = useRef();
  const orbMeshRef = useRef();
  const orbShaderRef = useRef();
  const waveRef1 = useRef();
  const waveRef2 = useRef();
  const letterRef = useRef();
  const bubblesGroupRef = useRef();
  const bubbleRefs = useRef([]);
  const targetArrowRef = useRef();
  
  const { mode, capsLock, activeTargetId } = useTypingGameStore();
  const theme = useThemeStore((s) => s.theme);

  const [hovered, setHovered] = useState(false);

  // Assign a cheerful, playful candy color to each letter to make typing extra fun!
  const letterCandyColor = useMemo(() => {
    return FUN_CANDY_COLORS[item.id % FUN_CANDY_COLORS.length];
  }, [item.id]);

  // Initial offsets for tiny air bubbles rising inside the water
  const internalBubblesData = useMemo(() => {
    return [
      { x: 0.28, y: -0.3, z: 0.15, speed: 0.35, size: 0.055 },
      { x: -0.25, y: -0.1, z: 0.2, speed: 0.42, size: 0.045 },
      { x: 0.12, y: 0.1, z: -0.22, speed: 0.38, size: 0.038 },
      { x: -0.18, y: -0.38, z: -0.15, speed: 0.48, size: 0.042 },
      { x: 0.05, y: -0.25, z: 0.28, speed: 0.31, size: 0.05 }
    ];
  }, []);

  useFrame((state, delta) => {
    if (!outerGroupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Gentle upward floating rising up from the ground/world
    const swayX = Math.sin(t * (item.swaySpeed || 1.4) + (item.swayPhase || 0)) * (item.swayAmount || 0.14);
    const swayZ = Math.cos(t * 1.2 + (item.swayPhase || 0)) * 0.08;

    outerGroupRef.current.position.set(
      item.position[0] + swayX,
      item.position[1],
      item.position[2] + swayZ
    );

    // Smooth spawning scale animation (Pop-in over 500ms)
    let spawnScale = 1.0;
    if (item.spawnTime) {
      const elapsedSinceSpawn = (Date.now() - item.spawnTime) / 1000;
      // Use an elastic/ease-out spring feel for the pop-in (if under 0.5s)
      if (elapsedSinceSpawn < 0.5) {
        const p = elapsedSinceSpawn / 0.5;
        // Simple easeOutQuad
        spawnScale = p * (2 - p);
      }
    }

    // Strictly round scale (`100% equal width and height at all times`, NO oval squishing or eggs!)
    const baseScale = (item.scale || 0.45) * 2.3;
    const hoverScaleBonus = hovered ? 1.08 : 1.0;
    const strictRoundScale = baseScale * hoverScaleBonus * spawnScale;
    outerGroupRef.current.scale.set(strictRoundScale, strictRoundScale, strictRoundScale);

    // Outer water sphere shimmer & custom fluid water ripple shader updates
    if (orbMeshRef.current) {
      orbMeshRef.current.rotation.y = t * 0.2 + item.id;
    }
    if (orbShaderRef.current) {
      orbShaderRef.current.uniforms.uTime.value = t + item.id * 1.5;
    }

    // Internal liquid water waves swaying (`looks like actual water caustics`)
    if (waveRef1.current) {
      waveRef1.current.rotation.x = Math.sin(t * 1.8 + item.id) * 0.2;
      waveRef1.current.position.y = Math.sin(t * 2.4 + item.id) * 0.04;
    }
    if (waveRef2.current) {
      waveRef2.current.rotation.z = Math.cos(t * 1.6 + item.id) * 0.25;
      waveRef2.current.position.y = Math.cos(t * 2.1 + item.id) * 0.03;
    }

    // Fun, playful letter animation (`make them more fun`: happy wiggle + bouncy breathing!)
    if (letterRef.current) {
      letterRef.current.position.y = Math.sin(t * 3.0 + item.id) * 0.035;
      letterRef.current.rotation.z = Math.sin(t * 4.2 + item.id) * 0.13; // happy side-to-side wiggle!
      const letterScale = 1.0 + Math.sin(t * 5.0 + item.id) * 0.065; // bouncy pulsing!
      letterRef.current.scale.set(letterScale, letterScale, letterScale);
    }

    // Animate tiny internal air bubbles physically rising up through the liquid water
    if (bubblesGroupRef.current) {
      bubblesGroupRef.current.rotation.y = t * 0.4;
    }
    bubbleRefs.current.forEach((mesh, idx) => {
      if (mesh) {
        const data = internalBubblesData[idx];
        let newY = mesh.position.y + data.speed * delta;
        if (newY > 0.45) {
          newY = -0.45;
        }
        mesh.position.y = newY;
      }
    });

    // Bounce and spin the focus target arrow
    if (targetArrowRef.current) {
      targetArrowRef.current.position.y = (item.shapeType === 'word_capsule' ? 0.95 : 1.15) + Math.sin(t * 6.0) * 0.08;
      targetArrowRef.current.rotation.y = t * 3.0;
    }
  });

  const displayText = capsLock ? item.text.toUpperCase() : item.text.toLowerCase();
  
  // For letters: strictly equal width and height (`1:1:1 round`). For words: wider, spacious rounded water capsule (`1.35x width`) so words fit beautifully!
  // For letters: strictly equal width and height (`1:1:1 round`). For words: wider, spacious rounded water capsule (`1.35x width`) so words fit beautifully!
  const baseScale = (item.scale || 0.45) * 2.3;
  const uniformScale = item.shapeType === 'word_capsule'
    ? [baseScale * 1.35, baseScale * 0.95, baseScale * 0.95]
    : [baseScale, baseScale, baseScale];

  const orbColor = item.color || theme.bubbleColor || '#38bdf8';

  const renderGeometry = (radius, detail) => {
    switch (item.geometryShape) {
      case 'torus': return <torusGeometry args={[radius * 0.75, radius * 0.35, 32, detail]} />;
      case 'icosahedron': return <icosahedronGeometry args={[radius, 6]} />; // Subdivided enough for ripples
      case 'capsule': return <capsuleGeometry args={[radius * 0.7, radius * 0.8, 32, detail]} />;
      case 'cylinder': return <cylinderGeometry args={[radius * 0.75, radius * 0.75, radius * 1.5, detail]} />;
      case 'sphere':
      default: return <sphereGeometry args={[radius, detail, detail]} />;
    }
  };

  return (
    <group
      ref={outerGroupRef}
      position={item.position}
      scale={uniformScale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      {/* 1. Very faint outer glow halo — barely visible, just a whisper of color */}
      <mesh renderOrder={0} castShadow={false} receiveShadow={false}>
        {renderGeometry(0.76, 32)}
        <meshStandardMaterial
          color={item.isBoss ? '#ff1144' : item.powerUpType === 'rainbow' ? '#cc44cc' : item.powerUpType === 'freeze' ? '#00ccee' : item.powerUpType === 'starburst' ? '#ddaa00' : orbColor}
          emissive={item.isBoss ? '#ff1144' : orbColor}
          emissiveIntensity={item.isBoss ? 0.6 : (item.powerUpType ? 0.35 : (hovered ? 0.22 : 0.08))}
          transparent
          opacity={item.isBoss ? 0.3 : (item.powerUpType ? 0.18 : (hovered ? 0.12 : 0.06))}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Fluid Liquid Water Drop (`onBeforeCompile` custom vertex shader creates organic surface water ripples with NO black shadows, NO external ring) */}
      <mesh ref={orbMeshRef} renderOrder={1} castShadow={false} receiveShadow={false}>
        {renderGeometry(0.72, 64)}
        <meshPhysicalMaterial
          color={orbColor}
          roughness={0.02}
          metalness={0.1}
          transmission={1.0} // Fully transparent glass/liquid
          ior={1.33} // Exact index of refraction for water
          thickness={2.5}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          transparent={true}
          opacity={1.0} // Transmission handles transparency now
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uTime = { value: 0 };
            shader.uniforms.uDistortion = { value: 0.25 };
            orbShaderRef.current = shader;
            shader.vertexShader = `
              uniform float uTime;
              uniform float uDistortion;
              
              // Simplex 3D Noise for organic liquid blob wobble
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

              ${shader.vertexShader}
            `.replace(
              '#include <begin_vertex>',
              `
              #include <begin_vertex>
              // Heavy organic wobble
              float noise1 = snoise(vec3(position.x * 2.5 + uTime * 1.5, position.y * 2.5, position.z * 2.5)) * uDistortion;
              float noise2 = snoise(vec3(position.x * 3.5 - uTime * 2.1, position.y * 3.5 + uTime * 1.1, position.z * 3.5)) * (uDistortion * 0.5);
              transformed += normal * (noise1 + noise2);
              `
            );
          }}
        />
      </mesh>

      {/* 3. Shimmering Internal Water Caustic Waves floating inside the liquid (`no black shadow`) */}
      <group renderOrder={3}>
        <mesh ref={waveRef1} position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow={false} receiveShadow={false}>
          <circleGeometry args={[0.64, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={orbColor}
            emissiveIntensity={0.65}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={waveRef2} position={[0, 0.08, 0]} rotation={[Math.PI / 2 + 0.3, 0.1, 0]} castShadow={false} receiveShadow={false}>
          <circleGeometry args={[0.58, 32]} />
          <meshStandardMaterial
            color="#e0f2fe"
            emissive="#ffffff"
            emissiveIntensity={0.55}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 4. Wet Surface Specular Glint / Gloss Highlight near the top so it glistens like a real water droplet (`no shadow`) */}
      <mesh position={[-0.26, 0.34, 0.5]} renderOrder={4} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} transparent opacity={0.88} depthWrite={false} />
      </mesh>
      <mesh position={[-0.15, 0.44, 0.45]} renderOrder={4} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} transparent opacity={0.82} depthWrite={false} />
      </mesh>

      {/* 5. Live Effervescent Air Bubbles physically bubbling up through the liquid water right inside the sphere (`no shadow`) */}
      <group ref={bubblesGroupRef} renderOrder={5}>
        {internalBubblesData.map((data, idx) => (
          <mesh
            key={idx}
            ref={(el) => { bubbleRefs.current[idx] = el; }}
            position={[data.x, data.y, data.z]}
            castShadow={false}
            receiveShadow={false}
          >
            <sphereGeometry args={[data.size, 16, 16]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.92}
              ior={1.333}
              roughness={0.04}
              transparent
              opacity={0.88}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 5.5 Focus Target Indicator (Bouncing 3D Crystal) for Words Mode */}
      {mode === 'words' && activeTargetId === item.id && !item.isPopped && (
        <group ref={targetArrowRef} position={[0, 1.1, 0]} renderOrder={15}>
          <mesh rotation={[Math.PI, 0, 0]} castShadow={false}>
            <coneGeometry args={[0.15, 0.28, 4]} />
            <meshStandardMaterial 
              color="#ff3366" 
              roughness={0.2} 
              metalness={0.6} 
              emissive="#ff3366" 
              emissiveIntensity={0.6} 
              depthWrite={false} 
            />
          </mesh>
        </group>
      )}

      {/* 6. Fun, Playful Candy/Jewel Letters inside (`outlineColor="#ffffff"` eliminates all black shadows inside the shape!) */}
      <group ref={letterRef} position={[0, 0, 0]} renderOrder={10}>
        {mode === 'letters' ? (
            <Text
              position={[0, 0, 0]}
              fontSize={0.88}
              fontWeight={900}
              color={letterCandyColor}
              outlineWidth={0.026}
              outlineColor="#ffffff"
              outlineOpacity={0.95}
              outlineBlur={0.012}
              anchorX="center"
              anchorY="middle"
              renderOrder={10}
              material-depthTest={false}
            >
              {displayText}
            </Text>
          ) : (
            <group position={[0, 0, 0]}>
              {(() => {
                const len = Math.max(1, displayText.length);
                // Make words slightly smaller so they fit better in the capsule
                const wordFontSize = Math.min(0.72, 2.0 / Math.max(2.2, len));
                const charWidth = wordFontSize * 0.78;
                return displayText.split('').map((char, idx) => {
                  const isTyped = idx < item.typedIndex;
                  const isNext = idx === item.typedIndex;
                  const offsetX = (idx - (len - 1) / 2) * charWidth;
                  const charColor = isTyped ? '#00ff88' : isNext ? '#ffff00' : FUN_CANDY_COLORS[(item.id + idx) % FUN_CANDY_COLORS.length];
                  return (
                    <Text
                      key={idx}
                      position={[offsetX, 0, 0]}
                      fontSize={wordFontSize}
                      fontWeight={900}
                      color={charColor}
                      outlineWidth={Math.max(0.012, wordFontSize * 0.045)}
                      outlineColor="#ffffff"
                      outlineOpacity={0.95}
                      outlineBlur={0.012}
                      anchorX="center"
                      anchorY="middle"
                      renderOrder={10}
                      material-depthTest={false}
                    >
                      {char}
                    </Text>
                  );
                });
              })()}
            </group>
          )}
        </group>
    </group>
  );
});

export const FloatingShips3D = React.memo(function FloatingShips3D() {
  const { balloons: items, spawnBalloon, updateBalloons } = useTypingGameStore();

  useFrame((state, delta) => {
    updateBalloons(delta);
    if (Math.random() < delta * 1.15) {
      spawnBalloon();
    }
  });

  return (
    <group>
      {items.map((item) => (
        <FloatingWaterOrbItem key={item.id} balloon={item} />
      ))}
    </group>
  );
});
