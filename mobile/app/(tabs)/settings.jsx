import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    StatusBar,
    Alert,
    Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../src/constants/colors';
import { CURRENCIES } from '../../src/constants/categories';
import { useApp } from '../../src/context/AppContext';
import { useAuth } from '../../src/context/AuthContext';
import CurrencyPicker from '../../src/components/CurrencyPicker';

export default function SettingsScreen() {
    const { logout } = useAuth();
    const router = useRouter();
    const {
        homeCurrency,
        spendingCurrency,
        saveHomeCurrency,
        saveSpendingCurrency,
        transactions,
        exchangeRates,
        travelMode,
        saveTravelMode
    } = useApp();

    const [showHomePicker, setShowHomePicker] = useState(false);
    const [showSpendingPicker, setShowSpendingPicker] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const handleClearData = () => {
        Alert.alert(
            'Clear All Data',
            'This will delete all your transactions. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: () => {
                        // Would clear AsyncStorage here
                        Alert.alert('Success', 'All data has been cleared');
                    }
                },
            ]
        );
    };

    const SettingItem = ({ icon, iconColor, title, subtitle, onPress, rightElement }) => (
        <Pressable
            style={({ pressed }) => [styles.settingItem, pressed && styles.pressed]}
            onPress={onPress}
        >
            <View style={[styles.settingIcon, { backgroundColor: `${iconColor}15` }]}>
                <Ionicons name={icon} size={22} color={iconColor} />
            </View>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            {rightElement || <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />}
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        style={styles.headerButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { marginLeft: SIZES.sm }]}>Settings</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Preferences */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>App Mode</Text>
                        <View style={styles.sectionCard}>
                            <SettingItem
                                icon="airplane-outline"
                                iconColor={COLORS.primary}
                                title="Travel Mode"
                                subtitle="Enable multi-currency features"
                                rightElement={
                                    <Switch
                                        value={travelMode}
                                        onValueChange={saveTravelMode}
                                        trackColor={{ false: COLORS.border, true: `${COLORS.primary}50` }}
                                        thumbColor={travelMode ? COLORS.primary : COLORS.textMuted}
                                    />
                                }
                            />
                        </View>
                    </View>

                    {/* Currency Settings - Only show if Travel Mode is on or for Home Currency */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Currency Settings</Text>
                        <View style={styles.sectionCard}>
                            <SettingItem
                                icon="home-outline"
                                iconColor={COLORS.primary}
                                title="Home Currency"
                                subtitle={`${homeCurrency.flag} ${homeCurrency.name} (${homeCurrency.symbol})`}
                                onPress={() => setShowHomePicker(true)}
                            />
                            {travelMode && (
                                <>
                                    <View style={styles.divider} />
                                    <SettingItem
                                        icon="airplane-outline"
                                        iconColor="#8B5CF6"
                                        title="Spending Currency"
                                        subtitle={`${spendingCurrency.flag} ${spendingCurrency.name} (${spendingCurrency.symbol})`}
                                        onPress={() => setShowSpendingPicker(true)}
                                    />
                                </>
                            )}
                        </View>
                    </View>

                    {/* Exchange Rate Info - Only in Travel Mode */}
                    {travelMode && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Exchange Rate</Text>
                            <View style={styles.exchangeCard}>
                                <View style={styles.exchangeRow}>
                                    <View style={styles.exchangeItem}>
                                        <Text style={styles.exchangeFlag}>{spendingCurrency.flag}</Text>
                                        <Text style={styles.exchangeCode}>{spendingCurrency.code}</Text>
                                    </View>
                                    <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
                                    <View style={styles.exchangeItem}>
                                        <Text style={styles.exchangeFlag}>{homeCurrency.flag}</Text>
                                        <Text style={styles.exchangeCode}>{homeCurrency.code}</Text>
                                    </View>
                                </View>
                                <View style={styles.exchangeRateBox}>
                                    <Text style={styles.exchangeRateLabel}>Current Rate</Text>
                                    <Text style={styles.exchangeRateValue}>
                                        1 {spendingCurrency.code} = {(exchangeRates[homeCurrency.code] || 1).toFixed(4)} {homeCurrency.code}
                                    </Text>
                                </View>
                                <Text style={styles.exchangeNote}>
                                    Rates are fetched from ExchangeRate-API and updated automatically
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Data Management */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Data</Text>
                        <View style={styles.sectionCard}>
                            <SettingItem
                                icon="analytics-outline"
                                iconColor="#06B6D4"
                                title="Total Transactions"
                                subtitle={`${transactions.length} transactions recorded`}
                                rightElement={null}
                            />
                            <View style={styles.divider} />
                            <SettingItem
                                icon="trash-outline"
                                iconColor={COLORS.danger}
                                title="Clear All Data"
                                subtitle="Delete all transactions"
                                onPress={handleClearData}
                            />
                            <View style={styles.divider} />
                            <SettingItem
                                icon="log-out-outline"
                                iconColor={COLORS.danger}
                                title="Sign Out"
                                subtitle="Log out of your account"
                                onPress={() => {
                                    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                                        { text: 'Cancel', style: 'cancel' },
                                        { text: 'Log Out', onPress: logout, style: 'destructive' }
                                    ]);
                                }}
                            />
                        </View>
                    </View>

                    {/* About */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <View style={styles.sectionCard}>
                            <SettingItem
                                icon="information-circle-outline"
                                iconColor={COLORS.primary}
                                title="ExpenseTracker"
                                subtitle="Version 1.0.0"
                                rightElement={null}
                            />
                        </View>
                    </View>

                    {/* App Branding */}
                    <View style={styles.branding}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="wallet" size={32} color={COLORS.primary} />
                        </View>
                        <Text style={styles.brandName}>ExpenseTracker</Text>
                        <Text style={styles.brandTagline}>Track smarter, spend wiser</Text>
                    </View>
                </ScrollView>

                {/* Currency Pickers */}
                <CurrencyPicker
                    visible={showHomePicker}
                    currencies={CURRENCIES}
                    selectedCurrency={homeCurrency}
                    onSelect={(currency) => {
                        saveHomeCurrency(currency);
                        setShowHomePicker(false);
                    }}
                    onClose={() => setShowHomePicker(false)}
                    title="Select Home Currency"
                />

                <CurrencyPicker
                    visible={showSpendingPicker}
                    currencies={CURRENCIES}
                    selectedCurrency={spendingCurrency}
                    onSelect={(currency) => {
                        saveSpendingCurrency(currency);
                        setShowSpendingPicker(false);
                    }}
                    onClose={() => setShowSpendingPicker(false)}
                    title="Select Spending Currency"
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.lg,
        paddingVertical: SIZES.md,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: SIZES.radiusMd,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: SIZES.font2xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    scrollContent: {
        paddingHorizontal: SIZES.md,
        paddingBottom: 100,
        flexGrow: 1,
    },
    section: {
        marginBottom: SIZES.lg,
    },
    sectionTitle: {
        fontSize: SIZES.fontSm,
        fontWeight: '600',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SIZES.sm,
        marginLeft: SIZES.xs,
    },
    sectionCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusLg,
        overflow: 'hidden',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.md,
    },
    pressed: {
        backgroundColor: COLORS.backgroundSecondary,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: SIZES.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.md,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: SIZES.fontLg,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    settingSubtitle: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginLeft: 68,
    },
    exchangeCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusLg,
        padding: SIZES.md,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    exchangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SIZES.lg,
        marginBottom: SIZES.md,
    },
    exchangeItem: {
        alignItems: 'center',
        gap: SIZES.xs,
    },
    exchangeFlag: {
        fontSize: 32,
    },
    exchangeCode: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    exchangeRateBox: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.md,
        alignItems: 'center',
    },
    exchangeRateLabel: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        marginBottom: SIZES.xs,
    },
    exchangeRateValue: {
        fontSize: SIZES.fontLg,
        fontWeight: '700',
        color: COLORS.primary,
    },
    exchangeNote: {
        fontSize: SIZES.fontXs,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: SIZES.sm,
    },
    branding: {
        alignItems: 'center',
        paddingVertical: SIZES.xl,
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: SIZES.radiusLg,
        backgroundColor: `${COLORS.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.md,
    },
    brandName: {
        fontSize: SIZES.fontXl,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    brandTagline: {
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
        marginTop: SIZES.xs,
    },
});
