import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackRouteProp } from '@react-navigation/native-stack';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';
import {
  STUDENT,
  PRICE_MULTIPLIER,
  VARIANT,
} from '@constants/student';
import { useCartStore } from '@stores/cartStore';
import { useProducts } from '@services/productApi';
import Watermark from '@components/Watermark';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import type { ShopStackParamList } from '@navigation/ShopStack';

type RouteProp = NativeStackRouteProp<ShopStackParamList, 'Detail'>;
type NavProp = NativeStackNavigationProp<ShopStackParamList, 'Detail'>;

const DetailScreen: React.FC = () => {
  const route = useRoute<RouteProp>();
  const navigation = useNavigation<NavProp>();
  const { id } = route.params;

  const { data } = useProducts();
  const product = data?.find(p => String(p.id) === id);
  const addToCart = useCartStore(s => s.add);

  const handleAdd = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });

    if (VARIANT.hapticOnAdd === 'impact') {
      ReactNativeHapticFeedback.trigger('impactMedium', {
        enableVibrateFallback: true,
      });
    } else {
      ReactNativeHapticFeedback.trigger('selection', {
        enableVibrateFallback: true,
      });
    }

    Alert.alert(
      `KTXGo · ${STUDENT.mssv}`,
      `Đã thêm "${product.title}" vào giỏ hàng thành công!`,
      [{ text: 'OK' }],
    );
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {VARIANT.watermarkAtTop && <Watermark />}
        <View style={styles.center}>
          <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
        </View>
        {!VARIANT.watermarkAtTop && <Watermark />}
      </SafeAreaView>
    );
  }

  const priceVND = Math.round(product.price * PRICE_MULTIPLIER);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Top Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>← Chi tiết món</Text>
        </TouchableOpacity>
        <Text style={styles.stackTag}>Stack</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Khối ảnh nền pastel */}
        <View style={styles.imageBlock}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Thông tin món */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{priceVND.toLocaleString('vi-VN')} đ</Text>
          <Text style={styles.deliverySub}>Giao nội khu · nhận tận phòng</Text>

          <Text style={styles.description} numberOfLines={3}>
            {product.description || 'Mô tả ngắn từ API (tối đa 3 dòng). Giữ nguyên id từ route.params.'}
          </Text>
        </View>
      </ScrollView>

      {/* Nút Thêm vào giỏ · Haptic */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAdd}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>Thêm vào giỏ · Haptic</Text>
        </TouchableOpacity>
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '700',
  },
  stackTag: {
    color: '#F97316',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: 90,
  },
  imageBlock: {
    width: '100%',
    height: 220,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  image: {
    width: '75%',
    height: '75%',
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  deliverySub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.md,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'transparent',
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  addBtnText: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
  },
});

export default DetailScreen;
