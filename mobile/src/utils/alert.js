import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert utility that works on both mobile and web
 */
export const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
    if (Platform.OS === 'web') {
        // For web, we need to handle alerts differently
        // If there's a destructive action with cancel, use confirm
        const hasDestructive = buttons.some(b => b.style === 'destructive');
        const hasCancel = buttons.some(b => b.style === 'cancel');

        if (hasDestructive && hasCancel) {
            // Use confirm dialog for destructive actions
            const confirmed = window.confirm(`${title}\n\n${message}`);
            if (confirmed) {
                const destructiveButton = buttons.find(b => b.style === 'destructive');
                if (destructiveButton?.onPress) {
                    destructiveButton.onPress();
                }
            } else {
                const cancelButton = buttons.find(b => b.style === 'cancel');
                if (cancelButton?.onPress) {
                    cancelButton.onPress();
                }
            }
        } else if (buttons.length === 1) {
            // Simple alert
            window.alert(`${title}\n\n${message}`);
            if (buttons[0]?.onPress) {
                buttons[0].onPress();
            }
        } else {
            // For multiple non-destructive buttons, use confirm
            const confirmed = window.confirm(`${title}\n\n${message}`);
            if (confirmed && buttons.length > 1) {
                // Find the "positive" button (not cancel)
                const positiveButton = buttons.find(b => b.style !== 'cancel') || buttons[1];
                if (positiveButton?.onPress) {
                    positiveButton.onPress();
                }
            }
        }
    } else {
        // Use native Alert for mobile
        Alert.alert(title, message, buttons);
    }
};

/**
 * Simple success/error alert
 */
export const showSimpleAlert = (title, message, onPress) => {
    showAlert(title, message, [{ text: 'OK', onPress }]);
};

/**
 * Confirmation dialog for destructive actions
 */
export const showConfirmDialog = (title, message, onConfirm, onCancel) => {
    showAlert(title, message, [
        { text: 'Cancel', style: 'cancel', onPress: onCancel },
        { text: 'Confirm', style: 'destructive', onPress: onConfirm }
    ]);
};

export default showAlert;
