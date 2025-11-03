import { useAuthStore } from "@/store/authStore";
import {
  Entypo,
  // FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MoveRequest {
  id: string;
  pickup: string;
  dropoff: string;
  phone: string;
  move_datetime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function Requests() {
  const router = useRouter();

  const { token } = useAuthStore();
  const [requests, setRequests] = useState<MoveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (!refreshing) setLoading(true);
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/user/get-requests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch requests");

      setRequests(data.requests);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching requests:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, refreshing]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#facc15"; // yellow
      case "confirmed":
        return "#34d399"; // green
      case "cancelled":
        return "#f87171"; // red
      default:
        return "#a1a1aa"; // gray
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#f5f4ee]">
        <ActivityIndicator size="large" color="#f88379" />
        <Text className="mt-4 text-[#5b2417] font-medium">
          Loading requests...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#f5f4ee]">
        <Text className="text-red-500">{error}</Text>
      </SafeAreaView>
    );
  }

  if (requests.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#f5f4ee]">
        <Text className="text-gray-500 text-lg">No move requests found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-2xl font-bold text-[#5b2417] mb-4">
          Move Requests
        </Text>

        {requests.map((req) => (
          <Pressable
            key={req.id}
            onPress={() => router.push(`/request/process/${req.id}`)}
           
            android_ripple={{ color: "#f5d2cb" }}
          >
            <View
              key={req.id}
              className="bg-white p-6 rounded-3xl shadow-md mb-4"
              style={{ shadowOpacity: 0.1, shadowRadius: 8 }}
            >
              {/* Pickup & Dropoff */}
              <View className="flex-row items-center mb-2">
                <Entypo name="location-pin" size={20} color="#f88379" />
                <Text className="ml-2 font-bold text-[#5b2417]">
                  {req.pickup} → {req.dropoff}
                </Text>
              </View>

              {/* Date & Time */}
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="date-range" size={16} color="#4b5563" />
                <Text className="ml-2 text-gray-600">
                  {formatDate(req.move_datetime)}
                </Text>
                <MaterialIcons
                  name="access-time"
                  size={16}
                  color="#4b5563"
                  style={{ marginLeft: 16 }}
                />
                <Text className="ml-2 text-gray-600">
                  {formatTime(req.move_datetime)}
                </Text>
              </View>

              {/* Status Badge */}
              <View
                className="mt-2 px-3 py-1 rounded-full self-start"
                style={{ backgroundColor: getStatusColor(req.status) + "33" }}
              >
                <Text
                  className="font-semibold text-sm"
                  style={{ color: getStatusColor(req.status) }}
                >
                  {req.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
