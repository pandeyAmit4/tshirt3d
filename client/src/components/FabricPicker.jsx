import React from 'react'
import { useSnapshot } from 'valtio'
import state from '../store'

const FabricPicker = () => {
  const snap = useSnapshot(state)

  return (
    <div className="absolute left-full ml-3 glassmorphism p-3 rounded-md flex flex-col gap-2">
      <p className="font-bold text-sm text-gray-700">Fabric Texture</p>
      <div className="flex flex-col gap-2">
        {snap.fabrics.map((fabric) => (
          <button
            key={fabric.name}
            className={`px-4 py-2 text-xs rounded-md transition-all ${
              snap.fabricType === fabric.name 
                ? 'bg-black text-white' 
                : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => state.fabricType = fabric.name}
          >
            {fabric.name.charAt(0).toUpperCase() + fabric.name.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FabricPicker
