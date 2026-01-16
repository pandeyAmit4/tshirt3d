import React from 'react'
import { useSnapshot } from 'valtio'
import CustomButton from './CustomButton'
import RegionSelector from './RegionSelector'
import state from '../store'

const FilePicker = ({file, setFile, readFile}) => {
  const snap = useSnapshot(state)
  const isShoulder = snap.activeRegion === 'leftShoulder' || snap.activeRegion === 'rightShoulder'

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-apply as logo to active region
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        applyLogoToRegion(reader.result);
      };
    }
  };

  const applyLogoToRegion = (imageData) => {
    switch (snap.activeRegion) {
      case 'front':
        state.logoDecal = imageData;
        state.isLogoTexture = true;
        break;
      case 'back':
        state.backLogoDecal = imageData;
        state.isBackLogoTexture = true;
        break;
      case 'leftShoulder':
        state.leftShoulderDecal = imageData;
        state.isLeftShoulderLogo = true;
        state.isLeftShoulderText = false; // Disable text when using logo
        break;
      case 'rightShoulder':
        state.rightShoulderDecal = imageData;
        state.isRightShoulderLogo = true;
        state.isRightShoulderText = false; // Disable text when using logo
        break;
    }
  };

  // Get current scale for active region
  const getCurrentScale = () => {
    if (snap.activeRegion === 'back') return snap.backLogoScale;
    return snap.logoScale;
  };

  const setCurrentScale = (value) => {
    if (snap.activeRegion === 'back') {
      state.backLogoScale = value;
    } else {
      state.logoScale = value;
    }
  };

  // Check if logo is enabled for current region
  const isLogoEnabled = () => {
    switch (snap.activeRegion) {
      case 'front': return snap.isLogoTexture;
      case 'back': return snap.isBackLogoTexture;
      case 'leftShoulder': return snap.isLeftShoulderLogo;
      case 'rightShoulder': return snap.isRightShoulderLogo;
      default: return false;
    }
  };

  const toggleLogo = () => {
    switch (snap.activeRegion) {
      case 'front':
        state.isLogoTexture = !state.isLogoTexture;
        break;
      case 'back':
        state.isBackLogoTexture = !state.isBackLogoTexture;
        break;
      case 'leftShoulder':
        state.isLeftShoulderLogo = !state.isLeftShoulderLogo;
        if (state.isLeftShoulderLogo) state.isLeftShoulderText = false;
        break;
      case 'rightShoulder':
        state.isRightShoulderLogo = !state.isRightShoulderLogo;
        if (state.isRightShoulderLogo) state.isRightShoulderText = false;
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
    <div className='filepicker-container'>
      <RegionSelector />
      
      {/* Logo Toggle */}
      <div className='flex items-center justify-between mb-3'>
        <p className='text-xs font-semibold text-gray-700 uppercase'>Show {getRegionLabel()} Logo</p>
        <button 
          onClick={toggleLogo}
          className={`w-10 h-5 rounded-full transition-colors ${isLogoEnabled() ? 'bg-[#EFBD48]' : 'bg-gray-300'} relative`}
        >
          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${isLogoEnabled() ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className='flex flex-1 flex-col'>
        <input 
          id='file-upload'
          type="file"
          accept='image/*'
          onChange={handleFileChange} 
        />
        <label htmlFor="file-upload" className='filepicker-label'>
          Upload File
        </label>

        <p className='mt-2 text-gray-600 text-sm truncate'>
          {file === '' ? 'No file selected' : file.name}
        </p>
      </div>

      {/* Logo Scale Slider - hidden for shoulders (fixed size) */}
      {!isShoulder && (
        <div className='mt-3'>
          <p className='text-xs font-semibold mb-1 text-gray-700 uppercase'>
            Logo Scale: {getCurrentScale().toFixed(2)}
          </p>
          <input 
            type="range" 
            min="0.05" 
            max="0.3" 
            step="0.01" 
            value={getCurrentScale()} 
            onChange={(e) => setCurrentScale(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EFBD48]"
          />
        </div>
      )}

      {isShoulder && (
        <p className='mt-3 text-xs text-gray-500 italic'>
          Shoulder logos have a fixed size
        </p>
      )}

      <div className='mt-4 flex flex-wrap gap-3'>
        <CustomButton
          type='filled'
          title='Logo'
          handleClick={() => readFile('logo')}
        />

        <CustomButton
          type='outline'
          title='Full'
          handleClick={() => readFile('full')}
        />
      </div>
    </div>
  )
}

export default FilePicker