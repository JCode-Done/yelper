import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

let Purchases;
if (Platform.OS !== 'web') {
  Purchases = require('react-native-purchases').default;
}

const RC_IOS_API_KEY = process.env.EXPO_PUBLIC_RC_IOS_API_KEY || '';
const RC_ANDROID_API_KEY = process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY || '';
const ENTITLEMENT_ID = 'premium';

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsSubscribed(false);
      setLoading(false);
      return;
    }

    if (Platform.OS === 'web') {
      const unsub = onSnapshot(
        doc(db, 'users', user.uid, 'subscription', 'status'),
        (snap) => {
          setIsSubscribed(snap.exists() && snap.data()?.active === true);
          setLoading(false);
        },
        () => {
          setIsSubscribed(false);
          setLoading(false);
        },
      );
      return unsub;
    }

    let cancelled = false;
    (async () => {
      try {
        const apiKey = Platform.OS === 'ios' ? RC_IOS_API_KEY : RC_ANDROID_API_KEY;
        if (!apiKey) {
          if (__DEV__) console.warn('[Subscription] Missing RevenueCat API key');
          setLoading(false);
          return;
        }

        Purchases.configure({ apiKey, appUserID: user.uid });

        const info = await Purchases.getCustomerInfo();
        if (!cancelled) {
          setIsSubscribed(info.entitlements.active[ENTITLEMENT_ID] !== undefined);
        }

        const offeringsResult = await Purchases.getOfferings();
        if (!cancelled && offeringsResult.current) {
          setOfferings(offeringsResult.current);
        }
      } catch (e) {
        if (__DEV__) console.warn('[Subscription] Init error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    const listener = Purchases?.addCustomerInfoUpdateListener?.((info) => {
      if (!cancelled) {
        setIsSubscribed(info.entitlements.active[ENTITLEMENT_ID] !== undefined);
      }
    });

    return () => {
      cancelled = true;
      if (listener?.remove) listener.remove();
    };
  }, [user]);

  const purchaseSubscription = useCallback(async (pkg) => {
    if (Platform.OS === 'web') {
      throw new Error('Use Stripe checkout for web subscriptions');
    }
    if (!pkg) throw new Error('No package selected');
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const active = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    setIsSubscribed(active);
    return active;
  }, []);

  const restorePurchases = useCallback(async () => {
    if (Platform.OS === 'web') return false;
    const info = await Purchases.restorePurchases();
    const active = info.entitlements.active[ENTITLEMENT_ID] !== undefined;
    setIsSubscribed(active);
    return active;
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        loading,
        offerings,
        purchaseSubscription,
        restorePurchases,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
};
