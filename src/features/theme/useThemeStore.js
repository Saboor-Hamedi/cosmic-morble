import { create } from 'zustand';
import theme1Img from '../../themes/theme1.png';
import theme2Img from '../../themes/theme2.png';
import theme3Img from '../../themes/theme3.png';
import theme4Img from '../../themes/theme4.png';
import theme5Img from '../../themes/theme5.png';
import theme6Img from '../../themes/theme6.png';
import theme7Img from '../../themes/theme7.png';
import theme8Img from '../../themes/theme8.png';
import theme9Img from '../../themes/theme9.png';
import theme10Img from '../../themes/theme10.png';

const SETTINGS_KEY = 'cosmic_morble_settings_json';

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.theme) {
        return parsed;
      }
    }
  } catch (_) {}
  // Default theme is theme1 matching user attachment (`the default theme is going to be the one i just attached`)
  return { theme: 'theme1' };
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (_) {}
}

export const THEMES = {
  theme1: {
    id: 'theme1',
    name: 'Crystal Aqua Orb',
    icon: '💧',
    previewImg: theme1Img,
    skyGradient: 'linear-gradient(180deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)',
    ambientColor: '#e0f2fe',
    ambientIntensity: 0.95,
    directionalColor: '#7dd3fc',
    cloudColor: '#f0f9ff',
    cloudEmissive: '#bae6fd',
    plateauColor: '#0284c7',
    plateauAccent: '#38bdf8',
    rockBaseColor: '#075985',
    rockAccentColor: '#0c4a6e',
    waterColor: '#7dd3fc',
    treeType: 'crystal',
    treeColor: '#38bdf8',
    treeAccent: '#e0f2fe',
    keyboardTray: '#075985',
    keyboardTrim: '#0284c7',
    keyRowColors: ['#e0f2fe', '#bae6fd', '#7dd3fc'],
    keySpacebar: '#38bdf8',
    keyActive: '#facc15',
    keyText: '#0c4a6e',
    bubbleColor: '#38bdf8',
    bubbleEmissive: '#0284c7'
  },
  theme2: {
    id: 'theme2',
    name: 'Pine River Valley',
    icon: '🌲',
    previewImg: theme2Img,
    skyGradient: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    ambientColor: '#ffffff',
    ambientIntensity: 0.9,
    directionalColor: '#fef08a',
    cloudColor: '#f8fafc',
    cloudEmissive: '#e0f2fe',
    plateauColor: '#4ade80',
    plateauAccent: '#86efac',
    rockBaseColor: '#334155',
    rockAccentColor: '#475569',
    waterColor: '#06b6d4',
    treeType: 'pine',
    treeColor: '#16a34a',
    treeAccent: '#15803d',
    keyboardTray: '#3f6212',
    keyboardTrim: '#1e293b',
    keyRowColors: ['#f0fdf4', '#dcfce7', '#bbf7d0'],
    keySpacebar: '#86efac',
    keyActive: '#facc15',
    keyText: '#14532d',
    bubbleColor: '#22c55e',
    bubbleEmissive: '#15803d'
  },
  theme3: {
    id: 'theme3',
    name: 'Sakura Sanctuary',
    icon: '🌸',
    previewImg: theme3Img,
    skyGradient: 'linear-gradient(180deg, #c4b5fd 0%, #fbcfe8 50%, #fed7aa 100%)',
    ambientColor: '#ffffff',
    ambientIntensity: 0.88,
    directionalColor: '#fef08a',
    cloudColor: '#fff1f2',
    cloudEmissive: '#fbcfe8',
    plateauColor: '#65a30d',
    plateauAccent: '#84cc16',
    rockBaseColor: '#9a5b34',
    rockAccentColor: '#683d24',
    waterColor: '#0ea5e9',
    treeType: 'sakura',
    treeColor: '#f472b6',
    treeAccent: '#fb7185',
    keyboardTray: '#824c2e',
    keyboardTrim: '#683d24',
    keyRowColors: ['#f8fafc', '#fef9c3', '#ffe4e6'],
    keySpacebar: '#dcfce7',
    keyActive: '#facc15',
    keyText: '#334155',
    bubbleColor: '#f472b6',
    bubbleEmissive: '#be185d'
  },
  theme4: {
    id: 'theme4',
    name: 'Cosmic Candy Isle',
    icon: '🍬',
    previewImg: theme4Img,
    skyGradient: 'linear-gradient(180deg, #312e81 0%, #831843 50%, #f43f5e 100%)',
    ambientColor: '#fdf4ff',
    ambientIntensity: 0.92,
    directionalColor: '#f0abfc',
    cloudColor: '#f3e8ff',
    cloudEmissive: '#e879f9',
    plateauColor: '#f472b6',
    plateauAccent: '#c084fc',
    rockBaseColor: '#581c87',
    rockAccentColor: '#3b0764',
    waterColor: '#ec4899',
    treeType: 'candy',
    treeColor: '#a855f7',
    treeAccent: '#38bdf8',
    keyboardTray: '#f8fafc',
    keyboardTrim: '#ddd6fe',
    keyRowColors: ['#fbcfe8', '#ddd6fe', '#a5f3fc'],
    keySpacebar: '#f9a8d4',
    keyActive: '#fbbf24',
    keyText: '#4c1d95',
    bubbleColor: '#ec4899',
    bubbleEmissive: '#a21caf'
  },
  theme5: {
    id: 'theme5',
    name: 'Golden Sunset Desert',
    icon: '🌅',
    previewImg: theme5Img,
    skyGradient: 'linear-gradient(180deg, #7c2d12 0%, #ea580c 50%, #fde047 100%)',
    ambientColor: '#ffedd5',
    ambientIntensity: 0.9,
    directionalColor: '#fde047',
    cloudColor: '#fff7ed',
    cloudEmissive: '#fed7aa',
    plateauColor: '#eab308',
    plateauAccent: '#fde047',
    rockBaseColor: '#7c2d12',
    rockAccentColor: '#9a3412',
    waterColor: '#0284c7',
    treeType: 'desert',
    treeColor: '#16a34a',
    treeAccent: '#84cc16',
    keyboardTray: '#9a3412',
    keyboardTrim: '#c2410c',
    keyRowColors: ['#ffedd5', '#fed7aa', '#fde047'],
    keySpacebar: '#fbbf24',
    keyActive: '#38bdf8',
    keyText: '#7c2d12',
    bubbleColor: '#f59e0b',
    bubbleEmissive: '#b45309'
  },
  theme6: {
    id: 'theme6',
    name: 'Arctic Frost Glacier',
    icon: '❄️',
    previewImg: theme6Img,
    skyGradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a8a 50%, #93c5fd 100%)',
    ambientColor: '#eff6ff',
    ambientIntensity: 0.94,
    directionalColor: '#bfdbfe',
    cloudColor: '#ffffff',
    cloudEmissive: '#93c5fd',
    plateauColor: '#93c5fd',
    plateauAccent: '#bfdbfe',
    rockBaseColor: '#1e3a8a',
    rockAccentColor: '#1d4ed8',
    waterColor: '#3b82f6',
    treeType: 'arctic',
    treeColor: '#60a5fa',
    treeAccent: '#eff6ff',
    keyboardTray: '#1e3a8a',
    keyboardTrim: '#1d4ed8',
    keyRowColors: ['#eff6ff', '#dbafea', '#bfdbfe'],
    keySpacebar: '#60a5fa',
    keyActive: '#facc15',
    keyText: '#1e3a8a',
    bubbleColor: '#60a5fa',
    bubbleEmissive: '#1d4ed8'
  },
  theme7: {
    id: 'theme7',
    name: 'Mystic Lavender Meadow',
    icon: '🪻',
    previewImg: theme7Img,
    skyGradient: 'linear-gradient(180deg, #2e1065 0%, #6b21a8 50%, #d8b4fe 100%)',
    ambientColor: '#faf5ff',
    ambientIntensity: 0.9,
    directionalColor: '#e9d5ff',
    cloudColor: '#faf5ff',
    cloudEmissive: '#d8b4fe',
    plateauColor: '#a855f7',
    plateauAccent: '#c084fc',
    rockBaseColor: '#3b0764',
    rockAccentColor: '#581c87',
    waterColor: '#c084fc',
    treeType: 'lavender',
    treeColor: '#d8b4fe',
    treeAccent: '#f3e8ff',
    keyboardTray: '#581c87',
    keyboardTrim: '#6b21a8',
    keyRowColors: ['#faf5ff', '#f3e8ff', '#e9d5ff'],
    keySpacebar: '#c084fc',
    keyActive: '#facc15',
    keyText: '#3b0764',
    bubbleColor: '#a855f7',
    bubbleEmissive: '#6b21a8'
  },
  theme8: {
    id: 'theme8',
    name: 'Cyber Neon City',
    icon: '⚡',
    previewImg: theme8Img,
    skyGradient: 'linear-gradient(180deg, #030712 0%, #111827 50%, #1e1b4b 100%)',
    ambientColor: '#ffffff',
    ambientIntensity: 0.85,
    directionalColor: '#22d3ee',
    cloudColor: '#1e293b',
    cloudEmissive: '#06b6d4',
    plateauColor: '#0f172a',
    plateauAccent: '#1e293b',
    rockBaseColor: '#030712',
    rockAccentColor: '#111827',
    waterColor: '#00ff88',
    treeType: 'cyber',
    treeColor: '#00ff88',
    treeAccent: '#06b6d4',
    keyboardTray: '#111827',
    keyboardTrim: '#1f2937',
    keyRowColors: ['#1e293b', '#334155', '#475569'],
    keySpacebar: '#06b6d4',
    keyActive: '#00ff88',
    keyText: '#38bdf8',
    bubbleColor: '#00ff88',
    bubbleEmissive: '#06b6d4'
  },
  theme9: {
    id: 'theme9',
    name: 'Autumn Maple Ridge',
    icon: '🍁',
    previewImg: theme9Img,
    skyGradient: 'linear-gradient(180deg, #451a03 0%, #9a3412 50%, #fdba74 100%)',
    ambientColor: '#fff7ed',
    ambientIntensity: 0.9,
    directionalColor: '#ffedd5',
    cloudColor: '#fff7ed',
    cloudEmissive: '#fed7aa',
    plateauColor: '#ea580c',
    plateauAccent: '#f97316',
    rockBaseColor: '#451a03',
    rockAccentColor: '#7c2d12',
    waterColor: '#38bdf8',
    treeType: 'autumn',
    treeColor: '#ef4444',
    treeAccent: '#eab308',
    keyboardTray: '#7c2d12',
    keyboardTrim: '#9a3412',
    keyRowColors: ['#fff7ed', '#ffedd5', '#fed7aa'],
    keySpacebar: '#f97316',
    keyActive: '#facc15',
    keyText: '#451a03',
    bubbleColor: '#f97316',
    bubbleEmissive: '#c2410c'
  },
  theme10: {
    id: 'theme10',
    name: 'Starlight Galaxy Peak',
    icon: '🌌',
    previewImg: theme10Img,
    skyGradient: 'linear-gradient(180deg, #020617 0%, #0f172a 50%, #312e81 100%)',
    ambientColor: '#e0e7ff',
    ambientIntensity: 0.88,
    directionalColor: '#818cf8',
    cloudColor: '#1e1b4b',
    cloudEmissive: '#4338ca',
    plateauColor: '#312e81',
    plateauAccent: '#4338ca',
    rockBaseColor: '#020617',
    rockAccentColor: '#0f172a',
    waterColor: '#818cf8',
    treeType: 'starlight',
    treeColor: '#a855f7',
    treeAccent: '#6366f1',
    keyboardTray: '#0f172a',
    keyboardTrim: '#1e1b4b',
    keyRowColors: ['#e0e7ff', '#c7d2fe', '#a5b4fc'],
    keySpacebar: '#6366f1',
    keyActive: '#facc15',
    keyText: '#1e1b4b',
    bubbleColor: '#818cf8',
    bubbleEmissive: '#4338ca'
  }
};

const initialSettings = loadSettings();

export const useThemeStore = create((set, get) => ({
  currentThemeId: initialSettings.theme || 'theme1',
  theme: THEMES[initialSettings.theme || 'theme1'] || THEMES.theme1,

  setTheme: (themeId) => {
    if (THEMES[themeId]) {
      const updated = { theme: themeId };
      saveSettings(updated);
      set({ currentThemeId: themeId, theme: THEMES[themeId] });
    }
  },

  cycleTheme: () => {
    const keys = Object.keys(THEMES);
    const currentIndex = keys.indexOf(get().currentThemeId);
    const nextIndex = (currentIndex + 1) % keys.length;
    const nextThemeId = keys[nextIndex];
    get().setTheme(nextThemeId);
  }
}));
