import React from 'react'
import { useSnapshot } from 'valtio'
import RegionSelector from './RegionSelector'
import state from '../store'

const TextPicker = () => {
  const snap = useSnapshot(state)
  const isShoulder = snap.activeRegion === 'leftShoulder' || snap.activeRegion === 'rightShoulder'

  // Get text value for active region
  const getText = () => {
    switch (snap.activeRegion) {
      case 'front': return snap.text;
      case 'back': return snap.backText;
      case 'leftShoulder': return snap.leftShoulderText;
      case 'rightShoulder': return snap.rightShoulderText;
      default: return '';
    }
  };

  const setText = (value) => {
    switch (snap.activeRegion) {
      case 'front': state.text = value; break;
      case 'back': state.backText = value; break;
      case 'leftShoulder': state.leftShoulderText = value; break;
      case 'rightShoulder': state.rightShoulderText = value; break;
    }
  };

  // Text color
  const getTextColor = () => {
    switch (snap.activeRegion) {
      case 'front': return snap.textColor;
      case 'back': return snap.backTextColor;
      case 'leftShoulder': return snap.leftShoulderTextColor;
      case 'rightShoulder': return snap.rightShoulderTextColor;
      default: return '#000000';
    }
  };

  const setTextColor = (value) => {
    switch (snap.activeRegion) {
      case 'front': state.textColor = value; break;
      case 'back': state.backTextColor = value; break;
      case 'leftShoulder': state.leftShoulderTextColor = value; break;
      case 'rightShoulder': state.rightShoulderTextColor = value; break;
    }
  };

  // Text scale (only for front/back)
  const getTextScale = () => {
    if (snap.activeRegion === 'back') return snap.backTextScale;
    return snap.textScale;
  };

  const setTextScale = (value) => {
    if (snap.activeRegion === 'back') {
      state.backTextScale = value;
    } else {
      state.textScale = value;
    }
  };

  // Text position (only for front/back)
  const getPositionX = () => {
    if (snap.activeRegion === 'back') return snap.backTextPositionX;
    return snap.textPositionX;
  };

  const setPositionX = (value) => {
    if (snap.activeRegion === 'back') {
      state.backTextPositionX = value;
    } else {
      state.textPositionX = value;
    }
  };

  const getPositionY = () => {
    if (snap.activeRegion === 'back') return snap.backTextPositionY;
    return snap.textPositionY;
  };

  const setPositionY = (value) => {
    if (snap.activeRegion === 'back') {
      state.backTextPositionY = value;
    } else {
      state.textPositionY = value;
    }
  };

  // Check if text is enabled for current region
  const isTextEnabled = () => {
    switch (snap.activeRegion) {
      case 'front': return snap.isTextTexture;
      case 'back': return snap.isBackTextTexture;
      case 'leftShoulder': return snap.isLeftShoulderText;
      case 'rightShoulder': return snap.isRightShoulderText;
      default: return false;
    }
  };

  const toggleText = () => {
    switch (snap.activeRegion) {
      case 'front':
        state.isTextTexture = !state.isTextTexture;
        break;
      case 'back':
        state.isBackTextTexture = !state.isBackTextTexture;
        break;
      case 'leftShoulder':
        state.isLeftShoulderText = !state.isLeftShoulderText;
        if (state.isLeftShoulderText) state.isLeftShoulderLogo = false;
        break;
      case 'rightShoulder':
        state.isRightShoulderText = !state.isRightShoulderText;
        if (state.isRightShoulderText) state.isRightShoulderLogo = false;
        break;
    }
  };

  const getRegionLabel = () => {
    switch (snap.activeRegion) {
      case 'front': return 'Front';
      case 'back': return 'Back';
      case 'leftShoulder': return 'Left Shoulder';
      case 'rightShoulder': return 'Right Shoulder';
      default: return '';
    }
  };

  return (
    <div className='textpicker-container glassmorphism p-3 absolute left-full ml-3 rounded-md w-[280px]'>
      <div className='flex flex-col gap-4'>
        <RegionSelector />

        {/* Text Toggle */}
        <div className='flex items-center justify-between'>
          <p className='text-xs font-semibold text-gray-700 uppercase'>Show {getRegionLabel()} Text</p>
          <button 
            onClick={toggleText}
            className={`w-10 h-5 rounded-full transition-colors ${isTextEnabled() ? 'bg-[#EFBD48]' : 'bg-gray-300'} relative`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${isTextEnabled() ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {isTextEnabled() && (
          <div className='flex flex-col gap-3 border-t pt-3'>
            <div>
              <p className='text-xs font-semibold mb-1 text-gray-700 uppercase'>Text Content</p>
              <input 
                type="text" 
                value={getText()} 
                onChange={(e) => setText(e.target.value)}
                className='w-full p-2 text-sm border rounded bg-white/50 focus:outline-none focus:border-[#EFBD48]'
                placeholder='Enter text...'
              />
            </div>

            <div>
              <p className='text-xs font-semibold mb-1 text-gray-700 uppercase'>Text Color</p>
              <div className='flex items-center gap-2'>
                <input 
                  type="color" 
                  value={getTextColor()} 
                  onChange={(e) => setTextColor(e.target.value)}
                  className='w-8 h-8 rounded border-none p-0 cursor-pointer'
                />
                <span className='text-xs text-gray-500'>{getTextColor()}</span>
              </div>
            </div>

            {/* Scale and position - hidden for shoulders */}
            {!isShoulder && (
              <>
                <div>
                  <p className='text-xs font-semibold mb-1 text-gray-700 uppercase'>Text Scale: {getTextScale().toFixed(2)}</p>
                  <input 
                    type="range" 
                    min="0.05" 
                    max="0.3" 
                    step="0.01" 
                    value={getTextScale()} 
                    onChange={(e) => setTextScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EFBD48]"
                  />
                </div>

                <div>
                  <p className='text-xs font-semibold mb-1 text-gray-700 uppercase'>Horizontal (X): {getPositionX().toFixed(2)}</p>
                  <input 
                    type="range" 
                    min="-0.15" 
                    max="0.15" 
                    step="0.01" 
                    value={getPositionX()} 
                    onChange={(e) => setPositionX(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EFBD48]"
                  />
                </div>

                <div>
                  <p className='text-xs font-semibold mb-1 text-gray-700 uppercase'>Vertical (Y): {getPositionY().toFixed(2)}</p>
                  <input 
                    type="range" 
                    min="-0.2" 
                    max="0.1" 
                    step="0.01" 
                    value={getPositionY()} 
                    onChange={(e) => setPositionY(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EFBD48]"
                  />
                </div>
              </>
            )}

            {isShoulder && (
              <p className='text-xs text-gray-500 italic'>
                Shoulder text has fixed size and position
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TextPicker
