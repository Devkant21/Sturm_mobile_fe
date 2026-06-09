import React from "react";
import { Linking, Modal, Text, TouchableOpacity, View } from "react-native";

interface ContactSupportModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ContactSupportModal({
  visible,
  onClose,
}: ContactSupportModalProps) {
  const PHONE_NUMBER = "+91 94012 71725";
  const EMAIL = "support@sturm.express";

  const handleCall = () => {
    Linking.openURL("tel:+919401271725");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@sturm.express?subject=Sturm Support");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View className="w-full rounded-lg bg-white p-6">
          <Text className="mb-2 text-2xl font-bold">Contact Support</Text>

          <Text className="mb-6 text-gray-600">
            Need help with a booking or have a question? Reach out to our
            support team using the options below.
          </Text>

          <View className="mb-4 rounded-xl border border-zinc-200 p-4">
            <Text className="mb-1 text-sm text-zinc-500">Email Support</Text>

            <Text className="text-base font-semibold text-zinc-900">
              {EMAIL}
            </Text>

            <TouchableOpacity
              onPress={handleEmail}
              className="mt-3 self-start rounded-lg bg-zinc-100 px-3 py-2"
            >
              <Text className="font-medium text-zinc-900">Send Email</Text>
            </TouchableOpacity>
          </View>

          <View className="rounded-xl border border-zinc-200 p-4">
            <Text className="mb-1 text-sm text-zinc-500">Phone Support</Text>

            <Text className="text-base font-semibold text-zinc-900">
              {PHONE_NUMBER}
            </Text>

            <TouchableOpacity
              onPress={handleCall}
              className="mt-3 self-start rounded-lg bg-zinc-100 px-3 py-2"
            >
              <Text className="font-medium text-zinc-900">Call Now</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="mt-6 self-end rounded-md bg-[#5b2417] px-4 py-2"
          >
            <Text className="font-medium text-white">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
