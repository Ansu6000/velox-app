import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CurrencyPicker({
    visible,
    currencies = [],
    selectedCurrency,
    onSelect,
    onClose,
    title = 'Select Currency'
}) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                        </Pressable>
                    </View>

                    <View style={styles.listContainer}>
                        <FlatList
                            data={currencies}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item: currency }) => {
                                const isSelected = selectedCurrency?.code === currency.code;
                                return (
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.currencyItem,
                                            isSelected && styles.selectedItem,
                                            pressed && styles.pressed
                                        ]}
                                        onPress={() => onSelect(currency)}
                                    >
                                        <Text style={styles.flag}>{currency.flag}</Text>
                                        <View style={styles.currencyInfo}>
                                            <Text style={[styles.currencyCode, isSelected && styles.selectedText]}>
                                                {currency.code}
                                            </Text>
                                            <Text style={styles.currencyName}>{currency.name}</Text>
                                        </View>
                                        <Text style={styles.symbol}>{currency.symbol}</Text>
                                        {isSelected && (
                                            <View style={styles.checkmark}>
                                                <Ionicons name="checkmark" size={18} color={COLORS.white} />
                                            </View>
                                        )}
                                    </Pressable>
                                );
                            }}
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No items available</Text>
                                </View>
                            }
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusLg,
        height: SCREEN_HEIGHT * 0.7,
        width: '90%',
        maxWidth: 500,
        overflow: 'hidden',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: SIZES.fontXl,
        fontWeight: '700',
        color: '#1E293B',
    },
    closeButton: {
        padding: SIZES.xs,
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: SIZES.md,
        paddingBottom: SIZES.xl,
    },
    currencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.md,
        borderRadius: SIZES.radiusMd,
        marginTop: SIZES.sm,
    },
    selectedItem: {
        backgroundColor: `${COLORS.primary}10`,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    pressed: {
        backgroundColor: COLORS.backgroundSecondary,
    },
    flag: {
        fontSize: 32,
        marginRight: SIZES.md,
    },
    currencyInfo: {
        flex: 1,
    },
    currencyCode: {
        fontSize: SIZES.fontLg,
        fontWeight: '700',
        color: '#1E293B',
    },
    selectedText: {
        color: COLORS.primary,
    },
    currencyName: {
        fontSize: SIZES.fontSm,
        color: '#64748B',
        marginTop: 2,
    },
    symbol: {
        fontSize: SIZES.fontLg,
        fontWeight: '600',
        color: '#94A3B8',
        marginRight: SIZES.md,
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: SIZES.radiusFull,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: SIZES.xxl,
        alignItems: 'center',
    },
    emptyText: {
        color: '#64748B',
        fontSize: SIZES.fontMd,
    },
});
