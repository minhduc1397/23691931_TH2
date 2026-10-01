import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';
import { Product } from '@services/productApi';

interface ProductCardProps {
  item: Product;
  index: number;
  onPress: () => void;
  onAdd: () => void;
}

const PASTEL_COLORS = ['#FEF3C7', '#E0F2FE', '#DCFCE7', '#FFE4E6'];

const ProductCard: React.FC<ProductCardProps> = ({ item, index, onPress, onAdd }) => {
  const priceVND = Math.round(item.price * PRICE_MULTIPLIER);
  const bgColor = PASTEL_COLORS[index % PASTEL_COLORS.length];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.imageContainer, { backgroundColor: bgColor }]}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.price}>
          {priceVND.toLocaleString('vi-VN')} đ
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={onAdd}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const keyExtractor = (item: Product) =>
  `${STUDENT.mssv}-${item.id}`;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 110,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  image: {
    width: '75%',
    height: '75%',
  },
  content: {
    paddingBottom: 28,
  },
  title: {
    fontSize: FONT_SIZE.sm + 1,
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: 4,
  },
  price: {
    fontSize: FONT_SIZE.sm + 1,
    color: COLORS.primary,
    fontWeight: '700',
  },
  addBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: COLORS.surface,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
});

export default ProductCard;
