import AccountCard from "@/components/profile/AccountCard";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SupportLegalCard from "@/components/profile/SupportLegalCard";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, clearUser } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <ScrollView className="flex-1">
        <ProfileHeader
          onNotificationPress={() => router.push("/notifications")}
        />
        <ProfileCard
          name={user?.fullName ?? "User"}
          email={user?.email ?? ""}
          phone={user?.phoneNumber}
          profileImage={user?.profileImage}
          verified={user?.profileStatus === "completed"}
          onEdit={() => {
            // edit profile screen later
          }}
        />
        <SupportLegalCard />
        <AccountCard />
      </ScrollView>
    </SafeAreaView>
  );
}
