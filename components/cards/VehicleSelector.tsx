import { Image, Text, TouchableOpacity, View } from "react-native";

interface VehicleSelectorProps {
  selectedVehicle: string;
  onSelect: (vehicleId: string) => void;
}

const VEHICLES = [
  {
    id: "pickup",
    name: "DI Truck",
    description: "Perfect for furniture and household moving",
    image: require("@/assets/images/ditruck.png"),
  },
];

export default function VehicleSelector({
  selectedVehicle,
  onSelect,
}: VehicleSelectorProps) {
  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-zinc-900">
          Vehicle Needed?
        </Text>
      </View>

      <View className="flex-row">
        {VEHICLES.map((vehicle) => {
          const selected = selectedVehicle === vehicle.id;

          return (
            <TouchableOpacity
              key={vehicle.id}
              activeOpacity={0.8}
              onPress={() => onSelect(vehicle.id)}
              className={`w-[170px] rounded-3xl border p-3 ${
                selected
                  ? "border-green-500 bg-green-50"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <Image
                source={vehicle.image}
                resizeMode="contain"
                className="h-24 w-full"
              />

              <View className="mt-1 items-center">
                <Text className="text-lg font-semibold text-zinc-900">
                  {vehicle.name}
                </Text>

                <Text className="mt-2 text-center text-sm leading-4 text-zinc-500">
                  {vehicle.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
