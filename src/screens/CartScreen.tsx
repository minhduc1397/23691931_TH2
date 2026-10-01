import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore, CartItem } from '@stores/cartStore';
import { COLORS, SPACING, FONT_SIZE } from '@constants/theme';
import {
  STUDENT,
  ROOM_LABEL,
  PRICE_MULTIPLIER,
  VARIANT,
  BASE_SHIP_FEE,
} from '@constants/student';
import { useCampusLocation } from '@hooks/useCampusLocation';
import Watermark from '@components/Watermark';

const CartScreen: React.FC = () => {
  const items = useCartStore(s => s.items);
  const remove = useCartStore(s => s.remove);
  const totalAmount = useCartStore(s => s.totalAmount)();
  const { shipFee } = useCampusLocation();

  const totalItemsVND = Math.round(totalAmount * PRICE_MULTIPLIER);
  const effectiveShipFee = shipFee !== null ? shipFee : BASE_SHIP_FEE + 2000;
  const grandTotal = totalItemsVND + (items.length > 0 ? effectiveShipFee : 0);

  const renderItem = ({ item }: { item: CartItem }) => {
    const itemPriceVND = Math.round(item.price * PRICE_MULTIPLIER);
    const itemTotalVND = itemPriceVND * item.quantity;

    return (
      <View style={styles.cardItem}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemQuantityPrice}>
            ×{item.quantity}  {itemTotalVND.toLocaleString('vi-VN')} đ
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => {
            Alert.alert('Xoá món', `Xoá "${item.title}" khỏi giỏ?`, [
              { text: 'Huỷ', style: 'cancel' },
              {
                text: 'Xoá',
                style: 'destructive',
                onPress: () => remove(item.id),
              },
            ]);
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header GIỎ HÀNG */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
      </View>

      <View style={styles.container}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyText}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptySub}>Hãy thêm món ăn tại tab Cửa hàng nhé!</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => `${STUDENT.mssv}-cart-${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Khung Giao đến & Phí ship viền cam theo Hình 5 */}
        <View style={styles.summaryBox}>
          <View style={styles.deliveryCard}>
            <Text style={styles.deliveryRoom}>Giao đến {ROOM_LABEL}</Text>
            <Text style={styles.shipFormulaText}>
              Phí ship: {effectiveShipFee.toLocaleString('vi-VN')} đ (công thức {VARIANT.shipFormula})
            </Text>
          </View>

          <Text style={styles.totalText}>
            Tổng hàng: {grandTotal.toLocaleString('vi-VN')} đ
          </Text>
        </View>
      </View>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  listContent: {
    paddingBottom: 16,
  },
  cardItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  itemTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  itemQuantityPrice: {
    fontSize: FONT_SIZE.sm,
    color: '#64748B',
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#DC2626',
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 16,
    color: COLORS.surface,
  },
  summaryBox: {
    paddingVertical: SPACING.md,
    paddingBottom: 24,
    backgroundColor: COLORS.background,
  },
  deliveryCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: '#F97316',
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  deliveryRoom: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  shipFormulaText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: '#F97316',
  },
  totalText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: 4,
  },
});

export default CartScreen;
