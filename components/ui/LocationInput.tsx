import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Prediction {
  description: string;
  place_id: string;
}

interface LocationInputProps {
  type: "pickup" | "destination";
  value: string;
  placeholder: string;
  label: string;
  onChangeText: (text: string) => void;
  onSelectSuggestion: (suggestion: string) => void;
  onSuggestionsChange?: (hasSuggestions: boolean) => void;
  suggestions?: Prediction[];
  detectingLocation?: boolean;
}

export default function LocationInput({
  type,
  value,
  placeholder,
  label,
  onChangeText,
  onSelectSuggestion,
  onSuggestionsChange,
  detectingLocation,
  suggestions = [],
}: LocationInputProps) {
  const [loading, setLoading] = useState(false);
  const [localSuggestions, setLocalSuggestions] = useState<Prediction[]>([]);
  const [justSelected, setJustSelected] = useState(false);

  const activeSuggestions =
    suggestions.length > 0 ? suggestions : localSuggestions;

  const fetchPlaces = async (query: string) => {
    if (!query.trim()) {
      setLocalSuggestions([]);
      onSuggestionsChange?.(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_WEBSITE_URL}/api/google/places?input=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      const preds = data.predictions ?? [];
      setLocalSuggestions(preds);
      onSuggestionsChange?.(preds.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (justSelected) {
      setJustSelected(false);
      return;
    }
    const timer = setTimeout(() => fetchPlaces(value), 350);
    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (description: string) => {
    setJustSelected(true);
    onSelectSuggestion(description);
    setLocalSuggestions([]);
    onSuggestionsChange?.(false);
  };

  const handleClear = () => {
    onChangeText("");
    setLocalSuggestions([]);
    onSuggestionsChange?.(false);
  };

  return (
    <View>
      {/* Label */}
      <Text className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </Text>

      {/* Input row */}
      <View className="flex-row items-center">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={
            detectingLocation ? "Detecting current location..." : placeholder
          }
          placeholderTextColor="#d4d4d8"
          className="flex-1 text-[16px] text-zinc-900 py-0.5"
        />

        <View className="ml-2 flex-row items-center gap-2">
          {loading && <ActivityIndicator size="small" color="#a1a1aa" />}

          {!loading && value.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              className="h-[26px] w-[26px] items-center justify-center rounded-full bg-zinc-100"
            >
              <Ionicons name="close" size={14} color="#71717a" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Suggestions drawer — rendered below the card via portal in parent */}
      {activeSuggestions.length > 0 && (
        <View className="mt-3 overflow-hidden rounded-2xl border border-zinc-100 bg-white">
          <Text className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Suggestions
          </Text>

          {activeSuggestions.map((item, index) => {
            const [main, ...rest] = item.description.split(",");
            const sub = rest.join(",").trim();

            return (
              <TouchableOpacity
                key={item.place_id}
                onPress={() => handleSelect(item.description)}
                activeOpacity={0.6}
                className={`flex-row items-start px-4 py-3 ${
                  index < activeSuggestions.length - 1
                    ? "border-b border-zinc-50"
                    : ""
                }`}
              >
                {/* Icon chip */}
                <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-[10px] bg-zinc-100">
                  <Ionicons name="location-outline" size={16} color="#71717a" />
                </View>

                <View className="ml-3 flex-1">
                  <Text
                    className="text-sm font-medium text-zinc-800 leading-snug"
                    numberOfLines={1}
                  >
                    {main}
                  </Text>
                  {!!sub && (
                    <Text
                      className="mt-0.5 text-xs text-zinc-400"
                      numberOfLines={1}
                    >
                      {sub}
                    </Text>
                  )}
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color="#d4d4d8"
                  style={{ marginTop: 4 }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
