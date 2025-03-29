import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_PATH = "beberagua:notificationSettings";
const ThemeContext = createContext();

const baseThemes = {
  light: {
    background: "#E3F2FD",
    cardBackground: "#FFF",
    text: "#333",
    secondaryText: "#666",
    error: "#D32F2F",
    tabBarBackground: "#FFF",
    tabBarBorder: "#E3F2FD",
    headerColor: "#fff"
  },
  dark: {
    background: "#1E1E1E",
    cardBackground: "#2C2C2C",
    text: "#E0E0E0",
    secondaryText: "#B0B0B0",
    error: "#EF5350",
    tabBarBackground: "#2C2C2C",
    tabBarBorder: "#424242",
    headerColor: "#2C2C2C"
  }
};

export const availableColors = {
  blue: {
    primary: "#2196F3",
    primaryDark: "#1976D2"
  },
  green: {
    primary: "#4CAF50",
    primaryDark: "#388E3C"
  },
  purple: {
    primary: "#9C27B0",
    primaryDark: "#7B1FA2"
  },
  orange: {
    primary: "#FF9800",
    primaryDark: "#F57C00"
  }
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeName, setThemeName] = useState(systemColorScheme || "light");
  const [colorName, setColorName] = useState("blue");

  const themeBase = baseThemes[themeName];
  const color = availableColors[colorName];
  const theme = { ...themeBase, ...color };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_PATH);
        const settings = savedSettings ? JSON.parse(savedSettings) : {};
        setThemeName(settings.theme || systemColorScheme || "light");
        setColorName(settings.color || "blue");
      } catch (error) {
        console.error("Erro ao carregar tema:", error);
      }
    };
    loadTheme();
  }, []); // Dependências vazias, para carregar o tema apenas uma vez

  const setTheme = async (newTheme) => {
    setThemeName(newTheme);
    await saveTheme(newTheme, colorName); // Salva o tema junto com a cor atual
  };

  const setPrimaryColor = async (newColor) => {
    setColorName(newColor);
    await saveTheme(themeName, newColor); // Salva o tema junto com a nova cor
  };

  const saveTheme = async (themeToSave, colorToSave) => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_PATH);
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      await AsyncStorage.setItem(
        SETTINGS_PATH,
        JSON.stringify({ ...settings, theme: themeToSave, color: colorToSave })
      );
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setPrimaryColor, colorName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
