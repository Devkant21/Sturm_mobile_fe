import { BackHandler } from "react-native";
import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingSuccessPage() {
  const { pickup, dropoff, move_datetime, movementType } =
    useLocalSearchParams<{
      pickup: string;
      dropoff: string;
      move_datetime: string;
      movementType: string;
    }>();

  const formattedDate = new Date(move_datetime).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      router.replace("/");
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => subscription.remove();
  }, []),
);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 24,
          }}
        >
          {/* Header */}

          <View className="mt-8 items-center">
            <Text className="text-4xl font-bold text-zinc-900">
              Request Submitted
            </Text>

            <Text className="mt-2 text-center text-base text-zinc-500">
              Your request has been received successfully
            </Text>
          </View>

          {/* Success Card */}

          <View className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6">
            <View className="items-center">
              <View className="h-32 w-32 items-center justify-center rounded-full bg-green-50">
                <Ionicons name="checkmark" size={80} color="#16a34a" />
              </View>

              <Text className="mt-6 text-4xl font-bold text-green-600">
                Request Sent!
              </Text>

              <Text className="mt-4 text-center text-lg leading-7 text-zinc-700">
                Thank you! Your move request has been submitted successfully.
              </Text>
            </View>

            <View className="my-8 h-px bg-zinc-100" />

            {/* Team Review Box */}

            <View className="rounded-2xl bg-green-50 p-5">
              <View className="flex-row">
                <Ionicons name="people-outline" size={28} color="#16a34a" />

                <View className="ml-4 flex-1">
                  <Text className="text-xl font-semibold text-zinc-900">
                    Our team will check in shortly
                  </Text>

                  <Text className="mt-2 text-base leading-6 text-zinc-600">
                    We will review your request and contact you soon with
                    further details.
                  </Text>
                </View>
              </View>
            </View>

            <View className="my-8 h-px bg-zinc-100" />

            {/* Summary */}

            <Text className="mb-5 text-2xl font-bold text-zinc-900">
              Request Summary
            </Text>

            <View className="gap-y-5">
              <View className="flex-row">
                <Ionicons name="cube-outline" size={22} color="#71717a" />

                <View className="ml-4 flex-1">
                  <Text className="text-sm text-zinc-500">Service</Text>

                  <Text className="text-lg font-medium text-zinc-900">
                    {movementType}
                  </Text>
                </View>
              </View>

              <View className="flex-row">
                <Ionicons name="calendar-outline" size={22} color="#71717a" />

                <View className="ml-4 flex-1">
                  <Text className="text-sm text-zinc-500">Date & Time</Text>

                  <Text className="text-lg font-medium text-zinc-900">
                    {formattedDate}
                  </Text>
                </View>
              </View>

              <View className="flex-row">
                <Ionicons name="location-outline" size={22} color="#71717a" />

                <View className="ml-4 flex-1">
                  <Text className="text-sm text-zinc-500">Route</Text>

                  <Text className="mt-1 text-base text-zinc-900">{pickup}</Text>

                  <View className="my-2">
                    <Ionicons name="arrow-down" size={18} color="#71717a" />
                  </View>

                  <Text className="text-base text-zinc-900">{dropoff}</Text>
                </View>
              </View>
            </View>

            <Text className="mt-8 text-center text-base text-zinc-500">
              You will receive updates regarding your request shortly.
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}

        <View className="border-t border-zinc-200 bg-white p-6">
          <TouchableOpacity
            onPress={() => router.replace("/")}
            className="rounded-2xl bg-green-600 py-5"
          >
            <Text className="text-center text-xl font-semibold text-white">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
