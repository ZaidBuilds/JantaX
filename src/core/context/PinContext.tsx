import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isValidIndianPincode } from '../utils/pinResolver';
import { nearestPin, onDirectoryLoad, prefetchPin } from '../services/pinDirectory';

/** PIN centres are rarely more than a few tens of km apart in India; further than this, the location is not in the directory. */
const MAX_DETECT_KM = 100;

interface PinContextValue {
  /** The currently selected PIN code across the whole app. */
  selectedPin: string;
  setSelectedPin: (pin: string) => void;

  /** PIN codes the user is tracking (persisted to localStorage). */
  followedPins: string[];
  isFollowing: (pin: string) => boolean;
  toggleFollow: (pin: string) => void;

  /** Browser location → the PIN whose post offices are closest (India Post directory). */
  isDetecting: boolean;
  detectionError: string | null;
  detectLocation: () => Promise<string | null>;

  /** Bumps when a PIN directory file loads, so screens that call resolvePincode re-render with real districts. */
  directoryVersion: number;
}

const FOLLOW_STORAGE_KEY = 'jantax.followedPins';

const PinContext = createContext<PinContextValue | null>(null);

function loadFollowedPins(): string[] {
  try {
    const raw = localStorage.getItem(FOLLOW_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((p) => typeof p === 'string') : [];
  } catch {
    return [];
  }
}

export function PinProvider({ children }: { children: ReactNode }) {
  const [selectedPin, setSelectedPinState] = useState<string>('110001');
  const [followedPins, setFollowedPins] = useState<string[]>(() => loadFollowedPins());
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [directoryVersion, setDirectoryVersion] = useState(0);

  useEffect(() => onDirectoryLoad(() => setDirectoryVersion((v) => v + 1)), []);
  useEffect(() => prefetchPin(selectedPin), [selectedPin]);

  useEffect(() => {
    try {
      localStorage.setItem(FOLLOW_STORAGE_KEY, JSON.stringify(followedPins));
    } catch {
      /* storage unavailable — ignore */
    }
  }, [followedPins]);

  const setSelectedPin = useCallback((pin: string) => {
    const cleaned = pin.trim();
    if (isValidIndianPincode(cleaned)) {
      setSelectedPinState(cleaned);
    }
  }, []);

  const isFollowing = useCallback(
    (pin: string) => followedPins.includes(pin.trim()),
    [followedPins]
  );

  const toggleFollow = useCallback((pin: string) => {
    const cleaned = pin.trim();
    if (!isValidIndianPincode(cleaned)) return;
    setFollowedPins((prev) =>
      prev.includes(cleaned) ? prev.filter((p) => p !== cleaned) : [...prev, cleaned]
    );
  }, []);

  const detectLocation = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setDetectionError('Location is not supported on this device.');
        setIsDetecting(false);
        resolve(null);
        return;
      }
      setIsDetecting(true);
      setDetectionError(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const near = await nearestPin(latitude, longitude);
          setIsDetecting(false);
          if (!near) {
            setDetectionError("Couldn't load the PIN directory. Enter your PIN code instead.");
            resolve(null);
          } else if (near.km > MAX_DETECT_KM) {
            setDetectionError('Your location is far from every PIN in the India Post directory. Enter your PIN code instead.');
            resolve(null);
          } else {
            setSelectedPinState(near.pin);
            resolve(near.pin);
          }
        },
        (error) => {
          setIsDetecting(false);
          setDetectionError(
            error.code === error.PERMISSION_DENIED
              ? 'Location permission denied.'
              : 'Could not detect your location.'
          );
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
      );
    });
  }, []);

  const value = useMemo<PinContextValue>(
    () => ({
      selectedPin,
      setSelectedPin,
      followedPins,
      isFollowing,
      toggleFollow,
      isDetecting,
      detectionError,
      detectLocation,
      directoryVersion,
    }),
    [selectedPin, followedPins, isFollowing, toggleFollow, isDetecting, detectionError, detectLocation, directoryVersion]
  );

  return <PinContext.Provider value={value}>{children}</PinContext.Provider>;
}

export function usePin(): PinContextValue {
  const ctx = useContext(PinContext);
  if (!ctx) {
    throw new Error('usePin must be used within a PinProvider');
  }
  return ctx;
}
