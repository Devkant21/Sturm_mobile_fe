import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Dimensions } from "react-native";

const CELL_SIZE = (Dimensions.get("window").width - 48) / 7;

const PeriodIcon = ({
  period,
  color,
}: {
  period: "morning" | "afternoon" | "evening";
  color: string;
}) => {
  if (period === "morning")
    return <Ionicons name="partly-sunny-outline" size={15} color={color} />;
  if (period === "afternoon")
    return <Ionicons name="sunny-outline" size={15} color={color} />;
  return <Ionicons name="moon-outline" size={15} color={color} />;
};

interface DateTimeModalProps {
  visible: boolean;
  onClose: () => void;
  step: "date" | "time";
  selectedDate: Date | null;
  selectedTime: Date | null;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: Date) => void;
}

// ----------------- Calendar Component -----------------
function Calendar({
  selectedDate,
  onSelectDate,
  onClose,
}: {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const lastDate = new Date(year, month + 1, 0).getDate();

  const dates: Date[] = [];

  for (let day = 1; day <= lastDate; day++) {
    dates.push(new Date(year, month, day));
  }

  const calendarCells: (Date | null)[] = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }

  calendarCells.push(...dates);

  const isPast = (date: Date) => {
    const now = new Date();

    if (now.getHours() >= 16) {
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      return date < tomorrow;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today;
  };

  return (
    <View className="mb-6">
      {/* Month Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="h-10 w-10 items-center justify-center rounded-full bg-zinc-100"
        >
          <Ionicons name="chevron-back" size={20} color="#18181b" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-zinc-900">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="h-10 w-10 items-center justify-center rounded-full bg-zinc-100"
        >
          <Ionicons name="chevron-forward" size={20} color="#18181b" />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View className="mb-2 flex-row">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-xs font-medium text-zinc-500">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View className="flex-row flex-wrap">
        {calendarCells.map((date, index) => {
          if (!date) {
            return (
              <View
                key={`empty-${index}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }}
              />
            );
          }

          const disabled = isPast(date);

          const selected = selectedDate?.toDateString() === date.toDateString();

          return (
            <TouchableOpacity
              key={date.toISOString()}
              disabled={disabled}
              onPress={() => {
                onSelectDate(date);
                onClose();
              }}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
              className="items-center justify-center"
            >
              <View
                className={`h-11 w-11 items-center justify-center rounded-full ${
                  selected ? "bg-green-500" : disabled ? "bg-zinc-100" : ""
                }`}
              >
                <Text
                  className={`font-medium ${
                    selected
                      ? "text-white"
                      : disabled
                        ? "text-zinc-400"
                        : "text-zinc-900"
                  }`}
                >
                  {date.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ----------------- Time Picker Component -----------------
function TimePicker({
  selectedDate,
  selectedTime,
  onSelectTime,
  onClose,
}: {
  selectedDate: Date | null;
  selectedTime: Date | null;
  onSelectTime: (time: Date) => void;
  onClose: () => void;
}) {
  const [activePeriod, setActivePeriod] = React.useState<
    "morning" | "afternoon" | "evening"
  >("morning");

  if (!selectedDate) {
    return (
      <View className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
        <View className="items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
            <Ionicons name="time-outline" size={20} color="#a1a1aa" />
          </View>
          <Text className="text-sm text-zinc-400">
            Select a date to view available pickup windows
          </Text>
        </View>
      </View>
    );
  }

  // ── build slot list ──────────────────────────────────────────────────────
  const now = new Date();
  const isToday = selectedDate.toDateString() === now.toDateString();

  const dayStart = new Date(selectedDate);
  dayStart.setHours(6, 0, 0, 0);
  const dayEnd = new Date(selectedDate);
  dayEnd.setHours(20, 0, 0, 0);

  let minTime: Date;
  if (isToday) {
    const temp = new Date(Date.now() + 4 * 60 * 60 * 1000);
    const rem = temp.getMinutes() % 30;
    if (rem !== 0) temp.setMinutes(temp.getMinutes() + (30 - rem));
    temp.setSeconds(0, 0);
    minTime = temp < dayStart ? dayStart : temp;
  } else {
    minTime = dayStart;
  }

  const allSlots: Date[] = [];
  let cur = new Date(minTime);
  while (cur <= dayEnd) {
    allSlots.push(new Date(cur));
    cur = new Date(cur.getTime() + 30 * 60 * 1000);
  }

  const periods = {
    morning: allSlots.filter((t) => t.getHours() < 12),
    afternoon: allSlots.filter((t) => t.getHours() >= 12 && t.getHours() < 17),
    evening: allSlots.filter((t) => t.getHours() >= 17),
  };

  const periodMeta = {
    morning: { label: "Morning", range: "6 AM – 12 PM" },
    afternoon: { label: "Afternoon", range: "12 PM – 5 PM" },
    evening: { label: "Evening", range: "5 PM – 8 PM" },
  };

  const firstAvailablePeriod =
    (["morning", "afternoon", "evening"] as const).find(
      (p) => periods[p].length > 0,
    ) ?? "morning";

  const displayPeriod =
    periods[activePeriod].length > 0 ? activePeriod : firstAvailablePeriod;

  const nextSlot = allSlots[0];

  const fmt = (d: Date) =>
    d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <View className="mt-4 gap-4">
      {/* header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-zinc-900">
          Pickup Window
        </Text>
        {nextSlot && (
          <View className="flex-row items-center gap-1.5 rounded-full bg-green-50 px-3 py-1">
            <View className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <Text className="text-xs font-medium text-green-700">
              Next: {fmt(nextSlot)}
            </Text>
          </View>
        )}
      </View>

      {/* period tabs */}
      <View className="flex-row gap-2">
        {(["morning", "afternoon", "evening"] as const).map((p) => {
          const meta = periodMeta[p];
          const isActive = activePeriod === p;
          const hasSlots = periods[p].length > 0;
          const hasSelected = periods[p].some(
            (t) => t.getTime() === selectedTime?.getTime(),
          );

          return (
            <TouchableOpacity
              key={p}
              onPress={() => setActivePeriod(p)}
              disabled={!hasSlots}
              className={`relative flex-1 items-center rounded-xl border py-2.5 gap-0.5
                ${
                  isActive
                    ? "border-zinc-900 bg-zinc-900"
                    : hasSlots
                      ? "border-zinc-200 bg-white"
                      : "border-zinc-100 bg-zinc-50 opacity-40"
                }
              `}
            >
              <PeriodIcon period={p} color={isActive ? "#ffffff" : "#71717a"} />
              <Text
                className={`text-xs font-semibold ${
                  isActive ? "text-white" : "text-zinc-500"
                }`}
              >
                {meta.label}
              </Text>
              {hasSelected && !isActive && (
                <View className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-green-500" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* slot grid */}
      {periods[displayPeriod].length === 0 ? (
        <View className="rounded-xl border border-zinc-100 bg-zinc-50 py-6 items-center">
          <Text className="text-sm text-zinc-400">
            No slots available for this period
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {periods[displayPeriod].map((time) => {
            const isSelected = selectedTime?.getTime() === time.getTime();
            const isNext = time.getTime() === nextSlot?.getTime();

            return (
              <TouchableOpacity
                key={time.toISOString()}
                onPress={() => {
                  onSelectTime(time);
                  onClose();
                }}
                className={`
                  relative h-12 w-[31%] items-center justify-center
                  rounded-xl border
                  ${
                    isSelected
                      ? "border-green-500 bg-green-500"
                      : isNext
                        ? "border-green-200 bg-green-50"
                        : "border-zinc-200 bg-white"
                  }
                `}
              >
                <Text
                  className={`text-sm font-semibold
                    ${
                      isSelected
                        ? "text-white"
                        : isNext
                          ? "text-green-700"
                          : "text-zinc-700"
                    }
                  `}
                >
                  {fmt(time)}
                </Text>
                {isNext && !isSelected && (
                  <View className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-white bg-green-500" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* selected summary */}
      {selectedTime && (
        <View className="flex-row items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-green-500">
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
          <View>
            <Text className="text-xs text-green-600">Selected window</Text>
            <Text className="text-sm font-semibold text-green-800">
              {fmt(selectedTime)}
              {" · "}
              {selectedDate.toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ----------------- Modal Wrapper -----------------
export default function DateTimeModal({
  visible,
  onClose,
  step,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: DateTimeModalProps) {
  const translateY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(600);

      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 180,
        mass: 1,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible) {
          onClose();
          return true;
        }

        return false;
      },
    );

    return () => subscription.remove();
  }, [visible, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      {/* Background Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50" />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet */}
      <Animated.View
        style={{
          transform: [{ translateY }],
        }}
        className="absolute bottom-0 left-0 right-0 h-[70%] bg-[#f5f4ee] rounded-t-2xl p-6"
      >
        <Text className="text-2xl font-bold text-[#5b2417] mb-4">
          Select Date & Time
        </Text>

        {(selectedDate || selectedTime) && (
          <View className="mb-6 rounded-3xl border border-green-200 bg-green-50 p-4">
            <Text className="text-sm text-green-700">Selected Schedule</Text>

            {selectedDate && (
              <Text className="mt-2 text-base font-semibold text-zinc-900">
                {selectedDate.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            )}

            {selectedTime && (
              <Text className="mt-1 text-zinc-600">
                {selectedTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            )}
          </View>
        )}

        {step === "date" && (
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            onClose={onClose}
          />
        )}

        {step === "time" && (
          <TimePicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectTime={onSelectTime}
            onClose={onClose}
          />
        )}
      </Animated.View>
    </Modal>
  );
}
