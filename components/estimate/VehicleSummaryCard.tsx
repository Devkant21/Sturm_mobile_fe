import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface VehicleSummaryCardProps {
  vehicleId: string;
}

const VEHICLES = {
  pickup: {
    name: "DI Truck",
    image: require("@/assets/images/ditruck.png"),
    capacity: "750 KG Capacity",
    helpers: "1 - 2 Helpers",
    service: "Home Furniture Moving",
    fare: "Calculating...",
  },
};

export default function VehicleSummaryCard({
  vehicleId,
}: VehicleSummaryCardProps) {
  const vehicle = VEHICLES[vehicleId as keyof typeof VEHICLES];

  if (!vehicle) return null;

  return (
    <View className="mx-3 mt-2 rounded-3xl border border-zinc-200 bg-white p-4">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-zinc-900">
          Selected Vehicle
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Ionicons name="create-outline" size={18} color="#16a34a" />
          <Text className="ml-1 font-semibold text-green-600">Edit</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row">
        <Image
          source={vehicle.image}
          resizeMode="contain"
          className="h-24 w-24"
        />

        <View className="ml-4 flex-1">
          <View className="flex-row items-center flex-wrap">
            <Text className="text-xl font-bold text-zinc-900">
              {vehicle.name}
            </Text>

            <View className="ml-2 rounded-lg bg-green-100 px-2 py-1">
              <Text className="text-xs font-semibold text-green-700">
                Most Popular
              </Text>
            </View>
          </View>

          <View className="mt-2 flex-row items-center flex-wrap">
            <View className="flex-row items-center">
              <Ionicons name="cube-outline" size={14} color="#71717a" />
              <Text className="ml-1 text-sm text-zinc-500">
                {vehicle.capacity}
              </Text>
            </View>

            <Text className="mx-2 text-zinc-300">•</Text>

            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={14} color="#71717a" />
              <Text className="ml-1 text-sm text-zinc-500">
                {vehicle.helpers}
              </Text>
            </View>
          </View>

          <Text className="mt-3 text-base text-zinc-600">
            {vehicle.service}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-xl font-bold text-zinc-900">
            {vehicle.fare}
          </Text>

          <Text className="text-sm text-zinc-500">Base Fare</Text>
        </View>
      </View>
    </View>
  );
}
