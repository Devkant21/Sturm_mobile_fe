import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function LandingScreen() {
  const router = useRouter();

  const floatY = useSharedValue(0);
  const dot1 = useSharedValue(0.35);
  const dot2 = useSharedValue(0.35);
  const dot3 = useSharedValue(0.35);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1600 }),
        withTiming(8, { duration: 1600 }),
      ),
      -1,
      true,
    );

    dot1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 350 }),
        withTiming(0.35, { duration: 350 }),
      ),
      -1,
    );

    setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 350 }),
          withTiming(0.35, { duration: 350 }),
        ),
        -1,
      );
    }, 180);

    setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 350 }),
          withTiming(0.35, { duration: 350 }),
        ),
        -1,
      );
    }, 360);

    const timer = setTimeout(() => {
      router.replace("/home");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: dot1.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: dot2.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: dot3.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <StatusBar style="dark" />

      <Animated.View
        entering={FadeIn.duration(800)}
        className="flex-1 items-center justify-center px-6"
      >
        {/* Background Decoration */}
        <View className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#e9dfd5]" />
        <View className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#efe7df]" />

        {/* Logo */}
        <Animated.View style={logoStyle}>
          <Image
            source={require("../assets/images/sturmlogo.png")}
            className="h-64 w-64"
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInDown.duration(700).delay(200)}
          className="mt-3 text-5xl font-black tracking-[6px] text-[#5b2417]"
        >
          STURM
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.duration(700).delay(500)}
          className="mt-3 px-6 text-center text-base leading-6 text-[#5b2417]/75"
        >
          Fast, reliable & affordable courier and moving services
        </Animated.Text>

        {/* Loading Section */}
        <Animated.View
          entering={FadeIn.duration(600).delay(900)}
          className="mt-12 items-center"
        >
          <Text className="mb-4 text-sm tracking-[2px] text-[#5b2417]/60">
            LOADING
          </Text>

          <View className="flex-row gap-3">
            <Animated.View
              style={dot1Style}
              className="h-3 w-3 rounded-full bg-[#5b2417]"
            />
            <Animated.View
              style={dot2Style}
              className="h-3 w-3 rounded-full bg-[#5b2417]"
            />
            <Animated.View
              style={dot3Style}
              className="h-3 w-3 rounded-full bg-[#5b2417]"
            />
          </View>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}
