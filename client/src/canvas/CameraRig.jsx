import React, { useRef } from 'react';
import { useFrame} from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';

import state from '../store';

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  useFrame((frameState, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    // set the initial position of the model
    let targetPosition = [-0.4, 0, 2];
    if(snap.intro) {
      if(isBreakpoint) targetPosition = [0, 0, 2];
      if(isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      if(isMobile) targetPosition = [0, 0, 2.5]
      else targetPosition = [0, 0, 2];
    }

    // set model camera position only during intro
    if (snap.intro) {
      easing.damp3(frameState.camera.position, targetPosition, 0.25, delta)
    }

    // Smooth rotation animation when activeRegion changes (only when not auto-rotating)
    if (group.current && !snap.isAutoRotate) {
      easing.damp(group.current.rotation, 'y', snap.targetRotation, 0.25, delta)
    }
  })


  return <group ref={group}>{children}</group>
}

export default CameraRig