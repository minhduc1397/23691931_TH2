import React from 'react';
import { useAuthStore } from '@stores/authStore';
import AuthStack from '@navigation/AuthStack';
import MainTabs from '@navigation/MainTabs';

const RootNavigator: React.FC = () => {
  const token = useAuthStore(s => s.token);

  // Nếu chưa có token → Auth Stack; có token → Main Tabs
  return token ? <MainTabs /> : <AuthStack />;
};

export default RootNavigator;
