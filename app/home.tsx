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

export default function HomeScreen() {
  const router = useRouter();
  const { user, setAuth, isLoggedIn } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false);
  const [isConditionsVisible, setIsConditionsVisible] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, // must be Web client ID
      offlineAccess: false,
    });

    if (isLoggedIn && user) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, user]);

  const handlePressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();

  const handleGoogleSignIn = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();

      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response))
        throw new Error("Google Sign-In failed");

      const { idToken, user: googleUser } = response.data;

      if (!idToken) throw new Error("Google ID token not received");

      const backendRes = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/google/mobile-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await backendRes.json();
      if (!backendRes.ok)
        throw new Error(data.message || "Backend login failed");

      setAuth(
        {
          email: data.user.email,
          name: data.user.name,
          picture: data.user.picture,
        },
        data.token
      );

      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Sign-in error:", err);

      if (err.code === statusCodes.SIGN_IN_CANCELLED)
        setError("Sign-in cancelled");
      else if (err.code === statusCodes.IN_PROGRESS)
        setError("Sign-in in progress");
      else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
        setError("Google Play Services not available");
      else setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={require("../assets/images/sturmlogo.png")}
          style={{ width: 140, height: 120, resizeMode: "contain", marginBottom: 16 }}
        />

        {/* <Text className="text-3xl font-black text-[#5b2417] mb-10">
          STURM
        </Text> */}

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
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
                style={{ width: 280, height: 50, resizeMode: "contain" }}
              />
            )}
          </TouchableOpacity>
        </Animated.View>

        <View className="w-full max-w-[320px] mt-8">
          <Text className="text-center text-sm leading-tight text-black/70">
            By signing in, you agree to Sturm{" "}
            <Text
              className="underline text-[#5b2417]/80"
              onPress={() => setIsConditionsVisible(true)}
            >
              Conditions of Use
            </Text>{" "}
            and{" "}
            <Text
              className="underline text-[#5b2417]/80"
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
