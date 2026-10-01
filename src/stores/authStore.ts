import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  login: () => void;
  logout: () => void;
}

const PERSIST_KEY = `ktxgo-auth-${STUDENT.mssv}`;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      login: () => {
        const stamp = examStamp();
        set({ token: `ktxgo-${STUDENT.mssv}-${stamp}` });
      },
      logout: () => set({ token: null }),
    }),
    {
      name: PERSIST_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
