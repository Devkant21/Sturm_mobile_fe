import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SingleProcessDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee] px-4 py-4">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#5b2417" />
        </Pressable>

        <Text className="text-xl font-bold text-[#5b2417] ml-2">
          Request Details
        </Text>
      </View>

      {/* Content */}
      <View className="bg-white p-4 rounded-2xl shadow">
        <Text className="text-base text-[#5b2417] font-medium">
          Request ID: {id}
        </Text>
      </View>
    </SafeAreaView>
  );
}
