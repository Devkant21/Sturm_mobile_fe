import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import ConditionsModal from "../modal/ConditionsModal";
import ContactSupportModal from "../modal/ContactSupportModal";
import FAQModal from "../modal/FAQModal";
import PrivacyModal from "../modal/PrivacyModal";

type MenuAction =
  | "chat-support"
  | "contact-support"
  | "faq"
  | "terms"
  | "privacy";

type MenuItem = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: MenuAction;
};

const MENU_ITEMS: MenuItem[] = [
  {
    title: "Chat Support",
    subtitle: "(coming soon)",
    icon: "chatbubble-outline",
    action: "chat-support",
  },
  {
    title: "Contact Support",
    subtitle: "Call or email our support team",
    icon: "call-outline",
    action: "contact-support",
  },
  {
    title: "FAQs",
    subtitle: "Find answers to common questions",
    icon: "help-circle-outline",
    action: "faq",
  },
  {
    title: "Terms & Conditions",
    subtitle: "Read our terms and conditions",
    icon: "document-text-outline",
    action: "terms",
  },
  {
    title: "Privacy Policy",
    subtitle: "Read our privacy policy",
    icon: "shield-checkmark-outline",
    action: "privacy",
  },
];

export default function SupportLegalCard() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);

  const handlePress = (action: MenuAction) => {
    switch (action) {
      case "contact-support":
        setShowContactSupport(true);
        break;

      case "terms":
        setShowTerms(true);
        break;

      case "privacy":
        setShowPrivacy(true);
        break;

      case "faq":
        setShowFAQ(true);
        break;

      default:
        break;
    }
  };

  return (
    <View className="mx-4 mt-4">
      <Text className="mb-3 text-xl font-semibold text-zinc-900">
        Support & Legal
      </Text>

      <View className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.title}
            onPress={() => handlePress(item.action)}
            activeOpacity={0.7}
            className={`flex-row items-center px-4 py-4 ${
              index !== MENU_ITEMS.length - 1 ? "border-b border-zinc-100" : ""
            }`}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <Ionicons name={item.icon} size={20} color="#16a34a" />
            </View>

            <View className="ml-3 flex-1">
              <Text className="font-semibold text-zinc-900">{item.title}</Text>

              <Text className="mt-0.5 text-sm text-zinc-500">
                {item.subtitle}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>
      <ContactSupportModal
        visible={showContactSupport}
        onClose={() => setShowContactSupport(false)}
      />

      <ConditionsModal
        visible={showTerms}
        onClose={() => setShowTerms(false)}
      />

      <PrivacyModal
        visible={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />

      <FAQModal visible={showFAQ} onClose={() => setShowFAQ(false)} />
    </View>
  );
}
