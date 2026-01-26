import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/colors';
import { useApp } from '../context/AppContext';

export default function CurrencyConverter() {
    const { homeCurrency, spendingCurrency, exchangeRates, isLoading, fetchExchangeRates } = useApp();

    if (homeCurrency.code === spendingCurrency.code) {
        return null;
    }

    const rate = exchangeRates[homeCurrency.code] || 1;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
                    <Text style={styles.title}>Live Exchange Rate</Text>
                </View>
                <Pressable
                    onPress={() => fetchExchangeRates(spendingCurrency.code)}
                    style={({ pressed }) => [styles.refreshButton, pressed && styles.pressed]}
                >
                    <Ionicons
                        name="refresh-outline"
                        size={18}
                        color={COLORS.primary}
                        style={isLoading && styles.spinning}
                    />
                </Pressable>
            </View>

            <View style={styles.rateCard}>
                <View style={styles.currencyBox}>
                    <Text style={styles.flag}>{spendingCurrency.flag}</Text>
                    <View>
                        <Text style={styles.currencyCode}>{spendingCurrency.code}</Text>
                        <Text style={styles.currencyAmount}>1.00</Text>
                    </View>
                </View>

                <View style={styles.arrowContainer}>
                    <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
                </View>

                <View style={styles.currencyBox}>
                    <Text style={styles.flag}>{homeCurrency.flag}</Text>
                    <View>
                        <Text style={styles.currencyCode}>{homeCurrency.code}</Text>
                        <Text style={styles.currencyAmount}>{rate.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.helperText}>
                Spending in {spendingCurrency.name}, tracking in {homeCurrency.name}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusLg,
        padding: SIZES.md,
        marginHorizontal: SIZES.md,
        marginTop: SIZES.md,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.sm,
    },
    title: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    refreshButton: {
        padding: SIZES.xs,
        borderRadius: SIZES.radiusFull,
        backgroundColor: `${COLORS.primary}10`,
    },
    pressed: {
        opacity: 0.7,
    },
    spinning: {
        opacity: 0.5,
    },
    rateCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.md,
    },
    currencyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.sm,
        flex: 1,
    },
    flag: {
        fontSize: 28,
    },
    currencyCode: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    currencyAmount: {
        fontSize: SIZES.fontXl,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    arrowContainer: {
        width: 36,
        height: 36,
        borderRadius: SIZES.radiusFull,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    helperText: {
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: SIZES.sm,
    },
});
