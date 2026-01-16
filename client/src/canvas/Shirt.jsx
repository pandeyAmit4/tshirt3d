import React from 'react'
import {easing} from 'maath'
import {useSnapshot} from 'valtio'
import { useFrame } from '@react-three/fiber'
import { Decal, useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import state from '../store'

const Shirt = () => {

  const snap = useSnapshot(state)  
  const { nodes, materials } = useGLTF('/shirt_baked.glb')
  
  // Front logo texture
  const logoTexture = useTexture(snap.logoDecal)
  const fullTexture = useTexture(snap.fullDecal)
  
  // Back logo texture
  const backLogoTexture = useTexture(snap.backLogoDecal)
  
  // Shoulder textures
  const leftShoulderTexture = useTexture(snap.leftShoulderDecal)
  const rightShoulderTexture = useTexture(snap.rightShoulderDecal)
  
  // Create dynamic text texture for front
  const textTexture = React.useMemo(() => {
    if (!snap.isTextTexture) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = snap.textColor;
    ctx.font = 'bold 200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(snap.text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [snap.text, snap.textColor, snap.isTextTexture]);

  // Create dynamic text texture for back
  const backTextTexture = React.useMemo(() => {
    if (!snap.isBackTextTexture || !snap.backText) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = snap.backTextColor;
    ctx.font = 'bold 200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(snap.backText, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [snap.backText, snap.backTextColor, snap.isBackTextTexture]);

  // Create dynamic text texture for left shoulder
  const leftShoulderTextTexture = React.useMemo(() => {
    if (!snap.isLeftShoulderText || !snap.leftShoulderText) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = snap.leftShoulderTextColor;
    ctx.font = 'bold 150px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(snap.leftShoulderText, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [snap.leftShoulderText, snap.leftShoulderTextColor, snap.isLeftShoulderText]);

  // Create dynamic text texture for right shoulder
  const rightShoulderTextTexture = React.useMemo(() => {
    if (!snap.isRightShoulderText || !snap.rightShoulderText) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = snap.rightShoulderTextColor;
    ctx.font = 'bold 150px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(snap.rightShoulderText, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [snap.rightShoulderText, snap.rightShoulderTextColor, snap.isRightShoulderText]);
  
  // Load fabric textures
  const cottonNormal = useTexture('/textures/cotton_normal.png')
  const silkNormal = useTexture('/textures/silk_normal.png')
  const denimNormal = useTexture('/textures/denim_normal.png')

  // Configure tiling and color space
  React.useMemo(() => {
    ;[cottonNormal, silkNormal, denimNormal, logoTexture, fullTexture, textTexture].forEach(texture => {
      if (!texture) return;
      if (texture === cottonNormal || texture === silkNormal || texture === denimNormal) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(8, 8)
      }
      // Modern Three.js color space
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    })
  }, [cottonNormal, silkNormal, denimNormal, logoTexture, fullTexture, textTexture])

  const currentFabric = snap.fabrics.find(f => f.name === snap.fabricType)
  
  const normalMap = React.useMemo(() => {
    switch (snap.fabricType) {
      case 'cotton': return cottonNormal;
      case 'silk': return silkNormal;
      case 'denim': return denimNormal;
      default: return null;
    }
  }, [snap.fabricType, cottonNormal, silkNormal, denimNormal])

  // Optimization: Pre-calculate material properties to avoid jitter
  const materialProps = React.useMemo(() => ({
    roughness: currentFabric?.roughness ?? 0.5,
    metalness: snap.fabricType === 'silk' ? 0.2 : 0,
    normalScale: new THREE.Vector2(
      snap.fabricType === 'silk' ? 0.3 : 1.0,
      snap.fabricType === 'silk' ? 0.3 : 1.0
    )
  }), [currentFabric, snap.fabricType]);

  // Use layout effect to handle material property changes reliably
  React.useLayoutEffect(() => {
    // Ensuring the material is Standard for better PBR support
    if (materials.lambert1.type !== 'MeshStandardMaterial') {
      const standard = new THREE.MeshStandardMaterial().copy(materials.lambert1);
      nodes.T_Shirt_male.material = standard;
      materials.lambert1 = standard;
    }
    
    const material = materials.lambert1;
    material.normalMap = normalMap;
    material.roughness = materialProps.roughness;
    material.metalness = materialProps.metalness;
    material.normalScale = materialProps.normalScale;
    
    material.needsUpdate = true;
  }, [normalMap, materialProps, materials.lambert1, nodes.T_Shirt_male])

  // Create a separate normal map for decals to match the shirt's texture scale
  const decalNormalMap = React.useMemo(() => {
    if (!normalMap) return null
    const clone = normalMap.clone()
    // Align normal map grain scale with shirt scale
    // Shirt has 8 repeats globally.
    // So decal normal map should have 8 * scale repeats to match grain size.
    const r = 8 * snap.logoScale
    clone.repeat.set(r, r)
    clone.needsUpdate = true
    return clone
  }, [normalMap, snap.logoScale])

  const textNormalMap = React.useMemo(() => {
    if (!normalMap) return null
    const clone = normalMap.clone()
    const r = 8 * snap.textScale
    clone.repeat.set(r, r)
    clone.needsUpdate = true
    return clone
  }, [normalMap, snap.textScale])

  const fullDecalNormalMap = React.useMemo(() => {
    if (!normalMap) return null
    const clone = normalMap.clone()
    // Full texture has scale 1, so match shirt repeat (8)
    clone.repeat.set(8, 8)
    clone.needsUpdate = true
    return clone
  }, [normalMap])

  // Back logo normal map
  const backLogoNormalMap = React.useMemo(() => {
    if (!normalMap) return null
    const clone = normalMap.clone()
    const r = 8 * snap.backLogoScale
    clone.repeat.set(r, r)
    clone.needsUpdate = true
    return clone
  }, [normalMap, snap.backLogoScale])

  // Back text normal map
  const backTextNormalMap = React.useMemo(() => {
    if (!normalMap) return null
    const clone = normalMap.clone()
    const r = 8 * snap.backTextScale
    clone.repeat.set(r, r)
    clone.needsUpdate = true
    return clone
  }, [normalMap, snap.backTextScale])

  // Shoulder normal map (fixed scale 0.08)
  const shoulderNormalMap = React.useMemo(() => {
    if (!normalMap) return null
    const clone = normalMap.clone()
    const r = 8 * 0.08 // Fixed shoulder scale
    clone.repeat.set(r, r)
    clone.needsUpdate = true
    return clone
  }, [normalMap])

  useFrame((state, delta) => {
    easing.dampC(materials.lambert1.color, snap.color, 0.25, delta)
    
    // Ensure no baked textures are interfering
    materials.lambert1.map = null;
    materials.lambert1.aoMap = null;
  })
  
  const stateString = JSON.stringify(snap)

  const meshRef = React.useRef();

  // Animation loop - only auto-rotate when enabled
  useFrame(() => {
    if (snap.isAutoRotate && meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        material-side={2}
        dispose={null}
      >
        {snap.isFullTexture && (
          <>
            <Decal 
              key={`full-front-${snap.fullDecal}`}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1}
              map={fullTexture}
              normalMap={fullDecalNormalMap}
              normalScale={materials.lambert1.normalScale}
              polygonOffset
              polygonOffsetFactor={-1}
            />
            {/* Back Full Texture */}
            <Decal 
              key={`full-back-${snap.fullDecal}`}
              position={[0, 0, 0]}
              rotation={[0, Math.PI, 0]}
              scale={1}
              map={fullTexture}
              normalMap={fullDecalNormalMap}
              normalScale={materials.lambert1.normalScale}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </>
        )}

        {snap.isLogoTexture && (
          <Decal 
            key={`logo-front-${snap.logoDecal}-${snap.logoScale}`}
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={snap.logoScale}
            map={logoTexture}
            normalMap={decalNormalMap}
            normalScale={materials.lambert1.normalScale}
            mapAnisotropy={8}
            depthTest={true}
            depthWrite={true}
            polygonOffset
            polygonOffsetFactor={-5}
            transparent
          />
        )}

        {snap.isTextTexture && textTexture && (
          <Decal 
            key={`text-front-${snap.text}-${snap.textScale}-${snap.textColor}-${snap.textPositionX}-${snap.textPositionY}`}
            position={[snap.textPositionX, snap.textPositionY, 0.15]}
            rotation={[0, 0, 0]}
            scale={snap.textScale}
            map={textTexture}
            normalMap={textNormalMap}
            normalScale={materials.lambert1.normalScale}
            mapAnisotropy={8}
            depthTest={true}
            depthWrite={true}
            polygonOffset
            polygonOffsetFactor={-10}
            transparent
          />
        )}

        {/* Back Logo */}
        {snap.isBackLogoTexture && (
          <Decal 
            key={`logo-back-${snap.backLogoDecal}-${snap.backLogoScale}`}
            position={[0, 0.04, -0.15]}
            rotation={[0, Math.PI, 0]}
            scale={snap.backLogoScale}
            map={backLogoTexture}
            normalMap={backLogoNormalMap}
            normalScale={materials.lambert1.normalScale}
            mapAnisotropy={8}
            depthTest={true}
            depthWrite={true}
            polygonOffset
            polygonOffsetFactor={-5}
            transparent
          />
        )}

        {/* Back Text */}
        {snap.isBackTextTexture && backTextTexture && (
          <Decal 
            key={`text-back-${snap.backText}-${snap.backTextScale}-${snap.backTextColor}-${snap.backTextPositionX}-${snap.backTextPositionY}`}
            position={[snap.backTextPositionX, snap.backTextPositionY, -0.15]}
            rotation={[0, Math.PI, 0]}
            scale={snap.backTextScale}
            map={backTextTexture}
            normalMap={backTextNormalMap}
            normalScale={materials.lambert1.normalScale}
            mapAnisotropy={8}
            depthTest={true}
            depthWrite={true}
            polygonOffset
            polygonOffsetFactor={-10}
            transparent
          />
        )}

        {/* Left Shoulder Logo */}
        {snap.isLeftShoulderLogo && (
          <Decal 
            key={`logo-left-shoulder-${snap.leftShoulderDecal}`}
            position={[-0.13, 0.14, 0.07]}
            rotation={[0, -0.3, 0]}
            scale={0.08}
            map={leftShoulderTexture}
            normalMap={shoulderNormalMap}
            normalScale={materials.lambert1.normalScale}
            mapAnisotropy={8}
            depthTest={true}
            depthWrite={true}
            polygonOffset
            polygonOffsetFactor={-15}
            transparent
          />
        )}

        {/* Left Shoulder Text */}
        {snap.isLeftShoulderText && leftShoulderTextTexture && (
          <Decal 
            key={`text-left-shoulder-${snap.leftShoulderText}-${snap.leftShoulderTextColor}`}
            position={[-0.13, 0.14, 0.07]}
            rotation={[0, -0.3, 0]}
            scale={0.08}
            map={leftShoulderTextTexture}
            normalMap={shoulderNormalMap}
            normalScale={materials.lambert1.normalScale}
            mapAnisotropy={8}
            depthTest={true}
            depthWrite={true}
            polygonOffset
            polygonOffsetFactor={-15}
            transparent
          />
        )}

        {/* Right Shoulder Logo */}
        {snap.isRightShoulderLogo && (
          <Decal 
            key={`logo-right-shoulder-${snap.rightShoulderDecal}`}
            position={[0.13, 0.14, 0.07]}
            rotation={[0, 0.3, 0]}
            scale={0.08}
            map={rightShoulderTexture}
            normalMap={shoulderNormalMap}
            normalScale={materials.lambert1.normalScale}
            mapAnisotropy={8}
            depthTest={true}
            depthWrite={true}
            polygonOffset
            polygonOffsetFactor={-15}
            transparent
          />
        )}

        {/* Right Shoulder Text */}
        {snap.isRightShoulderText && rightShoulderTextTexture && (
          <Decal 
            key={`text-right-shoulder-${snap.rightShoulderText}-${snap.rightShoulderTextColor}`}
            position={[0.13, 0.14, 0.07]}
            rotation={[0, 0.3, 0]}
            scale={0.08}
            map={rightShoulderTextTexture}
            normalMap={shoulderNormalMap}
            normalScale={materials.lambert1.normalScale}
            mapAnisotropy={8}
            depthTest={true}
            depthWrite={true}
            polygonOffset
            polygonOffsetFactor={-15}
            transparent
          />
        )}

      </mesh>
    </group>
  )
}

export default Shirt