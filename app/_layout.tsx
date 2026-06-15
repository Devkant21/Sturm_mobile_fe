import "../global.css";

import { AuthProvider } from "@/context/AuthContext";

import { usePathname, router } from "expo-router";
import { Stack } from "expo-router";
import { useEffect, useRef } from "react";
import { BackHandler, Platform, ToastAndroid } from "react-native";

export function useDoubleBackExit() {
  const pathname = usePathname();
  const lastPress = useRef(0);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      const isRootTab =
        pathname === "/" || pathname === "/history" || pathname === "/profile";

      if (!isRootTab) {
        if (router.canGoBack()) {
          router.back();
          return true;
        }

        return false;
      }

      const now = Date.now();

      if (now - lastPress.current < 2000) {
        BackHandler.exitApp();
        return true;
      }

      lastPress.current = now;
      ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);

      return true;
    });

    return () => sub.remove();
  }, [pathname]);
}
export default function RootLayout() {
  useDoubleBackExit();

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f5f4ee" },
        }}
      />
    </AuthProvider>
  );
}
