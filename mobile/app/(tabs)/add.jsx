import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ScrollView,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Modal,
    FlatList,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../src/constants/colors';
import {
    EXPENSE_CATEGORIES,
    INCOME_CATEGORIES,
    EXPENSE_PAYMENT_TYPES,
    INCOME_PAYMENT_TYPES
} from '../../src/constants/categories';
import { useApp } from '../../src/context/AppContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AddTransactionScreen() {
    const router = useRouter();
    const { addTransaction, spendingCurrency, homeCurrency, exchangeRates, travelMode } = useApp();

    const [type, setType] = useState('expense');
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [date, setDate] = useState(new Date()); // Default to today
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPaymentTypePicker, setShowPaymentTypePicker] = useState(false);

    // Generate last 30 days for date picker
    const recentDates = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
    });

    const formatDateDisplay = (dateObj) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateObj.toDateString() === today.toDateString()) return 'Today';
        if (dateObj.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    // Filter payment types based on type and currency
    const availablePaymentTypes = useMemo(() => {
        const baseTypes = type === 'expense' ? EXPENSE_PAYMENT_TYPES : INCOME_PAYMENT_TYPES;
        // Filter out UPI if home currency is not INR
        return baseTypes.filter(pt => {
            if (pt.indiaOnly && homeCurrency.code !== 'INR') {
                return false;
            }
            return true;
        });
    }, [type, homeCurrency.code]);

    const convertedAmount = amount
        ? (parseFloat(amount) * (exchangeRates[homeCurrency.code] || 1)).toFixed(2)
        : '0.00';

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        if (!category) {
            Alert.alert('Error', 'Please select a category');
            return;
        }
        if (!paymentType) {
            Alert.alert('Error', `Please select ${type === 'expense' ? 'a payment type' : 'how the amount was credited'}`);
            return;
        }

        try {
            setIsSubmitting(true);
            await addTransaction({
                title: title.trim(),
                amount: parseFloat(amount),
                category: category.id,
                paymentType: paymentType.id,
                type,
                date: date,
            });

            setTitle('');
            setAmount('');
            setCategory(null);
            setPaymentType(null);
            setDate(new Date());

            Alert.alert('Success', 'Transaction added successfully', [
                { text: 'OK', onPress: () => router.push('/') }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to add transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset payment type when switching transaction type
    const handleTypeChange = (newType) => {
        setType(newType);
        setCategory(null);
        setPaymentType(null);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Add Transaction</Text>
                    </View>

                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Type Toggle */}
                        <View style={styles.typeToggle}>
                            <Pressable
                                style={[styles.toggleButton, type === 'expense' && styles.toggleActive]}
                                onPress={() => handleTypeChange('expense')}
                            >
                                <Ionicons
                                    name="arrow-up-circle"
                                    size={20}
                                    color={type === 'expense' ? COLORS.white : COLORS.danger}
                                />
                                <Text style={[styles.toggleText, type === 'expense' && styles.toggleTextActive]}>
                                    Expense
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[styles.toggleButton, styles.toggleIncome, type === 'income' && styles.toggleIncomeActive]}
                                onPress={() => handleTypeChange('income')}
                            >
                                <Ionicons
                                    name="arrow-down-circle"
                                    size={20}
                                    color={type === 'income' ? COLORS.white : COLORS.success}
                                />
                                <Text style={[
                                    styles.toggleText,
                                    styles.toggleTextIncome,
                                    type === 'income' && styles.toggleTextActive
                                ]}>
                                    Income
                                </Text>
                            </Pressable>
                        </View>

                        {/* Amount Input */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Amount</Text>
                            <View style={styles.amountInputContainer}>
                                <Text style={styles.currencySymbol}>
                                    {travelMode ? spendingCurrency.symbol : homeCurrency.symbol}
                                </Text>
                                <TextInput
                                    style={styles.amountInput}
                                    placeholder="0.00"
                                    placeholderTextColor={COLORS.textMuted}
                                    keyboardType="decimal-pad"
                                    value={amount}
                                    onChangeText={setAmount}
                                />
                                {travelMode && (
                                    <View style={styles.currencyBadge}>
                                        <Text style={styles.currencyFlag}>{spendingCurrency.flag}</Text>
                                        <Text style={styles.currencyCode}>{spendingCurrency.code}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Conversion Preview */}
                            {travelMode && amount && spendingCurrency.code !== homeCurrency.code && (
                                <View style={styles.conversionPreview}>
                                    <Ionicons name="swap-horizontal" size={16} color={COLORS.primary} />
                                    <Text style={styles.conversionText}>
                                        ≈ {homeCurrency.symbol}{convertedAmount} {homeCurrency.code}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Date Selection */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Date</Text>
                            <Pressable
                                style={styles.textInputContainer}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Ionicons name="calendar-outline" size={20} color={COLORS.textMuted} />
                                <Text style={styles.textInput}>
                                    {formatDateDisplay(date)}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
                            </Pressable>
                        </View>

                        {/* Title Input */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Title</Text>
                            <View style={styles.textInputContainer}>
                                <Ionicons name="create-outline" size={20} color={COLORS.textMuted} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="What was this for?"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                        </View>

                        {/* Category Selection (Dropdown Style) */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Category</Text>
                            <Pressable
                                style={styles.dropdownButton}
                                onPress={() => setShowCategoryPicker(true)}
                            >
                                <View style={styles.dropdownLeft}>
                                    {category ? (
                                        <>
                                            <View style={[styles.miniIcon, { backgroundColor: `${category.color}20` }]}>
                                                <Ionicons name={category.icon} size={20} color={category.color} />
                                            </View>
                                            <Text style={styles.dropdownValue}>{category.label}</Text>
                                        </>
                                    ) : (
                                        <>
                                            <Ionicons name="list-outline" size={20} color={COLORS.textMuted} />
                                            <Text style={styles.dropdownPlaceholder}>Select a category</Text>
                                        </>
                                    )}
                                </View>
                                <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
                            </Pressable>
                        </View>

                        {/* Payment Type Selection (NEW) */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>
                                {type === 'expense' ? 'Payment Type' : 'Credited Via'}
                            </Text>
                            <Pressable
                                style={styles.dropdownButton}
                                onPress={() => setShowPaymentTypePicker(true)}
                            >
                                <View style={styles.dropdownLeft}>
                                    {paymentType ? (
                                        <>
                                            <View style={[styles.miniIcon, { backgroundColor: `${paymentType.color}20` }]}>
                                                <Ionicons name={paymentType.icon} size={20} color={paymentType.color} />
                                            </View>
                                            <Text style={styles.dropdownValue}>{paymentType.label}</Text>
                                        </>
                                    ) : (
                                        <>
                                            <Ionicons name="wallet-outline" size={20} color={COLORS.textMuted} />
                                            <Text style={styles.dropdownPlaceholder}>
                                                {type === 'expense' ? 'Select payment type' : 'Select credit source'}
                                            </Text>
                                        </>
                                    )}
                                </View>
                                <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
                            </Pressable>
                        </View>
                    </ScrollView>

                    {/* Submit Button */}
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[
                                styles.submitButton,
                                type === 'income' && styles.submitButtonIncome,
                                isSubmitting && styles.submitButtonDisabled
                            ]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Ionicons
                                name={type === 'expense' ? 'arrow-up-circle' : 'arrow-down-circle'}
                                size={24}
                                color={COLORS.white}
                            />
                            <Text style={styles.submitButtonText}>
                                {isSubmitting ? 'Adding...' : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
                            </Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>

            {/* Category Picker Modal */}
            <Modal
                visible={showCategoryPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCategoryPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setShowCategoryPicker(false)} />
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Category</Text>
                            <Pressable onPress={() => setShowCategoryPicker(false)} style={styles.modalClose}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </Pressable>
                        </View>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item: cat }) => (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.categoryItem,
                                        pressed && styles.pressed,
                                        category?.id === cat.id && styles.selectedCategoryItem
                                    ]}
                                    onPress={() => {
                                        setCategory(cat);
                                        setShowCategoryPicker(false);
                                    }}
                                >
                                    <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}15` }]}>
                                        <Ionicons name={cat.icon} size={24} color={cat.color} />
                                    </View>
                                    <Text style={[styles.categoryLabel, category?.id === cat.id && { color: cat.color, fontWeight: '700' }]}>
                                        {cat.label}
                                    </Text>
                                    {category?.id === cat.id && (
                                        <Ionicons name="checkmark-circle" size={24} color={cat.color} />
                                    )}
                                </Pressable>
                            )}
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={styles.modalList}
                        />
                    </View>
                </View>
            </Modal>

            {/* Date Picker Modal */}
            <Modal
                visible={showDatePicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDatePicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setShowDatePicker(false)} />
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Date</Text>
                            <Pressable onPress={() => setShowDatePicker(false)} style={styles.modalClose}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </Pressable>
                        </View>
                        <FlatList
                            data={recentDates}
                            keyExtractor={(item) => item.toISOString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.categoryItem,
                                        pressed && styles.pressed,
                                        item.toDateString() === date.toDateString() && styles.selectedCategoryItem
                                    ]}
                                    onPress={() => {
                                        setDate(item);
                                        setShowDatePicker(false);
                                    }}
                                >
                                    <View style={[styles.categoryIcon, { backgroundColor: item.toDateString() === date.toDateString() ? `${COLORS.primary}20` : '#F1F5F9' }]}>
                                        <Ionicons
                                            name="calendar"
                                            size={24}
                                            color={item.toDateString() === date.toDateString() ? COLORS.primary : COLORS.textMuted}
                                        />
                                    </View>
                                    <Text style={[styles.categoryLabel, item.toDateString() === date.toDateString() && { color: COLORS.primary, fontWeight: '700' }]}>
                                        {formatDateDisplay(item)}
                                    </Text>
                                    {item.toDateString() === date.toDateString() && (
                                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                                    )}
                                </Pressable>
                            )}
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={styles.modalList}
                        />
                    </View>
                </View>
            </Modal>

            {/* Payment Type Picker Modal (NEW) */}
            <Modal
                visible={showPaymentTypePicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowPaymentTypePicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setShowPaymentTypePicker(false)} />
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {type === 'expense' ? 'Select Payment Type' : 'Select Credit Source'}
                            </Text>
                            <Pressable onPress={() => setShowPaymentTypePicker(false)} style={styles.modalClose}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </Pressable>
                        </View>
                        <FlatList
                            data={availablePaymentTypes}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item: pt }) => (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.categoryItem,
                                        pressed && styles.pressed,
                                        paymentType?.id === pt.id && styles.selectedCategoryItem
                                    ]}
                                    onPress={() => {
                                        setPaymentType(pt);
                                        setShowPaymentTypePicker(false);
                                    }}
                                >
                                    <View style={[styles.categoryIcon, { backgroundColor: `${pt.color}15` }]}>
                                        <Ionicons name={pt.icon} size={24} color={pt.color} />
                                    </View>
                                    <Text style={[styles.categoryLabel, paymentType?.id === pt.id && { color: pt.color, fontWeight: '700' }]}>
                                        {pt.label}
                                    </Text>
                                    {paymentType?.id === pt.id && (
                                        <Ionicons name="checkmark-circle" size={24} color={pt.color} />
                                    )}
                                </Pressable>
                            )}
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={styles.modalList}
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
    keyboardView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SIZES.lg,
        paddingVertical: SIZES.md,
    },
    headerTitle: {
        fontSize: SIZES.font2xl,
        fontWeight: '700',
        color: '#1E293B',
    },
    scrollContent: {
        paddingHorizontal: SIZES.lg,
        paddingBottom: 150,
        flexGrow: 1,
    },
    typeToggle: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusLg,
        padding: SIZES.xs,
        marginBottom: SIZES.lg,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SIZES.md,
        borderRadius: SIZES.radiusMd,
    },
    toggleIcon: {
        marginRight: SIZES.xs,
    },
    toggleActive: {
        backgroundColor: COLORS.danger,
    },
    toggleIncome: {},
    toggleIncomeActive: {
        backgroundColor: COLORS.success,
    },
    toggleText: {
        fontSize: SIZES.fontLg,
        fontWeight: '600',
        color: COLORS.danger,
    },
    toggleTextIncome: {
        color: COLORS.success,
    },
    toggleTextActive: {
        color: COLORS.white,
    },
    inputSection: {
        marginBottom: SIZES.lg,
    },
    label: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: '#334155',
        marginBottom: SIZES.sm,
        marginLeft: 4,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusLg,
        paddingHorizontal: SIZES.md,
        height: 80,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.primary,
        marginRight: SIZES.xs,
    },
    amountInput: {
        flex: 1,
        fontSize: 32,
        fontWeight: '700',
        color: '#1E293B',
    },
    currencyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: SIZES.sm,
        paddingVertical: SIZES.xs,
        borderRadius: SIZES.radiusFull,
    },
    currencyFlag: {
        fontSize: SIZES.fontLg,
    },
    currencyCode: {
        fontSize: SIZES.fontSm,
        fontWeight: '600',
        color: '#475569',
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusLg,
        paddingHorizontal: SIZES.md,
        height: 60,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        gap: SIZES.sm,
    },
    textInput: {
        flex: 1,
        fontSize: SIZES.fontLg,
        color: '#1E293B',
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusLg,
        paddingHorizontal: SIZES.md,
        height: 60,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dropdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.sm,
    },
    dropdownPlaceholder: {
        fontSize: SIZES.fontLg,
        color: COLORS.textMuted,
    },
    dropdownValue: {
        fontSize: SIZES.fontLg,
        color: '#1E293B',
        fontWeight: '500',
    },
    miniIcon: {
        width: 36,
        height: 36,
        borderRadius: SIZES.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        paddingHorizontal: SIZES.lg,
        paddingBottom: 90, // Significant padding to stay above the absolute tab bar
        backgroundColor: COLORS.background,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.danger,
        borderRadius: SIZES.radiusLg,
        paddingVertical: SIZES.lg,
        gap: SIZES.sm,
        shadowColor: COLORS.danger,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonIncome: {
        backgroundColor: COLORS.success,
        shadowColor: COLORS.success,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        fontSize: SIZES.fontLg,
        fontWeight: '700',
        color: COLORS.white,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: SIZES.radiusXl,
        borderTopRightRadius: SIZES.radiusXl,
        maxHeight: SCREEN_HEIGHT * 0.7,
        paddingBottom: SIZES.xl,
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
        color: '#1E293B',
    },
    modalClose: {
        padding: SIZES.xs,
    },
    modalList: {
        paddingHorizontal: SIZES.lg,
        paddingBottom: SIZES.xl,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.md,
        borderRadius: SIZES.radiusMd,
        marginTop: SIZES.sm,
        gap: SIZES.md,
    },
    selectedCategoryItem: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: SIZES.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryLabel: {
        flex: 1,
        fontSize: SIZES.fontLg,
        color: '#334155',
    },
    pressed: {
        backgroundColor: '#F1F5F9',
    },
    conversionPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SIZES.sm,
        paddingHorizontal: SIZES.md,
        gap: SIZES.xs,
    },
    conversionText: {
        fontSize: SIZES.fontMd,
        color: COLORS.primary,
        fontWeight: '500',
    },
});
