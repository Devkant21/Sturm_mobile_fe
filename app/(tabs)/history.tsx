import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-24 h-24 rounded-full bg-[#fff1ee] items-center justify-center mb-6">
          <MaterialCommunityIcons
            name="truck-delivery-outline"
            size={46}
            color="#f88379"
          />
        </View>

        <Text className="text-2xl font-bold text-[#5b2417] mb-3 text-center">
          No History Yet
        </Text>

        <Text className="text-base text-gray-600 text-center leading-6">
          Your move requests, driver assignments, and completed deliveries will
          appear here.
        </Text>

        <Text className="text-sm text-gray-500 text-center mt-4 leading-6">
          Once your booking is reviewed by Sturm, status updates will be shown
          on this screen.
        </Text>
      </View>
    </SafeAreaView>
  );
}
