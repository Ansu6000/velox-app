import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
    StatusBar,
    TextInput,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { COLORS, SIZES } from '../../src/constants/colors';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../src/constants/categories';
import { useApp } from '../../src/context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const { transactions, homeCurrency, savingsGoals, saveSavingsGoals } = useApp();
    const router = useRouter();
    const [timeRange, setTimeRange] = useState('weekly'); // weekly, monthly, custom
    const [isEditingGoals, setIsEditingGoals] = useState(false);
    const [goalValues, setGoalValues] = useState({
        weekly: savingsGoals.weekly.toString(),
        monthly: savingsGoals.monthly.toString()
    });

    const categories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

    // Filter data based on time range
    const filteredTransactions = useMemo(() => {
        const now = new Date();
        return transactions.filter(t => {
            const tDate = new Date(t.createdAt);
            if (timeRange === 'weekly') {
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return tDate >= oneWeekAgo;
            } else if (timeRange === 'monthly') {
                const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                return tDate >= oneMonthAgo;
            }
            return true; // Default or custom
        });
    }, [transactions, timeRange]);

    // Pie Chart Data
    const pieData = useMemo(() => {
        const expenseMap = {};
        filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
            expenseMap[t.category] = (expenseMap[t.category] || 0) + (t.convertedAmount || t.amount);
        });

        return Object.keys(expenseMap).map(catId => {
            const cat = categories.find(c => c.id === catId) || { label: 'Other', color: '#64748B' };
            return {
                name: `${cat.label}`,
                population: Math.abs(expenseMap[catId]),
                color: cat.color,
                legendFontColor: '#475569',
                legendFontSize: 12,
            };
        }).sort((a, b) => b.population - a.population);
    }, [filteredTransactions]);

    // Graph data for weekly trend
    const trendData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = [0, 0, 0, 0, 0, 0, 0];

        filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
            const dayIndex = new Date(t.createdAt).getDay();
            data[dayIndex] += Math.abs(t.convertedAmount || t.amount);
        });

        // Reorder data to end on today
        const today = new Date().getDay();
        const reorderedData = [];
        const reorderedLabels = [];
        for (let i = 0; i < 7; i++) {
            const index = (today + 1 + i) % 7;
            reorderedData.push(data[index]);
            reorderedLabels.push(days[index]);
        }

        return {
            labels: reorderedLabels,
            datasets: [{ data: reorderedData }]
        };
    }, [filteredTransactions]);

    const totalExpense = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.convertedAmount || t.amount), 0);

    const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.convertedAmount || t.amount), 0);

    const handleSaveGoals = () => {
        saveSavingsGoals({
            weekly: parseFloat(goalValues.weekly) || 0,
            monthly: parseFloat(goalValues.monthly) || 0
        });
        setIsEditingGoals(false);
    };

    const currentGoal = timeRange === 'weekly' ? savingsGoals.weekly : savingsGoals.monthly;
    const goalStatus = currentGoal > 0 ? (totalExpense > currentGoal ? 'over' : 'within') : 'unset';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <Pressable
                        style={styles.headerButton}
                        onPress={() => router.push('/(tabs)/settings')}
                    >
                        <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
                    </Pressable>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: SIZES.sm, gap: 8 }}>
                        <Image source={require('../../assets/images/logo.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
                        <Text style={styles.headerTitle}>Analytics</Text>
                    </View>
                    <Pressable
                        style={styles.goalButton}
                        onPress={() => {
                            setGoalValues({
                                weekly: savingsGoals.weekly.toString(),
                                monthly: savingsGoals.monthly.toString()
                            });
                            setIsEditingGoals(true);
                        }}
                    >
                        <Ionicons name="flag-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.goalButtonText}>Set Goals</Text>
                    </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Time Range Selector */}
                    <View style={styles.rangeSelector}>
                        {['weekly', 'monthly'].map((range) => (
                            <Pressable
                                key={range}
                                style={[styles.rangeTab, timeRange === range && styles.activeRangeTab]}
                                onPress={() => setTimeRange(range)}
                            >
                                <Text style={[styles.rangeTabText, timeRange === range && styles.activeRangeTabText]}>
                                    {range.charAt(0).toUpperCase() + range.slice(1)}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Overall Stats */}
                    <View style={styles.statsOverview}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Income</Text>
                            <Text style={[styles.statValue, { color: COLORS.success }]}>
                                {homeCurrency.symbol}{totalIncome.toLocaleString()}
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Expenses</Text>
                            <Text style={[styles.statValue, { color: COLORS.danger }]}>
                                {homeCurrency.symbol}{totalExpense.toLocaleString()}
                            </Text>
                        </View>
                    </View>

                    {/* Goal Progress */}
                    {currentGoal > 0 && (
                        <View style={[styles.goalCard, goalStatus === 'over' ? styles.goalCardCritical : styles.goalCardSuccess]}>
                            <View style={styles.goalHeader}>
                                <Text style={styles.goalTitle}>
                                    {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Savings Goal
                                </Text>
                                <Text style={styles.goalAmount}>
                                    {homeCurrency.symbol}{currentGoal}
                                </Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: `${Math.min((totalExpense / currentGoal) * 100, 100)}%`,
                                            backgroundColor: goalStatus === 'over' ? COLORS.danger : COLORS.success
                                        }
                                    ]}
                                />
                            </View>
                            <View style={styles.goalFooter}>
                                <Text style={styles.goalNote}>
                                    {goalStatus === 'over'
                                        ? `You spent ${homeCurrency.symbol}${(totalExpense - currentGoal).toLocaleString()} over your goal!`
                                        : `You have ${homeCurrency.symbol}${(currentGoal - totalExpense).toLocaleString()} left of your budget.`}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Category Breakdown (Pie Chart) */}
                    <View style={styles.chartSection}>
                        <Text style={styles.sectionTitle}>Category Breakdown</Text>
                        <View style={styles.chartCard}>
                            {pieData.length > 0 ? (
                                <View style={{ alignItems: 'center', width: '100%' }}>
                                    <PieChart
                                        data={pieData}
                                        width={SCREEN_WIDTH - 48}
                                        height={220}
                                        chartConfig={chartConfig}
                                        accessor="population"
                                        backgroundColor="transparent"
                                        paddingLeft={(SCREEN_WIDTH - 48) / 4}
                                        hasLegend={false}
                                        absolute
                                    />
                                    <View style={styles.legendContainer}>
                                        {pieData.map((item, index) => (
                                            <View key={index} style={styles.legendItem}>
                                                <View style={styles.legendLeft}>
                                                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                                    <Text style={styles.legendLabel}>{item.name}</Text>
                                                </View>
                                                <Text style={styles.legendValue}>
                                                    {homeCurrency.symbol}{item.population.toLocaleString()}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.emptyChart}>
                                    <Ionicons name="pie-chart-outline" size={48} color={COLORS.textMuted} />
                                    <Text style={styles.emptyText}>No data for this period</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Spending Trend (Line Chart) */}
                    <View style={styles.chartSection}>
                        <Text style={styles.sectionTitle}>Spending Trend</Text>
                        <View style={styles.chartCard}>
                            <LineChart
                                data={trendData}
                                width={SCREEN_WIDTH - 48}
                                height={220}
                                chartConfig={chartConfig}
                                bezier
                                style={styles.lineChart}
                                withVerticalLines={false}
                                withHorizontalLines={true}
                                segments={4}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Set Goal Modal */}
            {isEditingGoals && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Savings Goals</Text>
                            <Pressable onPress={() => setIsEditingGoals(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </Pressable>
                        </View>
                        <View style={styles.modalBody}>
                            <View style={styles.goalInputRow}>
                                <Text style={styles.inputLabel}>Weekly Budget Limit</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputSymbol}>{homeCurrency.symbol}</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        keyboardType="numeric"
                                        value={goalValues.weekly}
                                        onChangeText={(v) => setGoalValues(prev => ({ ...prev, weekly: v }))}
                                        placeholder="0"
                                    />
                                </View>
                            </View>
                            <View style={styles.goalInputRow}>
                                <Text style={styles.inputLabel}>Monthly Budget Limit</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputSymbol}>{homeCurrency.symbol}</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        keyboardType="numeric"
                                        value={goalValues.monthly}
                                        onChangeText={(v) => setGoalValues(prev => ({ ...prev, monthly: v }))}
                                        placeholder="0"
                                    />
                                </View>
                            </View>
                            <Text style={styles.modalHint}>Setting a goal helps you stay within your budget. You'll see progress indicators on the analytics screen.</Text>
                            <Pressable style={styles.saveGoalButton} onPress={handleSaveGoals}>
                                <Text style={styles.saveGoalButtonText}>Save Goals</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
};

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
        color: '#1E293B',
    },
    goalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${COLORS.primary}10`,
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.sm,
        borderRadius: SIZES.radiusFull,
        gap: SIZES.xs,
    },
    goalButtonText: {
        fontSize: SIZES.fontSm,
        fontWeight: '600',
        color: COLORS.primary,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    rangeSelector: {
        flexDirection: 'row',
        marginHorizontal: SIZES.lg,
        backgroundColor: '#F1F5F9',
        borderRadius: SIZES.radiusLg,
        padding: 4,
        marginBottom: SIZES.lg,
    },
    rangeTab: {
        flex: 1,
        paddingVertical: SIZES.sm,
        alignItems: 'center',
        borderRadius: SIZES.radiusMd,
    },
    activeRangeTab: {
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    rangeTabText: {
        fontSize: SIZES.fontMd,
        color: '#64748B',
        fontWeight: '600',
    },
    activeRangeTabText: {
        color: COLORS.primary,
    },
    statsOverview: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        marginHorizontal: SIZES.lg,
        padding: SIZES.lg,
        borderRadius: SIZES.radiusLg,
        marginBottom: SIZES.lg,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: COLORS.border,
        marginHorizontal: SIZES.md,
    },
    statLabel: {
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    statValue: {
        fontSize: SIZES.fontXl,
        fontWeight: '700',
    },
    goalCard: {
        marginHorizontal: SIZES.lg,
        padding: SIZES.lg,
        borderRadius: SIZES.radiusLg,
        marginBottom: SIZES.lg,
        borderWidth: 1,
    },
    goalCardSuccess: {
        backgroundColor: `${COLORS.success}08`,
        borderColor: `${COLORS.success}20`,
    },
    goalCardCritical: {
        backgroundColor: `${COLORS.danger}08`,
        borderColor: `${COLORS.danger}20`,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.md,
    },
    goalTitle: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: '#334155',
    },
    goalAmount: {
        fontSize: SIZES.fontLg,
        fontWeight: '700',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: SIZES.radiusFull,
        marginBottom: SIZES.sm,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: SIZES.radiusFull,
    },
    goalFooter: {
        marginTop: 4,
    },
    goalNote: {
        fontSize: SIZES.fontSm,
        color: '#64748B',
    },
    chartSection: {
        marginHorizontal: SIZES.lg,
        marginBottom: SIZES.xl,
    },
    sectionTitle: {
        fontSize: SIZES.fontLg,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: SIZES.md,
    },
    chartCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusLg,
        paddingVertical: SIZES.md,
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    lineChart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    emptyChart: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SIZES.sm,
    },
    emptyText: {
        color: COLORS.textMuted,
        fontSize: SIZES.fontMd,
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: SIZES.xl,
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusXl,
        padding: SIZES.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.xl,
    },
    modalTitle: {
        fontSize: SIZES.fontXl,
        fontWeight: '700',
        color: '#1E293B',
    },
    modalBody: {
        gap: SIZES.lg,
    },
    goalInputRow: {
        gap: SIZES.sm,
    },
    inputLabel: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: '#475569',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: SIZES.radiusLg,
        paddingHorizontal: SIZES.md,
        height: 56,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    inputSymbol: {
        fontSize: SIZES.fontLg,
        fontWeight: '700',
        color: COLORS.primary,
        marginRight: SIZES.xs,
    },
    modalInput: {
        flex: 1,
        fontSize: SIZES.fontLg,
        fontWeight: '700',
        color: '#1E293B',
    },
    modalHint: {
        fontSize: SIZES.fontXs,
        color: '#94A3B8',
        lineHeight: 18,
    },
    saveGoalButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: SIZES.radiusLg,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SIZES.md,
    },
    saveGoalButtonText: {
        color: COLORS.white,
        fontSize: SIZES.fontLg,
        fontWeight: '700',
    },
    emptyChart: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SIZES.xl,
    },
    emptyText: {
        color: COLORS.textMuted,
        fontSize: SIZES.fontMd,
        marginTop: SIZES.sm,
    },
    legendContainer: {
        width: '100%',
        marginTop: SIZES.md,
        paddingHorizontal: SIZES.sm,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.sm,
        justifyContent: 'space-between',
    },
    legendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: SIZES.sm,
    },
    legendLabel: {
        fontSize: SIZES.fontSm,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    legendValue: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
});
