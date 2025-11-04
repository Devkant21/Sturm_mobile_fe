import CompletedCard from "@/components/cards/CompletedCard";
import OtherCard from "@/components/cards/OtherCard";
import ScheduleCard from "@/components/cards/ScheduledCard";
import { useFetchRequest } from "@/hooks/useFetchRequest";
import { useAuthStore } from "@/store/authStore";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Requests() {
  const { token } = useAuthStore();
  const { requests, loading, refreshing, error, onRefresh } =
    useFetchRequest(token);

  const scheduled = requests.filter((r) =>
    ["scheduled", "accepted", "approved"].includes(r.status.toLowerCase())
  );
  const completed = requests.filter((r) =>
    ["completed"].includes(r.status.toLowerCase())
  );
  const other = requests.filter((r) =>
    ["pending", "failed", "rejected", "cancelled"].includes(
      r.status.toLowerCase()
    )
  );

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

        {scheduled.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-semibold text-[#5b2417] mb-2">
              Scheduled Moves
            </Text>

            {scheduled.map((req) => (
              <ScheduleCard key={req.id} data={req} />
            ))}
          </View>
        )}

        {completed.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-semibold text-[#5b2417] mb-2">
              Completed Moves
            </Text>

            {completed.map((req) => (
              <CompletedCard key={req.id} data={req} />
            ))}
          </View>
        )}

        {other.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-semibold text-[#5b2417] mb-2">
              Others
            </Text>

            {other.map((req) => (
              <OtherCard key={req.id} data={req} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
