import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/colors';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { useApp } from '../context/AppContext';

export default function TransactionItem({ transaction, onDelete }) {
    const { homeCurrency } = useApp();

    const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
    const category = allCategories.find(c => c.id === transaction.category) || allCategories[allCategories.length - 1];

    const isExpense = transaction.type === 'expense';

    const formatCurrency = (amount) => {
        return `${homeCurrency.symbol}${Math.abs(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short'
            });
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed
            ]}
            onLongPress={() => onDelete?.(transaction.id)}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
                <Ionicons name={category.icon} size={24} color={category.color} />
            </View>

            <View style={styles.details}>
                <Text style={styles.title} numberOfLines={1}>{transaction.title}</Text>
                <View style={styles.metaRow}>
                    <Text style={styles.category}>{category.label}</Text>
                    <View style={styles.dot} />
                    <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
                </View>
            </View>

            <View style={styles.amountContainer}>
                <Text style={[styles.amount, isExpense ? styles.expense : styles.income]}>
                    {isExpense ? '-' : '+'}{formatCurrency(transaction.convertedAmount)}
                </Text>
                {transaction.originalCurrency !== homeCurrency.code && (
                    <Text style={styles.originalAmount}>
                        {transaction.originalCurrency} {transaction.amount.toFixed(2)}
                    </Text>
                )}
            </View>

            <Pressable
                style={styles.deleteButton}
                onPress={() => onDelete?.(transaction.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
            </Pressable>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SIZES.md,
        borderRadius: SIZES.radiusLg,
        marginBottom: SIZES.sm,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: SIZES.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.md,
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: SIZES.fontLg,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    category: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: SIZES.radiusFull,
        backgroundColor: COLORS.textMuted,
        marginHorizontal: SIZES.xs,
    },
    date: {
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: SIZES.fontLg,
        fontWeight: '700',
    },
    expense: {
        color: COLORS.danger,
    },
    income: {
        color: COLORS.success,
    },
    originalAmount: {
        fontSize: SIZES.fontXs,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    deleteButton: {
        padding: SIZES.md,
        marginLeft: SIZES.sm,
        borderRadius: SIZES.radiusMd,
        backgroundColor: `${COLORS.danger}12`,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
