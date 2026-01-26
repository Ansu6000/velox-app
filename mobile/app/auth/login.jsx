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
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../src/constants/colors';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        try {
            await login(email, password);
            router.replace('/(tabs)');
        } catch (error) {
            Alert.alert('Login Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={{ width: 48, height: 48 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.title}>Velox</Text>
                        <Text style={styles.subtitle}>Sign in to continue tracking</Text>
                    </View>

                    <View style={styles.form}>
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
                                    placeholder="Enter your password"
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

                        <Pressable style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.loginButton, isLoading && styles.disabledButton]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <Text style={styles.loginButtonText}>
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Text>
                        </Pressable>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <Link href="/auth/signup" asChild>
                                <Pressable>
                                    <Text style={styles.signupLink}>Sign Up</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>
                </KeyboardAvoidingView>
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
    content: {
        flex: 1,
        paddingHorizontal: SIZES.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: SIZES.xxl,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: SIZES.xl,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: SIZES.fontSm,
    },
    loginButton: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radiusMd,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: COLORS.white,
        fontSize: SIZES.fontLg,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SIZES.xl,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.fontMd,
    },
    signupLink: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: SIZES.fontMd,
    },
});
