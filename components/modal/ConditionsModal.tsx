import React from "react";
import {
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ConditionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ConditionsModal({
  visible,
  onClose,
}: ConditionsModalProps) {
  const handleEmailPress = () =>
    Linking.openURL("mailto:orbitsmovers@gmail.com?subject=Terms%20Inquiry");
  const handlePhonePress = () => Linking.openURL("tel:+03614057886");

  const LAST_UPDATED = "April 2026";

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
            <Text className="text-2xl font-bold mb-4">
              Terms and Conditions
            </Text>

            <Text className="mb-4">
              Welcome to <Text className="font-bold">Sturm</Text>. By
              using our app and services, you agree to comply with the following
              terms and conditions.
            </Text>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">1. Use of App</Text>
              <Text>
                You agree to use this app for lawful purposes only and not
                engage in activities that may harm, disrupt, or exploit the
                services.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">
                2. Service Agreement
              </Text>
              <Text>
                Our services are provided in accordance with applicable laws.
                Sturm reserves the right to refuse service or terminate
                accounts at our discretion.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">
                3. Intellectual Property
              </Text>
              <Text>
                All content in this app, including text, graphics, logos, and
                images, is the property of Sturm or its licensors.
                Unauthorized use is prohibited.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">
                4. Limitation of Liability
              </Text>
              <Text>
                Sturm is not liable for any damages arising from the use
                or inability to use the app or its services. Use at your own
                risk.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">
                5. Privacy & Cookies
              </Text>
              <Text>
                Our Privacy Policy and Cookie Policy govern how we collect and
                use your data. By using our services, you consent to these
                policies.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">
                6. Changes to Terms
              </Text>
              <Text>
                We reserve the right to update these terms at any time. Changes
                will be posted on this page, and continued use constitutes
                acceptance.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">7. Contact</Text>
              <Text>
                For questions regarding these terms, please{" "}
                <Text
                  className="text-blue-600 underline"
                  onPress={handleEmailPress}
                >
                  contact us via email
                </Text>{" "}
                or{" "}
                <Text
                  className="text-blue-600 underline"
                  onPress={handlePhonePress}
                >
                  call us
                </Text>
                .
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
