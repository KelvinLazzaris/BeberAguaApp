import { Platform } from 'react-native';  // Importe o módulo Platform
import * as Notifications from 'expo-notifications';

// Função para agendar notificações
export const scheduleNotification = async (date, message) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Hidratação",
        body: message,
      },
      trigger: {
        seconds: date.getTime() / 1000 - Date.now() / 1000,  // Definir o tempo para a notificação
      },
    });
    console.log("Notificação agendada com sucesso!");
  } catch (error) {
    console.error("Erro ao agendar a notificação:", error);
  }
};

// Função para cancelar todas as notificações agendadas (com verificação de plataforma)
export const updateNotifications = async () => {
  if (Platform.OS !== 'web') {
    try {
      // Só deve ser chamado em plataformas nativas (iOS/Android)
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("Todas as notificações agendadas foram canceladas.");
    } catch (error) {
      console.error("Erro ao cancelar notificações:", error);
    }
  } else {
    console.log("Notifications.cancelAllScheduledNotificationsAsync não é suportado na web.");
  }
};

// Função para obter permissões de notificação
export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log("Permissão para notificações não concedida!");
    } else {
      console.log("Permissão para notificações concedida.");
    }
  } catch (error) {
    console.error("Erro ao solicitar permissões para notificações:", error);
  }
};

// Função para cancelar notificações agendadas de um usuário específico
export const cancelUserNotifications = async () => {
  if (Platform.OS !== 'web') {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      notifications.forEach(async (notification) => {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      });
      console.log("Notificações do usuário canceladas com sucesso.");
    } catch (error) {
      console.error("Erro ao cancelar notificações do usuário:", error);
    }
  } else {
    console.log("Não é possível cancelar notificações no web.");
  }
};

// Função para configurar notificações (nova função)
export const setupNotifications = async () => {
  try {
    await requestNotificationPermissions();  // Solicita permissões para notificações
    console.log("Notificações configuradas com sucesso.");
  } catch (error) {
    console.error("Erro ao configurar notificações:", error);
  }
};
