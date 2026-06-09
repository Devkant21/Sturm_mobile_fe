import DateTimeSelector from "@/components/cards/DateTimeSelector";
import HomeHeader from "@/components/cards/HomeHeader";
import LocationCard from "@/components/cards/LocationCard";
import ServiceTypeSelector from "@/components/cards/ServiceTypeSelector";
import VehicleSelector from "@/components/cards/VehicleSelector";
import DateTimeModal from "@/components/ui/DateTimeModal";
import InputField from "@/components/ui/InputField";
import { useFare } from "@/hooks/useFareTrip";
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
  const { user, token } = useAuthStore();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [contactNumber, setContactNumber] = useState(user?.phoneNumber ?? "");
  const [serviceType, setServiceType] = useState<"home" | "items">("home");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const { calculateFare, loading: fareLoading } = useFare();
  const [fare, setFare] = useState<number | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

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
    async function getFare() {
      if (!pickup || !dropoff) {
        setFare(null);
        setDistance(null);
        setDuration(null);
        return;
      }

      const result = await calculateFare(pickup, dropoff);
      if (result) {
        setFare(result.fare);
        setDistance(result.distance);
        setDuration(result.duration);
      }
    }

    getFare();
  }, [pickup, dropoff]);

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

  const sendMoveRequest = async () => {
    if (!validateFields()) return;

    if (!selectedDate || !selectedTime) return;

    setLoading(true);

    const move_datetime = new Date(
      selectedDate!.getFullYear(),
      selectedDate!.getMonth(),
      selectedDate!.getDate(),
      selectedTime!.getHours(),
      selectedTime!.getMinutes(),
    ).toISOString();

    const payload = {
      pickup,
      dropoff,
      move_datetime,
      phone: contactNumber,
      email: user?.email ?? "",
      name: user?.fullName ?? "",
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

      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Something went wrong");
        return;
      }

      alert("Request submitted successfully! Check your email.");
      setPickup("");
      setDropoff("");
      setContactNumber("");
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (err) {
      console.error(err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1 px-6 pt-4 pb-32"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header / Title */}
        <HomeHeader
          userName={user?.fullName?.split(" ")[0] ?? "User"}
          onNotifications={() => router.push("/notifications")}
        />

        <View className="mt-2">
          <LocationCard
            pickup={pickup}
            dropoff={dropoff}
            onPickupChange={setPickup}
            onDropoffChange={setDropoff}
            pickupError={errors.pickup}
            dropoffError={errors.dropoff}
          />
        </View>

        <View className="mt-3">
          <VehicleSelector
            selectedVehicle={selectedVehicle}
            onSelect={setSelectedVehicle}
          />
        </View>

        <View className="mt-3">
          <ServiceTypeSelector
            selectedService={serviceType}
            onSelect={setServiceType}
          />
        </View>

        {/* Date & Time Picker */}
        <View className="mt-3">
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
            <Text className="text-red-500 text-xs mt-2 ml-1">
              {errors.dateTime}
            </Text>
          ) : null}
        </View>

        <View className="mt-3">
          <Text className="text-[#6B7280] text-sm font-medium mb-2">
            Contact Number
          </Text>

          <View
            className={`flex-row items-center rounded-2xl border bg-white px-4 py-4 ${
              errors.contactNumber ? "border-red-400" : "border-gray-200"
            }`}
          >
            <View className="mr-3">
              <Text className="text-base font-medium text-gray-700">+91</Text>
            </View>

            <View className="w-px h-6 bg-gray-200 mr-3" />

            <InputField
              placeholder="Enter mobile number"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="number-pad"
              maxLength={10}
              containerClassName="flex-1"
              inputClassName="text-base"
            />
          </View>

          {errors.contactNumber ? (
            <Text className="text-red-500 text-xs mt-2 ml-1">
              {errors.contactNumber}
            </Text>
          ) : (
            <Text className="text-xs text-gray-500 mt-2 ml-1">
              We'll send booking updates to this number
            </Text>
          )}
        </View>

        {/* <View className="mb-4">
          {fareLoading ? (
            <Text className="text-gray-500">Calculating fare...</Text>
          ) : fare ? (
            <View className="bg-white p-4 rounded-md border border-gray-200">
              <Text className="text-[#5b2417] font-semibold text-lg">
                Estimated Fare: ₹{fare}
              </Text>
              {distance && duration && (
                <Text className="text-gray-600">
                  {distance} • {duration}
                </Text>
              )}
              <Text className="text-xs text-gray-500 mt-1">
                Final fare may vary depending on load and conditions
              </Text>
            </View>
          ) : pickup && dropoff ? (
            <Text className="text-gray-500">No fare available</Text>
          ) : (
            <Text className="text-gray-400">
              Enter pickup & dropoff to see fare
            </Text>
          )}
        </View> */}

        {firstError ? (
          <View className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3">
            <Text className="text-red-600 text-sm">{firstError}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          className="mt-6 rounded-2xl bg-green-600 py-4 mb-10"
          onPress={goToEstimate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-center text-lg">
              Get Estimate
            </Text>
          )}
        </TouchableOpacity>

        <DateTimeModal
          visible={showModal}
          step={modalStep}
          onClose={() => setShowModal(false)}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSelectDate={handleDateSelect}
          onSelectTime={setSelectedTime}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
