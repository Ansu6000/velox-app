import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Alert,
    ScrollView,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../src/constants/colors';
import { useAuth } from '../../src/context/AuthContext';
import { useApp } from '../../src/context/AppContext';
import { CURRENCIES } from '../../src/constants/categories';
import CurrencyPicker from '../../src/components/CurrencyPicker';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [homeCurrency, setHomeCurrency] = useState(CURRENCIES[0]); // Default INR
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { signup, isLoading } = useAuth();
    const { saveHomeCurrency } = useApp();
    const router = useRouter();

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        try {
            await signup(email, password, name);
            await saveHomeCurrency(homeCurrency);
            router.replace('/(tabs)');
        } catch (error) {
            Alert.alert('Sign Up Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.flex}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <Pressable style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                        </Pressable>

                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('../../assets/images/logo.png')}
                                    style={{ width: 48, height: 48 }}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.title}>Velox</Text>
                            <Text style={styles.subtitle}>Join us and track your wealth</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Full Name</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="person-outline" size={20} color={COLORS.textMuted} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="John Doe"
                                        placeholderTextColor={COLORS.textMuted}
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email Address</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="name@example.com"
                                        placeholderTextColor={COLORS.textMuted}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Create a password"
                                        placeholderTextColor={COLORS.textMuted}
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color={COLORS.textMuted}
                                        />
                                    </Pressable>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Repeat your password"
                                        placeholderTextColor={COLORS.textMuted}
                                        secureTextEntry={!showPassword}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Home Currency</Text>
                                <Pressable
                                    style={styles.currencyButton}
                                    onPress={() => setShowCurrencyPicker(true)}
                                >
                                    <View style={styles.currencyLeft}>
                                        <Text style={styles.flag}>{homeCurrency.flag}</Text>
                                        <Text style={styles.currencyValue}>{homeCurrency.name} ({homeCurrency.code})</Text>
                                    </View>
                                    <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
                                </Pressable>
                            </View>

                            <Pressable
                                style={[styles.signupButton, isLoading && styles.disabledButton]}
                                onPress={handleSignUp}
                                disabled={isLoading}
                            >
                                <Text style={styles.signupButtonText}>
                                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                                </Text>
                            </Pressable>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <Link href="/auth/login" asChild>
                                    <Pressable>
                                        <Text style={styles.loginLink}>Sign In</Text>
                                    </Pressable>
                                </Link>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <CurrencyPicker
                visible={showCurrencyPicker}
                currencies={CURRENCIES}
                selectedCurrency={homeCurrency}
                onSelect={(currency) => {
                    setHomeCurrency(currency);
                    setShowCurrencyPicker(false);
                }}
                onClose={() => setShowCurrencyPicker(false)}
                title="Select Home Currency"
            />
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
    flex: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SIZES.lg,
        paddingBottom: SIZES.xl,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: SIZES.radiusMd,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SIZES.md,
        marginBottom: SIZES.lg,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        marginBottom: SIZES.xl,
        alignItems: 'center',
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: SIZES.radiusLg,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.lg,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: SIZES.font4xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SIZES.xs,
    },
    subtitle: {
        fontSize: SIZES.fontMd,
        color: COLORS.textSecondary,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: SIZES.lg,
    },
    label: {
        fontSize: SIZES.fontSm,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SIZES.sm,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusMd,
        paddingHorizontal: SIZES.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        height: 56,
    },
    input: {
        flex: 1,
        marginLeft: SIZES.sm,
        fontSize: SIZES.fontMd,
        color: COLORS.textPrimary,
    },
    currencyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusMd,
        paddingHorizontal: SIZES.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        height: 56,
    },
    currencyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.sm,
    },
    flag: {
        fontSize: 24,
    },
    currencyValue: {
        fontSize: SIZES.fontMd,
        color: COLORS.textPrimary,
    },
    signupButton: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radiusMd,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SIZES.md,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.7,
    },
    signupButtonText: {
        color: COLORS.white,
        fontSize: SIZES.fontLg,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SIZES.xl,
        marginBottom: SIZES.xl,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.fontMd,
    },
    loginLink: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: SIZES.fontMd,
    },
});
