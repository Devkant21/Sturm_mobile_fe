import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface DateTimeSelectorProps {
  selectedDate: Date | null;
  selectedTime: Date | null;
  onDatePress: () => void;
  onTimePress: () => void;
}

export default function DateTimeSelector({
  selectedDate,
  selectedTime,
  onDatePress,
  onTimePress,
}: DateTimeSelectorProps) {
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const formattedTime = selectedTime
    ? selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <View>
      <View className="flex-row gap-3">
        {/* Date Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onDatePress}
          className="flex-1 rounded-3xl border border-zinc-200 bg-white p-4"
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-row gap-2">
              <Ionicons name="calendar-outline" size={24} color="#52525b" />

              <Text className="mt-2 text-sm text-zinc-500">Select Date</Text>
            </View>

            <Ionicons name="chevron-down" size={20} color="#71717a" />
          </View>

          {formattedDate ? (
            <Text className="mt-3 text-lg font-semibold text-zinc-900">
              {formattedDate}
            </Text>
          ) : null}
        </TouchableOpacity>

        {/* Time Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onTimePress}
          className="flex-1 rounded-3xl border border-zinc-200 bg-white p-4"
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-row gap-2">
              <Ionicons name="time-outline" size={24} color="#52525b" />

              <Text className="mt-2 text-sm text-zinc-500">Select Time</Text>
            </View>

            <Ionicons name="chevron-down" size={20} color="#71717a" />
          </View>

          {formattedTime ? (
            <Text className="mt-3 text-lg font-semibold text-zinc-900">
              {formattedTime}
            </Text>
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
}
