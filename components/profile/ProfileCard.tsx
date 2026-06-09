import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProfileCardProps {
  name: string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  verified?: boolean;
  onEdit?: () => void;
}

export default function ProfileCard({
  name,
  email,
  phone,
  profileImage,
  verified = true,
  onEdit,
}: ProfileCardProps) {
  return (
    <View className="mx-4 rounded-3xl border border-zinc-200 bg-white p-4">
      <View className="flex-row">
        {/* Avatar */}

        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            className="h-24 w-24 rounded-full"
          />
        ) : (
          <View className="h-24 w-24 items-center justify-center rounded-full bg-green-50">
            <Ionicons name="person" size={42} color="#16a34a" />
          </View>
        )}

        {/* Details */}
        <View className="ml-4 flex-1">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text
                className="text-2xl font-bold text-zinc-900"
                numberOfLines={1}
              >
                {name}
              </Text>

              <Text className="mt-2 text-base text-zinc-500" numberOfLines={1}>
                {email}
              </Text>

              <Text className="mt-1 text-base text-zinc-500">
                {phone ?? "No phone number"}
              </Text>
            </View>

            {verified && (
              <View className="ml-3 flex-row items-center rounded-xl bg-green-50 px-3 py-2">
                <Ionicons name="shield-checkmark" size={16} color="#16a34a" />

                <Text className="ml-1 font-semibold text-green-700">
                  Verified
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            disabled
            activeOpacity={1}
            className="mt-4 flex-row items-center self-start rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
          >
            <Ionicons name="create-outline" size={18} color="#9ca3af" />

            <Text className="ml-2 font-semibold text-zinc-400">
              Edit Profile
            </Text>

            <Text className="ml-2 text-xs text-zinc-400">(Coming Soon)</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-5 border-t border-zinc-100 pt-5">
        <View className="flex-row">
          <View className="flex-1 flex-row items-start">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <Ionicons name="calendar-outline" size={22} color="#16a34a" />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-3xl font-bold text-zinc-900">0</Text>

              <Text className="text-sm text-zinc-500">Total Bookings</Text>
            </View>
          </View>

          <View className="mx-4 w-px bg-zinc-100" />

          <View className="flex-1 flex-row items-start">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <Ionicons name="time-outline" size={22} color="#16a34a" />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-3xl font-bold text-zinc-900">0</Text>

              <Text className="text-sm text-zinc-500">Active Requests</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
