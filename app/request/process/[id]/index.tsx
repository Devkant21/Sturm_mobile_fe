import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGeocode } from "@/hooks/useGeocoding";
import { StatusBar } from "expo-status-bar";
import DriverMap from "@/components/drivermap";
import * as Location from "expo-location";

interface DriverLocation {
  lat: number;
  lng: number;
}

type MoveData = {
  id: string;
  move_datetime: string;
  pickup: string;
  dropoff: string;
  status: string;
};

type Coords = { latitude: number; longitude: number };

export default function SingleProcessDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const { fetchCoordinates } = useGeocode();

  const [userCoords, setUserCoords] = useState<Coords | null>(null);

  // Parse JSON param only once
  const data: MoveData = JSON.parse(params.id as string);

  const [pickupCoords, setPickupCoords] = useState<Coords | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<Coords | null>(null);
  const [location, setLocation] = useState<DriverLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setUserCoords({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (!userCoords) return;
    fetchDriverLocation();
  }, [userCoords]);

  const fetchDriverLocation = async () => {
    if (!userCoords) return;

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/user/client/${data.id}/track-driver?lat=${userCoords.latitude}&lng=${userCoords.longitude}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();

      let foundDriver = null;

      // Case 1: Single driver object { driver: { lat, lng } }
      if (json?.driver) {
        foundDriver = {
          lat: json.driver.latitude,
          lng: json.driver.longitude,
        };
      }

      // Case 2: List from nearest-location API
      if (
        !foundDriver &&
        Array.isArray(json.active_drivers) &&
        json.active_drivers.length > 0
      ) {
        const d = json.active_drivers[0];
        foundDriver = {
          lat: d.Latitude,
          lng: d.Longitude,
        };
      }

      if (foundDriver) setLocation(foundDriver);
    } catch (error) {
      console.log("Failed to fetch driver location:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("Sending coords to backend:", userCoords);

  useEffect(() => {
    // fetchDriverLocation();

    (async () => {
      const [pickupLoc, dropoffLoc] = await Promise.all([
        fetchCoordinates(data.pickup),
        fetchCoordinates(data.dropoff),
      ]);

      setPickupCoords(pickupLoc);
      setDropoffCoords(dropoffLoc);
    })();

    const interval = setInterval(fetchDriverLocation, 10000);
    return () => clearInterval(interval);
  }, [userCoords]);

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee] px-4 py-4">
      <StatusBar hidden />

      {/* Map */}
      <View className="absolute inset-0">
        <DriverMap
          pickupCoords={pickupCoords}
          dropoffCoords={dropoffCoords}
          driverCoords={
            location
              ? { latitude: location.lat, longitude: location.lng }
              : null
          }
        />
      </View>

      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#5b2417" />
        </Pressable>

        <Text className="text-xl font-bold text-[#5b2417] ml-2">
          Request Details
        </Text>
      </View>
    </SafeAreaView>
  );
}
