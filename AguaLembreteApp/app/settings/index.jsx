import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Switch, ActivityIndicator, TouchableOpacity, TextInput } from "react-native";
import Slider from '@react-native-community/slider';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateNotifications } from "../../utils/notifications";
import { useTheme, availableColors } from "../../utils/ThemeContext";

const SETTINGS_PATH = "beberagua:notificationSettings";
const USERNAME_KEY = "beberagua:userName";

const INTERVAL_MIN = 0.01;
const INTERVAL_MAX = 4;
const INTERVAL_STEP = 0.01;

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [interval, setInterval] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const { theme, setTheme, setPrimaryColor, colorName } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const toggleTheme = (value) => {
    setIsDarkMode(value);
    setTheme(value ? "dark" : "light");
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_PATH);
      const savedName = await AsyncStorage.getItem(USERNAME_KEY);
      if (savedSettings) {
        const { enabled, interval: savedInterval, theme: savedTheme } = JSON.parse(savedSettings);
        setNotificationsEnabled(enabled);
        setInterval(parseFloat(savedInterval) || 1);
        setIsDarkMode(savedTheme === "dark");
        if (savedTheme) setTheme(savedTheme);
      } else {
        setInterval(1);
      }
      if (savedName) setUserName(savedName);
    } catch (e) {
      console.error("Erro ao carregar configurações:", e);
      setInterval(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      const settings = {
        enabled: notificationsEnabled,
        interval: interval,
        theme: isDarkMode ? "dark" : "light"
      };
      await AsyncStorage.setItem(SETTINGS_PATH, JSON.stringify(settings));
      await AsyncStorage.setItem(USERNAME_KEY, userName);
      await updateNotifications();
    } catch (e) {
      console.error("Erro ao salvar configurações:", e);
    }
  };

  const handleNameChange = (value) => {
    setUserName(value);
    AsyncStorage.setItem(USERNAME_KEY, value);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.setting}>
          <Text style={[styles.label, { color: theme.secondaryText }]}>Modo Escuro</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#ccc", true: theme.primary }}
            thumbColor={isDarkMode ? theme.primaryDark : "#f4f3f4"}
          />
        </View>
        <View style={styles.setting}>
          <Text style={[styles.label, { color: theme.secondaryText }]}>Notificações</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#ccc", true: theme.primary }}
            thumbColor={notificationsEnabled ? theme.primaryDark : "#f4f3f4"}
          />
        </View>
        <View style={styles.sliderContainer}>
          <Text style={[styles.label, { color: theme.secondaryText }]}>
            Intervalo: {interval?.toFixed(2)} hora(s)
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={INTERVAL_MIN}
            maximumValue={INTERVAL_MAX}
            step={INTERVAL_STEP}
            value={interval}
            onValueChange={setInterval}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.secondaryText}
            thumbTintColor={theme.primaryDark}
          />
        </View>

        {/* Campo de nome do usuário */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.secondaryText }]}>Nome do Usuário:</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.primary }]}
            value={userName}
            onChangeText={handleNameChange}
            placeholder="Digite seu nome"
          />
        </View>

        {/* Seção para escolha da cor do tema */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.secondaryText }]}>Cor do Tema:</Text>
          <View style={styles.colorPickerContainer}>
            {Object.keys(availableColors).map((colorKey) => (
              <TouchableOpacity
                key={colorKey}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: availableColors[colorKey].primary,
                    borderWidth: colorKey === colorName ? 3 : 1,
                    borderColor: colorKey === colorName ? "#000" : "#ccc"
                  }
                ]}
                onPress={() => setPrimaryColor(colorKey)}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  card: {
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15
  },
  label: {
    fontSize: 18,
    fontWeight: "500"
  },
  sliderContainer: {
    marginVertical: 15
  },
  slider: {
    width: "100%",
    height: 40
  },
  inputContainer: {
    marginTop: 20
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  colorPickerContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  }
});
