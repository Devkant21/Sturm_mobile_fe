import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { useAuthStore } from "@/store/authStore";

export default function AccountCard() {
  const router = useRouter();
  const { clearUser } = useAuthStore();

  const version = Constants.expoConfig?.version ?? "1.0.0";

  const handleLogout = () => {
    clearUser();
    router.replace("/home");
  };

  return (
    <View className="mx-4 mt-4 mb-8">
      <Text className="mb-3 text-xl font-semibold text-zinc-900">Account</Text>

      <View className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center px-4 py-4"
          activeOpacity={0.7}
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-red-50">
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          </View>

          <View className="ml-3 flex-1">
            <Text className="font-semibold text-red-600">Logout</Text>

            <Text className="mt-0.5 text-sm text-zinc-500">
              Sign out of your account
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>

        <View className="border-t border-zinc-100 px-4 py-5">
          <Text className="text-center text-sm font-medium text-zinc-500">
            Sturm App v{version}
          </Text>

          <Text className="mt-1 text-center text-xs text-zinc-400">
            © {new Date().getFullYear()} Sturm
          </Text>

          <Text className="mt-0.5 text-center text-xs text-zinc-400">
            All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  );
}
