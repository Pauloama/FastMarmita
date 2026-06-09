import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, Calendar, DollarSign, ShoppingCart as OrderIcon } from 'lucide-react-native';
import { orderService } from '../services/orderService';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
      <Icon size={24} color={color} />
    </View>
    <View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color: color }]}>{value}</Text>
    </View>
  </View>
);

export default function AdminReportsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState({
    daily: null,
    weekly: null,
    monthly: null
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const now = new Date();
      
      // Daily
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
      
      // Weekly (last 7 days)
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      const startOfWeek = lastWeek.toISOString();
      
      // Monthly (this month)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [dailyData, weeklyData, monthlyData] = await Promise.all([
        orderService.getReports(startOfDay, endOfDay),
        orderService.getReports(startOfWeek, now.toISOString()),
        orderService.getReports(startOfMonth, now.toISOString())
      ]);

      setReports({
        daily: dailyData,
        weekly: weeklyData,
        monthly: monthlyData
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os relatórios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatório de Vendas</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Resumo Diário</Text>
          <View style={styles.statsRow}>
            <StatCard 
              title="Vendas" 
              value={`R$ ${reports.daily?.totalSales.toFixed(2)}`} 
              icon={DollarSign} 
              color="#10b981" 
            />
            <StatCard 
              title="Pedidos" 
              value={reports.daily?.orderCount.toString()} 
              icon={OrderIcon} 
              color="#3b82f6" 
            />
          </View>

          <Text style={styles.sectionTitle}>Últimos 7 Dias</Text>
          <View style={styles.statsRow}>
            <StatCard 
              title="Total" 
              value={`R$ ${reports.weekly?.totalSales.toFixed(2)}`} 
              icon={DollarSign} 
              color="#f97316" 
            />
            <StatCard 
              title="Pedidos" 
              value={reports.weekly?.orderCount.toString()} 
              icon={OrderIcon} 
              color="#8b5cf6" 
            />
          </View>

          <Text style={styles.sectionTitle}>Este Mês</Text>
          <View style={styles.statsRow}>
            <StatCard 
              title="Total" 
              value={`R$ ${reports.monthly?.totalSales.toFixed(2)}`} 
              icon={DollarSign} 
              color="#ef4444" 
            />
            <StatCard 
              title="Pedidos" 
              value={reports.monthly?.orderCount.toString()} 
              icon={OrderIcon} 
              color="#64748b" 
            />
          </View>

          <TouchableOpacity style={styles.refreshBtn} onPress={fetchReports}>
            <Text style={styles.refreshBtnText}>Atualizar Dados</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
  content: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 5 },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  statTitle: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  statValue: { fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  refreshBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshBtnText: { color: '#666', fontWeight: 'bold' },
});
