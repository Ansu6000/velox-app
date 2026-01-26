import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/colors';
import { useApp } from '../context/AppContext';

export default function BalanceCard() {
    const { getSummary, homeCurrency, lastUpdated, travelMode } = useApp();
    const { balance, income, expense } = getSummary();

    const formatCurrency = (amount) => {
        return `${homeCurrency.symbol}${Math.abs(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    return (
        <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.label}>Total Balance</Text>
                <View style={styles.currencyBadge}>
                    <Text style={styles.currencyFlag}>{homeCurrency.flag}</Text>
                    <Text style={styles.currencyCode}>{homeCurrency.code}</Text>
                </View>
            </View>

            <Text style={styles.balance}>
                {balance >= 0 ? '' : '-'}{formatCurrency(balance)}
            </Text>

            <View style={styles.row}>
                <View style={styles.statContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="arrow-down" size={18} color={COLORS.white} />
                    </View>
                    <View>
                        <Text style={styles.statLabel}>Income (+)</Text>
                        <Text style={styles.statValue}>{formatCurrency(income)}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="arrow-up" size={18} color={COLORS.white} />
                    </View>
                    <View>
                        <Text style={styles.statLabel}>Expenses (-)</Text>
                        <Text style={styles.statValue}>{formatCurrency(expense)}</Text>
                    </View>
                </View>
            </View>

            {travelMode && lastUpdated && (
                <Text style={styles.lastUpdated}>
                    Rates updated: {new Date(lastUpdated).toLocaleTimeString()}
                </Text>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.radiusXl,
        padding: SIZES.lg,
        marginHorizontal: SIZES.md,
        marginTop: SIZES.md,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.xs,
    },
    label: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: SIZES.fontMd,
        fontWeight: '500',
    },
    currencyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SIZES.sm,
        paddingVertical: SIZES.xs,
        borderRadius: SIZES.radiusFull,
    },
    currencyFlag: {
        fontSize: SIZES.fontLg,
        marginRight: SIZES.xs,
    },
    currencyCode: {
        color: COLORS.textLight,
        fontSize: SIZES.fontSm,
        fontWeight: '600',
    },
    balance: {
        color: COLORS.textLight,
        fontSize: SIZES.font4xl,
        fontWeight: '700',
        marginVertical: SIZES.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: SIZES.radiusLg,
        padding: SIZES.md,
        marginTop: SIZES.sm,
    },
    statContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.sm,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: SIZES.radiusFull,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: SIZES.fontSm,
        marginBottom: 2,
    },
    statValue: {
        color: COLORS.textLight,
        fontSize: SIZES.fontLg,
        fontWeight: '600',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: SIZES.md,
    },
    lastUpdated: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: SIZES.fontXs,
        textAlign: 'center',
        marginTop: SIZES.sm,
    },
});
