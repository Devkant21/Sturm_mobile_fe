import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-50">
      <View className="flex-row items-center border-b border-zinc-200 bg-white px-4 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-zinc-100"
        >
          <Ionicons name="arrow-back" size={20} color="#18181b" />
        </TouchableOpacity>

        <Text className="text-xl font-semibold text-zinc-900">
          Notifications
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
          <Ionicons
            name="notifications-off-outline"
            size={40}
            color="#71717a"
          />
        </View>

        <Text className="mt-6 text-xl font-semibold text-zinc-900">
          No New Notifications
        </Text>

        <Text className="mt-2 text-center text-base text-zinc-500">
          You're all caught up. We'll notify you when there are updates about
          your bookings and services.
        </Text>
      </View>
    </SafeAreaView>
  );
}
