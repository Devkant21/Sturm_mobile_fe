import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface EstimateFooterProps {
  total?: string;
  loading?: boolean;
  onPress: () => void;
}

export default function EstimateFooter({
  total = "Calculating...",
  loading = false,
  onPress,
}: EstimateFooterProps) {
  return (
    <View className="border-t border-zinc-200 bg-white px-6 pt-4 pb-6">
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={loading}
        onPress={onPress}
        className={`flex-row items-center justify-between rounded-2xl px-5 py-5 ${
          loading ? "bg-green-500" : "bg-green-600"
        }`}
      >
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/15">
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="mail-outline" size={22} color="white" />
            )}
          </View>

          <Text className="text-xl font-semibold text-white">
            {loading ? "Submitting Request..." : "Submit Booking"}
          </Text>
        </View>

        {!loading && (
          <View className="flex-row items-center">
            <Text className="mr-2 text-2xl font-bold text-white">{total}</Text>

            <Ionicons name="arrow-forward" size={24} color="white" />
          </View>
        )}
      </TouchableOpacity>

      <View className="mt-4 flex-row items-center justify-center">
        <View className="flex-row items-center">
          <Ionicons name="shield-checkmark-outline" size={18} color="#16a34a" />
          <Text className="ml-2 text-sm text-zinc-600">Secure Request</Text>
        </View>

        <View className="mx-4 h-4 w-px bg-zinc-300" />

        <View className="flex-row items-center">
          <Ionicons name="headset-outline" size={18} color="#16a34a" />
          <Text className="ml-2 text-sm text-zinc-600">Fast Response</Text>
        </View>
      </View>
    </View>
  );
}
