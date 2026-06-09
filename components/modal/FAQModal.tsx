import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface FAQModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FAQModal({ visible, onClose }: FAQModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View className="max-h-[85%] w-full rounded-lg bg-white p-6">
          <ScrollView showsVerticalScrollIndicator>
            <Text className="mb-4 text-2xl font-bold">
              Frequently Asked Questions
            </Text>

            <View className="mb-5">
              <Text className="mb-1 text-lg font-semibold">
                How do I book a service?
              </Text>

              <Text>
                Select your service type, choose pickup and drop-off locations,
                pick a date and time, then confirm your booking.
              </Text>
            </View>

            <View className="mb-5">
              <Text className="mb-1 text-lg font-semibold">
                How will I know my booking is confirmed?
              </Text>

              <Text>
                Once your booking is reviewed and accepted, you will receive a
                confirmation through the app and any available contact methods.
              </Text>
            </View>

            <View className="mb-5">
              <Text className="mb-1 text-lg font-semibold">
                Can I cancel or reschedule a booking?
              </Text>

              <Text>
                Yes. Cancellation and rescheduling options may be available
                depending on the booking status and service conditions.
              </Text>
            </View>

            <View className="mb-5">
              <Text className="mb-1 text-lg font-semibold">
                How are service charges calculated?
              </Text>

              <Text>
                Charges are estimated based on the selected service, distance,
                location, and other applicable factors.
              </Text>
            </View>

            <View className="mb-5">
              <Text className="mb-1 text-lg font-semibold">
                What if my pickup or drop location is incorrect?
              </Text>

              <Text>
                Please contact support as soon as possible. Changes may be
                possible before the service has started.
              </Text>
            </View>

            <View className="mb-5">
              <Text className="mb-1 text-lg font-semibold">
                How can I contact support?
              </Text>

              <Text>
                You can reach our support team through the Contact Support
                section available in the app.
              </Text>
            </View>

            <View className="mb-5">
              <Text className="mb-1 text-lg font-semibold">
                Is my personal information secure?
              </Text>

              <Text>
                Yes. We take appropriate measures to protect your information
                and handle data according to our Privacy Policy.
              </Text>
            </View>

            <Text className="mt-4 text-xs text-gray-500">
              Last updated: June 2026
            </Text>
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            className="mt-4 self-end rounded-md bg-[#5b2417] px-4 py-2"
          >
            <Text className="font-medium text-white">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
