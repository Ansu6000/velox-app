import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    StatusBar,
    Pressable,
    Image,
    Modal,
    TextInput,
    FlatList,
    Dimensions,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../src/constants/colors';
import { useApp } from '../../src/context/AppContext';
import { useAuth } from '../../src/context/AuthContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, EXPENSE_PAYMENT_TYPES, INCOME_PAYMENT_TYPES } from '../../src/constants/categories';
import BalanceCard from '../../src/components/BalanceCard';
import TransactionItem from '../../src/components/TransactionItem';
import { showAlert, showSimpleAlert } from '../../src/utils/alert';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
    const { user } = useAuth();
    const { transactions, deleteTransaction, updateTransaction, fetchExchangeRates, spendingCurrency, homeCurrency, isLoading } = useApp();
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    // Edit Modal State
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editCategory, setEditCategory] = useState(null);
    const [editPaymentType, setEditPaymentType] = useState(null);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showPaymentTypePicker, setShowPaymentTypePicker] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchExchangeRates(spendingCurrency.code);
        setRefreshing(false);
    };

    const handleDelete = (id) => {
        showAlert(
            'Delete Transaction',
            'Are you sure you want to delete this transaction?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteTransaction(id)
                },
            ]
        );
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setEditTitle(transaction.title);
        setEditAmount(transaction.amount.toString());

        const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
        const allPaymentTypes = [...EXPENSE_PAYMENT_TYPES, ...INCOME_PAYMENT_TYPES];

        setEditCategory(allCategories.find(c => c.id === transaction.category) || null);
        setEditPaymentType(allPaymentTypes.find(pt => pt.id === transaction.paymentType) || null);
        setEditModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!editTitle.trim()) {
            showSimpleAlert('Error', 'Please enter a title');
            return;
        }
        if (!editAmount || parseFloat(editAmount) <= 0) {
            showSimpleAlert('Error', 'Please enter a valid amount');
            return;
        }

        try {
            const updatedTransaction = {
                ...editingTransaction,
                title: editTitle.trim(),
                amount: parseFloat(editAmount),
                category: editCategory?.id || editingTransaction.category,
                paymentType: editPaymentType?.id || editingTransaction.paymentType,
            };

            await updateTransaction(updatedTransaction);
            setEditModalVisible(false);
            setEditingTransaction(null);
            showSimpleAlert('Success', 'Transaction updated successfully');
        } catch (error) {
            showSimpleAlert('Error', 'Failed to update transaction');
        }
    };

    const getCategories = () => {
        return editingTransaction?.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    };

    const getPaymentTypes = () => {
        const baseTypes = editingTransaction?.type === 'expense' ? EXPENSE_PAYMENT_TYPES : INCOME_PAYMENT_TYPES;
        return baseTypes.filter(pt => !pt.indiaOnly || homeCurrency.code === 'INR');
    };

    const recentTransactions = transactions.slice(0, 15);

    // Quick stats
    const todayExpenses = useMemo(() => {
        const today = new Date().toDateString();
        return transactions
            .filter(t => t.type === 'expense' && new Date(t.createdAt).toDateString() === today)
            .reduce((sum, t) => sum + Math.abs(t.convertedAmount || t.amount), 0);
    }, [transactions]);

    const todayIncome = useMemo(() => {
        const today = new Date().toDateString();
        return transactions
            .filter(t => t.type === 'income' && new Date(t.createdAt).toDateString() === today)
            .reduce((sum, t) => sum + (t.convertedAmount || t.amount), 0);
    }, [transactions]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        style={styles.headerButton}
                        onPress={() => router.push('/(tabs)/settings')}
                    >
                        <Ionicons name="settings-outline" size={22} color={COLORS.textPrimary} />
                    </Pressable>
                    <View style={styles.greetingContainer}>
                        <View style={styles.brandContainer}>
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.brandName}>Velox</Text>
                        </View>
                        <Text style={styles.subtitle}>Welcome back, {user?.name?.split(' ')[0] || 'User'}</Text>
                    </View>
                    <Pressable style={styles.headerButton}>
                        <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
                        <View style={styles.notificationBadge} />
                    </Pressable>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.primary}
                        />
                    }
                >
                    {/* Balance Card */}
                    <BalanceCard />

                    {/* Quick Stats */}
                    <View style={styles.quickStats}>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: `${COLORS.danger}12` }]}>
                                <Ionicons name="arrow-up" size={SIZES.fontMd} color={COLORS.danger} />
                            </View>
                            <View style={styles.statTextContainer}>
                                <Text style={styles.statLabel} numberOfLines={1}>Today's Spent</Text>
                                <Text
                                    style={[styles.statValue, { color: COLORS.danger }]}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.7}
                                >
                                    {homeCurrency.symbol}{todayExpenses.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: `${COLORS.success}12` }]}>
                                <Ionicons name="arrow-down" size={SIZES.fontMd} color={COLORS.success} />
                            </View>
                            <View style={styles.statTextContainer}>
                                <Text style={styles.statLabel} numberOfLines={1}>Today's Income</Text>
                                <Text
                                    style={[styles.statValue, { color: COLORS.success }]}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.7}
                                >
                                    {homeCurrency.symbol}{todayIncome.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Recent Transactions */}
                    <View style={styles.transactionsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Transactions</Text>
                            {transactions.length > 15 && (
                                <Pressable style={styles.seeAllButton}>
                                    <Text style={styles.seeAllText}>See All</Text>
                                    <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                                </Pressable>
                            )}
                        </View>

                        {recentTransactions.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconContainer}>
                                    <Ionicons name="receipt-outline" size={48} color={COLORS.textMuted} />
                                </View>
                                <Text style={styles.emptyTitle}>No transactions yet</Text>
                                <Text style={styles.emptySubtitle}>
                                    Start tracking your expenses by tapping the + button below
                                </Text>
                            </View>
                        ) : (
                            recentTransactions.map((transaction) => (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                />
                            ))
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Edit Transaction Modal */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <Pressable style={styles.modalBackdrop} onPress={() => setEditModalVisible(false)} />
                    <View style={styles.editModalContainer}>
                        <View style={styles.modalHandle} />
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Transaction</Text>
                            <Pressable onPress={() => setEditModalVisible(false)} style={styles.modalClose}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
                            {/* Title */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Title</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="create-outline" size={20} color={COLORS.textMuted} />
                                    <TextInput
                                        style={styles.textInput}
                                        value={editTitle}
                                        onChangeText={setEditTitle}
                                        placeholder="Transaction title"
                                        placeholderTextColor={COLORS.textMuted}
                                    />
                                </View>
                            </View>

                            {/* Amount */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Amount</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.currencySymbol}>{homeCurrency.symbol}</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={editAmount}
                                        onChangeText={setEditAmount}
                                        placeholder="0.00"
                                        placeholderTextColor={COLORS.textMuted}
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                            </View>

                            {/* Category */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Category</Text>
                                <Pressable
                                    style={styles.dropdownButton}
                                    onPress={() => setShowCategoryPicker(true)}
                                >
                                    {editCategory ? (
                                        <View style={styles.dropdownSelected}>
                                            <View style={[styles.miniIcon, { backgroundColor: `${editCategory.color}15` }]}>
                                                <Ionicons name={editCategory.icon} size={18} color={editCategory.color} />
                                            </View>
                                            <Text style={styles.dropdownValue}>{editCategory.label}</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.dropdownPlaceholder}>Select category</Text>
                                    )}
                                    <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
                                </Pressable>
                            </View>

                            {/* Payment Type */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    {editingTransaction?.type === 'expense' ? 'Payment Type' : 'Credited Via'}
                                </Text>
                                <Pressable
                                    style={styles.dropdownButton}
                                    onPress={() => setShowPaymentTypePicker(true)}
                                >
                                    {editPaymentType ? (
                                        <View style={styles.dropdownSelected}>
                                            <View style={[styles.miniIcon, { backgroundColor: `${editPaymentType.color}15` }]}>
                                                <Ionicons name={editPaymentType.icon} size={18} color={editPaymentType.color} />
                                            </View>
                                            <Text style={styles.dropdownValue}>{editPaymentType.label}</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.dropdownPlaceholder}>Select payment type</Text>
                                    )}
                                    <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
                                </Pressable>
                            </View>
                        </ScrollView>

                        {/* Save Button */}
                        <View style={styles.modalFooter}>
                            <Pressable style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.saveButton} onPress={handleSaveEdit}>
                                <Ionicons name="checkmark" size={20} color={COLORS.white} />
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Category Picker Modal */}
            <Modal
                visible={showCategoryPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCategoryPicker(false)}
            >
                <View style={styles.pickerModalOverlay}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setShowCategoryPicker(false)} />
                    <View style={styles.pickerModalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Category</Text>
                            <Pressable onPress={() => setShowCategoryPicker(false)} style={styles.modalClose}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </Pressable>
                        </View>
                        <FlatList
                            data={getCategories()}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[styles.pickerItem, editCategory?.id === item.id && styles.pickerItemSelected]}
                                    onPress={() => {
                                        setEditCategory(item);
                                        setShowCategoryPicker(false);
                                    }}
                                >
                                    <View style={[styles.pickerIcon, { backgroundColor: `${item.color}15` }]}>
                                        <Ionicons name={item.icon} size={22} color={item.color} />
                                    </View>
                                    <Text style={styles.pickerLabel}>{item.label}</Text>
                                    {editCategory?.id === item.id && (
                                        <Ionicons name="checkmark-circle" size={22} color={item.color} />
                                    )}
                                </Pressable>
                            )}
                            contentContainerStyle={styles.pickerList}
                        />
                    </View>
                </View>
            </Modal>

            {/* Payment Type Picker Modal */}
            <Modal
                visible={showPaymentTypePicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowPaymentTypePicker(false)}
            >
                <View style={styles.pickerModalOverlay}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setShowPaymentTypePicker(false)} />
                    <View style={styles.pickerModalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Payment Type</Text>
                            <Pressable onPress={() => setShowPaymentTypePicker(false)} style={styles.modalClose}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </Pressable>
                        </View>
                        <FlatList
                            data={getPaymentTypes()}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[styles.pickerItem, editPaymentType?.id === item.id && styles.pickerItemSelected]}
                                    onPress={() => {
                                        setEditPaymentType(item);
                                        setShowPaymentTypePicker(false);
                                    }}
                                >
                                    <View style={[styles.pickerIcon, { backgroundColor: `${item.color}15` }]}>
                                        <Ionicons name={item.icon} size={22} color={item.color} />
                                    </View>
                                    <Text style={styles.pickerLabel}>{item.label}</Text>
                                    {editPaymentType?.id === item.id && (
                                        <Ionicons name="checkmark-circle" size={22} color={item.color} />
                                    )}
                                </Pressable>
                            )}
                            contentContainerStyle={styles.pickerList}
                        />
                    </View>
                </View>
            </Modal>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.sm,
    },
    greetingContainer: {
        flex: 1,
        marginHorizontal: SIZES.sm,
        alignItems: 'center',
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.xs,
    },
    logo: {
        width: 26,
        height: 26,
    },
    brandName: {
        fontSize: SIZES.fontXl,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    headerButton: {
        width: 42,
        height: 42,
        borderRadius: SIZES.radiusMd,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: SIZES.radiusFull,
        backgroundColor: COLORS.danger,
    },
    scrollContent: {
        paddingBottom: 120,
        flexGrow: 1,
    },
    quickStats: {
        flexDirection: 'row',
        paddingHorizontal: SIZES.md,
        marginTop: SIZES.md,
    },
    statCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SIZES.sm,
        borderRadius: SIZES.radiusLg,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
        marginRight: SIZES.sm,
    },
    statIcon: {
        width: 32,
        height: 32,
        borderRadius: SIZES.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.sm,
        flexShrink: 0,
    },
    statTextContainer: {
        flex: 1,
        minWidth: 0,
    },
    statLabel: {
        fontSize: SIZES.fontXs,
        color: COLORS.textMuted,
        marginBottom: 1,
    },
    statValue: {
        fontSize: SIZES.fontMd,
        fontWeight: '700',
    },
    transactionsSection: {
        marginTop: SIZES.lg,
        paddingHorizontal: SIZES.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.md,
    },
    sectionTitle: {
        fontSize: SIZES.fontLg,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seeAllText: {
        fontSize: SIZES.fontSm,
        color: COLORS.primary,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SIZES.xxl,
        paddingHorizontal: SIZES.lg,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: SIZES.radiusFull,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.md,
    },
    emptyTitle: {
        fontSize: SIZES.fontLg,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SIZES.xs,
    },
    emptySubtitle: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    editModalContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: SIZES.radiusXl,
        borderTopRightRadius: SIZES.radiusXl,
        maxHeight: SCREEN_HEIGHT * 0.85,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: SIZES.sm,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: SIZES.fontXl,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    modalClose: {
        padding: SIZES.xs,
    },
    modalBody: {
        padding: SIZES.lg,
    },
    inputGroup: {
        marginBottom: SIZES.lg,
    },
    inputLabel: {
        fontSize: SIZES.fontSm,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SIZES.sm,
        marginLeft: 2,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: SIZES.radiusMd,
        paddingHorizontal: SIZES.md,
        height: 52,
        gap: SIZES.sm,
    },
    textInput: {
        flex: 1,
        fontSize: SIZES.fontMd,
        color: COLORS.textPrimary,
    },
    currencySymbol: {
        fontSize: SIZES.fontLg,
        fontWeight: '600',
        color: COLORS.primary,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: SIZES.radiusMd,
        paddingHorizontal: SIZES.md,
        height: 52,
    },
    dropdownSelected: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.sm,
    },
    dropdownValue: {
        fontSize: SIZES.fontMd,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    dropdownPlaceholder: {
        fontSize: SIZES.fontMd,
        color: COLORS.textMuted,
    },
    miniIcon: {
        width: 32,
        height: 32,
        borderRadius: SIZES.radiusSm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: SIZES.lg,
        paddingBottom: Platform.OS === 'ios' ? SIZES.xl : SIZES.lg,
        gap: SIZES.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    cancelButton: {
        flex: 1,
        height: 50,
        borderRadius: SIZES.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundSecondary,
    },
    cancelButtonText: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    saveButton: {
        flex: 2,
        flexDirection: 'row',
        height: 50,
        borderRadius: SIZES.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        gap: SIZES.xs,
    },
    saveButtonText: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: COLORS.white,
    },
    // Picker Modal
    pickerModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    pickerModalContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: SIZES.radiusXl,
        borderTopRightRadius: SIZES.radiusXl,
        maxHeight: SCREEN_HEIGHT * 0.6,
        paddingBottom: Platform.OS === 'ios' ? SIZES.xl : SIZES.lg,
    },
    pickerList: {
        padding: SIZES.md,
    },
    pickerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.md,
        borderRadius: SIZES.radiusMd,
        marginBottom: SIZES.xs,
        gap: SIZES.md,
    },
    pickerItemSelected: {
        backgroundColor: COLORS.backgroundSecondary,
    },
    pickerIcon: {
        width: 44,
        height: 44,
        borderRadius: SIZES.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerLabel: {
        flex: 1,
        fontSize: SIZES.fontMd,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
});
