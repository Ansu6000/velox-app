import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { COLORS, SIZES } from '../../src/constants/colors';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarLabelStyle: styles.tabLabel,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconContainer, focused && styles.activeIcon]}>
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    tabBarButton: (props) => (
                        <Pressable
                            {...props}
                            style={styles.addButtonContainer}
                        >
                            <View style={styles.addButton}>
                                <Ionicons name="add" size={32} color={COLORS.white} />
                            </View>
                        </Pressable>
                    ),
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'Analytics',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconContainer, focused && styles.activeIcon]}>
                            <Ionicons
                                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    href: null, // Hides the tab button
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: COLORS.white,
        borderTopWidth: 0,
        height: Platform.OS === 'ios' ? 84 : 64,
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        paddingTop: 8,
        borderTopLeftRadius: SIZES.radiusXl,
        borderTopRightRadius: SIZES.radiusXl,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 10,
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    tabLabel: {
        fontSize: SIZES.fontSm,
        fontWeight: '600',
        marginTop: 4,
    },
    iconContainer: {
        padding: 4,
        borderRadius: SIZES.radiusMd,
    },
    activeIcon: {
        backgroundColor: `${COLORS.primary}10`,
    },
    addButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: Platform.OS === 'ios' ? 84 : 64,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? -48 : -32,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 4,
        borderColor: COLORS.background,
    },
});

