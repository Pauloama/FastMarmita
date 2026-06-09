import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react-native';
import { CartContext } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, getCartTotal } = useContext(CartContext);

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityBtn} 
            onPress={() => decreaseQuantity(item.id)}
          >
            <Minus size={16} color="#333" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityBtn} 
            onPress={() => addToCart(item)}
            disabled={item.quantity >= 10}
          >
            <Plus size={16} color={item.quantity >= 10 ? "#ccc" : "#333"} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.removeBtn} 
        onPress={() => removeFromCart(item.id)}
      >
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Carrinho</Text>
        <View style={{ width: 24 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={64} color="#ccc" />
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
          <TouchableOpacity 
            style={styles.startShoppingBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.startShoppingText}>Começar a Comprar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>R$ {getCartTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutBtnText}>Finalizar Pedido</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  listContent: { padding: 20 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#eee' },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemPrice: { fontSize: 14, color: '#28A745', fontWeight: 'bold', marginTop: 4 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 15,
  },
  quantityBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 4,
  },
  quantityText: { fontSize: 16, fontWeight: 'bold' },
  removeBtn: { padding: 10 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: { fontSize: 18, color: '#666' },
  totalValue: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  checkoutBtn: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: { fontSize: 18, color: '#999', marginTop: 20 },
  startShoppingBtn: {
    marginTop: 30,
    backgroundColor: '#f97316',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startShoppingText: { color: '#fff', fontWeight: 'bold' },
});
