import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface ProfileHeaderProps {
  onNotificationPress?: () => void;
  hasNotifications?: boolean;
}

export default function ProfileHeader({
  onNotificationPress,
  hasNotifications = false,
}: ProfileHeaderProps) {
  return (
    <View className="px-4 pt-4 pb-6">
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-4xl font-bold text-zinc-900">Profile</Text>

          <Text className="mt-2 text-base text-zinc-500">
            Manage your account and preferences
          </Text>
        </View>

        <TouchableOpacity
          onPress={onNotificationPress}
          className="relative h-12 w-12 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={30} color="#111827" />

          {hasNotifications && (
            <View className="absolute right-1 top-1 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
