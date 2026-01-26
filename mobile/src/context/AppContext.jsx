import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CURRENCIES } from '../constants/categories';
import { scheduleGoalNotification } from '../utils/notifications';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../constants/api';

const AppContext = createContext();

const EXCHANGE_API_BASE = 'https://api.exchangerate-api.com/v4/latest';

export function AppProvider({ children }) {
    const { user } = useAuth();
    const [homeCurrency, setHomeCurrency] = useState(CURRENCIES[0]); // Default: INR
    const [spendingCurrency, setSpendingCurrency] = useState(CURRENCIES[0]); // Default: Home Currency (INR)
    const [exchangeRates, setExchangeRates] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [travelMode, setTravelMode] = useState(false);
    const [savingsGoals, setSavingsGoals] = useState({ weekly: 0, monthly: 0 });

    // Load saved preferences
    useEffect(() => {
        loadPreferences();
    }, []);

    // Fetch transactions from Neon whenever user changes
    useEffect(() => {
        if (user) {
            fetchTransactions();
        } else {
            setTransactions([]);
        }
    }, [user]);

    // Fetch exchange rates when spending currency changes
    useEffect(() => {
        if (spendingCurrency) {
            fetchExchangeRates(spendingCurrency.code);
        }
    }, [spendingCurrency]);

    const fetchTransactions = async () => {
        if (!user) return;
        try {
            const response = await fetch(`${API_BASE_URL}/transactions/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                // Map DB schema to app schema if needed
                const formattedData = data.map(t => ({
                    ...t,
                    amount: parseFloat(t.amount),
                    convertedAmount: parseFloat(t.amount), // Backend should ideally handle conversion or app does it on top
                    createdAt: t.created_at || t.createdAt,
                    type: parseFloat(t.amount) >= 0 ? 'income' : 'expense'
                }));
                setTransactions(formattedData);
                await AsyncStorage.setItem('transactions', JSON.stringify(formattedData));
            }
        } catch (error) {
            console.error('Error fetching transactions from backend:', error);
            // Fallback to local
            const savedTransactions = await AsyncStorage.getItem('transactions');
            if (savedTransactions) {
                setTransactions(JSON.parse(savedTransactions));
            }
        }
    };

    const loadPreferences = async () => {
        try {
            const savedHomeCurrency = await AsyncStorage.getItem('homeCurrency');
            const savedSpendingCurrency = await AsyncStorage.getItem('spendingCurrency');
            const savedTravelMode = await AsyncStorage.getItem('travelMode');
            const savedGoals = await AsyncStorage.getItem('savingsGoals');

            if (savedHomeCurrency) {
                const currency = CURRENCIES.find(c => c.code === savedHomeCurrency);
                if (currency) setHomeCurrency(currency);
            }

            if (savedSpendingCurrency) {
                const currency = CURRENCIES.find(c => c.code === savedSpendingCurrency);
                if (currency) setSpendingCurrency(currency);
            }

            if (savedTravelMode) {
                setTravelMode(JSON.parse(savedTravelMode));
            }

            if (savedGoals) {
                setSavingsGoals(JSON.parse(savedGoals));
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    };

    const saveHomeCurrency = async (currency) => {
        try {
            await AsyncStorage.setItem('homeCurrency', currency.code);
            setHomeCurrency(currency);
        } catch (error) {
            console.error('Error saving home currency:', error);
        }
    };

    const saveSpendingCurrency = async (currency) => {
        try {
            await AsyncStorage.setItem('spendingCurrency', currency.code);
            setSpendingCurrency(currency);
        } catch (error) {
            console.error('Error saving spending currency:', error);
        }
    };

    const saveTravelMode = async (enabled) => {
        try {
            await AsyncStorage.setItem('travelMode', JSON.stringify(enabled));
            setTravelMode(enabled);

            // When disabling travel mode, reset spending currency to home currency
            if (!enabled) {
                await AsyncStorage.setItem('spendingCurrency', homeCurrency.code);
                setSpendingCurrency(homeCurrency);
            }
        } catch (error) {
            console.error('Error saving travel mode:', error);
        }
    };

    const saveSavingsGoals = async (goals) => {
        try {
            await AsyncStorage.setItem('savingsGoals', JSON.stringify(goals));
            setSavingsGoals(goals);
        } catch (error) {
            console.error('Error saving goals:', error);
        }
    };

    const fetchExchangeRates = async (baseCurrency) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${EXCHANGE_API_BASE}/${baseCurrency}`);
            const data = await response.json();

            if (data.rates) {
                setExchangeRates(data.rates);
                setLastUpdated(new Date().toISOString());
            }
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Convert amount from spending currency to home currency
    const convertToHomeCurrency = (amount, fromCurrencyCode = spendingCurrency?.code) => {
        // If travel mode is off, we always assume the amount is in home currency
        if (!travelMode || !exchangeRates || !homeCurrency || fromCurrencyCode === homeCurrency.code) {
            return amount;
        }

        const homeRate = exchangeRates[homeCurrency.code];
        if (homeRate) {
            return amount * homeRate;
        }

        return amount;
    };

    const checkAndNotifyGoals = (allTransactions, lastType) => {
        if (lastType !== 'expense') return;

        const now = new Date();

        // Weekly check
        if (savingsGoals.weekly > 0) {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const weeklyExpense = allTransactions
                .filter(t => t.type === 'expense' && new Date(t.createdAt) >= oneWeekAgo)
                .reduce((sum, t) => sum + Math.abs(t.convertedAmount), 0);

            if (weeklyExpense > savingsGoals.weekly) {
                scheduleGoalNotification(
                    'Weekly Limit Exceeded! ⚠️',
                    `You have spent ${homeCurrency.symbol}${weeklyExpense.toLocaleString()}, which is over your ${homeCurrency.symbol}${savingsGoals.weekly} weekly goal.`
                );
            }
        }

        // Monthly check
        if (savingsGoals.monthly > 0) {
            const oneMonthAgo = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
            const monthlyExpense = allTransactions
                .filter(t => t.type === 'expense' && new Date(t.createdAt) >= oneMonthAgo)
                .reduce((sum, t) => sum + Math.abs(t.convertedAmount), 0);

            if (monthlyExpense > savingsGoals.monthly) {
                scheduleGoalNotification(
                    'Monthly Goal Alert! 🚨',
                    `Monthly spending (${homeCurrency.symbol}${monthlyExpense.toLocaleString()}) has crossed your ${homeCurrency.symbol}${savingsGoals.monthly} limit.`
                );
            }
        }
    };

    // Add a new transaction
    const addTransaction = async (transaction) => {
        try {
            const convertedAmount = convertToHomeCurrency(transaction.amount);

            // Prepare for backend
            const backendTransaction = {
                user_id: user?.id || 'anonymous',
                title: transaction.title,
                amount: transaction.type === 'expense' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
                category: transaction.category,
                created_at: transaction.date ? new Date(transaction.date).toISOString() : new Date().toISOString(),
            };

            // Post to backend
            const response = await fetch(`${API_BASE_URL}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backendTransaction)
            });

            const savedTransaction = await response.json();

            const newTransaction = {
                ...transaction,
                id: savedTransaction.id.toString(),
                createdAt: savedTransaction.created_at || new Date().toISOString(),
                originalCurrency: spendingCurrency.code,
                convertedAmount: convertedAmount,
                exchangeRate: exchangeRates[homeCurrency.code] || 1,
            };

            const updatedTransactions = [newTransaction, ...transactions];
            setTransactions(updatedTransactions);
            await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));

            // Check Goals and notify if exceeded
            checkAndNotifyGoals(updatedTransactions, transaction.type);

            return newTransaction;
        } catch (error) {
            console.error('Error adding transaction:', error);
            // Local only fallback if offline
            throw error;
        }
    };

    // Delete a transaction
    const deleteTransaction = async (id) => {
        try {
            // Delete from backend
            await fetch(`${API_BASE_URL}/transactions/${id}`, {
                method: 'DELETE'
            });

            const updatedTransactions = transactions.filter(t => t.id !== id);
            setTransactions(updatedTransactions);
            await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    };

    // Calculate summary
    const getSummary = () => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.convertedAmount, 0);

        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.convertedAmount), 0);

        return {
            income,
            expense,
            balance: income - expense,
        };
    };

    const value = {
        homeCurrency,
        spendingCurrency,
        exchangeRates,
        transactions,
        isLoading,
        lastUpdated,
        saveHomeCurrency,
        saveSpendingCurrency,
        convertToHomeCurrency,
        addTransaction,
        deleteTransaction,
        getSummary,
        fetchExchangeRates,
        travelMode,
        saveTravelMode,
        savingsGoals,
        saveSavingsGoals,
        fetchTransactions
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

export default AppContext;
