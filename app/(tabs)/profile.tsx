import { useAuthStore } from "@/store/authStore";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearUser();
    router.replace("/home");
  };

  const version = Constants.expoConfig?.version ?? "1.0.0";

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-[#f5f4ee] items-center justify-center px-6">
        <Text className="text-[#5b2417] text-xl font-medium">
          You are not logged in.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Profile Header */}
        <View className="bg-white p-6 rounded-2xl items-center shadow-md mb-6">
          {/* Profile Picture */}
          {user.picture ? (
            <Image
              source={{ uri: user.picture }}
              className="w-32 h-32 rounded-full"
            />
          ) : (
            <View className="w-32 h-32 rounded-full bg-gray-300 items-center justify-center">
              <Text className="text-4xl text-white">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
          )}

          <Text className="mt-2 text-2xl font-bold text-[#5b2417]">
            {user.name || "Unnamed User"}
          </Text>
          <Text className="text-gray-500 text-base">{user.email}</Text>
        </View>

        {/* Optional Info Cards */}
        {/* <View className="flex-row justify-between mb-6">
          <View className="bg-white rounded-2xl p-4 flex-1 mx-1 items-center shadow-md">
            <Text className="text-gray-400 text-sm">Total Orders</Text>
            <Text className="text-[#5b2417] font-bold text-lg">12</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 flex-1 mx-1 items-center shadow-md">
            <Text className="text-gray-400 text-sm">Upcoming Pickups</Text>
            <Text className="text-[#5b2417] font-bold text-lg">3</Text>
          </View>
        </View> */}

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-[#5b2417] px-6 py-4 rounded-xl mb-4 shadow-md"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Logout
          </Text>
        </TouchableOpacity>

        {/* App Version / Info */}
        <View className="items-center mt-10 pb-6">
          <Text className="text-xs text-gray-400 text-center">
            App Version: v{version}
          </Text>
          <Text className="text-xs text-gray-400 text-center mt-1">
            © 2026 Sturm
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
