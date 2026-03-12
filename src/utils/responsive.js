import { useWindowDimensions } from 'react-native';

/**
 * Responsive utilities - use screen dimensions for adaptive layouts
 */
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isLargeScreen = width >= 414;

  return {
    width,
    height,
    isSmallScreen,
    isLargeScreen,
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      xxl: 24,
      screen: Math.max(12, Math.min(width * 0.04, 20)),
    },
    featuredCardWidth: Math.min(300, width - 60),
    featuredCardHeight: Math.min(200, (width - 60) * 0.67),
    thumbnailSize: Math.min(140, width * 0.32),
  };
};
