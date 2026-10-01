import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopStack from '@navigation/ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import { COLORS, FONT_SIZE } from '@constants/theme';
import { VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

export type MainTabsParamList = {
  ShopTab: undefined;
  CartTab: undefined;
  MeTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TabIcon = ({
  icon,
  focused,
  badge,
}: {
  icon: string;
  focused: boolean;
  badge?: number;
}) => (
  <View style={styles.iconWrap}>
    <Text style={[styles.iconText, focused && styles.iconFocused]}>{icon}</Text>
    {badge != null && badge > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
      </View>
    )}
  </View>
);

const MainTabs: React.FC = () => {
  const totalQty = useCartStore(s => s.totalQuantity)();

  // Thứ tự tab: shopFirst (số cuối 1) → Shop→Giỏ→Tôi
  const isShopFirst = VARIANT.tabOrder === 'shopFirst';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 56,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      {isShopFirst ? (
        <>
          <Tab.Screen
            name="ShopTab"
            component={ShopStack}
            options={{
              title: 'Cửa hàng',
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="🏪" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="CartTab"
            component={CartScreen}
            options={{
              title: 'Giỏ',
              tabBarBadge: totalQty > 0 ? totalQty : undefined,
              tabBarBadgeStyle: { backgroundColor: COLORS.secondary },
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="🛒" focused={focused} badge={totalQty} />
              ),
            }}
          />
          <Tab.Screen
            name="MeTab"
            component={MeScreen}
            options={{
              title: 'Tôi',
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="👤" focused={focused} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="CartTab"
            component={CartScreen}
            options={{
              title: 'Giỏ',
              tabBarBadge: totalQty > 0 ? totalQty : undefined,
              tabBarBadgeStyle: { backgroundColor: COLORS.secondary },
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="🛒" focused={focused} badge={totalQty} />
              ),
            }}
          />
          <Tab.Screen
            name="ShopTab"
            component={ShopStack}
            options={{
              title: 'Cửa hàng',
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="🏪" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="MeTab"
            component={MeScreen}
            options={{
              title: 'Tôi',
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="👤" focused={focused} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrap: { position: 'relative', alignItems: 'center' },
  iconText: { fontSize: 20, opacity: 0.6 },
  iconFocused: { opacity: 1 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.surface,
  },
});

export default MainTabs;
