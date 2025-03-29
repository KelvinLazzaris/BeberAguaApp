import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AguaContador from "../components/agua_contador";
import { setupNotifications, updateNotifications } from "../utils/notifications";
import { useTheme } from "../utils/ThemeContext";

const HISTORICO_AGUA = "waterHistory"; // Mesma chave usada no componente AguaContador
const USERNAME_KEY = "beberagua:userName"; // Chave para armazenar o nome do usuário
const META_COPOS_KEY = "beberagua:metaCopos"; // Chave para a meta de copos

export default function HomeScreen() {
  const { theme } = useTheme();  // Usando o tema atual
  const [copos, setCopos] = useState(0); // Estado para o número de copos consumidos
  const [userName, setUserName] = useState("");  // Variável para armazenar o nome do usuário
  const [metaCopos, setMetaCopos] = useState(8); // Meta de copos (padrão 8)

  // Carregar configurações e histórico ao inicializar
  useEffect(() => {
    const initialize = async () => {
      await setupNotifications();
      await carregar();
      await carregarNome();  // Carregar o nome do usuário
      await carregarMetaCopos();
      await updateNotifications();
    };
    initialize();
  }, []);

  // Recarregar dados ao voltar à tela
  useFocusEffect(
    useCallback(() => {
      const recarregarAoVoltar = async () => {
        await carregar();
        await carregarNome();  // Carregar o nome do usuário novamente
        await carregarMetaCopos();
      };
      recarregarAoVoltar();
    }, [])
  );

  // Carregar histórico de consumo de água
  const carregar = async () => {
    try {
      const historico_salvo = await AsyncStorage.getItem(HISTORICO_AGUA);
      const historico_parsed = historico_salvo ? JSON.parse(historico_salvo) : [];
      const dtAtual = new Date().toLocaleDateString("pt-BR");
      const coposHoje = historico_parsed.find((entry) => entry.date === dtAtual);
      setCopos(coposHoje ? coposHoje.count : 0); // Atualiza o estado de copos com base no histórico
    } catch (e) {
      console.error("Erro ao carregar contagem do dia:", e);
    }
  };

  // Carregar o nome do usuário salvo nas configurações
  const carregarNome = async () => {
    try {
      const savedName = await AsyncStorage.getItem(USERNAME_KEY);
      if (savedName) setUserName(savedName);  // Se existir um nome salvo, armazena no estado
    } catch (e) {
      console.error("Erro ao carregar nome do usuário:", e);
    }
  };

  // Carregar a meta de copos do AsyncStorage
  const carregarMetaCopos = async () => {
    try {
      const metaSalva = await AsyncStorage.getItem(META_COPOS_KEY);
      if (metaSalva) {
        setMetaCopos(parseInt(metaSalva, 10)); // Carregar a meta de copos se existir
      }
    } catch (e) {
      console.error("Erro ao carregar meta de copos:", e);
    }
  };

  // Função para aumentar o contador de copos ao clicar no botão "BEBER 1 COPO"
  const beberUmCopo = async () => {
    const novoNumeroDeCopos = copos + 1; // Aumenta o número de copos
    setCopos(novoNumeroDeCopos); // Atualiza o estado local

    try {
      const historico_salvo = await AsyncStorage.getItem(HISTORICO_AGUA);
      const historico_parsed = historico_salvo ? JSON.parse(historico_salvo) : [];
      const dtAtual = new Date().toLocaleDateString("pt-BR");

      // Atualiza ou adiciona o consumo de copos no histórico
      const coposHoje = historico_parsed.find((entry) => entry.date === dtAtual);
      if (coposHoje) {
        coposHoje.count += 1; // Se já existir um registro para hoje, incrementa
      } else {
        historico_parsed.push({ date: dtAtual, count: 1 }); // Se não existir, cria um novo registro
      }

      await AsyncStorage.setItem(HISTORICO_AGUA, JSON.stringify(historico_parsed)); // Salva o histórico atualizado
    } catch (e) {
      console.error("Erro ao salvar o consumo no histórico:", e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Mensagem de boas-vindas personalizada */}
      <Text style={[styles.welcome, { color: theme.text }]}>
        {userName ? `Olá, ${userName}!\nVamos nos hidratar hoje?` : "Olá! Vamos nos hidratar hoje?"}
      </Text>

      <Text style={[styles.title, { color: theme.primaryDark }]}>Lembrete de Água</Text>

      {/* Seção centralizada: "Copos Hoje" e "Bebi um Copo" */}
      <View style={styles.centeredContainer}>
        <Text style={[styles.cuposText, { color: theme.text }]}>Copos Hoje</Text>
        <Text style={[styles.cuposNumber, { color: theme.primaryDark }]}>{copos}</Text>

        {/* Botão para beber 1 copo com a cor do tema */}
        <Button
          title="BEBER 1 COPO"
          onPress={beberUmCopo}
          color={theme.primary} // Usando a cor primária do tema
        />
      </View>

      {/* Exibição do progresso */}
      <Text style={[styles.meta, { color: theme.text }]}>
        Progresso: {copos}/{metaCopos} copos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: "flex-start",
  },
  welcome: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  cuposText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cuposNumber: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  meta: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
