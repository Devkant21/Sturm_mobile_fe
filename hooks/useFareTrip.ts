import { useState } from "react";

type FareResponse = {
  distance_km: number;
  duration_minutes: number;
  fare_breakdown: {
    final_fare_inr: number;
  };
};

type FareResult = {
  distance: string;
  duration: string;
  fare: number;
};

export function useFare() {
  const FARE_BACKEND_URL =
    process.env.EXPO_PUBLIC_FARE_CALCULATION_BACKEND_URL ?? "";

  const [loading, setLoading] = useState(false);

  async function calculateFare(
    origin: string,
    destination: string,
  ): Promise<FareResult | null> {
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

      if (!res.ok) return null;

      const data: FareResponse = await res.json();

      return {
        distance: `${data.distance_km.toFixed(1)} km`,
        duration: `${Math.round(data.duration_minutes)} min`,
        fare: data.fare_breakdown.final_fare_inr,
      };
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { calculateFare, loading };
}
