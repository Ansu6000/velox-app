import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    StatusBar,
    Pressable,
    Alert,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../src/constants/colors';
import { useApp } from '../../src/context/AppContext';
import { useAuth } from '../../src/context/AuthContext';
import BalanceCard from '../../src/components/BalanceCard';
import CurrencyConverter from '../../src/components/CurrencyConverter';
import TransactionItem from '../../src/components/TransactionItem';

export default function HomeScreen() {
    const { user } = useAuth();
    const { transactions, deleteTransaction, fetchExchangeRates, spendingCurrency, isLoading } = useApp();
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchExchangeRates(spendingCurrency.code);
        setRefreshing(false);
    };

    const handleDelete = (id) => {
        Alert.alert(
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

    const recentTransactions = transactions.slice(0, 10);

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
                        <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
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
                    <View style={styles.headerRight}>
                        <Pressable style={styles.headerButton}>
                            <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
                            <View style={styles.notificationBadge} />
                        </Pressable>
                    </View>
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

                    {/* Transaction Summary or other info could go here */}

                    {/* Recent Transactions */}
                    <View style={styles.transactionsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Transactions</Text>
                            {transactions.length > 10 && (
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
                                />
                            ))
                        )}
                    </View>
                </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.lg,
        paddingVertical: SIZES.md,
    },
    greetingContainer: {
        flex: 1,
        marginLeft: SIZES.sm,
        justifyContent: 'center',
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.xs,
    },
    logo: {
        width: 28,
        height: 28,
    },
    brandName: {
        fontSize: SIZES.font2xl,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        marginTop: 0,
    },
    greeting: {
        fontSize: SIZES.font2xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
        lineHeight: 32,
    },
    subtitle: {
        fontSize: SIZES.fontMd,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.md,
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
        paddingBottom: 100,
        flexGrow: 1,
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
        fontSize: SIZES.fontXl,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seeAllText: {
        fontSize: SIZES.fontMd,
        color: COLORS.primary,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SIZES.xxl,
        paddingHorizontal: SIZES.lg,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: SIZES.radiusFull,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.lg,
    },
    emptyTitle: {
        fontSize: SIZES.fontXl,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SIZES.sm,
    },
    emptySubtitle: {
        fontSize: SIZES.fontMd,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});
