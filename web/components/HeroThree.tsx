import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'

function ScooterScene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 7]} intensity={1} />
      {/* Simplified placeholder: a moving cube representing scooter */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.5, 0.6, 0.6]} />
        <meshStandardMaterial color="#0ea5a4" metalness={0.6} roughness={0.2} />
      </mesh>
    </>
  )
}

export default function HeroThree() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/60 to-white/30 glass">
      <Canvas camera={{ position: [0, 2.5, 6], fov: 35 }}>
        <Suspense fallback={<Html>Loading 3D...</Html>}>
          <Environment preset="city" />
          <ScooterScene />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
