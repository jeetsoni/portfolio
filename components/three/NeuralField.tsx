"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

/**
 * A field of particles with a cinematic entrance: a scattered cloud converges
 * to spell "JEET", holds a beat, then releases into the living neural field
 * that morphs between three formations as the user scrolls the hero.
 * Everything runs in one custom shader; mouse bends the field.
 */

const COUNT_DESKTOP = 6000;
const COUNT_MOBILE = 3200;

const vertex = /* glsl */ `
  attribute vec3 aPosB;
  attribute vec3 aPosC;
  attribute vec3 aPosText;
  attribute vec3 aPosScatter;
  attribute float aRand;

  uniform float uTime;
  uniform float uMorph;      // 0..2 scroll-driven
  uniform float uIntro;      // 0 scatter -> 1 text
  uniform float uRelease;    // 0 intro shape -> 1 scroll-driven field
  uniform vec3 uMouse;       // world-space on z=0 plane
  uniform float uPixelRatio;

  varying float vGlow;
  varying float vRand;

  void main() {
    // scroll-driven field
    vec3 base = mix(position, aPosB, smoothstep(0.0, 1.0, uMorph));
    base = mix(base, aPosC, smoothstep(1.0, 2.0, uMorph));

    // entrance: scatter -> JEET -> field
    vec3 intro = mix(aPosScatter, aPosText, uIntro);
    vec3 p = mix(intro, base, uRelease);

    // organic breathing (calmer while the name holds so letters stay crisp)
    float wob = mix(0.25, 1.0, uRelease) * 0.06;
    p.x += sin(uTime * 0.55 + aRand * 21.0) * wob;
    p.y += cos(uTime * 0.48 + aRand * 33.0) * wob;
    p.z += sin(uTime * 0.62 + aRand * 13.0) * wob;

    // mouse repulsion
    vec2 d = p.xy - uMouse.xy;
    float dist = length(d);
    float force = smoothstep(1.6, 0.0, dist) * uRelease;
    p.xy += normalize(d + 0.0001) * force * 0.55;
    vGlow = force;
    vRand = aRand;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.2 + aRand * 2.6) * uPixelRatio * (6.8 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vGlow;
  varying float vRand;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;
    float alpha = smoothstep(0.5, 0.08, r);

    // a sparse minority of particles carry the signal color; mouse ignites more
    float signal = step(0.86, vRand) + vGlow;
    vec3 color = mix(uColorA, uColorB, clamp(signal, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha * (0.55 + 0.45 * clamp(signal, 0.0, 1.0)));
  }
`;

function sampleText(count: number, maxWorldWidth: number) {
  const pts = new Float32Array(count * 3);
  const W = 1000;
  const H = 300;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#fff";
  ctx.font = "900 235px Archivo, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("JEET", W / 2, H / 2 + 10);

  const data = ctx.getImageData(0, 0, W, H).data;
  const candidates: number[] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 128) candidates.push(x, y);
    }
  }
  if (candidates.length < 100) return null;

  const spreadX = Math.min(maxWorldWidth, 8);
  const n = candidates.length / 2;
  for (let i = 0; i < count; i++) {
    const c = Math.floor(Math.random() * n) * 2;
    const px = candidates[c] + (Math.random() - 0.5) * 2;
    const py = candidates[c + 1] + (Math.random() - 0.5) * 2;
    pts[i * 3] = (px / W - 0.5) * spreadX;
    pts[i * 3 + 1] = (0.5 - py / H) * ((spreadX * H) / W) + 0.45;
    pts[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }
  return pts;
}

function buildFormations(count: number) {
  const posA = new Float32Array(count * 3); // neural sphere
  const posB = new Float32Array(count * 3); // torus knot circuit
  const posC = new Float32Array(count * 3); // data plane wave
  const scatter = new Float32Array(count * 3); // far random cloud
  const rand = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    rand[i] = Math.random();

    // A — fibonacci sphere with radial jitter (a "brain" of nodes)
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const rA = 2.15 + (Math.random() - 0.5) * 0.65;
    posA[i * 3] = rA * Math.sin(phi) * Math.cos(theta);
    posA[i * 3 + 1] = rA * Math.sin(phi) * Math.sin(theta);
    posA[i * 3 + 2] = rA * Math.cos(phi);

    // B — torus knot (p=2, q=3), like a routed circuit
    const t = (i / count) * Math.PI * 2;
    const p = 2, q = 3;
    const rKnot = Math.cos(q * t) + 2.0;
    const jitter = () => (Math.random() - 0.5) * 0.34;
    posB[i * 3] = rKnot * Math.cos(p * t) * 0.85 + jitter();
    posB[i * 3 + 1] = rKnot * Math.sin(p * t) * 0.85 + jitter();
    posB[i * 3 + 2] = Math.sin(q * t) * 0.85 + jitter();

    // C — wide data plane with standing waves
    const gx = (Math.random() - 0.5) * 9.0;
    const gz = (Math.random() - 0.5) * 5.0;
    posC[i * 3] = gx;
    posC[i * 3 + 1] = Math.sin(gx * 1.4) * Math.cos(gz * 1.7) * 0.55 - 0.4;
    posC[i * 3 + 2] = gz;

    // scatter — a distant chaotic shell the intro collapses from
    const sr = 7 + Math.random() * 7;
    const sphi = Math.acos(2 * Math.random() - 1);
    const stheta = Math.random() * Math.PI * 2;
    scatter[i * 3] = sr * Math.sin(sphi) * Math.cos(stheta);
    scatter[i * 3 + 1] = sr * Math.sin(sphi) * Math.sin(stheta);
    scatter[i * 3 + 2] = sr * Math.cos(sphi) * 0.5;
  }

  return { posA, posB, posC, scatter, rand };
}

function Field({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const points = useRef<THREE.Points>(null);
  const { viewport, size } = useThree();
  const isMobile = size.width < 768;
  const count = isMobile ? COUNT_MOBILE : COUNT_DESKTOP;

  const { posA, posB, posC, scatter, rand } = useMemo(
    () => buildFormations(count),
    [count]
  );

  // text formation sized to the visible frustum; falls back to the sphere
  const posText = useMemo(
    () => sampleText(count, viewport.width * 0.85) ?? posA,
    [count, viewport.width, posA]
  );

  // Build the material imperatively: R3F rebuilds the `uniforms` prop object
  // on JSX materials, which disconnects it from the object we animate.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uIntro: { value: 0 },
          uRelease: { value: 0 },
          uMouse: { value: new THREE.Vector3(100, 100, 0) },
          uPixelRatio: {
            value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2),
          },
          uColorA: { value: new THREE.Color("#b3aa99") },
          uColorB: { value: new THREE.Color("#ff4d00") },
        },
      }),
    []
  );
  const uniforms = material.uniforms;

  // entrance timeline: scatter -> JEET -> release into the field
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      uniforms.uIntro.value = 1;
      uniforms.uRelease.value = 1;
      return;
    }
    const tl = gsap.timeline({ delay: 1.2 }); // after the preloader lifts
    tl.to(uniforms.uIntro, { value: 1, duration: 1.2, ease: "power3.inOut" })
      .to(uniforms.uRelease, { value: 1, duration: 1.6, ease: "power2.inOut" }, "+=0.8");
    return () => {
      tl.kill();
    };
  }, [uniforms]);

  const mouse = useRef(new THREE.Vector3(100, 100, 0));

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uMorph.value += (scrollRef.current * 2 - uniforms.uMorph.value) * 0.06;

    // pointer in world coords on the z=0 plane
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;
    mouse.current.set(x, y, 0);
    uniforms.uMouse.value.lerp(mouse.current, 0.08);

    if (points.current) {
      // hold still while the name is forming, then drift
      const rel = uniforms.uRelease.value;
      points.current.rotation.y += delta * 0.05 * rel;
      points.current.rotation.x = state.pointer.y * 0.08 * rel;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posA, 3]} />
        <bufferAttribute attach="attributes-aPosB" args={[posB, 3]} />
        <bufferAttribute attach="attributes-aPosC" args={[posC, 3]} />
        <bufferAttribute attach="attributes-aPosText" args={[posText, 3]} />
        <bufferAttribute attach="attributes-aPosScatter" args={[scatter, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[rand, 1]} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}

export default function NeuralField({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Field scrollRef={scrollRef} />
    </Canvas>
  );
}
