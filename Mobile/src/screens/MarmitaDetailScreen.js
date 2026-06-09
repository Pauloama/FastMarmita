import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { ArrowLeft, Utensils, ShoppingCart } from 'lucide-react-native';
import { CartContext } from '../context/CartContext';

export default function MarmitaDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(item);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Utensils size={80} color="#f97316" />
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.category}>Marmita Premium</Text>
          <Text style={styles.title}>{item.nome}</Text>
          <Text style={styles.price}>R$ {item.preco.toFixed(2)}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>
            {item.descricao || 'Nenhuma descrição disponível para esta marmita.'}
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Nossas marmitas são preparadas diariamente com ingredientes selecionados para garantir o melhor sabor e qualidade.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <ShoppingCart size={20} color="#fff" />
          <Text style={styles.cartButtonText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 25,
    elevation: 4,
  },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  placeholderContainer: { 
    width: '100%', 
    height: 300, 
    backgroundColor: '#fff3e0', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: { padding: 25 },
  category: { fontSize: 12, fontWeight: 'bold', color: '#f97316', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginTop: 10 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#10b981', marginTop: 5 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  description: { fontSize: 16, color: '#64748b', lineHeight: 24 },
  infoBox: { 
    backgroundColor: '#f8fafc', 
    padding: 15, 
    borderRadius: 12, 
    marginTop: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316'
  },
  infoText: { fontSize: 14, color: '#64748b', fontStyle: 'italic' },
  footer: { 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fff'
  },
  cartButton: {
    backgroundColor: '#f97316',
    flexDirection: 'row',
    padding: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  cartButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
