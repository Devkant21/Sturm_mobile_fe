import { useState } from "react";

type Coords = { latitude: number; longitude: number } | null;

export function useGeocode() {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? "";
  const [loading, setLoading] = useState(false);

  async function fetchCoordinates(address: string): Promise<Coords> {
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/google/geocode?address=${encodeURIComponent(address)}`
      );
      const data = await res.json();
      if (res.ok && data.lat && data.lng) {
        return { latitude: data.lat, longitude: data.lng };
      }
      return null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { fetchCoordinates, loading };
}
