import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderTrackingScreen from './src/screens/OrderTrackingScreen';
import UserOrdersScreen from './src/screens/UserOrdersScreen';
import MarmitaDetailScreen from './src/screens/MarmitaDetailScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminMarmitasScreen from './src/screens/AdminMarmitasScreen';
import AdminOrdersScreen from './src/screens/AdminOrdersScreen';
import AdminReportsScreen from './src/screens/AdminReportsScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
          <Stack.Screen name="Orders" component={UserOrdersScreen} />
          <Stack.Screen name="MarmitaDetail" component={MarmitaDetailScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="AdminMarmitas" component={AdminMarmitasScreen} />
          <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
          <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
