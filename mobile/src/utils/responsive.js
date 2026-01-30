import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (design was made for this screen size)
const BASE_WIDTH = 375; // iPhone 11 Pro width
const BASE_HEIGHT = 812;

// Scale factors
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;

// Use the smaller scale to ensure content fits
const scale = Math.min(widthScale, heightScale);

/**
 * Scales a size value based on screen width
 * Use for horizontal measurements (width, marginLeft, paddingHorizontal, etc.)
 */
export const wp = (size) => {
    return Math.round(size * widthScale);
};

/**
 * Scales a size value based on screen height
 * Use for vertical measurements (height, marginTop, paddingVertical, etc.)
 */
export const hp = (size) => {
    return Math.round(size * heightScale);
};

/**
 * Scales font size based on screen scale and respects user's font settings
 * This is the key function for cross-device font compatibility
 */
export const fp = (size) => {
    const newSize = size * scale;

    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        // Android: Use a slightly smaller scale to account for varied font rendering
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
    }
};

/**
 * Moderate scale - use for elements that should scale but not too aggressively
 * Good for padding, margins, and icon sizes
 */
export const ms = (size, factor = 0.5) => {
    return Math.round(size + (scale - 1) * size * factor);
};

/**
 * Get percentage of screen width
 */
export const widthPercent = (percent) => {
    return (SCREEN_WIDTH * percent) / 100;
};

/**
 * Get percentage of screen height
 */
export const heightPercent = (percent) => {
    return (SCREEN_HEIGHT * percent) / 100;
};

// Export screen dimensions
export { SCREEN_WIDTH, SCREEN_HEIGHT };

// Check if device is a tablet
export const isTablet = SCREEN_WIDTH >= 768;

// Check if device has a small screen
export const isSmallDevice = SCREEN_WIDTH < 375;

// Normalize size across different pixel densities
export const normalize = (size) => {
    const pixelRatio = PixelRatio.get();

    if (pixelRatio >= 3) {
        // High density (xxxhdpi)
        return size;
    } else if (pixelRatio >= 2) {
        // Medium-high density (xxhdpi, xhdpi)
        return Math.round(size * 0.95);
    } else {
        // Low density
        return Math.round(size * 0.9);
    }
};
