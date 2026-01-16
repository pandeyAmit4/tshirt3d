import React from 'react'
import { useSnapshot } from 'valtio'
import state from '../store'
import CustomButton from './CustomButton'
import { ColorPicker } from '.'

const Settings = () => {
  const snap = useSnapshot(state)

  return (
    <div className='settings-container glassmorphism p-3 absolute left-full ml-3 rounded-md w-[250px]'>
      <div className='flex flex-col gap-4'>
        {/* Logo Scaling */}
        <div>
          <p className='text-xs font-semibold mb-1 text-gray-700 uppercase'>Logo Scale: {snap.logoScale.toFixed(2)}</p>
          <input 
            type="range" 
            min="0.05" 
            max="0.5" 
            step="0.01" 
            value={snap.logoScale} 
            onChange={(e) => state.logoScale = parseFloat(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EFBD48]"
          />
        </div>

        {/* Text Settings Toggle */}
        <div className='flex items-center justify-between'>
          <p className='text-xs font-semibold text-gray-700 uppercase'>Show Text</p>
          <button 
            onClick={() => state.isTextTexture = !state.isTextTexture}
            className={`w-10 h-5 rounded-full transition-colors ${snap.isTextTexture ? 'bg-[#EFBD48]' : 'bg-gray-300'} relative`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${snap.isTextTexture ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {snap.isTextTexture && (
          <div className='flex flex-col gap-3 border-t pt-3'>
            <div>
              <p className='text-xs font-semibold mb-1 text-gray-700 uppercase'>Text Content</p>
              <input 
                type="text" 
                value={snap.text} 
                onChange={(e) => state.text = e.target.value}
                className='w-full p-2 text-sm border rounded bg-white/50 focus:outline-none focus:border-[#EFBD48]'
                placeholder='Enter text...'
              />
            </div>

            <div>
              <p className='text-xs font-semibold mb-1 text-gray-700 uppercase'>Text Scale: {snap.textScale.toFixed(2)}</p>
              <input 
                type="range" 
                min="0.05" 
                max="0.5" 
                step="0.01" 
                value={snap.textScale} 
                onChange={(e) => state.textScale = parseFloat(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EFBD48]"
              />
            </div>

            <div>
              <p className='text-xs font-semibold mb-1 text-gray-700 uppercase'>Text Color</p>
              <div className='flex items-center gap-2'>
                <input 
                  type="color" 
                  value={snap.textColor} 
                  onChange={(e) => state.textColor = e.target.value}
                  className='w-8 h-8 rounded border-none p-0 cursor-pointer'
                />
                <span className='text-xs text-gray-500'>{snap.textColor}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
