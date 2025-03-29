import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Configuracoes() {
  const [metaCopos, setMetaCopos] = useState('');

  useEffect(() => {
    carregarMeta();
  }, []);

  // Carrega a meta salva (se existir) ao abrir a tela
  const carregarMeta = async () => {
    try {
      const valor = await AsyncStorage.getItem('@metaCopos');
      if (valor !== null) {
        setMetaCopos(valor);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Salva a meta no AsyncStorage
  const salvarMeta = async () => {
    try {
      await AsyncStorage.setItem('@metaCopos', metaCopos);
      alert('Meta salva com sucesso!');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Defina a meta diária de copos de água</Text>
      
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={metaCopos}
        onChangeText={text => setMetaCopos(text)}
        placeholder="Ex: 8"
      />

      <Button title="Salvar Meta" onPress={salvarMeta} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
});
