import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface BookingConfirmModalProps {
  visible: boolean;
  fare: string;
  pickup: string;
  dropoff: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BookingConfirmModal({
  visible,
  fare,
  pickup,
  dropoff,
  onClose,
  onConfirm,
}: BookingConfirmModalProps) {
  const translateY = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(600);

      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 180,
        mass: 1,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />

        <Animated.View
          style={{
            transform: [{ translateY }],
          }}
          className="rounded-t-3xl bg-white p-6"
        >
          <Text className="text-2xl font-bold text-zinc-900">
            Confirm Booking
          </Text>

          <Text className="mt-4 text-sm text-zinc-500">
            Review your trip before submission
          </Text>

          <View className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <Text className="font-semibold">{pickup}</Text>
            <Text className="my-2 text-zinc-400">↓</Text>
            <Text className="font-semibold">{dropoff}</Text>
          </View>

          <View className="mt-5 flex-row items-center justify-between">
            <Text className="text-lg text-zinc-500">Estimated Total</Text>
            <Text className="text-3xl font-bold text-green-600">{fare}</Text>
          </View>

          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 rounded-2xl border border-zinc-300 py-4"
            >
              <Text className="text-center font-semibold">Go Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 rounded-2xl bg-green-600 py-4"
            >
              <Text className="text-center font-semibold text-white">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
