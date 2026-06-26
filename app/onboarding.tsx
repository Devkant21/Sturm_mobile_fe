import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ScrollView } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

interface CompleteProfileResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: {
      id: number;
      email: string;
      full_name?: string | null;
      phone_number?: string | null;
      profile_image?: string | null;
      profile_status?: string;
    };
  };
}

export default function OnboardingScreen() {
  const router = useRouter();

  const { token, setAuth, clearUser } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [otp, setOtp] = useState("");

  // const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  function getReadableError(error: unknown): string {
    if (!(error instanceof Error)) {
      return "Something went wrong. Please try again.";
    }

    const msg = error.message.toLowerCase();

    // if (msg.includes("failed to send otp") || msg.includes("otp")) {
    //   return "OTP service is being configured and will be available soon.";
    // }

    if (msg.includes("network")) {
      return "Network error. Check your internet connection.";
    }

    if (msg.includes("timeout")) {
      return "Request timed out. Please try again.";
    }

    return error.message;
  }

  // const handleSendOtp = async () => {
  //   try {
  //     setLoading(true);
  //     setMessage(null);

  //     const response = await fetch(
  //       `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/user/send-otp`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           phone_number: phoneNumber,
  //         }),
  //       },
  //     );

  //     const data = await response.json();

  //     if (!response.ok || !data.success) {
  //       throw new Error(data.message || "Failed to send OTP");
  //     }

  //     setOtpSent(true);
  //     setMessage({
  //       type: "success",
  //       text: "OTP sent successfully to your WhatsApp number.",
  //     });
  //   } catch (error) {
  //     setMessage({
  //       type: "error",
  //       text: getReadableError(error),
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCompleteProfile = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/user/complete-profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: fullName,
            phone_number: phoneNumber,
            // otp: Number(otp),
            profile_image: "",
          }),
        },
      );

      const data: CompleteProfileResponse = await response.json();

      if (!response.ok || !data.success || !data.data) {
        throw new Error(data.message || "Failed to complete profile");
      }

      const updatedUser = data.data.user;

      setAuth(
        {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.full_name ?? null,
          phoneNumber: updatedUser.phone_number ?? null,
          profileImage: updatedUser.profile_image ?? null,
          profileStatus: updatedUser.profile_status ?? "active",
        },
        data.data.token,
      );

      router.replace("/(tabs)");
    } catch (error) {
      setMessage({
        type: "error",
        text: getReadableError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch {
      // ignore
    }

    clearUser();

    router.replace("/home");
  };

  // const canSendOtp = phoneNumber.length === 10 && !loading && !otpSent;

  const canContinue =
    fullName.trim().length > 0 &&
    phoneNumber.length === 10 &&
    // otp.length === 4 &&
    !loading;

  return (
    <SafeAreaView className="flex-1 bg-[#F6F7F9]">
      <StatusBar style="dark" />
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(450)}>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-sm font-semibold tracking-widest text-[#5b2417]/60">
                  WELCOME TO STURM
                </Text>

                <Text className="mt-2 text-3xl font-bold text-[#5b2417]">
                  Complete your profile
                </Text>

                <Text className="mt-2 text-sm leading-6 text-black/55">
                  We need a few details before you can start booking deliveries.
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleSignOut}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2"
              >
                <Text className="text-sm font-medium text-red-600">
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Progress */}
          <Animated.View
            entering={FadeInDown.duration(450).delay(100)}
            className="mt-6"
          >
            <View className="h-2 rounded-full bg-zinc-200">
              <View className="h-2 w-full rounded-full bg-[#5b2417]" />
            </View>

            <Text className="mt-2 text-xs text-zinc-500">Step 1 of 1</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInDown.duration(450).delay(200)}
            className="mt-8 gap-5"
          >
            {/* Full Name */}
            <View>
              <Text className="mb-2 text-sm font-medium text-zinc-600">
                Full Name
              </Text>

              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="John Doe"
                className="h-14 rounded-2xl border border-zinc-200 bg-white px-4"
              />
            </View>

            {/* Phone */}
            <View>
              <View className="mb-2 flex-row items-center">
                <Text className="text-sm font-medium text-zinc-600">
                  Phone Number
                </Text>

                {/* <View className="ml-2 rounded-full bg-[#25D366]/10 px-2 py-1">
                  <Text className="text-[10px] font-bold text-[#25D366]">
                    For OTP
                  </Text>
                </View> */}
              </View>

              <View className="flex-row gap-3">
                <View className="h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4">
                  <Text className="font-medium">+91</Text>
                </View>

                <TextInput
                  value={phoneNumber}
                  onChangeText={(value) =>
                    setPhoneNumber(value.replace(/\D/g, ""))
                  }
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholder="9876543210"
                  className="flex-1 h-14 rounded-2xl border border-zinc-200 bg-white px-4"
                />
              </View>

              {/* <Text className="mt-2 text-xs text-zinc-500">
                We'll send verification code on WhatsApp
              </Text> */}
              {/* <TouchableOpacity
                disabled={!canSendOtp}
                onPress={handleSendOtp}
                className={`mt-3 h-12 items-center justify-center rounded-2xl border ${
                  canSendOtp
                    ? "border-[#5b2417]"
                    : "border-zinc-200 bg-zinc-100"
                }`}
              >
                <Text
                  className={`font-medium ${
                    canSendOtp ? "text-[#5b2417]" : "text-zinc-400"
                  }`}
                >
                  {loading && !otpSent
                    ? "Sending..."
                    : otpSent
                      ? "OTP Sent"
                      : "Send OTP"}
                </Text>
              </TouchableOpacity> */}
            </View>

            {/* OTP */}
            {/* {otpSent && (
              <Animated.View entering={FadeInDown.duration(350)}>
                <Text className="mb-2 text-sm font-medium text-zinc-600">
                  Enter OTP
                </Text>

                <TextInput
                  value={otp}
                  onChangeText={(value) => setOtp(value.replace(/\D/g, ""))}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="0000"
                  className="h-14 rounded-2xl border border-zinc-200 bg-white px-4 text-center text-lg tracking-[8px]"
                />
              </Animated.View>
            )} */}

            {/* Message */}
            {message ? (
              <Animated.View
                entering={FadeIn.duration(250)}
                className={`rounded-2xl border p-4 ${
                  message.type === "error"
                    ? "border-red-200 bg-red-50"
                    : message.type === "success"
                      ? "border-green-200 bg-green-50"
                      : "border-blue-200 bg-blue-50"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    message.type === "error"
                      ? "text-red-600"
                      : message.type === "success"
                        ? "text-green-600"
                        : "text-blue-600"
                  }`}
                >
                  {message.text}
                </Text>
              </Animated.View>
            ) : null}
          </Animated.View>
        </ScrollView>

        {/* Sticky CTA */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(300)}
          className="absolute bottom-0 left-0 right-0 border-t border-zinc-100 bg-white px-6 pb-8 pt-4"
        >
          <TouchableOpacity
            disabled={!canContinue}
            onPress={handleCompleteProfile}
            activeOpacity={0.9}
            className={`h-14 items-center justify-center rounded-2xl ${
              canContinue ? "bg-[#5b2417]" : "bg-[#5b2417]/40"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-semibold text-white">
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
