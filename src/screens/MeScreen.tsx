import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { COLORS, SPACING, FONT_SIZE } from '@constants/theme';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import Watermark from '@components/Watermark';

const MeScreen: React.FC = () => {
  const logout = useAuthStore(s => s.logout);
  const { status, km, shipFee, requestPermission } = useCampusLocation();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn muốn đăng xuất khỏi KTXGo?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const statusLabel =
    status === 'granted'
      ? 'granted'
      : status === 'denied'
      ? 'denied'
      : status === 'blocked'
      ? 'blocked'
      : 'chưa cấp';

  const statusColor =
    status === 'granted'
      ? '#16A34A'
      : status === 'blocked'
      ? '#DC2626'
      : '#F59E0B';

  const displayKm = km !== null ? `${km}` : '1.2';
  const displayShipFee =
    shipFee !== null ? shipFee.toLocaleString('vi-VN') : '12.000';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header TÔI · LOCATION */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TÔI · LOCATION</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={styles.profileSection}>
          <Text style={styles.name}>{STUDENT.hoTen}</Text>
          <Text style={styles.subInfo}>
            {STUDENT.mssv} · #{examStamp()}
          </Text>
        </View>

        {/* Card Location */}
        <View style={styles.locationCard}>
          <Text style={[styles.permissionStatus, { color: statusColor }]}>
            Quyền: {statusLabel}
          </Text>
          <Text style={styles.kmDistance}>
            ≈ {displayKm} km tới cổng KTX
          </Text>
          <Text style={styles.feeTitle}>Phí ship ước tính</Text>
          <Text style={styles.feeAmount}>{displayShipFee} đ</Text>
        </View>

        {/* 3 nút hành động theo Hình 5 */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={requestPermission}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Lấy vị trí ước tính ship</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => Linking.openSettings()}
            activeOpacity={0.85}
          >
            <Text style={styles.outlineBtnText}>Mở Cài đặt (blocked)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutBtnText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subInfo: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  locationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  permissionStatus: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    marginBottom: 8,
  },
  kmDistance: {
    fontSize: FONT_SIZE.md,
    color: '#334155',
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  feeTitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  feeAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F97316',
  },
  actions: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryBtnText: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  outlineBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    elevation: 2,
  },
  logoutBtnText: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
});

export default MeScreen;
