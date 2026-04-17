import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LandingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <StatusBar style="dark" />
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo */}
        <Image
          source={require("../assets/images/sturmlogo.png")}
          className="w-64 h-64 mb-6"
          resizeMode="contain"
        />

        {/* App Name */}
        <Text className="text-4xl font-black text-[#5b2417] mt-4">
          STURM
        </Text>

        {/* Short tagline */}
        <Text className="text-base text-center text-[#5b2417] mt-2">
          Fast, reliable & affordable courier and moving services
        </Text>

        {/* Loader */}
        <ActivityIndicator size="large" color="#5b2417" className="mt-10" />
      </View>
    </SafeAreaView>
  );
}
