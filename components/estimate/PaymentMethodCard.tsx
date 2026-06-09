import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type PaymentMethod = "upi" | "cash";

interface PaymentMethodCardProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodCard({
  selectedMethod,
  onSelect,
}: PaymentMethodCardProps) {
  return (
    <View className="mx-3 mt-2 rounded-3xl border border-zinc-200 bg-white p-4">
      <Text className="text-xl font-bold text-zinc-900">Payment Method</Text>

      <View className="mt-4 flex-row gap-3">
        <TouchableOpacity
          onPress={() => onSelect("upi")}
          className={`flex-1 rounded-2xl border p-4 ${
            selectedMethod === "upi"
              ? "border-green-500 bg-green-50"
              : "border-zinc-200"
          }`}
        >
          <View className="flex-row items-center gap-1">
            <Ionicons name="phone-portrait-outline" size={18} color="#16a34a" />

            <Text className="text-base font-semibold">UPI</Text>
          </View>

          <Text className="mt-1 text-sm text-zinc-500">
            Pay securely now or later
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelect("cash")}
          className={`flex-1 rounded-2xl border p-4 ${
            selectedMethod === "cash"
              ? "border-green-500 bg-green-50"
              : "border-zinc-200"
          }`}
        >
          <View className="flex-row items-center gap-1">
            <Ionicons name="cash-outline" size={18} color="#16a34a" />

            <Text className="text-base font-semibold">Cash</Text>
          </View>

          <Text className="mt-1 text-sm text-zinc-500">Pay later</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-4 rounded-2xl bg-green-50 p-3">
        <Text className="text-center text-sm font-medium text-green-700">
          Secure payment • Your information is encrypted
        </Text>
      </View>
    </View>
  );
}
