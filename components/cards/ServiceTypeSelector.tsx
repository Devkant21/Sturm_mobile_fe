import { Text, TouchableOpacity, View } from "react-native";

export type ServiceType = "home" | "items";

interface ServiceTypeSelectorProps {
  selectedService: ServiceType;
  onSelect: (service: ServiceType) => void;
}

const SERVICES = [
  {
    id: "home" as const,
    title: "Home Furniture Moving",
    description: "Moving of home furniture, appliances & more",
    emoji: "🏠",
  },
  {
    id: "items" as const,
    title: "Items Moving",
    description: "Delivery of boxes, parcels & other items",
    emoji: "📦",
  },
];

export default function ServiceTypeSelector({
  selectedService,
  onSelect,
}: ServiceTypeSelectorProps) {
  return (
    <View>
      <Text className="mb-3 text-xl font-semibold text-zinc-900">
        Type of Service
      </Text>

      <View className="flex-row gap-3">
        {SERVICES.map((service) => {
          const selected = selectedService === service.id;

          return (
            <TouchableOpacity
              key={service.id}
              activeOpacity={0.8}
              onPress={() => onSelect(service.id)}
              className={`flex-1 rounded-3xl border p-4 ${
                selected
                  ? "border-green-500 bg-green-50"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <View className="flex-row items-end gap-2">
                {/* Radio */}
                <View
                  className={`h-7 w-7 rounded-full border-2 items-center justify-center ${
                    selected ? "border-green-500" : "border-zinc-300"
                  }`}
                >
                  {selected && (
                    <View className="h-3 w-3 rounded-full bg-green-500" />
                  )}
                </View>

                {/* Icon */}
                <Text className="text-4xl">{service.emoji}</Text>
              </View>

              {/* Content */}
              <Text className="mt-3 text-base font-semibold text-zinc-900">
                {service.title}
              </Text>

              <Text className="mt-2 text-sm leading-5 text-zinc-500">
                {service.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
