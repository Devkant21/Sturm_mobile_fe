import { Text, View } from "react-native";

interface PriceEstimateCardProps {
  total?: string;
}

export default function PriceEstimateCard({
  total = "Calculating...",
}: PriceEstimateCardProps) {
  return (
    <View className="mx-3 mt-2 rounded-3xl border border-zinc-200 bg-white p-4">
      <Text className="text-xl font-bold text-zinc-900">Price Estimate</Text>

      <View className="mt-5 border-t border-dashed border-zinc-200 pt-5">
        <Text className="text-sm text-zinc-500">Estimated Total</Text>

        <Text className="mt-2 text-4xl font-bold text-green-600">{total}</Text>

        <Text className="mt-2 text-sm text-zinc-500">
          Inclusive of transportation, labour and taxes
        </Text>
      </View>
    </View>
  );
}
