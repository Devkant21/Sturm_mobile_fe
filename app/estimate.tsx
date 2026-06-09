import EstimateHeader from "@/components/estimate/EstimateHeader";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EstimateFooter from "@/components/estimate/EstimateFooter";
import PaymentMethodCard from "@/components/estimate/PaymentMethodCard";
import PriceEstimateCard from "@/components/estimate/PriceEstimateCard";
import TripSummaryCard from "@/components/estimate/TripSummaryCard";
import VehicleSummaryCard from "@/components/estimate/VehicleSummaryCard";
import { useAuthStore } from "@/store/authStore";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

type PaymentMethod = "upi" | "cash";

export default function EstimatePage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(false);

  const {
    pickup,
    dropoff,
    move_datetime,
    phone,
    email,
    name,
    vehicle,
    serviceType,
  } = useLocalSearchParams<{
    pickup: string;
    dropoff: string;
    move_datetime: string;
    phone: string;
    email: string;
    name: string;
    vehicle: string;
    serviceType: string;
  }>();

  const submitEstimateRequest = async () => {
    setLoading(true);

    const movementType =
      serviceType === "home" ? "Home Furniture Moving" : "Items Delivery";

    const payload = {
      pickup,
      dropoff,
      move_datetime,
      phone,
      email,
      name,
      movementType,
    };

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_WEBSITE_URL}/api/send-quote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data: {
        success: boolean;
        error?: string;
      } = await res.json();

      if (!data.success) {
        Alert.alert("Request Failed", data.error ?? "Something went wrong");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      router.replace({
        pathname: "/booking-success",
        params: {
          pickup,
          dropoff,
          move_datetime,
          movementType,
        },
      });
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Network Error",
        "Failed to submit request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <View className="flex-1">
        <ScrollView className="flex-1">
          <EstimateHeader />

          <TripSummaryCard
            pickup={pickup}
            dropoff={dropoff}
            moveDateTime={move_datetime}
          />

          <VehicleSummaryCard vehicleId={vehicle} />
          <PriceEstimateCard total="Calculating..." />

          <PaymentMethodCard
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </ScrollView>

        <EstimateFooter
          total="₹950"
          loading={loading}
          onPress={submitEstimateRequest}
        />
      </View>
    </SafeAreaView>
  );
}
