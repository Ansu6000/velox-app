import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/colors';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, EXPENSE_PAYMENT_TYPES, INCOME_PAYMENT_TYPES } from '../constants/categories';
import { useApp } from '../context/AppContext';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TransactionItem({ transaction, onDelete, onEdit }) {
    const { homeCurrency } = useApp();
    const [isExpanded, setIsExpanded] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
    const allPaymentTypes = [...EXPENSE_PAYMENT_TYPES, ...INCOME_PAYMENT_TYPES];
    const category = allCategories.find(c => c.id === transaction.category) || { label: 'Other', color: '#64748B', icon: 'ellipsis-horizontal' };
    const paymentType = allPaymentTypes.find(pt => pt.id === transaction.paymentType);

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
                month: 'short',
            });
        }
    };

    const formatFullDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handlePress = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable
                style={[styles.container, isExpanded && styles.containerExpanded]}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                {/* Main Row */}
                <View style={styles.mainRow}>
                    <View style={[styles.iconContainer, { backgroundColor: `${category.color}12` }]}>
                        <Ionicons name={category.icon} size={SIZES.fontXl} color={category.color} />
                    </View>

                    <View style={styles.details}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                            {transaction.title}
                        </Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.category} numberOfLines={1}>{category.label}</Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.date} numberOfLines={1}>{formatDate(transaction.createdAt)}</Text>
                        </View>
                    </View>

                    <View style={styles.amountContainer}>
                        <Text
                            style={[styles.amount, isExpense ? styles.expense : styles.income]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                        >
                            {isExpense ? '-' : '+'}{formatCurrency(transaction.convertedAmount)}
                        </Text>
                        <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={SIZES.fontMd}
                            color={COLORS.textMuted}
                            style={styles.chevron}
                        />
                    </View>
                </View>

                {/* Expanded Details */}
                {isExpanded && (
                    <View style={styles.expandedSection}>
                        <View style={styles.divider} />

                        {/* Details Grid */}
                        <View style={styles.detailsGrid}>
                            {/* Payment Type */}
                            <View style={styles.detailItem}>
                                <View style={styles.detailIcon}>
                                    <Ionicons
                                        name={paymentType?.icon || "wallet-outline"}
                                        size={SIZES.fontMd}
                                        color={paymentType?.color || COLORS.textMuted}
                                    />
                                </View>
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailLabel} numberOfLines={1}>
                                        {isExpense ? 'Paid via' : 'Received via'}
                                    </Text>
                                    <Text style={styles.detailValue} numberOfLines={1}>
                                        {paymentType?.label || 'Not specified'}
                                    </Text>
                                </View>
                            </View>

                            {/* Date & Time */}
                            <View style={styles.detailItem}>
                                <View style={styles.detailIcon}>
                                    <Ionicons name="calendar-outline" size={SIZES.fontMd} color={COLORS.primary} />
                                </View>
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailLabel} numberOfLines={1}>Date</Text>
                                    <Text style={styles.detailValue} numberOfLines={1}>
                                        {formatFullDate(transaction.createdAt)}
                                    </Text>
                                </View>
                            </View>

                            {/* Transaction Type */}
                            <View style={styles.detailItem}>
                                <View style={styles.detailIcon}>
                                    <Ionicons
                                        name={isExpense ? "arrow-up-circle-outline" : "arrow-down-circle-outline"}
                                        size={SIZES.fontMd}
                                        color={isExpense ? COLORS.danger : COLORS.success}
                                    />
                                </View>
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailLabel} numberOfLines={1}>Type</Text>
                                    <Text style={[styles.detailValue, { color: isExpense ? COLORS.danger : COLORS.success }]} numberOfLines={1}>
                                        {isExpense ? 'Expense' : 'Income'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <Pressable
                                style={styles.editButton}
                                onPress={() => onEdit?.(transaction)}
                            >
                                <Ionicons name="create-outline" size={SIZES.fontLg} color={COLORS.primary} />
                                <Text style={styles.editButtonText}>Edit</Text>
                            </Pressable>

                            <Pressable
                                style={styles.deleteButton}
                                onPress={() => onDelete?.(transaction.id)}
                            >
                                <Ionicons name="trash-outline" size={SIZES.fontLg} color={COLORS.danger} />
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: SIZES.sm,
    },
    container: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusLg,
        padding: SIZES.md,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    containerExpanded: {
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: SIZES.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.sm,
        flexShrink: 0,
    },
    details: {
        flex: 1,
        marginRight: SIZES.sm,
        minWidth: 0, // Important: allows flex child to shrink below content size
    },
    title: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    category: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        flexShrink: 1,
    },
    dot: {
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
        marginHorizontal: 4,
    },
    date: {
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
        flexShrink: 0,
    },
    amountContainer: {
        alignItems: 'flex-end',
        flexShrink: 0,
        maxWidth: '35%',
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
    chevron: {
        marginTop: 4,
    },
    expandedSection: {
        marginTop: SIZES.md,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: SIZES.md,
    },
    detailsGrid: {
        marginBottom: SIZES.sm,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.sm,
    },
    detailIcon: {
        width: 32,
        height: 32,
        borderRadius: SIZES.radiusSm,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.sm,
        flexShrink: 0,
    },
    detailTextContainer: {
        flex: 1,
        minWidth: 0,
    },
    detailLabel: {
        fontSize: SIZES.fontXs,
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailValue: {
        fontSize: SIZES.fontSm,
        color: COLORS.textPrimary,
        fontWeight: '500',
        marginTop: 1,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: SIZES.sm,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SIZES.sm,
        borderRadius: SIZES.radiusMd,
        backgroundColor: `${COLORS.primary}10`,
        borderWidth: 1,
        borderColor: `${COLORS.primary}20`,
        marginRight: SIZES.sm,
    },
    editButtonText: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: COLORS.primary,
        marginLeft: 6,
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SIZES.sm,
        borderRadius: SIZES.radiusMd,
        backgroundColor: `${COLORS.danger}08`,
        borderWidth: 1,
        borderColor: `${COLORS.danger}15`,
    },
    deleteButtonText: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: COLORS.danger,
        marginLeft: 6,
    },
});
