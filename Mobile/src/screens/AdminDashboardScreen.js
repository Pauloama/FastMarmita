import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { ShoppingBag, Package, BarChart3, ArrowLeft, PlusCircle } from 'lucide-react-native';

const AdminOption = ({ icon: Icon, title, subtitle, onPress, color = "#f97316" }) => (
  <TouchableOpacity style={styles.optionCard} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
      <Icon size={24} color={color} />
    </View>
    <View style={styles.optionInfo}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export default function AdminDashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Painel do Administrador</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Gestão</Text>
        
        <AdminOption 
          icon={ShoppingBag} 
          title="Gerenciar Marmitas" 
          subtitle="Cadastrar, editar ou remover marmitas"
          onPress={() => navigation.navigate('AdminMarmitas')}
        />

        <AdminOption 
          icon={Package} 
          title="Gerenciar Pedidos" 
          subtitle="Ver todos os pedidos e atualizar status"
          color="#3b82f6"
          onPress={() => navigation.navigate('AdminOrders')}
        />

        <Text style={styles.sectionTitle}>Relatórios</Text>

        <AdminOption 
          icon={BarChart3} 
          title="Relatório de Vendas" 
          subtitle="Vendas diárias, semanais e mensais"
          color="#10b981"
          onPress={() => navigation.navigate('AdminReports')}
        />
      </ScrollView>
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
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: 15, marginTop: 10 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionInfo: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  optionSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
});
