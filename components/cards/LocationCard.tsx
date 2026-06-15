import LocationInput from "@/components/ui/LocationInput";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface LocationCardProps {
  pickup: string;
  dropoff: string;
  detectingLocation?: boolean;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
  onSwap?: () => void;
  pickupError?: string;
  dropoffError?: string;
}

export default function LocationCard({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
  onSwap,
  pickupError,
  dropoffError,
  detectingLocation,
}: LocationCardProps) {
  return (
    <View>
      <View className="rounded-3xl bg-white px-5 pt-5 pb-5 shadow-sm border border-zinc-100">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[13px] font-semibold text-zinc-500 tracking-tight">
            Where are you going?
          </Text>
          {onSwap && (
            <TouchableOpacity
              onPress={onSwap}
              className="h-8 w-8 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200"
              activeOpacity={0.7}
            >
              <Ionicons name="swap-vertical" size={16} color="#52525b" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row">
          {/* Route connector */}
          <View className="items-center mr-4 pt-[26px]">
            {/* Pickup dot */}
            <View
              className="h-3 w-3 rounded-full bg-green-500 ring-2"
              style={{
                shadowColor: "#16a34a",
                shadowOpacity: 0.25,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 0 },
              }}
            />
            {/* Dashed line */}
            <View
              className="my-1.5 w-px flex-1"
              style={{
                borderLeftWidth: 2,
                borderLeftColor: "#d4d4d8",
                borderStyle: "dashed",
                minHeight: 32,
              }}
            />
            {/* Dropoff dot */}
            <View
              className="h-3 w-3 rounded-full bg-red-500"
              style={{
                shadowColor: "#dc2626",
                shadowOpacity: 0.25,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 0 },
              }}
            />
          </View>

          {/* Inputs */}
          <View className="flex-1">
            <LocationInput
              type="pickup"
              value={pickup}
              label="Pickup"
              onChangeText={onPickupChange}
              onSelectSuggestion={onPickupChange}
              placeholder="Enter pickup location"
              detectingLocation={detectingLocation}
            />
            {pickupError ? (
              <Text className="text-red-500 text-xs mt-1">{pickupError}</Text>
            ) : null}

            <View className="my-3.5 h-px bg-zinc-100" />

            <LocationInput
              type="destination"
              value={dropoff}
              label="Drop-off"
              onChangeText={onDropoffChange}
              onSelectSuggestion={onDropoffChange}
              placeholder="Enter destination"
            />
            {dropoffError ? (
              <Text className="text-red-500 text-xs mt-1">{dropoffError}</Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
