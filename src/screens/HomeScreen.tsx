import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';
import {
  STUDENT,
  ROOM_LABEL,
  DEBOUNCE_MS,
  VARIANT,
} from '@constants/student';
import { useProducts, Product } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import ProductCard, { keyExtractor } from '@components/ProductCard';
import Watermark from '@components/Watermark';
import type { ShopStackParamList } from '@navigation/ShopStack';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

type NavProp = NativeStackNavigationProp<ShopStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, DEBOUNCE_MS);
  const { data, isPending, isError, refetch } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const addToCart = useCartStore(s => s.add);

  const filtered = data
    ? data.filter(p =>
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    : [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleAdd = useCallback(
    (item: Product) => {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
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
    },
    [addToCart],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <ProductCard
        item={item}
        index={index}
        onPress={() =>
          navigation.navigate('Detail', { id: String(item.id) })
        }
        onAdd={() => handleAdd(item)}
      />
    ),
    [navigation, handleAdd],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header (A) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>KTXGO</Text>
          <Text style={styles.headerSub}>Giao tận {ROOM_LABEL}</Text>
        </View>
        <Text style={styles.tagA}>(A)</Text>
      </View>

      {/* Search Input (B) */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
          <Text style={styles.tagB}>(B)</Text>
        </View>
      </View>

      {/* Trạng thái 1: ĐANG TẢI */}
      {isPending && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải món...</Text>
        </View>
      )}

      {/* Trạng thái 3: LỖI MẠNG */}
      {isError && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
          <Text style={styles.errorMsg}>Không tải được dữ liệu món.</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => refetch()}
            activeOpacity={0.85}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Trạng thái 2: CÓ DỮ LIỆU */}
      {!isPending && !isError && (
        <View style={styles.listWrapper}>
          <View style={styles.subHeaderRow}>
            <Text style={styles.flashListTag}>(C) FlashList ×2</Text>
          </View>
          <FlashList
            data={filtered}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={220}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không tìm thấy món nào</Text>
              </View>
            }
          />
        </View>
      )}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.surface,
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: FONT_SIZE.sm,
    color: '#BFDBFE',
    marginTop: 2,
  },
  tagA: {
    color: '#F97316',
    fontWeight: '700',
    fontSize: FONT_SIZE.xs,
  },
  searchSection: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  searchInputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  tagB: {
    position: 'absolute',
    right: 14,
    color: '#1D4ED8',
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  subHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingBottom: 4,
  },
  flashListTag: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 70,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
  errorMssv: {
    fontSize: 22,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 6,
  },
  errorMsg: {
    fontSize: FONT_SIZE.md,
    color: '#1E3A8A',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 36,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
});

export default HomeScreen;
