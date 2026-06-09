import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface HomeHeaderProps {
  userName: string;
  onMessages?: () => void;
  onNotifications?: () => void;
}

export default function HomeHeader({
  userName,
  onMessages,
  onNotifications,
}: HomeHeaderProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <View className="flex-row items-start justify-between">
      <View className="flex-1">
        <Text className="text-3xl font-bold text-zinc-900">
          {greeting}, {userName}
        </Text>

        <Text className="mt-1 text-base text-zinc-500">
          What are you moving today?
        </Text>
      </View>

      <View className="flex-row gap-3">

        <TouchableOpacity
          onPress={onNotifications}
          className="h-12 w-12 items-center justify-center rounded-full bg-white"
        >
          <Ionicons name="notifications-outline" size={22} color="#18181b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
