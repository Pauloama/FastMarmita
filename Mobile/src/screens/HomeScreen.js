import React, { useState, useEffect, useCallback, useContext } from 'react';
import { 
  View, FlatList, StyleSheet, Text, StatusBar, SafeAreaView, 
  Image, RefreshControl, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { ShoppingBag, LogOut, ShoppingCart, Utensils } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { marmitaService } from '../services/marmitaService';

const ProdutoCard = ({ item, aoSelecionar }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => aoSelecionar(item)}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.imagem} />
      ) : (
        <View style={[styles.imagem, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff3e0' }]}>
          <Utensils size={40} color="#f97316" />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.category}>Marmita</Text>
        <Text style={styles.titulo} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.ingredientesTexto} numberOfLines={2}>
          {item.descricao}
        </Text>
        <View style={styles.footerCard}>
          <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
          <View style={styles.badgeBotao}><Text style={styles.textoBadge}>Ver Detalhes</Text></View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const [marmitas, setMarmitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);

  const fetchMarmitas = async () => {
    try {
      const data = await marmitaService.getAll();
      setMarmitas(data);
    } catch (error) {
      console.error("Erro ao buscar marmitas:", error);
      Alert.alert("Erro", "Não foi possível carregar o cardápio.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarmitas();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMarmitas();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Fast Marmita</Text>
          <Text style={styles.headerSubtitle}>Olá, {user?.nome}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <View>
              <ShoppingCart size={24} color="#333" />
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <LogOut size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={marmitas}
        renderItem={({ item }) => (
          <ProdutoCard item={item} aoSelecionar={() => navigation.navigate('MarmitaDetail', { item })} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listaPaddin}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} color="#f97316" />}
      />

      <View style={styles.footerButtons}>
         <TouchableOpacity 
            style={styles.footerBtn}
            onPress={() => navigation.navigate('Orders')}
         >
            <Text style={styles.footerBtnText}>Meus Pedidos</Text>
         </TouchableOpacity>
         {user?.isAdmin && (
           <TouchableOpacity 
              style={[styles.footerBtn, { backgroundColor: '#1e293b' }]}
              onPress={() => navigation.navigate('AdminDashboard')}
           >
              <Text style={styles.footerBtnText}>Painel Admin</Text>
           </TouchableOpacity>
         )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    padding: 20, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#f97316' },
  headerSubtitle: { fontSize: 14, color: '#666' },
  listaPaddin: { paddingBottom: 100 },
  card: { 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    marginHorizontal: 16, 
    marginTop: 12, 
    borderRadius: 12, 
    overflow: 'hidden', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagem: { width: 110, height: 110, backgroundColor: '#EEE' },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  category: { fontSize: 10, fontWeight: '800', color: '#f97316', textTransform: 'uppercase' },
  titulo: { fontSize: 15, fontWeight: '600', color: '#333' },
  ingredientesTexto: { fontSize: 12, color: '#777', marginVertical: 2 },
  footerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  preco: { fontSize: 14, fontWeight: 'bold', color: '#28A745' },
  badgeBotao: { backgroundColor: '#f97316', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  textoBadge: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  footerButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  footerBtn: {
    flex: 1,
    backgroundColor: '#f97316',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  footerBtnText: { color: '#fff', fontWeight: 'bold' }
});
