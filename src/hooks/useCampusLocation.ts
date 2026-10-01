import { useState, useCallback, useEffect } from 'react';
import {
  PermissionsAndroid,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

// Tọa độ cổng KTX cố định trong code
const KTX_LAT = 10.8537;
const KTX_LNG = 106.6297;

export type LocationStatus = 'idle' | 'granted' | 'denied' | 'blocked';

export interface CampusLocationResult {
  status: LocationStatus;
  km: number | null;
  shipFee: number | null;
  requestPermission: () => Promise<void>;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calcShipFee(km: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  } else {
    return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
  }
}

export function useCampusLocation(): CampusLocationResult {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const storeShipFee = useCartStore(s => s.shipFee);
  const storeKm = useCartStore(s => s.km);
  const setStoreShipFee = useCartStore(s => s.setShipFee);

  const [km, setKm] = useState<number | null>(storeKm);
  const [shipFee, setShipFee] = useState<number | null>(storeShipFee);

  useEffect(() => {
    if (storeKm !== null) setKm(storeKm);
    if (storeShipFee !== null) setShipFee(storeShipFee);
  }, [storeKm, storeShipFee]);

  const requestPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Quyền vị trí',
            message: 'KTXGo cần truy cập vị trí để tính phí ship.',
            buttonNeutral: 'Hỏi sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Đồng ý',
          },
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          setStatus('granted');
          Geolocation.getCurrentPosition(
            pos => {
              const userLat = pos.coords.latitude;
              const userLng = pos.coords.longitude;
              const distKm = haversineKm(userLat, userLng, KTX_LAT, KTX_LNG);
              const roundedKm = Math.round(distKm * 10) / 10;
              const fee = calcShipFee(distKm);
              setKm(roundedKm);
              setShipFee(fee);
              setStoreShipFee(fee, roundedKm);
            },
            _err => {
              // Mock tọa độ mẫu ~1.2km cho máy ảo/thiết bị trong nhà
              const mockKm = 1.2;
              const fee = calcShipFee(mockKm);
              setKm(mockKm);
              setShipFee(fee);
              setStoreShipFee(fee, mockKm);
            },
            { enableHighAccuracy: false, timeout: 8000 },
          );
        } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setStatus('blocked');
          Alert.alert(
            'Quyền bị chặn',
            'Bạn đã chặn quyền vị trí. Mở Cài đặt để cấp quyền.',
            [
              { text: 'Hủy', style: 'cancel' },
              {
                text: 'Mở Cài đặt',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
        } else {
          setStatus('denied');
        }
      }
    } catch (_e) {
      setStatus('denied');
    }
  }, [setStoreShipFee]);

  return { status, km, shipFee, requestPermission };
}
