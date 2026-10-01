import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';
import { STUDENT, VARIANT } from '@constants/student';
import Watermark from '@components/Watermark';

const LoginScreen: React.FC = () => {
  const isEmail = VARIANT.authField === 'email';
  const defaultPlaceholder = isEmail
    ? `Email — ${STUDENT.mssv}@iuh.edu.vn`
    : `Số điện thoại — 09${STUDENT.mssv.slice(-6)}`;
  
  const [fieldValue, setFieldValue] = useState('');
  const login = useAuthStore(s => s.login);

  const handleLogin = () => {
    login();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark />}
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>KTXGO</Text>
          <Text style={styles.subtitle}>Giao đồ tận phòng ký túc xá</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={defaultPlaceholder}
              placeholderTextColor={COLORS.textLight}
              value={fieldValue}
              onChangeText={setFieldValue}
              keyboardType={isEmail ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
            />
            <Text style={styles.tagA}>(A)</Text>
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Vào cửa hàng</Text>
          </TouchableOpacity>

          <Text style={styles.authNote}>Auth Stack · chưa có token</Text>
        </View>
      </KeyboardAvoidingView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xl * 1.5,
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  tagA: {
    position: 'absolute',
    right: 16,
    top: 14,
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  loginBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loginBtnText: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  authNote: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
});

export default LoginScreen;
