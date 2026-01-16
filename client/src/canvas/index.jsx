import {Canvas, extend} from '@react-three/fiber'
import {Environment, Center, SoftShadows, OrbitControls} from '@react-three/drei'
import { useSnapshot } from 'valtio';

import state from '../store'
import Shirt from './Shirt'
import Backdrop from './Backdrop'
import CameraRig from './CameraRig'

const CanvasModel = () => {
  const snap = useSnapshot(state);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 2], fov: 25}}
      gl={{preserveDrawingBuffer: true}}
      className='w-full max-w-full h-full transition-all ease-in'
    >
      <ambientLight intensity={0.5}/>
      <Environment files={'/city.hdr'}></Environment>
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[0, 0, -5]} intensity={2} />
      <pointLight position={[0, 0, 5]} intensity={2} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />

      <CameraRig>
        <Backdrop/>
        <Center>
          <Shirt/>
        </Center>
      </CameraRig>
      <OrbitControls 
        enabled={!snap.intro}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        minDistance={1}
        maxDistance={4}
      />
    </Canvas>
  )
}

export default CanvasModel