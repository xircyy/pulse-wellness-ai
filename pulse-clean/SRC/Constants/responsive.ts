import { useWindowDimensions } from 'react-native';

const BASE_WIDTH = 390;

/**
 * Reactive responsive hook — re-renders when window dimensions change.
 * Replaces the old static Dimensions.get('window') approach.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const ms = (size: number, factor: number = 0.5): number => {
    const scale = width / BASE_WIDTH;
    return size + (scale - 1) * size * factor;
  };

  return {
    width,
    height,
    ms,
    fontSize: {
      xs: ms(11),
      sm: ms(12),
      md: ms(14),
      lg: ms(16),
      xl: ms(18),
      xxl: ms(20),
      title: ms(24),
      bpmLarge: ms(64),
      bpmSmall: ms(48),
    },
    bottomNavHeight: Math.max(height * 0.08, 56),
  };
}
