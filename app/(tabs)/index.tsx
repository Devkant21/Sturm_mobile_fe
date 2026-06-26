import * as Location from "expo-location";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import DateTimeSelector from "@/components/cards/DateTimeSelector";
import HomeHeader from "@/components/cards/HomeHeader";
import LocationCard from "@/components/cards/LocationCard";
import ServiceTypeSelector from "@/components/cards/ServiceTypeSelector";
import VehicleSelector from "@/components/cards/VehicleSelector";
import DateTimeModal from "@/components/ui/DateTimeModal";
import InputField from "@/components/ui/InputField";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Landing() {
  const { user } = useAuthStore();

  const [pickup, setPickup] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(true);
  const [dropoff, setDropoff] = useState("");
  const [contactNumber, setContactNumber] = useState(user?.phoneNumber ?? "");
  const [serviceType, setServiceType] = useState<"home" | "items">("home");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const [errors, setErrors] = useState({
    pickup: "",
    dropoff: "",
    dateTime: "",
    name: "",
    email: "",
    contactNumber: "",
    movementType: "",
  });

  const [selectedVehicle, setSelectedVehicle] = useState("pickup");

  const [showModal, setShowModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const [modalStep, setModalStep] = useState<"date" | "time">("date");

  const [loading, setLoading] = useState(false);

  const goToEstimate = () => {
    if (!validateFields()) return;

    if (!selectedDate || !selectedTime) return;

    const move_datetime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes(),
    ).toISOString();

    router.push({
      pathname: "/estimate",
      params: {
        pickup,
        dropoff,
        move_datetime,
        phone: contactNumber,
        email: user?.email ?? "",
        name: user?.fullName ?? "",
        vehicle: selectedVehicle,
        serviceType,
      },
    });
  };

  useEffect(() => {
    async function detectCurrentLocation() {
      try {
        setDetectingLocation(true);

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setDetectingLocation(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const places = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (!places.length) {
          setDetectingLocation(false);
          return;
        }

        const place = places[0];

        const address = [place.name, place.street, place.city, place.region]
          .filter(Boolean)
          .join(", ");

        setPickup(address);
      } catch (error) {
        console.error(error);
      } finally {
        setDetectingLocation(false);
      }
    }

    detectCurrentLocation();
  }, []);

  const validateFields = () => {
    const newErrors = {
      pickup: pickup.trim() === "" ? "Pickup location is required" : "",
      dropoff: dropoff.trim() === "" ? "Dropoff location is required" : "",
      dateTime:
        !selectedDate || !selectedTime ? "Pickup date & time are required" : "",
      name: !user?.fullName ? "Name is required" : "",
      email: !user?.email ? "Email is required" : "",
      contactNumber:
        contactNumber.trim().length !== 10
          ? "Valid contact number is required"
          : "",
      movementType: "",
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const firstError = Object.values(errors).find(Boolean);

  return (
    <SafeAreaView className="flex-1 bg-[#F6F7F9]">
      <StatusBar style="dark" />

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 160,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(450)}>
            <HomeHeader
              userName={user?.fullName?.split(" ")[0] ?? "User"}
              onNotifications={() => router.push("/notifications")}
            />
          </Animated.View>

          {/* Location */}
          <Animated.View
            entering={FadeInDown.duration(450).delay(100)}
            className="mt-4"
          >
            <LocationCard
              pickup={pickup}
              detectingLocation={detectingLocation}
              dropoff={dropoff}
              onPickupChange={(value) => {
                setPickup(value);

                if (value.trim()) {
                  setErrors((prev) => ({
                    ...prev,
                    pickup: "",
                  }));
                }
              }}
              onDropoffChange={(value) => {
                setDropoff(value);

                if (value.trim()) {
                  setErrors((prev) => ({
                    ...prev,
                    dropoff: "",
                  }));
                }
              }}
              pickupError={errors.pickup}
              dropoffError={errors.dropoff}
            />
          </Animated.View>

          {/* Contact Number */}
          <Animated.View
            entering={FadeInDown.duration(450).delay(420)}
            className="mt-4"
          >
            <Text className="mb-2 text-sm font-medium text-[#6B7280]">
              Contact Number
            </Text>

            <View
              className={`flex-row items-center rounded-2xl border bg-white px-4 py-4 ${
                errors.contactNumber ? "border-red-400" : "border-gray-200"
              }`}
            >
              <Text className="mr-3 text-base font-medium text-gray-700">
                +91
              </Text>

              <View className="mr-3 h-6 w-px bg-gray-200" />

              <InputField
                placeholder="Enter mobile number"
                value={contactNumber}
                onChangeText={(value) => {
                  setContactNumber(value);

                  if (value.trim().length === 10) {
                    setErrors((prev) => ({
                      ...prev,
                      contactNumber: "",
                    }));
                  }
                }}
                keyboardType="number-pad"
                maxLength={10}
                containerClassName="flex-1"
                inputClassName="text-base"
              />
            </View>

            {errors.contactNumber ? (
              <Text className="ml-1 mt-2 text-xs text-red-500">
                {errors.contactNumber}
              </Text>
            ) : (
              <Text className="ml-1 mt-2 text-xs text-gray-500">
                We'll send booking updates to this number
              </Text>
            )}
          </Animated.View>

          {/* Vehicle */}
          <Animated.View
            entering={FadeInDown.duration(450).delay(180)}
            className="mt-4"
          >
            <VehicleSelector
              selectedVehicle={selectedVehicle}
              onSelect={setSelectedVehicle}
            />
          </Animated.View>

          {/* Service Type */}
          <Animated.View
            entering={FadeInDown.duration(450).delay(260)}
            className="mt-4"
          >
            <ServiceTypeSelector
              selectedService={serviceType}
              onSelect={setServiceType}
            />
          </Animated.View>

          {/* Date & Time */}
          <Animated.View
            entering={FadeInDown.duration(450).delay(340)}
            className="mt-4"
          >
            <DateTimeSelector
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDatePress={() => {
                setModalStep("date");
                setShowModal(true);
              }}
              onTimePress={() => {
                setModalStep("time");
                setShowModal(true);
              }}
            />

            {errors.dateTime ? (
              <Text className="ml-1 mt-2 text-xs text-red-500">
                {errors.dateTime}
              </Text>
            ) : null}
          </Animated.View>
        </ScrollView>

        {/* Sticky Bottom CTA */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(500)}
          className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-6 pb-8 pt-4"
        >
          {/* Error Card */}
          {firstError ? (
            <Animated.View
              entering={FadeIn.duration(250)}
              className="mb-2 rounded-2xl border border-red-200 bg-red-50 p-4"
            >
              <Text className="text-sm font-medium text-red-600">
                {firstError}
              </Text>
            </Animated.View>
          ) : null}

          <TouchableOpacity
            className={`rounded-2xl py-4 ${
              loading ? "bg-green-500" : "bg-green-600"
            }`}
            onPress={goToEstimate}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator size="small" color="#fff" />
                <Text className="ml-3 text-lg font-semibold text-white">
                  Calculating...
                </Text>
              </View>
            ) : (
              <Text className="text-center text-lg font-semibold text-white">
                Get Estimate
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <DateTimeModal
          visible={showModal}
          step={modalStep}
          onClose={() => setShowModal(false)}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSelectDate={handleDateSelect}
          onSelectTime={setSelectedTime}
        />
      </View>
    </SafeAreaView>
  );
}
