import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#6b7280",

        tabBarStyle: {
          height: 72,

          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",

          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: "#e5e7eb",

          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,

          backgroundColor: "#ffffff",

          paddingTop: 8,
          paddingBottom: 10,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={28} color={color} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="requests"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={28}
              color={color}
            />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="requests"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-outline"
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
