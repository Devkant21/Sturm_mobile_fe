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

  const { token, setAuth } = useAuthStore();
  const { clearUser } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/user/send-otp`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone_number: phoneNumber,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
      setMessage(data.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    try {
      setLoading(true);
      setMessage("");

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
            otp: Number(otp),
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
      setMessage(
        error instanceof Error ? error.message : "Failed to complete profile",
      );
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

  const canSendOtp = phoneNumber.length === 10 && !loading && !otpSent;

  const canContinue =
    fullName.trim().length > 0 &&
    phoneNumber.length === 10 &&
    otp.length === 4 &&
    !loading;

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <View className="flex-1 px-6 pt-10">
        <View className="mb-8 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-[#5b2417]">
              Complete Profile
            </Text>

            <Text className="mt-1 text-sm text-black/60">
              Verify your phone number to continue.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSignOut}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2"
          >
            <Text className="font-medium text-red-600">Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-10 gap-5">
          <View>
            <Text className="mb-2 text-sm font-medium text-black/70">
              Full Name
            </Text>

            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              className="h-14 rounded-xl border border-black/15 bg-white px-4"
            />
          </View>

          <View>
            <Text className="mb-2 text-sm font-medium text-black/70">
              Phone Number
            </Text>

            <View className="flex-row gap-2">
              <View className="h-14 items-center justify-center rounded-xl border border-black/15 bg-white px-4">
                <Text>+91</Text>
              </View>

              <TextInput
                value={phoneNumber}
                onChangeText={(value) =>
                  setPhoneNumber(value.replace(/\D/g, ""))
                }
                keyboardType="number-pad"
                maxLength={10}
                placeholder="9876543210"
                className="flex-1 h-14 rounded-xl border border-black/15 bg-white px-4"
              />
            </View>

            <TouchableOpacity
              disabled={!canSendOtp}
              onPress={handleSendOtp}
              className="mt-3 h-12 items-center justify-center rounded-xl border border-[#5b2417]"
            >
              <Text className="font-medium text-[#5b2417]">
                {otpSent ? "OTP Sent" : "Send OTP"}
              </Text>
            </TouchableOpacity>
          </View>

          {otpSent && (
            <View>
              <Text className="mb-2 text-sm font-medium text-black/70">
                OTP
              </Text>

              <TextInput
                value={otp}
                onChangeText={(value) => setOtp(value.replace(/\D/g, ""))}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="Enter OTP"
                className="h-14 rounded-xl border border-black/15 bg-white px-4"
              />
            </View>
          )}

          {message ? (
            <View className="rounded-xl border border-black/10 bg-white p-4">
              <Text>{message}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            disabled={!canContinue}
            onPress={handleCompleteProfile}
            className="mt-4 h-14 items-center justify-center rounded-xl bg-[#5b2417]"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="font-semibold text-white">Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
