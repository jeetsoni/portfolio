"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { stages } from "./story";

/**
 * The hero: an agent's request path as eight glass machines, each with a
 * glowing core that brightens when a request passes through it.
 *
 * On load the machines rise out of the floor in turn. Scroll sets `focus`
 * (-1 overview, 0..7 a stage) and the camera glides from machine to
 * machine. DOM callouts are pinned to each stage from here, and `onStage`
 * reports each stage the lead request reaches (for the trace log).
 */

export const PALETTE = {
  bg: "#07111c",
  floor: "#020710",
  glass: "#ffffff",
  tint: "#8fb8ff",
  rod: "#2a4a6b",
  accent: "#ffb21a",
  ok: "#4fe3b0",
};

const N = stages.length;
const GAP = 2.9;
const NODE = stages.map((_, i) => new THREE.Vector3(Math.sin(i * 1.15) * 1.8, 0, -i * GAP));
const FLOOR = -1.05;
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));
const back = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 + 2.6 * Math.pow(x - 1, 3) + 1.6 * Math.pow(x - 1, 2));

const glowTexture = (() => {
  let tex: THREE.Texture | null = null;
  return () => {
    if (tex) return tex;
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.22, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    tex = new THREE.CanvasTexture(c);
    return tex;
  };
})();

/** A cylinder spanning a → b. */
function Rod({ a, b, r = 0.022, material }: { a: THREE.Vector3; b: THREE.Vector3; r?: number; material: THREE.Material }) {
  const { pos, quat, len } = useMemo(() => {
    const d = b.clone().sub(a);
    return { pos: a.clone().add(b).multiplyScalar(0.5), quat: new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.clone().normalize()), len: d.length() };
  }, [a, b]);
  return (
    <mesh position={pos} quaternion={quat} material={material}>
      <cylinderGeometry args={[r, r, len, 10]} />
    </mesh>
  );
}

const PLAN_KIDS = [-0.62, 0, 0.62].map((dz) => V(0, 0.05, dz));
const PLAN_LEAVES = PLAN_KIDS.flatMap((k) => [-0.18, 0.18].map((dz) => V(0, -0.55, k.z + dz)));
const TOOL_SERVERS = [0, 1, 2, 3].map((k) => {
  const a = (k / 4) * Math.PI * 2 + 0.4;
  return V(Math.cos(a) * 1.1, -0.2 + (k % 2) * 0.4, Math.sin(a) * 1.1);
});

type Props = {
  focus: React.RefObject<number>;
  labels: React.RefObject<(HTMLDivElement | null)[]>;
  onStage?: (i: number) => void;
};

function Scene({ focus, labels, onStage }: Props) {
  const { size, camera, scene, gl } = useThree();
  const portrait = size.width / size.height < 0.9;
  const mobile = size.width < 700;
  // matches the CSS breakpoint where the stage caption moves to the side
  const stacked = size.width < 1100;

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 1.15;
    // glass refraction renders the scene twice; half resolution on phones
    gl.transmissionResolutionScale = mobile ? 0.5 : 1;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, mobile]);
  useEffect(() => {
    scene.fog = new THREE.Fog(PALETTE.bg, 9, portrait ? 30 : 28);
  }, [scene, portrait]);

  // ---- materials ----
  const mats = useMemo(() => {
    const glass = new THREE.MeshPhysicalMaterial({
      color: PALETTE.glass,
      roughness: 0.14,
      transmission: 1,
      thickness: 0.7,
      ior: 1.5,
      attenuationColor: new THREE.Color(PALETTE.tint),
      attenuationDistance: 1.4,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      iridescence: 0.25,
      iridescenceIOR: 1.25,
      specularIntensity: 1,
    });
    const frost = glass.clone();
    frost.roughness = 0.38;
    const rod = new THREE.MeshStandardMaterial({ color: PALETTE.rod, roughness: 0.35, metalness: 0.6 });
    // Lambert ignores scene.environment, which otherwise lays a grey
    // grazing-angle sheen across the whole floor
    // not tone-mapped, so its fogged far edge equals the (untouched)
    // background colour exactly and the horizon has no seam
    const floor = new THREE.MeshLambertMaterial({ color: PALETTE.floor, toneMapped: false });
    const plinth = new THREE.MeshStandardMaterial({ color: "#0e2033", roughness: 0.3, metalness: 0.4 });
    const glow = new THREE.MeshStandardMaterial({ color: PALETTE.accent, emissive: PALETTE.accent, emissiveIntensity: 2, roughness: 0.4, toneMapped: false });
    // one core per stage so each can flare on its own
    const cores = stages.map(() => new THREE.MeshStandardMaterial({ color: PALETTE.accent, emissive: PALETTE.accent, emissiveIntensity: 0.5, roughness: 0.3, toneMapped: false }));
    return { glass, frost, rod, floor, plinth, glow, cores };
  }, []);
  useEffect(() => () => Object.values(mats).flat().forEach((m) => (m as THREE.Material).dispose()), [mats]);

  // ---- geometry ----
  const path = useMemo(() => new THREE.CatmullRomCurve3([V(NODE[0].x - 0.3, 0, 2.6), ...NODE, V(NODE[N - 1].x, 0, -N * GAP - 2)], false, "centripetal"), []);
  const nodeT = useMemo(
    () =>
      NODE.map((p) => {
        let best = 0, bestD = Infinity;
        for (let s = 0; s <= 800; s++) {
          const d = path.getPoint(s / 800).distanceToSquared(p);
          if (d < bestD) { bestD = d; best = s / 800; }
        }
        return best;
      }),
    [path]
  );
  const tube = useMemo(() => new THREE.TubeGeometry(path, 500, 0.03, 10, false), [path]);
  const cables = useMemo(() => TOOL_SERVERS.map((s) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(0, -0.1, 0), V(s.x * 0.5, -0.65, s.z * 0.5), s]), 40, 0.018, 8)), []);
  const cloud = useMemo(() => {
    let seed = 9;
    const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    return Array.from({ length: mobile ? 50 : 80 }, () => {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = Math.cbrt(r()) * 0.75;
      return V(Math.sqrt(1 - u * u) * Math.cos(th) * rad, 1.3 + u * rad * 0.55, Math.sqrt(1 - u * u) * Math.sin(th) * rad);
    });
  }, [mobile]);
  const geo = useMemo(() => {
    const rb = (w: number, h: number, d: number, r = 0.06) => new RoundedBoxGeometry(w, h, d, 5, r);
    return {
      bubble: rb(0.28, 0.64, 1.05, 0.13),
      slab: rb(0.92, 0.07, 0.66, 0.03),
      server: rb(0.3, 0.38, 0.3, 0.06),
      pillar: rb(0.15, 1.5, 0.15, 0.06),
      screen: rb(0.12, 0.82, 1.28, 0.05),
      base: rb(0.45, 0.07, 0.55, 0.03),
      gaugeBase: rb(0.3, 0.5, 1.4, 0.08),
      leaf: rb(0.16, 0.16, 0.16, 0.04),
    };
  }, []);
  const glowTex = useMemo(() => glowTexture(), []);
  const backdrop = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = PALETTE.bg;
    g.fillRect(0, 0, 512, 256);
    const glow = (x: number, y: number, r: number, color: string) => {
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, color);
      grad.addColorStop(1, "rgba(7,17,28,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 512, 256);
    };
    // glows sit high so the floor meets plain background colour
    glow(300, 60, 170, "rgba(36,92,180,0.5)");
    glow(160, 95, 120, "rgba(255,178,26,0.1)");
    const fade = g.createLinearGradient(0, 120, 0, 256);
    fade.addColorStop(0, "rgba(7,17,28,0)");
    fade.addColorStop(1, "rgba(7,17,28,1)");
    g.fillStyle = fade;
    g.fillRect(0, 0, 512, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: tex, fog: false, depthWrite: false, toneMapped: false });
  }, []);
  useEffect(() => () => backdrop.dispose(), [backdrop]);

  // ---- refs ----
  const groups = useRef<THREE.Group[]>([]);
  const heat = useRef<number[]>(stages.map(() => 0));
  const packets = useRef<THREE.Group[]>([]);
  const PACKETS = 4;
  const prog = useRef<number[]>(Array.from({ length: PACKETS }, (_, k) => -0.22 - k * 0.24));
  const slabs = useRef<THREE.Mesh[]>([]);
  const cloudRef = useRef<THREE.InstancedMesh>(null);
  const hub = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const needle = useRef<THREE.Group>(null);
  const needleTarget = useRef(0.9);
  const lines = useRef<THREE.Mesh[]>([]);
  const typed = useRef(0);
  const dots = useRef<THREE.Mesh[]>([]);
  const halos = useRef<THREE.Sprite[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const born = useRef<number | null>(null);
  const reduced = useRef(false);
  const camPos = useRef(V(-7, 9, 6));
  const camLook = useRef(V(0, 0, -9));
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const cOk = useMemo(() => new THREE.Color(PALETTE.ok), []);
  const cAccent = useMemo(() => new THREE.Color(PALETTE.accent), []);
  const tA = useMemo(() => V(0, 0, 0), []);
  const tB = useMemo(() => V(0, 0, 0), []);
  const tC = useMemo(() => V(0, 0, 0), []);
  const tD = useMemo(() => V(0, 0, 0), []);
  const tE = useMemo(() => V(0, 0, 0), []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // ---- camera framings ----
  const overview = useMemo(
    () => (portrait ? { pos: V(-4.6, 5.4, 3.4), look: V(0.4, -2.2, -7.5) } : { pos: V(-10.4, 4.6, 1.6), look: V(0.6, -1.1, -9.8) }),
    [portrait]
  );
  // side-on from -x so neighbours fall left/right of the subject instead
  // of between it and the lens; looking past the node toward +z moves it
  // left of centre (caption on the right), straight on centres it
  const framing = (i: number, p: THREE.Vector3, l: THREE.Vector3) => {
    const n = NODE[i];
    if (stacked) {
      p.set(n.x - (portrait ? 6.6 : 5.2), n.y + (portrait ? 2.7 : 2.2), n.z + 0.9);
      l.set(n.x, n.y - (portrait ? 1.25 : 0.8), n.z + 0.1);
    } else {
      p.set(n.x - 5.6, n.y + 1.6, n.z + 0.3);
      l.set(n.x, n.y + 0.05, n.z + 1.9);
    }
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    if (born.current === null) born.current = t;
    const still = reduced.current;
    const age = still ? 99 : t - born.current;
    const f = focus.current ?? -1;

    // ---- camera: settle into the overview, then fly stage to stage ----
    const settle = ease(age / 2.6);
    tC.copy(overview.pos).add(tA.set(0, (1 - settle) * 3, (1 - settle) * 2.5));
    tD.copy(overview.look);
    if (f > -1) {
      if (f < 0) {
        framing(0, tA, tB);
        const k = THREE.MathUtils.smoothstep(f + 1, 0, 1);
        tC.lerp(tA, k);
        tD.lerp(tB, k);
      } else {
        const i = Math.min(Math.floor(f), N - 1);
        const j = Math.min(i + 1, N - 1);
        const k = THREE.MathUtils.smoothstep(f - i, 0.15, 0.85);
        framing(i, tA, tB);
        framing(j, tC, tD);
        tA.lerp(tC, k);
        tB.lerp(tD, k);
        tC.copy(tA);
        tD.copy(tB);
      }
    }
    if (!still) {
      tC.z += Math.sin(t * 0.12) * 0.4 + pointer.current.x * 0.45;
      tC.y += -pointer.current.y * 0.3;
    }
    const follow = 1 - Math.pow(0.002, dt);
    camPos.current.lerp(tC, follow);
    camLook.current.lerp(tD, follow);
    camera.position.copy(camPos.current);
    camera.lookAt(camLook.current);

    const active = f > -0.5 ? Math.round(Math.max(0, f)) : -1;

    // ---- assembly: each machine rises out of the floor in turn ----
    groups.current.forEach((g, i) => {
      if (!g) return;
      const x = (age - 0.25 - i * 0.14) / 0.9;
      g.scale.setScalar(Math.max(0.0001, back(x)));
      g.position.y = NODE[i].y - (1 - ease(x)) * 0.8;
    });

    // ---- requests ----
    const flowing = age > 1.9;
    for (let p = 0; p < PACKETS; p++) {
      const before = prog.current[p];
      let after = before + (still || !flowing ? 0 : dt * 0.05);
      if (after > 1) after = -0.04;
      prog.current[p] = after;
      nodeT.forEach((nt, i) => {
        if (before < nt && after >= nt) {
          heat.current[i] = 1;
          if (p === 0) onStage?.(i);
          if (i === 6) needleTarget.current = 0.82 + Math.random() * 0.16;
          if (i === 7) typed.current = 0;
        }
      });
      const g = packets.current[p];
      if (g) {
        g.visible = after > 0 && after < 1;
        if (g.visible) g.position.copy(path.getPoint(after));
      }
    }

    // ---- cores flare as a request passes; the stage in focus stays warm ----
    const near = (i: number) => Math.max(heat.current[i], i === active ? 0.7 : 0);
    for (let i = 0; i < N; i++) {
      heat.current[i] = Math.max(0, heat.current[i] - dt * 0.8);
      const n = near(i);
      const core = mats.cores[i];
      core.emissiveIntensity = 0.6 + n * 3.2;
      core.emissive.copy(i === 5 && heat.current[i] > 0.2 ? cOk : cAccent);
      core.color.copy(core.emissive);
      const halo = halos.current[i];
      if (halo) {
        halo.material.opacity = 0.12 + n * 0.5;
        halo.material.color.copy(core.emissive);
        halo.scale.setScalar(1.8 + n * 1.2);
      }
    }
    const h = heat.current;

    dots.current.forEach((d, k) => {
      if (d) d.position.y = 0.15 + Math.max(0, Math.sin(t * 6 - k * 0.8)) * 0.07;
    });
    slabs.current.forEach((s, k) => {
      if (s) s.position.y = -0.42 + k * (0.15 - h[1] * 0.06);
    });
    if (cloudRef.current) {
      const rot = still ? 0 : t * 0.25;
      const c = Math.cos(rot), s = Math.sin(rot);
      cloud.forEach((p, k) => {
        tmp.position.set(p.x * c - p.z * s, p.y, p.x * s + p.z * c);
        tmp.scale.setScalar(1);
        tmp.updateMatrix();
        cloudRef.current!.setMatrixAt(k, tmp.matrix);
      });
      cloudRef.current.instanceMatrix.needsUpdate = true;
    }
    if (hub.current && !still) hub.current.rotation.y += dt * (0.15 + h[4] * 0.8);
    if (ring.current && !still) ring.current.rotation.x += dt * (0.3 + h[5] * 2);
    if (needle.current) {
      // high scores swing right (toward +z, screen-right from this side)
      const target = Math.PI / 2 - (1 - needleTarget.current) * Math.PI;
      needle.current.rotation.x += (target - needle.current.rotation.x) * (1 - Math.pow(0.02, dt));
    }
    typed.current = Math.min(1, typed.current + dt * 0.5);
    lines.current.forEach((m, k) => {
      if (m) m.scale.z = Math.max(0.001, Math.min(1, typed.current * 6 - k));
    });

    // ---- callouts pinned above each machine ----
    const els = labels.current;
    if (els) {
      for (let i = 0; i < N; i++) {
        const el = els[i];
        if (!el) continue;
        tE.copy(NODE[i]);
        tE.y += i === 2 ? 2.1 : 1.05;
        tE.project(camera);
        const inView = tE.z < 1 && Math.abs(tE.x) < 1.05 && Math.abs(tE.y) < 1.05;
        const dist = camera.position.distanceTo(NODE[i]);
        const shown = ease((age - 1.2 - i * 0.14) / 0.6);
        el.style.opacity = (inView ? Math.max(0, Math.min(1, (21 - dist) / 7)) * shown : 0).toFixed(3);
        // keep the whole pill on screen: it is centred on x, so clamp by half its width
        const half = el.offsetWidth / 2 + 10;
        const x = Math.min(size.width - half, Math.max(half, ((tE.x + 1) / 2) * size.width));
        // and never tuck it under the fixed nav (the pill hangs above y)
        const y = Math.max(60 + 10 + el.offsetHeight, ((1 - tE.y) / 2) * size.height);
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        el.dataset.hot = near(i) > 0.3 ? "1" : "0";
      }
    }
  });

  const core = (i: number, pos: [number, number, number], r = 0.12) => (
    <mesh position={pos} material={mats.cores[i]}>
      <sphereGeometry args={[r, 24, 24]} />
    </mesh>
  );

  const stage = (i: number, children: React.ReactNode, haloY = 0.1) => (
    <group key={i} ref={(g) => { if (g) groups.current[i] = g; }} position={NODE[i]} scale={0.0001}>
      {children}
      <sprite ref={(s) => { if (s) halos.current[i] = s; }} position={[0, haloY, 0]} scale={2}>
        <spriteMaterial map={glowTex} color={PALETTE.accent} transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh position={[0, FLOOR + 0.03, 0]} material={mats.plinth} receiveShadow>
        <cylinderGeometry args={[0.95, 1, 0.06, 64]} />
      </mesh>
      <mesh position={[0, FLOOR + 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.cores[i]}>
        <ringGeometry args={[0.9, 0.92, 64]} />
      </mesh>
    </group>
  );

  return (
    <>
      <hemisphereLight args={["#bcd3ff", "#07111c", 0.5]} />
      <directionalLight
        position={[-6, 9, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[mobile ? 1024 : 2048, mobile ? 1024 : 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
      />

      {/* far backdrop: soft colour for the glass to refract. It stands
          beyond the fog's far plane, so the floor has already faded into
          the background colour where they meet and there is no seam. */}
      <mesh position={[4, 14, -46]} material={backdrop}>
        <planeGeometry args={[140, 60]} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR, -9]} material={mats.floor} receiveShadow>
        <planeGeometry args={[120, 120]} />
      </mesh>
      <mesh geometry={tube} material={mats.rod} castShadow />

      {stage(0, (
        <>
          <mesh geometry={geo.bubble} material={mats.glass} position={[0, 0.15, 0]} castShadow />
          <mesh material={mats.glass} position={[0, -0.25, -0.33]} rotation={[0.6, 0, 0]}>
            <coneGeometry args={[0.13, 0.28, 32]} />
          </mesh>
          {[-0.24, 0, 0.24].map((z, k) => (
            <mesh key={k} ref={(m) => { if (m) dots.current[k] = m; }} material={mats.cores[0]} position={[0, 0.15, z]}>
              <sphereGeometry args={[0.065, 20, 20]} />
            </mesh>
          ))}
        </>
      ), 0.15)}

      {stage(1, (
        <>
          {Array.from({ length: 6 }, (_, k) => (
            <mesh key={k} ref={(m) => { if (m) slabs.current[k] = m; }} geometry={geo.slab} material={k === 5 ? mats.frost : mats.glass} position={[0, -0.42 + k * 0.15, (k % 2) * 0.05]} castShadow />
          ))}
          {core(1, [0, -0.05, 0], 0.1)}
        </>
      ))}

      {stage(2, (
        <>
          {[-0.55, -0.27, 0.01].map((y, k) => (
            <mesh key={k} material={mats.glass} position={[0, y, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.5, 0.22, 64]} />
            </mesh>
          ))}
          {core(2, [0, -0.27, 0], 0.16)}
          <Rod a={V(0, 0.12, 0)} b={V(0, 0.8, 0)} r={0.018} material={mats.rod} />
          <instancedMesh ref={cloudRef} args={[undefined, undefined, cloud.length]}>
            <sphereGeometry args={[0.042, 12, 12]} />
            <meshStandardMaterial color="#cfe3ff" emissive="#6f9cff" emissiveIntensity={0.6} roughness={0.3} />
          </instancedMesh>
        </>
      ), -0.27)}

      {stage(3, (
        <>
          {core(3, [0, 0.62, 0], 0.13)}
          {PLAN_KIDS.map((k, j) => (
            <group key={j}>
              <Rod a={V(0, 0.62, 0)} b={k} material={mats.rod} />
              <mesh material={mats.glass} position={k} castShadow>
                <sphereGeometry args={[0.12, 32, 32]} />
              </mesh>
            </group>
          ))}
          {PLAN_LEAVES.map((l, j) => (
            <group key={j}>
              <Rod a={PLAN_KIDS[Math.floor(j / 2)]} b={l} r={0.016} material={mats.rod} />
              <mesh geometry={geo.leaf} material={mats.glass} position={l} castShadow />
            </group>
          ))}
        </>
      ), 0.3)}

      {stage(4, (
        <group ref={hub}>
          <mesh material={mats.glass} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.36, 6]} />
          </mesh>
          {core(4, [0, 0, 0], 0.13)}
          {TOOL_SERVERS.map((s, k) => (
            <group key={k}>
              <mesh geometry={geo.server} material={mats.glass} position={s} castShadow />
              <mesh position={s} material={mats.cores[4]}>
                <boxGeometry args={[0.08, 0.08, 0.08]} />
              </mesh>
              <mesh geometry={cables[k]} material={mats.rod} />
            </group>
          ))}
        </group>
      ))}

      {stage(5, (
        <>
          <mesh geometry={geo.pillar} material={mats.glass} position={[0, -0.05, -0.7]} castShadow />
          <mesh geometry={geo.pillar} material={mats.glass} position={[0, -0.05, 0.7]} castShadow />
          <mesh ref={ring} material={mats.glass} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.5, 0.08, 32, 96]} />
          </mesh>
          <mesh material={mats.cores[5]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.5, 0.022, 12, 96]} />
          </mesh>
        </>
      ))}

      {stage(6, (
        <>
          <mesh geometry={geo.gaugeBase} material={mats.glass} position={[0, -0.55, 0]} castShadow />
          <mesh material={mats.glass} position={[0, -0.3, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.62, 0.07, 24, 96, Math.PI]} />
          </mesh>
          <group ref={needle} position={[-0.02, -0.3, 0]}>
            <mesh material={mats.cores[6]} position={[0, 0.26, 0]}>
              <boxGeometry args={[0.035, 0.52, 0.035]} />
            </mesh>
          </group>
          {core(6, [-0.02, -0.3, 0], 0.07)}
        </>
      ), -0.1)}

      {stage(7, (
        <>
          <mesh geometry={geo.screen} material={mats.glass} position={[0, 0.2, 0]} castShadow />
          {[0.44, 0.32, 0.2, 0.08, -0.04].map((y, k) => {
            // left-aligned inside the 1.28-wide screen
            const len = [0.9, 0.7, 0.85, 0.55, 0.75][k];
            return (
              <mesh key={k} ref={(m) => { if (m) lines.current[k] = m; }} material={mats.cores[7]} position={[0, y, -0.5 + len / 2]}>
                <boxGeometry args={[0.02, 0.045, len]} />
              </mesh>
            );
          })}
          <Rod a={V(0, -0.21, 0)} b={V(0, -0.62, 0)} r={0.035} material={mats.rod} />
          <mesh geometry={geo.base} material={mats.glass} position={[0, -0.64, 0]} castShadow />
        </>
      ), 0.2)}

      {Array.from({ length: PACKETS }, (_, p) => (
        <group key={p} ref={(g) => { if (g) packets.current[p] = g; }} visible={false}>
          <mesh material={mats.glow}>
            <sphereGeometry args={[0.08, 24, 24]} />
          </mesh>
          <sprite scale={0.8}>
            <spriteMaterial map={glowTex} color={PALETTE.accent} transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
          <pointLight color={PALETTE.accent} intensity={2} distance={1.8} />
        </group>
      ))}
    </>
  );
}

export default function GlassScene({ focus, onStage }: Omit<Props, "labels">) {
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <div className="g-canvas" aria-hidden="true">
      <Canvas
        shadows="soft"
        camera={{ position: [-7, 9, 6], fov: 40, near: 0.1, far: 90 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        style={{ position: "absolute", inset: 0 }}
      >
        <color attach="background" args={[PALETTE.bg]} />
        <Scene focus={focus} labels={labels} onStage={onStage} />
      </Canvas>
      {stages.map((s, i) => (
        <div key={s.id} ref={(el) => { labels.current[i] = el; }} className="g-callout" style={{ opacity: 0 }}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          {s.part}
        </div>
      ))}
    </div>
  );
}
