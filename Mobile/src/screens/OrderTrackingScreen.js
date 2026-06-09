import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, Linking } from 'react-native';
import { ArrowLeft, Clock, Package, Truck, CheckCircle, XCircle, MessageCircle } from 'lucide-react-native';
import { orderService } from '../services/orderService';

const STATUS_STAGES = [
  { level: 0, label: 'Aguardando Aceite', icon: Clock },
  { level: 1, label: 'Em Preparação', icon: Package },
  { level: 2, label: 'Saiu para Entrega', icon: Truck },
  { level: 3, label: 'Entregue', icon: CheckCircle },
];

export default function OrderTrackingScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error(error);
      // No mobile, se falhar o polling silencioso, não queremos dar Alert toda hora
      if (loading) Alert.alert('Erro', 'Não foi possível carregar o pedido.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text>Pedido não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={{ color: '#f97316', marginTop: 10 }}>Voltar ao Início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStatus = order.status;

  const handleWhatsApp = () => {
    const phoneNumber = '553175363878';
    const message = `Olá! Estou entrando em contato sobre o meu pedido #${order.id}.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'WhatsApp não está instalado ou link inválido.');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Acompanhar Pedido</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.orderIdCard}>
          <Text style={styles.orderIdText}>Pedido #{order.id}</Text>
          <Text style={styles.orderDateText}>{new Date(order.timestamp).toLocaleDateString()}</Text>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Status do Pedido</Text>
          
          {STATUS_STAGES.map((stage) => {
            const isCompleted = currentStatus > stage.level;
            const isCurrent = currentStatus === stage.level;
            const Icon = stage.icon;

            return (
              <View key={stage.level} style={styles.statusRow}>
                <View style={[
                  styles.iconBadge, 
                  isCompleted && styles.iconCompleted, 
                  isCurrent && styles.iconCurrent
                ]}>
                  <Icon size={20} color={isCompleted || isCurrent ? '#fff' : '#ccc'} />
                </View>
                <View style={styles.statusInfo}>
                  <Text style={[
                    styles.statusLabel,
                    isCompleted && styles.textCompleted,
                    isCurrent && styles.textCurrent
                  ]}>
                    {stage.label}
                  </Text>
                  {isCurrent && <Text style={styles.currentBadge}>Ativo agora</Text>}
                </View>
              </View>
            );
          })}

          {order.status === 4 && (
            <View style={styles.statusRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#ef4444' }]}>
                <XCircle size={20} color="#fff" />
              </View>
              <View style={styles.statusInfo}>
                <Text style={[styles.statusLabel, { color: '#ef4444' }]}>Cancelado</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total:</Text>
            <Text style={styles.detailValue}>R$ {order.precoTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pagamento:</Text>
            <Text style={styles.detailValue}>{['Cartão', 'Pix', 'Dinheiro'][order.metodoPagamento]}</Text>
          </View>
          {order.observacoes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Obs:</Text>
              <Text style={[styles.detailValue, { flex: 1, textAlign: 'right' }]} numberOfLines={2}>
                {order.observacoes}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.chatButton}
          onPress={handleWhatsApp}
        >
          <MessageCircle size={20} color="#fff" />
          <Text style={styles.chatButtonText}>Conversar com a Loja</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backButtonText}>Voltar ao Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  orderIdCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  orderIdText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  orderDateText: { fontSize: 14, color: '#666', marginTop: 5 },
  timelineCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconCompleted: { backgroundColor: '#10b981' },
  iconCurrent: { backgroundColor: '#f97316' },
  statusInfo: { flex: 1 },
  statusLabel: { fontSize: 16, color: '#94a3b8', fontWeight: '500' },
  textCompleted: { color: '#10b981' },
  textCurrent: { color: '#f97316', fontWeight: 'bold' },
  currentBadge: { fontSize: 12, color: '#f97316', marginTop: 2 },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontSize: 15, color: '#666' },
  detailValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  chatButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    gap: 10,
    marginBottom: 10,
  },
  chatButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  backButtonText: { color: '#666', fontSize: 16, fontWeight: 'bold' },
});
