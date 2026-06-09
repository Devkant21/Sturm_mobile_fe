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
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ConditionsModal from "@/components/modal/ConditionsModal";
import PrivacyModal from "@/components/modal/PrivacyModal";

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

  const scaleAnim = useState(new Animated.Value(1))[0];

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

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

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
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={require("../assets/images/sturmlogo.png")}
          style={{
            width: 140,
            height: 120,
            resizeMode: "contain",
            marginBottom: 16,
          }}
        />

        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <View
                style={{
                  width: 200,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <ActivityIndicator size="small" color="#4285F4" />
              </View>
            ) : (
              <Image
                source={require("../assets/images/googleSignIn.png")}
                style={{
                  width: 280,
                  height: 50,
                  resizeMode: "contain",
                }}
              />
            )}
          </TouchableOpacity>
        </Animated.View>

        {error && (
          <Text className="mt-4 text-center text-red-600">{error}</Text>
        )}

        <View className="mt-8 w-full max-w-[320px]">
          <Text className="text-center text-sm leading-tight text-black/70">
            By signing in, you agree to Sturm{" "}
            <Text
              className="text-[#5b2417]/80 underline"
              onPress={() => setIsConditionsVisible(true)}
            >
              Conditions of Use
            </Text>{" "}
            and{" "}
            <Text
              className="text-[#5b2417]/80 underline"
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
