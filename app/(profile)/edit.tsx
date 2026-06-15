import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/authStore";
import { Modal, BackHandler } from "react-native";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function EditProfileScreen() {
  const { user, updateUser } = useAuthStore();

  const name = user?.fullName ?? "Unknown User";
  const email = user?.email ?? "No email";
  const phone = user?.phoneNumber ?? "No phone";

  const [selectedImage, setSelectedImage] = useState<string | null>(
    user?.profileImage ?? null,
  );

  const profileImage = selectedImage;

  const hasChanges = selectedImage !== (user?.profileImage ?? null);

  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  async function handleChangePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to access photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    if (!asset?.uri) return;

    setSelectedImage(asset.uri);
  }

  async function handleSave() {
    if (!hasChanges || !selectedImage || !BACKEND_URL) return;

    if (!BACKEND_URL) {
      console.error("Missing EXPO_PUBLIC_BACKEND_URL");
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();

      formData.append("image", {
        uri: selectedImage,
        name: "profile.jpg",
        type: "image/jpeg",
      } as unknown as Blob);

      const response = await fetch(
        `${BACKEND_URL}/api/upload/profile-image?user`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Upload failed");
      }

      const imageUrl = data.data as string;

      updateUser({
        profileImage: imageUrl,
      });

      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!hasChanges) {
        return false;
      }

      setShowDiscardModal(true);
      return true;
    });

    return () => sub.remove();
  }, [hasChanges]);

  function handleBack() {
    if (!hasChanges) {
      router.back();
      return;
    }

    setShowDiscardModal(true);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <View className="flex-1">
        <ScrollView className="flex-1 px-4">
          {/* Header */}
          <View className="mb-6 mt-2 flex-row items-center">
            <TouchableOpacity
              onPress={handleBack}
              className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-white"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={20} color="#18181b" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-zinc-900">
              Edit Profile
            </Text>
          </View>

          {/* Profile Photo */}
          <View className="items-center rounded-3xl bg-white px-5 py-8">
            <TouchableOpacity
              disabled={isSaving}
              onPress={handleChangePhoto}
              activeOpacity={0.85}
              className="relative"
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  className="h-32 w-32 rounded-full"
                />
              ) : (
                <View className="h-32 w-32 items-center justify-center rounded-full bg-green-50">
                  <Ionicons name="person" size={52} color="#16a34a" />
                </View>
              )}

              <View className="absolute bottom-1 right-1 h-10 w-10 items-center justify-center rounded-full bg-green-600">
                <Ionicons name="camera" size={18} color="white" />
              </View>
            </TouchableOpacity>

            <Text className="mt-4 text-base font-semibold text-green-600">
              Tap to change photo
            </Text>
          </View>

          {/* Details */}
          <View className="mt-5 rounded-3xl bg-white px-4 py-2">
            <InfoRow label="Full Name" value={name} />
            <InfoRow label="Email" value={email} />
            <InfoRow label="Phone Number" value={phone} />
          </View>
        </ScrollView>

        {hasChanges && (
          <View className="border-t border-zinc-200 bg-white px-4 py-4">
            <TouchableOpacity
              disabled={isSaving}
              onPress={handleSave}
              className="items-center rounded-2xl bg-green-600 py-4"
            >
              <Text className="text-base font-bold text-white">
                {isSaving ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        visible={showDiscardModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDiscardModal(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white px-5 pb-8 pt-6">
            <View className="mb-4 h-1.5 w-14 self-center rounded-full bg-zinc-300" />

            <Text className="text-xl font-bold text-zinc-900">
              Discard changes?
            </Text>

            <Text className="mt-2 text-base text-zinc-500">
              Your new profile photo hasn't been saved.
            </Text>

            <TouchableOpacity
              onPress={() => {
                setShowDiscardModal(false);
                router.back();
              }}
              className="mt-6 items-center rounded-2xl bg-red-500 py-4"
            >
              <Text className="font-bold text-white">Discard Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDiscardModal(false)}
              className="mt-3 items-center rounded-2xl bg-zinc-100 py-4"
            >
              <Text className="font-semibold text-zinc-700">Keep Editing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-zinc-100 py-5 last:border-b-0">
      <View className="flex-1">
        <Text className="text-sm font-medium text-zinc-500">{label}</Text>

        <Text className="mt-1 text-base font-semibold text-zinc-900">
          {value}
        </Text>
      </View>

      <TouchableOpacity
        disabled
        className="h-10 w-10 items-center justify-center rounded-full bg-zinc-100"
      >
        <Ionicons name="create-outline" size={18} color="#a1a1aa" />
      </TouchableOpacity>
    </View>
  );
}
