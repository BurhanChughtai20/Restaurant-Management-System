export const themeColors = {
  light: {
    primary: "#FF6B35",
    secondary: "#FECA57",
    accent: "#E63946",
    background: "#FFF8E1",
    text: "#000000",
    textSecondary: "#333333",
    border: "#E0E0E0",
    hover: "#FFB347",
  },
  dark: {
    primary: "#D00000",
    secondary: "#FFBA08",
    accent: "#FF6B35",
    background: "#1A1A1A",
    text: "#FFFFFF",
    textSecondary: "#E0E0E0",
    border: "#333333",
    hover: "#FF8C42",
  },
};

export const themeConfig = {
  light: {
    // Tailwind classes for light theme
    bodyBg: "bg-[#FFF8E1]",
    textColor: "text-black",
    textSecondary: "text-gray-700",
    navBg: "bg-white",
    navBorder: "border-gray-200",
    cardBg: "bg-white",
    cardBorder: "border-gray-300",
    buttonPrimary: "bg-[#FF6B35] hover:bg-[#E85A28]",
    buttonSecondary: "bg-[#FECA57] hover:bg-[#FFC629]",
    accentColor: "text-[#E63946]",
    primaryColor: "text-[#FF6B35]",
    secondaryColor: "text-[#FECA57]",
  },
  dark: {
    // Tailwind classes for dark theme
    bodyBg: "bg-[#1A1A1A]",
    textColor: "text-white",
    textSecondary: "text-gray-300",
    navBg: "bg-[#222222]",
    navBorder: "border-gray-700",
    cardBg: "bg-[#222222]",
    cardBorder: "border-gray-600",
    buttonPrimary: "bg-[#D00000] hover:bg-[#B30000]",
    buttonSecondary: "bg-[#FFBA08] hover:bg-[#FFB347]",
    accentColor: "text-[#FF6B35]",
    primaryColor: "text-[#D00000]",
    secondaryColor: "text-[#FFBA08]",
  },
};
