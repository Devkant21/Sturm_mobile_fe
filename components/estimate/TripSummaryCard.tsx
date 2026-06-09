import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface TripSummaryCardProps {
  pickup: string;
  dropoff: string;
  moveDateTime: string;
}

export default function TripSummaryCard({
  pickup,
  dropoff,
  moveDateTime,
}: TripSummaryCardProps) {
  const formattedDate = new Date(moveDateTime).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View className="mx-3 mt-4 rounded-3xl border border-zinc-200 bg-white p-4">
      {/* Header */}
      <View className="mb-5 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-zinc-900">Trip Summary</Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Ionicons name="create-outline" size={18} color="#16a34a" />
          <Text className="ml-1 font-semibold text-green-600">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Route */}
      <View className="flex-row">
        <View className="items-center mr-4">
          <View className="h-4 w-4 rounded-full bg-green-500/20 items-center justify-center">
            <View className="h-2.5 w-2.5 rounded-full bg-green-600" />
          </View>

          <View
            className="my-1 flex-1"
            style={{
              borderLeftWidth: 2,
              borderLeftColor: "#d4d4d8",
              borderStyle: "dashed",
              minHeight: 50,
            }}
          />

          <View className="h-4 w-4 rounded-full bg-red-500/20 items-center justify-center">
            <View className="h-2.5 w-2.5 rounded-full bg-red-600" />
          </View>
        </View>

        <View className="flex-1">
          <View>
            <Text className="text-sm text-zinc-500">Pickup Location</Text>
            <Text className="mt-1 text-base font-semibold text-zinc-900">
              {pickup}
            </Text>
          </View>

          <View className="mt-6">
            <Text className="text-sm text-zinc-500">Destination</Text>
            <Text className="mt-1 text-base font-semibold text-zinc-900">
              {dropoff}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="my-5 h-px bg-zinc-100" />

      {/* Stats */}
      {/* Stats */}
      <View className="flex-row">
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-1">
            <Ionicons name="navigate-outline" size={16} color="#4b5563" />
            <Text className="text-sm text-zinc-500">Distance</Text>
          </View>
          <Text className="text-base font-semibold text-zinc-900">
            Calculating...
          </Text>
        </View>

        <View className="w-px bg-zinc-100" />

        <View className="flex-1 px-4 gap-1">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={16} color="#4b5563" />
            <Text className="text-sm text-zinc-500">Estimated Time</Text>
          </View>
          <Text className="text-base font-semibold text-zinc-900">
            Calculating...
          </Text>
        </View>

        <View className="w-px bg-zinc-100" />

        <View className="flex-1 pl-4 gap-1">
          <View className="flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={16} color="#4b5563" />
            <Text className="text-sm text-zinc-500">Date & Time</Text>
          </View>
          <Text
            className="text-base font-semibold text-zinc-900"
            numberOfLines={2}
          >
            {formattedDate}
          </Text>
        </View>
      </View>
    </View>
  );
}
