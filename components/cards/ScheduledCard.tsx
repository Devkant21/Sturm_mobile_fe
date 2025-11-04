import { useAuthStore } from "@/store/authStore";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View, Text } from "react-native";
import { useFare } from "@/hooks/useFareTrip";
import { formatDuration } from "@/utils/formatDuration";

type Schedule = {
  id: string;
  move_datetime: string;
  pickup: string;
  dropoff: string;
  //   status: "pending" | "accepted" | "scheduled" | "completed";
  status: string;
  fare?: number;
  distance?: string;
  duration?: string;
};

type ScheduleCardProps = {
  data: Schedule;
};

export default function ScheduleCard({ data }: ScheduleCardProps) {
  const router = useRouter();
  const { token } = useAuthStore();

  const { calculateFare, loading } = useFare();

  const [fare, setFare] = useState<number | null>(data.fare ?? null);
  const [distance, setDistance] = useState<string | null>(
    data.distance ?? null
  );
  const [duration, setDuration] = useState<string | null>(
    data.duration ?? null
  );

  useEffect(() => {
    async function fetchFare() {
      const result = await calculateFare(data.pickup, data.dropoff);
      if (!result) return;
      setFare(result.fare);
      setDistance(result.distance);
      setDuration(result.duration);
    }

    if (fare === null) {
      fetchFare();
    }
  }, [data.pickup, data.dropoff, calculateFare, fare]);

  const enrichedData = {
    ...data,
    fare,
    distance,
    duration,
  };

  return (
    <Pressable
      onPress={() =>
        router.push(
          `/request/process/${encodeURIComponent(JSON.stringify(enrichedData))}`
        )
      }
    >
      <View className="bg-[#f0ede2] rounded-2xl p-5 mb-3 shadow-md">
        {/* Date + Status Pill */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <MaterialIcons name="calendar-today" size={18} color="#5b2417" />
            <Text className="ml-2 text-xs font-medium text-[#171717]">
              {data.move_datetime}
            </Text>
          </View>
        </View>

        {/* Pickup */}
        <View className="flex-row items-start mb-2">
          <Ionicons name="location-sharp" size={18} color="#5b2417" />
          <View className="ml-3 flex-1">
            <Text className="text-sm font-semibold text-[#171717]">Pickup</Text>
            <Text className="text-xs text-[#2d150f] mt-0.5">{data.pickup}</Text>
          </View>
        </View>

        {/* Dropoff */}
        <View className="flex-row items-start mb-1">
          <FontAwesome5 name="truck" size={16} color="#5b2417" />
          <View className="ml-3 flex-1">
            <Text className="text-sm font-semibold text-[#171717]">
              Dropoff
            </Text>
            <Text className="text-xs text-[#2d150f] mt-0.5">
              {data.dropoff}
            </Text>
          </View>
        </View>

        {(fare !== null || loading) && (
          <View className="mt-2">
            <Text className="text-sm font-semibold text-[#171717]">
              Estimated Fare
            </Text>
            <Text className="text-xs text-[#2d150f] mt-0.5">
              {loading
                ? "Calculating..."
                : `₹${fare} • ${distance ?? ""} • ${
                    duration ? formatDuration(duration) : ""
                  }`}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
