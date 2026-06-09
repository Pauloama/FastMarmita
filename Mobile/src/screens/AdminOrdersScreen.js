import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, 
  ActivityIndicator, RefreshControl, Alert, Modal
} from 'react-native';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { orderService } from '../services/orderService';

const STATUS_OPTIONS = [
  { id: 0, label: 'Aguardando Aceite', color: '#64748b' },
  { id: 1, label: 'Em Preparação', color: '#f97316' },
  { id: 2, label: 'Saiu para Entrega', color: '#3b82f6' },
  { id: 3, label: 'Entregue', color: '#10b981' },
  { id: 4, label: 'Cancelado', color: '#ef4444' },
];

export default function AdminOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os pedidos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus);
      setStatusModalVisible(false);
      fetchOrders();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar status.');
    }
  };

  const getStatusLabel = (statusId) => {
    return STATUS_OPTIONS.find(o => o.id === statusId)?.label || 'Desconhecido';
  };

  const getStatusColor = (statusId) => {
    return STATUS_OPTIONS.find(o => o.id === statusId)?.color || '#666';
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Pedido #{item.id}</Text>
          <Text style={styles.clientName}>{item.usuarioNome}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}
          onPress={() => {
            setSelectedOrder(item);
            setStatusModalVisible(true);
          }}
        >
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
          <ChevronDown size={14} color={getStatusColor(item.status)} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.orderItems}>
        {item.items?.map((p, idx) => (
          <Text key={idx} style={styles.itemText}>
            {p.quantidade}x {p.marmitaNome}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderDate}>{new Date(item.timestamp).toLocaleString()}</Text>
        <Text style={styles.orderTotal}>R$ {item.precoTotal.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Pedidos</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <Modal visible={statusModalVisible} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setStatusModalVisible(false)}
        >
          <View style={styles.statusModal}>
            <Text style={styles.modalTitle}>Alterar Status</Text>
            {STATUS_OPTIONS.map((option) => (
              <TouchableOpacity 
                key={option.id}
                style={styles.statusOption}
                onPress={() => handleUpdateStatus(option.id)}
              >
                <View style={[styles.statusDot, { backgroundColor: option.color }]} />
                <Text style={styles.statusOptionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
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
  list: { padding: 15 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  clientName: { fontSize: 14, color: '#666', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  orderItems: { marginBottom: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 },
  itemText: { fontSize: 14, color: '#444', marginBottom: 2 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  orderDate: { fontSize: 12, color: '#94a3b8' },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#10b981' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  statusModal: { backgroundColor: '#fff', borderRadius: 15, padding: 20, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  statusOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 15 },
  statusOptionLabel: { fontSize: 16, color: '#333' },
});
