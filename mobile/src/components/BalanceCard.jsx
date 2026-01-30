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
        const absAmount = Math.abs(amount);
        // Shorten large amounts
        if (absAmount >= 10000000) {
            return `${homeCurrency.symbol}${(absAmount / 10000000).toFixed(1)}Cr`;
        } else if (absAmount >= 100000) {
            return `${homeCurrency.symbol}${(absAmount / 100000).toFixed(1)}L`;
        } else if (absAmount >= 1000) {
            return `${homeCurrency.symbol}${(absAmount / 1000).toFixed(1)}K`;
        }
        return `${homeCurrency.symbol}${absAmount.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    const formatFullCurrency = (amount) => {
        return `${homeCurrency.symbol}${Math.abs(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    return (
        <LinearGradient
            colors={['#2563EB', '#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Decorative circles */}
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />

            <View style={styles.header}>
                <View style={styles.balanceContainer}>
                    <Text style={styles.label}>Total Balance</Text>
                    <Text
                        style={styles.balance}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.6}
                    >
                        {balance >= 0 ? '' : '-'}{formatFullCurrency(balance)}
                    </Text>
                </View>
                <View style={styles.currencyBadge}>
                    <Text style={styles.currencyFlag}>{homeCurrency.flag}</Text>
                    <Text style={styles.currencyCode}>{homeCurrency.code}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.statContainer}>
                    <View style={[styles.iconContainer, styles.incomeIcon]}>
                        <Ionicons name="arrow-down" size={SIZES.fontMd} color="#10B981" />
                    </View>
                    <View style={styles.statTextContainer}>
                        <Text style={styles.statLabel} numberOfLines={1}>Income</Text>
                        <Text
                            style={styles.statValue}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                        >
                            {formatCurrency(income)}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statContainer}>
                    <View style={[styles.iconContainer, styles.expenseIcon]}>
                        <Ionicons name="arrow-up" size={SIZES.fontMd} color="#EF4444" />
                    </View>
                    <View style={styles.statTextContainer}>
                        <Text style={styles.statLabel} numberOfLines={1}>Expenses</Text>
                        <Text
                            style={styles.statValue}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                        >
                            {formatCurrency(expense)}
                        </Text>
                    </View>
                </View>
            </View>

            {travelMode && lastUpdated && (
                <View style={styles.travelBadge}>
                    <Ionicons name="airplane" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.lastUpdated} numberOfLines={1}>
                        Travel Mode • Updated {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.radiusXl,
        padding: SIZES.md,
        marginHorizontal: SIZES.md,
        marginTop: SIZES.sm,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        top: -40,
        right: -20,
    },
    decorCircle2: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        bottom: -15,
        left: -15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SIZES.md,
    },
    balanceContainer: {
        flex: 1,
        marginRight: SIZES.sm,
    },
    label: {
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: SIZES.fontSm,
        fontWeight: '500',
        marginBottom: 4,
    },
    balance: {
        color: COLORS.textLight,
        fontSize: SIZES.font3xl,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    currencyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SIZES.sm,
        paddingVertical: 6,
        borderRadius: SIZES.radiusFull,
    },
    currencyFlag: {
        fontSize: SIZES.fontMd,
        marginRight: 4,
    },
    currencyCode: {
        color: COLORS.textLight,
        fontSize: SIZES.fontSm,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: SIZES.radiusLg,
        padding: SIZES.md,
    },
    statContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: SIZES.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.sm,
        flexShrink: 0,
    },
    incomeIcon: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
    },
    expenseIcon: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    statTextContainer: {
        flex: 1,
        minWidth: 0,
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.65)',
        fontSize: SIZES.fontXs,
        marginBottom: 1,
    },
    statValue: {
        color: COLORS.textLight,
        fontSize: SIZES.fontMd,
        fontWeight: '600',
    },
    divider: {
        width: 1,
        height: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        marginHorizontal: SIZES.sm,
    },
    travelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SIZES.md,
        paddingVertical: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: SIZES.radiusMd,
    },
    lastUpdated: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: SIZES.fontXs,
        marginLeft: 6,
    },
});
