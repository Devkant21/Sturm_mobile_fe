import React from "react";
import {
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ visible, onClose }: PrivacyModalProps) {
  const handleEmailPress = () =>
    Linking.openURL(
      "mailto:support@sturm.express?subject=Privacy%20Policy%20Query",
    );
  const handlePhonePress = () => Linking.openURL("tel:+919401271725");
  const handleGAOptOut = () =>
    Linking.openURL("https://tools.google.com/dlpage/gaoptout");

  const LAST_UPDATED = "June 2026";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        <View className="bg-white rounded-lg p-6 max-h-[85%] w-full">
          <ScrollView showsVerticalScrollIndicator={true}>
            <Text className="text-2xl font-bold mb-4">Privacy Policy</Text>

            <Text className="mb-4">
              Your privacy is important to us. This Privacy Policy explains how{" "}
              <Text className="font-bold">Sturm</Text> collects, uses, and
              protects your information when you use our services. By accessing
              or using our app, you agree to the practices described here.
            </Text>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">
                Information We Collect
              </Text>
              <Text>We may collect personal information such as:</Text>
              <View className="ml-4 space-y-1 mt-1">
                <Text>
                  • Your name, email address, and phone number (when you contact
                  us)
                </Text>
                <Text>• Messages or inquiries you send us</Text>
                <Text>
                  • Technical info such as IP address, browser/device info, and
                  pages visited
                </Text>
              </View>
              <Text className="mt-2">
                This helps us provide personalized services and improve your
                experience.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">
                How We Use Your Information
              </Text>
              <Text>The information we collect is used to:</Text>
              <View className="ml-4 space-y-1 mt-1">
                <Text>• Respond to inquiries and provide services</Text>
                <Text>• Send requested materials or updates</Text>
                <Text>• Improve app functionality and user experience</Text>
                <Text>• Comply with legal obligations</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">
                Google Analytics & Cookies
              </Text>
              <Text>
                We use cookies and similar technologies to enhance functionality
                and improve user experience. Our app uses Google Analytics to
                understand usage:
              </Text>
              <View className="ml-4 space-y-1 mt-1">
                <Text>• IP address and device/browser information</Text>
                <Text>• Pages visited and actions taken</Text>
                <Text>• General location data (city, region, country)</Text>
              </View>
              <Text className="mt-2">
                You can opt out of Google Analytics tracking via the{" "}
                <Text
                  className="text-blue-600 underline"
                  onPress={handleGAOptOut}
                >
                  Google Analytics Opt-out
                </Text>{" "}
                browser add-on.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">Data Security</Text>
              <Text>
                We implement reasonable security measures to protect your
                personal information. While we take commercially reasonable
                measures, no system is completely secure.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">Your Rights</Text>
              <Text>
                Depending on your location and applicable laws, you may have the
                following rights:
              </Text>
              <View className="ml-4 space-y-1 mt-1">
                <Text>• Access personal data we hold about you</Text>
                <Text>• Request corrections or updates</Text>
                <Text>• Request deletion, subject to legal obligations</Text>
                <Text>• Withdraw consent where applicable</Text>
                <Text>• Opt out of marketing communications</Text>
                <Text>• Request details on how data is used or shared</Text>
              </View>
              <Text className="mt-2">
                To exercise these rights, please{" "}
                <Text
                  className="text-blue-600 underline"
                  onPress={handleEmailPress}
                >
                  contact us
                </Text>
                .
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">
                Updates to This Privacy Policy
              </Text>
              <Text>
                We may update this Privacy Policy from time to time. Please
                review periodically for changes.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">Contact Us</Text>
              <Text>
                Questions about this Privacy Policy?{" "}
                <Text
                  className="text-blue-600 underline"
                  onPress={handleEmailPress}
                >
                  Email us
                </Text>{" "}
                or{" "}
                <Text
                  className="text-blue-600 underline"
                  onPress={handlePhonePress}
                >
                  call us
                </Text>
                . We aim to respond within 30 days.
              </Text>
            </View>

            <Text className="text-xs text-gray-500 mt-4">
              Last updated: {LAST_UPDATED}
            </Text>
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            className="mt-4 bg-[#5b2417] px-4 py-2 rounded-md self-end"
          >
            <Text className="text-white font-medium">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
