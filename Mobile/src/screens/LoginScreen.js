import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await login(email, senha);
      // O App.js vai lidar com o redirecionamento baseado no estado do user
    } catch (error) {
      Alert.alert('Erro no Login', error.response?.data?.message || 'Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <ShoppingBag size={64} color="#f97316" />
          <Text style={styles.title}>Fast Marmita</Text>
          <Text style={styles.subtitle}>O sabor de casa onde você estiver</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 30, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#f97316', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  form: { width: '100%' },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#666', fontSize: 14 },
});
