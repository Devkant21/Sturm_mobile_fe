import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface EstimateHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function EstimateHeader({
  title = "Estimate & Book",
  subtitle = "Review your booking details and confirm",
}: EstimateHeaderProps) {
  return (
    <View className="px-6 pt-6 pb-4 bg-[#F8F8F8]">
      <View className="relative items-center justify-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-0 h-10 w-10 items-center justify-center"
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={26} color="#111827" />
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-gray-900">{title}</Text>

        <Text className="mt-1 text-md text-gray-500">{subtitle}</Text>
      </View>
    </View>
  );
}
