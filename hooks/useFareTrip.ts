import { useState } from "react";

export function useFare() {
  const FARE_BACKEND_URL =
    process.env.EXPO_PUBLIC_FARE_CALCULATION_BACKEND_URL ?? "";

  const [loading, setLoading] = useState(false);

  async function calculateFare(origin: string, destination: string) {
    setLoading(true);
    try {
      const res = await fetch(`${FARE_BACKEND_URL}/trip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          vehicle_type: "di",
        }),
      });

      const data = await res.json();
      if (!res.ok) return null;

      return {
        distance: `${data.distance_km.toFixed(1)} km`,
        duration: `${Math.round(data.duration_minutes)} min`,
        fare: data.fare_breakdown.final_fare_inr,
      };
    } finally {
      setLoading(false);
    }
  }

  return { calculateFare, loading };
}
