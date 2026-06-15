import { useAuthStore } from "@/store/authStore";
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import ConditionsModal from "@/components/modal/ConditionsModal";
import PrivacyModal from "@/components/modal/PrivacyModal";
import { StatusBar } from "expo-status-bar";

interface BackendUser {
  id: number;
  email: string;

  full_name?: string | null;
  phone_number?: string | null;

  profile_image?: string | null;
  profile_status?: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  redirect?: string;
  data?: {
    token: string;
    user: BackendUser;
  };
}

export default function HomeScreen() {
  const router = useRouter();

  const { user, setAuth, isLoggedIn } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false);
  const [isConditionsVisible, setIsConditionsVisible] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      offlineAccess: false,
    });

    if (isLoggedIn && user) {
      if (user.profileStatus === "pending_profile") {
        router.replace("/onboarding");
        return;
      }

      router.replace("/(tabs)");
    }
  }, [isLoggedIn, user, router]);

  const handleGoogleSignIn = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      await GoogleSignin.hasPlayServices();

      try {
        await GoogleSignin.signOut();
      } catch {
        // ignore
      }

      const signInResult = await GoogleSignin.signIn();

      if (!isSuccessResponse(signInResult)) {
        // User dismissed account picker
        return;
      }

      const tokens = await GoogleSignin.getTokens();

      if (!tokens.accessToken) {
        throw new Error("Google access token not received");
      }

      const backendRes = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/user/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: tokens.accessToken,
          }),
        },
      );

      const data: LoginResponse = await backendRes.json();

      if (!backendRes.ok || !data.success || !data.data) {
        throw new Error(data.message || "Login failed");
      }

      const backendUser = data.data.user;
      const jwtToken = data.data.token;

      setAuth(
        {
          id: backendUser.id,
          email: backendUser.email,

          fullName: backendUser.full_name ?? null,
          phoneNumber: backendUser.phone_number ?? null,

          profileImage: backendUser.profile_image ?? null,

          profileStatus: backendUser.profile_status ?? "pending_profile",
        },
        jwtToken,
      );

      if (
        data.redirect === "/profile" ||
        backendUser.profile_status === "pending_profile"
      ) {
        router.replace("/onboarding");
        return;
      }

      router.replace("/(tabs)");
    } catch (err: unknown) {
      console.log("Google Sign-In Error:", err);

      if (typeof err === "object" && err !== null && "code" in err) {
        const errorCode = (err as { code: string }).code;

        switch (errorCode) {
          case statusCodes.SIGN_IN_CANCELLED:
            // User pressed back or closed account picker.
            return;

          case statusCodes.IN_PROGRESS:
            setError("Sign-in already in progress");
            return;

          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setError("Google Play Services unavailable");
            return;

          default:
            setError("Google Sign-In failed");
            return;
        }
      }

      if (err instanceof Error) {
        setError(err.message);
        return;
      }

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <StatusBar style="dark" />
      <View className="flex-1 px-6">
        {/* Background blobs */}
        <View className="absolute -top-10 -right-16 h-56 w-56 rounded-full bg-[#eaded2]" />
        <View className="absolute bottom-24 -left-20 h-72 w-72 rounded-full bg-[#efe6dd]" />

        {/* Hero */}
        <View className="flex-1 items-center justify-center">
          <Animated.View entering={FadeIn.duration(700)}>
            <Image
              source={require("../assets/images/sturmlogo.png")}
              style={{
                width: 160,
                height: 140,
                resizeMode: "contain",
              }}
            />
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(350).duration(600)}
            className="mt-3 text-center text-lg font-semibold text-[#5b2417]/85"
          >
            Courier & moving made simple
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(500).duration(600)}
            className="mt-3 px-8 text-center text-sm leading-6 text-black/55"
          >
            Same day delivery • Verified drivers • Real-time tracking
          </Animated.Text>

          {/* Trust badges */}
          <Animated.View
            entering={FadeInDown.delay(700).duration(600)}
            className="mt-8 flex-row gap-3"
          >
            <View className="rounded-full bg-white px-4 py-2 shadow-sm">
              <Text className="text-xs font-semibold text-[#5b2417]">
                Fast Delivery
              </Text>
            </View>

            <View className="rounded-full bg-white px-4 py-2 shadow-sm">
              <Text className="text-xs font-semibold text-[#5b2417]">
                Secure
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* CTA */}
        <View className="pb-8 w-full items-center">
          <Animated.View entering={FadeInDown.delay(900).duration(600)}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? (
                <View className="h-[50px] w-[280px] items-center justify-center rounded-full border border-gray-300 bg-white">
                  <ActivityIndicator size="small" color="#4285F4" />
                  <Text className="mt-2 text-sm text-black/60">
                    Signing you in...
                  </Text>
                </View>
              ) : (
                <Image
                  source={require("../assets/images/googleSignIn.png")}
                  className="h-[50px] w-[280px]"
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </Animated.View>

          {error && (
            <Animated.View
              entering={FadeIn.duration(250)}
              className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <Text className="text-center text-sm font-medium text-red-600">
                {error}
              </Text>
            </Animated.View>
          )}

          <Text className="mt-6 px-4 text-center text-xs leading-5 text-black/50">
            By signing in, you agree to Sturm{" "}
            <Text
              className="font-semibold text-[#5b2417]"
              onPress={() => setIsConditionsVisible(true)}
            >
              Conditions of Use
            </Text>{" "}
            and{" "}
            <Text
              className="font-semibold text-[#5b2417]"
              onPress={() => setIsPrivacyVisible(true)}
            >
              Privacy Notice
            </Text>
          </Text>
        </View>
      </View>

      <ConditionsModal
        visible={isConditionsVisible}
        onClose={() => setIsConditionsVisible(false)}
      />

      <PrivacyModal
        visible={isPrivacyVisible}
        onClose={() => setIsPrivacyVisible(false)}
      />
    </SafeAreaView>
  );
}
