import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await register({ nome, email, telefone, senha });
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
    } catch (error) {
      Alert.alert('Erro no Cadastro', error.response?.data?.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Criar Conta</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Senha *</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 30 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#f97316',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
