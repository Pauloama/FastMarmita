import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/Auth/login', { email, senha });
    const { token, ...user } = response.data;
    
    if (token) {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/Auth/register', userData);
    const { token, ...user } = response.data;
    
    if (token) {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
  },

  getStoredData: async () => {
    const token = await AsyncStorage.getItem('token');
    const userJson = await AsyncStorage.getItem('user');
    return {
      token,
      user: userJson ? JSON.parse(userJson) : null
    };
  }
};
