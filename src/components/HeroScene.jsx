import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  RoundedBox,
  ContactShadows,
  MeshTransmissionMaterial,
} from "@react-three/drei";

// A stacked "platform" of layered slabs: alternating brushed steel and glass,
// held by four slim posts. It reads as architecture / layered engineering
// (infrastructure, software, operations) and stays compact so it never
// competes with the headline. Motion: a slow sway and scroll-linked tilt;
// the mouse is never tracked.
const LAYERS = 5;
const GAP = 0.34;

const Platform = ({ reduced }) => {
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    const sway = reduced ? 0 : Math.sin(t * 0.25) * 0.28;
    group.current.rotation.y = -0.6 + sway + scroll * 0.7;
    group.current.position.y = (reduced ? 0 : Math.sin(t * 0.6) * 0.04) - scroll * 0.35;
  });

  const steel = { color: "#c3ccd9", metalness: 1, roughness: 0.28, envMapIntensity: 1.1 };
  const top = ((LAYERS - 1) * GAP) / 2;

  return (
    <group ref={group} rotation={[0.1, 0, 0]}>
      {Array.from({ length: LAYERS }, (_, i) => {
        const y = i * GAP - top;
        const w = 2.6 - i * 0.18;
        const d = 1.8 - i * 0.12;
        const glass = i % 2 === 1;
        return (
          <RoundedBox key={i} args={[w, 0.1, d]} radius={0.035} smoothness={4} position={[0, y, 0]}>
            {glass ? (
              <MeshTransmissionMaterial
                samples={4}
                resolution={256}
                thickness={0.35}
                roughness={0.08}
                ior={1.35}
                chromaticAberration={0.02}
                color="#dcebff"
                backside={false}
              />
            ) : (
              <meshStandardMaterial {...steel} />
            )}
          </RoundedBox>
        );
      })}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz]) => (
        <mesh key={`${sx}${sz}`} position={[sx * 0.95, 0, sz * 0.62]}>
          <cylinderGeometry args={[0.018, 0.018, (LAYERS - 1) * GAP, 16]} />
          <meshStandardMaterial color="#e4eaf3" metalness={1} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const HeroScene = ({ reduced }) => (
  <Canvas
    dpr={[1, 1.5]}
    camera={{ position: [3.4, 1.6, 5.6], fov: 30 }}
    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    frameloop={reduced ? "demand" : "always"}
    aria-hidden="true"
    onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
  >
    <ambientLight intensity={0.25} />
    <directionalLight position={[3, 5, 4]} intensity={1.4} />
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={3} position={[0, 5, -3]} scale={[10, 2.5, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={1.6} position={[-5, 1, 2]} scale={[2.5, 6, 1]} color="#8fc3ff" />
      <Lightformer form="rect" intensity={1.2} position={[5, 0, 3]} scale={[2.5, 6, 1]} color="#ffffff" />
    </Environment>
    <Platform reduced={reduced} />
    <ContactShadows position={[0, -1.35, 0]} opacity={0.4} scale={7} blur={2.6} far={2.4} color="#02060f" />
  </Canvas>
);

export default HeroScene;
