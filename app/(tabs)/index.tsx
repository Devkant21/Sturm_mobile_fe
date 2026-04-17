import DateTimeModal from "@/components/ui/DateTimeModal";
import InputField from "@/components/ui/InputField";
import LocationInput from "@/components/ui/LocationInput";
import { useFare } from "@/hooks/useFareTrip";
import { useAuthStore } from "@/store/authStore";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const MOVEMENT_OPTIONS = [
  "Home Move",
  "Office Move",
  "Apartment / Flat Move",
  "Relocation",
  "Others",
];

export default function Landing() {
  const { user, token } = useAuthStore();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [movementType, setMovementType] = useState<string | null>(null);
  const [customMovement, setCustomMovement] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showMovementModal, setShowMovementModal] = useState(false);

  const { calculateFare, loading: fareLoading } = useFare();
  const [fare, setFare] = useState<number | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    pickup: "",
    dropoff: "",
    dateTime: "",
    name: "",
    email: "",
    contactNumber: "",
    movementType: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const [loading, setLoading] = useState(false);

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

  // const handleExitApp = () => {
  //   setShowExitModal(false);

  //   if (Platform.OS === "android") {
  //     BackHandler.exitApp();
  //   }
  // };

  // useEffect(() => {
  //   if (Platform.OS === "android") {
  //     const backAction = () => {
  //       if (showModal) {
  //         setShowModal(false);
  //         return true;
  //       }
  //       setShowExitModal(true);
  //       return true;
  //     };

  //     const backHandler = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       backAction
  //     );

  //     return () => backHandler.remove();
  //   }
  // }, [showModal]);

  const validateFields = () => {
    const newErrors = {
      pickup: pickup.trim() === "" ? "Pickup location is required" : "",
      dropoff: dropoff.trim() === "" ? "Dropoff location is required" : "",
      dateTime:
        !selectedDate || !selectedTime ? "Pickup date & time are required" : "",
      name: !user?.name ? "Name is required" : "",
      email: !user?.email ? "Email is required" : "",
      contactNumber:
        contactNumber.trim() === "" ? "Contact number is required" : "",
      movementType:
        !movementType ||
        (movementType === "Others" && customMovement.trim() === "")
          ? "Movement type is required"
          : "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e !== "");
    if (hasError) {
      console.log("Validation failed:", newErrors);
    }

    return !hasError;
  };

  const sendMoveRequest = async () => {
    if (!validateFields()) return;

    if (!selectedDate || !selectedTime) return;

    setLoading(true);

    const finalMovementType =
      movementType === "Others" ? customMovement : movementType;

    const move_datetime = new Date(
      selectedDate!.getFullYear(),
      selectedDate!.getMonth(),
      selectedDate!.getDate(),
      selectedTime!.getHours(),
      selectedTime!.getMinutes()
    ).toISOString();

    const payload = {
      pickup,
      dropoff,
      move_datetime,
      phone: contactNumber,
      email: user?.email || "",
      name: user?.name || "",
      movementType: finalMovementType,
    };

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/send-quote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
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
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <StatusBar style="dark" />
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header / Title */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Book a Move
          </Text>
          <Text className="text-gray-500 mt-1">
            Fast, reliable relocation service
          </Text>
        </View>

        <LocationInput
          label="Pickup Location"
          placeholder="Enter pickup"
          value={pickup}
          onChangeText={setPickup}
          onSelectSuggestion={setPickup}
        />
        {errors.pickup ? (
          <Text className="text-red-500 mb-2">{errors.pickup}</Text>
        ) : null}
        <LocationInput
          label="Dropoff Location"
          placeholder="Enter dropoff"
          value={dropoff}
          onChangeText={setDropoff}
          onSelectSuggestion={setDropoff}
        />
        {errors.dropoff ? (
          <Text className="text-red-500 mb-2">{errors.dropoff}</Text>
        ) : null}

        <InputField
          label="Contact Number"
          placeholder="Enter your phone number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="numeric"
          maxLength={10}
        />
        {errors.contactNumber ? (
          <Text className="text-red-500 mb-2">{errors.contactNumber}</Text>
        ) : null}

        {/* Movement Type */}
        <View className="mb-4">
          <Text className="font-semibold mb-1 text-[#5b2417]">
            Movement Type
          </Text>

          <TouchableOpacity
            className="bg-white border border-gray-300 px-4 py-3 rounded-md"
            onPress={() => setShowMovementModal(true)}
          >
            <Text className="text-gray-700">
              {movementType || "Select movement type"}
            </Text>
          </TouchableOpacity>

          {errors.movementType ? (
            <Text className="text-red-500 mt-1">{errors.movementType}</Text>
          ) : null}

          {movementType === "Others" && (
            <InputField
              label="Specify Movement"
              placeholder="Enter movement type"
              value={customMovement}
              onChangeText={setCustomMovement}
            />
          )}
        </View>

        <View className="mb-4">
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
        </View>

        {/* Date & Time Picker */}
        <TouchableOpacity
          className="bg-[#5b2417] px-4 py-3 rounded-md mb-6 mt-4"
          onPress={() => setShowModal(true)}
        >
          <Text className="text-white text-center">
            {selectedDate && selectedTime
              ? `${selectedDate.toDateString()} ${selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Select Pickup Date & Time"}
          </Text>
        </TouchableOpacity>
        {errors.dateTime ? (
          <Text className="text-red-500 mb-2">{errors.dateTime}</Text>
        ) : null}

        <TouchableOpacity
          className="bg-[#f59e0b] px-4 py-3 rounded-md mb-6"
          onPress={sendMoveRequest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-center">
              Book Now
            </Text>
          )}
        </TouchableOpacity>

        <DateTimeModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSelectDate={setSelectedDate}
          onSelectTime={setSelectedTime}
        />

        {/* <ExitConfirmationModal
          visible={showExitModal}
          onClose={() => setShowExitModal(false)}
          onExit={handleExitApp}
        /> */}
      </ScrollView>
      {showMovementModal && (
        <View className="absolute inset-0 bg-black/30 justify-center items-center">
          <View className="bg-white w-[85%] rounded-xl p-5 shadow-lg">
            <Text className="text-lg font-semibold text-center text-[#5b2417] mb-4">
              Select Movement Type
            </Text>

            {MOVEMENT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setMovementType(option);
                  setShowMovementModal(false);
                }}
                className="py-3 rounded-md mb-2 border border-[#e5d2cb] active:opacity-70"
              >
                <Text className="text-center text-[#5b2417] font-medium">
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowMovementModal(false)}
              className="py-3 mt-1 rounded-md active:opacity-70"
            >
              <Text className="text-center text-gray-500 font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
