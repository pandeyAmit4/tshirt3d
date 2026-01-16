import React from 'react'
import { useSnapshot } from 'valtio'
import state from '../store'

const regions = [
  { id: 'front', label: 'Front', rotation: 0 },
  { id: 'back', label: 'Back', rotation: Math.PI },
  { id: 'leftShoulder', label: 'L Shoulder', rotation: Math.PI / 2 },  // 90° to show left side
  { id: 'rightShoulder', label: 'R Shoulder', rotation: -Math.PI / 2 }, // -90° to show right side
]

const RegionSelector = () => {
  const snap = useSnapshot(state)

  const handleRegionChange = (regionId, rotation) => {
    state.activeRegion = regionId
    state.targetRotation = rotation
    // Disable auto-rotate when manually selecting region
    state.isAutoRotate = false
  }

  return (
    <div className='flex flex-wrap gap-1 mb-3 pb-3 border-b border-gray-200'>
      {regions.map((region) => (
        <button
          key={region.id}
          onClick={() => handleRegionChange(region.id, region.rotation)}
          className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${
            snap.activeRegion === region.id
              ? 'bg-[#EFBD48] text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {region.label}
        </button>
      ))}
    </div>
  )
}

export default RegionSelector
