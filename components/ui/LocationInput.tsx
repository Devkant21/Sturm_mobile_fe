import { Ionicons } from "@expo/vector-icons"; // 💡 Import Ionicons
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LocationInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelectSuggestion: (suggestion: string) => void;
}

export default function LocationInput({
  label,
  placeholder,
  value,
  onChangeText,
  onSelectSuggestion,
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<
    Array<{ description: string; place_id: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [justSelected, setJustSelected] = useState(false);

  const fetchPlaces = async (query: string) => {
    if (!query.trim()) return setSuggestions([]);
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/google/places?input=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setSuggestions(data.predictions || []);
    } catch (error) {
      console.error("Failed to fetch places:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (justSelected) {
      setJustSelected(false);
      return;
    }

    const timeout = setTimeout(() => {
      if (value) fetchPlaces(value);
      else setSuggestions([]);
    }, 400);

    return () => clearTimeout(timeout);
  }, [value]);

  const handleSelect = (description: string) => {
    setJustSelected(true);
    onSelectSuggestion(description);
    setSuggestions([]);
  };

  // 💡 NEW: Handler to clear the input and suggestions
  const handleClear = () => {
    onChangeText("");
    setSuggestions([]);
  };

  return (
    <View className="w-full mb-4 relative">
      <Text className="mb-2 text-base font-medium text-[#5b2417]">{label}</Text>

      {/* 💡 CONTAINER FOR INPUT AND BUTTON */}
        <View className="w-full flex-row items-center rounded-lg border border-gray-300 bg-white pl-2 pr-2">
            <Ionicons
              name={label.includes("Pickup") ? "radio-button-on" : "location"}
              size={18}
              color={label.includes("Pickup") ? "#16a34a" : "#dc2626"}
            />

        <TextInput
          className="flex-1 px-2 py-3 bg-transparent" 
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
        />

        {/* 💡 CLEAR BUTTON (X Icon) */}
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} className="p-1">
            <Ionicons name="close-circle" size={24} color="#a0aec0" />
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestion dropdown */}
      {suggestions.length > 0 && (
        <View className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 shadow z-50">
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              onPress={() => handleSelect(item.description)}
              className="p-2 border-b border-gray-100"
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading && (
        <View className="mt-1 flex-row items-center gap-2">
          <ActivityIndicator size="small" color="#5b2417" />
          <Text className="text-sm text-gray-500">Loading suggestions...</Text>
        </View>
      )}
    </View>
  );
}
