import { Tabs } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { ThemeProvider, useTheme } from "../utils/ThemeContext";

const hydrationMessages = [
  { title: "💧 Hidratação é Vida 💧", text: "Beber água melhora sua concentração e mantém seu cérebro afiado!" },
  { title: "💧 Água é Saúde 💧", text: "A hidratação adequada ajuda na digestão e regula seu corpo!" },
  { title: "💧 Fique Hidratado 💧", text: "Água mantém sua pele saudável e radiante todos os dias!" },
  { title: "💧 Vida em Movimento 💧", text: "Beber água regularmente dá energia para suas atividades!" },
  { title: "💧 Equilíbrio Natural 💧", text: "A água regula sua temperatura corporal em qualquer clima!" },
];

const TabsLayout = () => {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarStyle: [styles.tabBar, { backgroundColor: theme.tabBarBackground, borderTopColor: theme.tabBarBorder }],
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Histórico",
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>📜</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState("");  // Estado para armazenar a hora atual
  const [randomMessage, setRandomMessage] = useState(null); // Estado para armazenar a frase motivacional fixa
  const { theme } = useTheme();

  // Atribuindo uma frase motivacional aleatória uma única vez
  useEffect(() => {
    const selectedMessage = hydrationMessages[Math.floor(Math.random() * hydrationMessages.length)];
    setRandomMessage(selectedMessage);  // Define a frase motivacional
  }, []);  // Este useEffect é executado apenas uma vez, quando o componente for montado

  // Atualizar a hora a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setCurrentTime(date.toLocaleString());  // Atualiza a hora e data
    }, 1000);  // Atualiza a cada 1 segundo

    return () => clearInterval(interval); // Limpar o intervalo quando o componente for desmontado
  }, []);

  const onContinue = useCallback(async () => {
    setAppIsReady(true);
  }, []);

  if (!appIsReady) {
    return (
      <View style={[styles.splashContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.splashCard, { backgroundColor: theme.cardBackground }]}>
          {/* Exibe a frase motivacional fixa */}
          {randomMessage && (
            <>
              <Text style={[styles.splashTitle, { color: theme.primaryDark }]}>
                {randomMessage.title}
              </Text>
              <Text style={[styles.splashText, { color: theme.secondaryText }]}>
                {randomMessage.text}
              </Text>
            </>
          )}
          {/* Exibe a hora atual */}
          <Text style={[styles.splashTime, { color: theme.primaryDark }]}>
            {currentTime}  {/* Exibe a hora atual */}
          </Text>
        </View>
        <TouchableOpacity onPress={onContinue} style={[styles.button, { borderColor: theme.primary }]}>
          <Text style={[styles.buttonText, { color: theme.primary }]}>Vamos Começar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <TabsLayout />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  splashCard: {
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "85%",
  },
  splashTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  splashText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  splashTime: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    borderWidth: 4,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tabBar: {
    borderTopWidth: 1,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabIcon: {
    fontSize: 24,
  },
});
