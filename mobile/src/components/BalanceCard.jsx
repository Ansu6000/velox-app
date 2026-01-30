import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
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
            colors={['#2563EB', '#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Decorative circles */}
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />

            <View style={styles.header}>
                <View>
                    <Text style={styles.label}>Total Balance</Text>
                    <Text style={styles.balance}>
                        {balance >= 0 ? '' : '-'}{formatCurrency(balance)}
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
                        <Ionicons name="arrow-down" size={16} color="#10B981" />
                    </View>
                    <View>
                        <Text style={styles.statLabel}>Income</Text>
                        <Text style={styles.statValue}>{formatCurrency(income)}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statContainer}>
                    <View style={[styles.iconContainer, styles.expenseIcon]}>
                        <Ionicons name="arrow-up" size={16} color="#EF4444" />
                    </View>
                    <View>
                        <Text style={styles.statLabel}>Expenses</Text>
                        <Text style={styles.statValue}>{formatCurrency(expense)}</Text>
                    </View>
                </View>
            </View>

            {travelMode && lastUpdated && (
                <View style={styles.travelBadge}>
                    <Ionicons name="airplane" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.lastUpdated}>
                        Travel Mode • Rates: {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.radiusXl,
        padding: SIZES.lg,
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
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        top: -50,
        right: -30,
    },
    decorCircle2: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        bottom: -20,
        left: -20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SIZES.md,
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
        gap: 4,
    },
    currencyFlag: {
        fontSize: SIZES.fontMd,
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
        gap: SIZES.sm,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: SIZES.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
    },
    incomeIcon: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
    },
    expenseIcon: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.65)',
        fontSize: SIZES.fontXs,
        marginBottom: 2,
    },
    statValue: {
        color: COLORS.textLight,
        fontSize: SIZES.fontMd,
        fontWeight: '600',
    },
    divider: {
        width: 1,
        height: 36,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        marginHorizontal: SIZES.md,
    },
    travelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: SIZES.md,
        paddingVertical: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: SIZES.radiusMd,
    },
    lastUpdated: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: SIZES.fontXs,
    },
});
