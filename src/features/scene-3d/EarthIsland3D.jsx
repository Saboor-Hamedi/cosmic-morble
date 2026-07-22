import React from 'react';
import { useThemeStore } from '../theme/useThemeStore.js';

export const EarthIsland3D = React.memo(function EarthIsland3D() {
  const theme = useThemeStore((s) => s.theme);

  // When a rich theme image (`theme1.png` through `theme10.png`) is active, the theme image ITSELF is the ground and world (`i thought you gonna add those themes as ground`).
  // We do not render blocky low-poly yellow/mustard plateaus over the beautiful world illustration!
  if (theme && theme.previewImg) {
    return null;
  }

  return null;
});
