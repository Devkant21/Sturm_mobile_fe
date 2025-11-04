import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Linking, Platform, Pressable, Text, View } from "react-native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

type Props = {
  pickupCoords?: { latitude: number; longitude: number } | null;
  dropoffCoords?: { latitude: number; longitude: number } | null;
  driverCoords?: { latitude: number; longitude: number } | null;
};

export default function DriverMap({
  pickupCoords,
  dropoffCoords,
  driverCoords,
}: Props) {
  const [driverLocation, setDriverLocation] =
    useState<Location.LocationObject | null>(null);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Location permission denied");
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setDriverLocation(current);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 4000,
            distanceInterval: 5,
          },
          (newLoc) => {
            setDriverLocation(newLoc);
          }
        );
      } catch (err) {
        setErrorMsg(
          "Location services are disabled. Please enable GPS / High accuracy."
        );
      }
    };

    startTracking();
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    async function fetchRoute() {
      if (!pickupCoords || !dropoffCoords) return;

      const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? "";

      const url = `${BACKEND_URL}/api/google/map/route-direction?originLat=${pickupCoords.latitude}&originLng=${pickupCoords.longitude}&destLat=${dropoffCoords.latitude}&destLng=${dropoffCoords.longitude}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.polyline) {
          const decoded = decodePolyline(data.polyline);
          setRouteCoords(decoded);

          mapRef.current?.fitToCoordinates(decoded, {
            edgePadding: { top: 80, right: 80, bottom: 300, left: 80 },
            animated: true,
          });
        }
      } catch (error) {
        console.error("Route fetch failed:", error);
      }
    }

    fetchRoute();
  }, [pickupCoords, dropoffCoords]);

  useEffect(() => {
    if (pickupCoords && dropoffCoords && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates([pickupCoords, dropoffCoords], {
          edgePadding: { top: 80, right: 80, bottom: 300, left: 80 },
          animated: true,
        });
      }, 400);
    }
  }, [pickupCoords, dropoffCoords]);

  useEffect(() => {
    if (driverCoords && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: driverCoords.latitude,
          longitude: driverCoords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        600
      );
    }
  }, [driverCoords]);

  const region: Region | undefined = driverLocation
    ? {
        latitude: driverLocation.coords.latitude,
        longitude: driverLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : undefined;

  const openLocationSettings = async () => {
    try {
      if (Platform.OS === "android") {
        await Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS");
      } else {
        await Linking.openURL("App-Prefs:Privacy&path=LOCATION");
      }
    } catch (e) {
      await Linking.openSettings();
    }
  };

  return (
    <>
      {errorMsg && (
        <View className="absolute inset-0 z-9999 flex items-center pt-40 bg-black/40 px-5">
          <View className="bg-white p-5 rounded-lg w-72 items-center">
            <Text className="text-center text-base mb-4 text-black">
              {errorMsg}
            </Text>

            <Pressable
              onPress={async () => {
                await openLocationSettings();
                setErrorMsg(null);
              }}
              className="px-5 py-2 rounded-md border border-gray-300 mb-2"
            >
              <Text className="text-black">Open Settings</Text>
            </Pressable>

            <Pressable
              onPress={() => setErrorMsg(null)}
              className="px-5 py-2 rounded-md border border-gray-300"
            >
              <Text className="text-black">Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}
      {driverLocation && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={region}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton
          mapType="standard"
          userInterfaceStyle="light"
        >
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeWidth={4}
              strokeColor="#2E6CF6"
            />
          )}
          {pickupCoords && (
            <Marker coordinate={pickupCoords} title="Pickup" pinColor="green" />
          )}
          {dropoffCoords && (
            <Marker
              coordinate={dropoffCoords}
              title="Drop-off"
              pinColor="red"
            />
          )}
          {driverCoords && (
            <Marker coordinate={driverCoords}>
              <View
                style={{
                  backgroundColor: "white",
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 24,
                  shadowColor: "#000",
                  shadowOpacity: 0.25,
                  shadowOffset: { width: 0, height: 3 },
                  shadowRadius: 4,
                  elevation: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 24 }}>🚚</Text>
              </View>
            </Marker>
          )}
        </MapView>
      )}
    </>
  );
}

function decodePolyline(encoded: string) {
  let points: { latitude: number; longitude: number }[] = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }
  return points;
}
