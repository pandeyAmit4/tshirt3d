import { proxy, subscribe } from "valtio";

const STORAGE_KEY = 'tshirt3d-customizer';

// Default state values
const defaultState = {
    intro: true,
    color: '#EFBD48',
    
    // Active region for customization
    activeRegion: 'front', // 'front' | 'back' | 'leftShoulder' | 'rightShoulder'
    targetRotation: 0, // Y rotation in radians for smooth animation
    
    // Front logo
    isLogoTexture: true,
    isFullTexture: false,
    logoDecal: './threejs.png',
    fullDecal: './threejs.png',
    logoScale: 0.15,
    
    // Front text
    text: '3D',
    textScale: 0.2,
    textColor: '#000000',
    textPositionX: 0,
    textPositionY: -0.1,
    isTextTexture: false,
    
    // Back logo
    isBackLogoTexture: false,
    backLogoDecal: './threejs.png',
    backLogoScale: 0.15,
    
    // Back text
    isBackTextTexture: false,
    backText: '',
    backTextScale: 0.2,
    backTextColor: '#000000',
    backTextPositionX: 0,
    backTextPositionY: -0.1,
    
    // Left shoulder (fixed scale 0.08)
    isLeftShoulderLogo: false,
    leftShoulderDecal: './threejs.png',
    isLeftShoulderText: false,
    leftShoulderText: '',
    leftShoulderTextColor: '#000000',
    
    // Right shoulder (fixed scale 0.08)
    isRightShoulderLogo: false,
    rightShoulderDecal: './threejs.png',
    isRightShoulderText: false,
    rightShoulderText: '',
    rightShoulderTextColor: '#000000',
    
    fabricType: 'cotton',
    fabrics: [
      { name: 'cotton', normalMap: '/textures/cotton_normal.png', roughness: 0.8 },
      { name: 'silk', normalMap: '/textures/silk_normal.png', roughness: 0.2 },
      { name: 'denim', normalMap: '/textures/denim_normal.png', roughness: 0.5 },
      { name: 'flat', normalMap: null, roughness: 0.5 }
    ],
    isAutoRotate: false
};

// Load saved state from localStorage
const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter out blob URLs as they don't persist across page refreshes
      const decalKeys = ['logoDecal', 'fullDecal', 'backLogoDecal', 'leftShoulderDecal', 'rightShoulderDecal'];
      decalKeys.forEach(key => {
        if (parsed[key] && parsed[key].startsWith('blob:')) {
          delete parsed[key]; // Use default instead
        }
      });
      // Merge with defaults to ensure all keys exist
      return { ...defaultState, ...parsed, fabrics: defaultState.fabrics };
    }
  } catch (e) {
    console.error('Failed to load saved state:', e);
  }
  return defaultState;
};

const state = proxy(loadState());

// Subscribe to changes and save to localStorage
subscribe(state, () => {
  try {
    // Don't save fabrics array (it's static) and intro (always start with intro)
    const { fabrics, ...toSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
});

// Reset function to clear all customizations
export const resetState = () => {
  localStorage.removeItem(STORAGE_KEY);
  Object.keys(defaultState).forEach(key => {
    state[key] = defaultState[key];
  });
};

export default state;

