import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { ArrowLeft, ChevronRight, Package } from 'lucide-react-native';
import { orderService } from '../services/orderService';

export default function UserOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      // Filtrar e ordenar se necessário
      setOrders(data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error(error);
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

  const getStatusLabel = (status) => {
    const labels = ['Aguardando', 'Preparando', 'Em Entrega', 'Entregue', 'Cancelado'];
    return labels[status] || 'Desconhecido';
  };

  const getStatusColor = (status) => {
    const colors = ['#64748b', '#f97316', '#3b82f6', '#10b981', '#ef4444'];
    return colors[status] || '#666';
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Pedido #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={styles.orderDate}>{new Date(item.timestamp).toLocaleDateString()}</Text>
        <Text style={styles.orderTotal}>R$ {item.precoTotal.toFixed(2)}</Text>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.itemsCount}>
          {item.items?.length || 0} {item.items?.length === 1 ? 'item' : 'itens'}
        </Text>
        <View style={styles.detailsLink}>
          <Text style={styles.detailsLinkText}>Ver detalhes</Text>
          <ChevronRight size={16} color="#f97316" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centered}>
          <Package size={64} color="#ccc" />
          <Text style={styles.emptyText}>Você ainda não fez nenhum pedido.</Text>
          <TouchableOpacity 
            style={styles.menuBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.menuBtnText}>Ir para o Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} color="#f97316" />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
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
  listContent: { padding: 15 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  orderInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  orderDate: { fontSize: 14, color: '#666' },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  orderFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9' 
  },
  itemsCount: { fontSize: 13, color: '#64748b' },
  detailsLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailsLinkText: { fontSize: 13, color: '#f97316', fontWeight: 'bold' },
  emptyText: { fontSize: 16, color: '#999', marginTop: 20, textAlign: 'center' },
  menuBtn: {
    marginTop: 25,
    backgroundColor: '#f97316',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  menuBtnText: { color: '#fff', fontWeight: 'bold' },
});
