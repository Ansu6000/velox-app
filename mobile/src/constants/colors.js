import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (design was made for iPhone 11 Pro)
const BASE_WIDTH = 375;

// Scale factor for responsive sizing
const scale = SCREEN_WIDTH / BASE_WIDTH;

// Responsive font size that respects device settings
const fontScale = (size) => {
  const newSize = size * Math.min(scale, 1.3); // Cap scaling at 1.3x
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive spacing
const spaceScale = (size) => {
  return Math.round(size * Math.min(scale, 1.2)); // Cap at 1.2x
};

// Beautiful Blue & White Aesthetic Theme
export const COLORS = {
  // Primary Blues
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  primarySoft: '#60A5FA',

  // Background Shades
  background: '#F0F7FF',
  backgroundSecondary: '#E0EFFF',
  white: '#FFFFFF',

  // Card & Surface
  cardBackground: '#FFFFFF',
  cardBorder: 'rgba(37, 99, 235, 0.1)',
  glassMorphism: 'rgba(255, 255, 255, 0.85)',

  // Text Colors
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textLight: '#FFFFFF',

  // Accent Colors
  success: '#10B981',
  successLight: '#D1FAE5',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',

  // Gradients
  gradientStart: '#2563EB',
  gradientEnd: '#06B6D4',

  // Shadows
  shadow: 'rgba(37, 99, 235, 0.15)',
  shadowDark: 'rgba(37, 99, 235, 0.25)',

  // Border
  border: '#E2E8F0',
  borderLight: 'rgba(255, 255, 255, 0.5)',
};

// Typography
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

// Responsive SIZES - automatically scales based on screen size
export const SIZES = {
  // Spacing (responsive)
  xs: spaceScale(4),
  sm: spaceScale(8),
  md: spaceScale(16),
  lg: spaceScale(24),
  xl: spaceScale(32),
  xxl: spaceScale(48),

  // Border Radius (responsive)
  radiusSm: spaceScale(8),
  radiusMd: spaceScale(12),
  radiusLg: spaceScale(20),
  radiusXl: spaceScale(28),
  radiusFull: 9999,

  // Font Sizes (responsive)
  fontXs: fontScale(10),
  fontSm: fontScale(12),
  fontMd: fontScale(14),
  fontLg: fontScale(16),
  fontXl: fontScale(18),
  font2xl: fontScale(22),
  font3xl: fontScale(28),
  font4xl: fontScale(36),
};

// Export screen dimensions for use in components
export { SCREEN_WIDTH, SCREEN_HEIGHT };
