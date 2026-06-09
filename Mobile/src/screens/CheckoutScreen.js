import React, { useMemo, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderService } from '../services/orderService';

export default function CheckoutScreen({ navigation }) {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Dados do cliente
  const [name, setName] = useState(user?.nome || '');
  const [phone, setPhone] = useState(user?.telefone || '');
  const [address, setAddress] = useState(user?.endereco || '');
  const [notes, setNotes] = useState('');

  // Pagamento
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [loading, setLoading] = useState(false);

  const deliveryFee = 0;
  const subtotal = useMemo(() => getCartTotal(), [cartItems]);
  const total = subtotal;

  const handleFinishOrder = async () => {
    if (!name || !phone || !address) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, telefone e endereço.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione itens antes de finalizar');
      return;
    }

    setLoading(true);
    try {
      // O backend real usa um DTO diferente do que a base previa
      // Vamos ajustar para o CreatePedidoDto do Backend
      const orderData = {
        items: cartItems.map(item => ({
          marmitaId: item.id,
          quantidade: item.quantity
        })),
        metodoPagamento: paymentMethod === 'PIX' ? 1 : (paymentMethod === 'Cartão' ? 0 : 2),
        observacoes: notes
      };

      const orderResponse = await orderService.createOrder(orderData);

      Alert.alert(
        'Sucesso!',
        'Seu pedido foi enviado com sucesso! Acompanhe o status na tela de pedidos.'
      );

      clearCart();
      navigation.replace('OrderTracking', { orderId: orderResponse.id });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao finalizar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Seu carrinho está vazio</Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.item}>
                  <Text>{item.nome} x{item.quantity}</Text>
                  <Text>R$ {(item.preco * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
              <View style={styles.separator} />
              <View style={styles.item}>
                <Text style={styles.totalText}>Total do Pedido</Text>
                <Text style={styles.totalText}>R$ {total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados de Entrega</Text>
              <TextInput
                placeholder="Nome"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Telefone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
              />
              <TextInput
                placeholder="Endereço Completo"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
              />
              <TextInput
                placeholder="Observações (ex: trocar feijão por lentilha)"
                value={notes}
                onChangeText={setNotes}
                multiline
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
              <View style={styles.paymentContainer}>
                {['PIX', 'Cartão', 'Dinheiro'].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.paymentButton,
                      paymentMethod === method && styles.paymentButtonSelected,
                    ]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <Text style={[
                      styles.paymentButtonText,
                      paymentMethod === method && styles.paymentButtonTextSelected
                    ]}>{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.finishButton, loading && styles.finishButtonDisabled]}
              onPress={handleFinishOrder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.finishButtonText}>Finalizar Pedido</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  container: { padding: 20, paddingBottom: 40 },
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyCartText: { fontSize: 18, color: '#666' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  separator: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#f97316' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  paymentContainer: { flexDirection: 'row', gap: 10 },
  paymentButton: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 14, borderRadius: 8, alignItems: 'center' },
  paymentButtonSelected: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  paymentButtonText: { fontSize: 14, fontWeight: '600', color: '#666' },
  paymentButtonTextSelected: { color: '#f97316' },
  finishButton: { backgroundColor: '#10b981', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  finishButtonDisabled: { opacity: 0.6 },
  finishButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
