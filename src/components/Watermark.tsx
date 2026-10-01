import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { COLORS, FONT_SIZE, SPACING } from '@constants/theme';

interface WatermarkProps {
  style?: object;
}

const Watermark: React.FC<WatermarkProps> = ({ style }) => {
  const label = `TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${examStamp()}`;

  return (
    <View
      style={[
        styles.container,
        VARIANT.watermarkAtTop ? styles.top : styles.bottom,
        style,
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.tagZero}>(0)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  top: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bottom: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  text: {
    fontSize: FONT_SIZE.xs,
    color: '#1E3A8A',
    fontWeight: '700',
    textAlign: 'center',
  },
  tagZero: {
    position: 'absolute',
    right: 12,
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default Watermark;
