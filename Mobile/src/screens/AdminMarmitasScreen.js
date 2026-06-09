import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, 
  ActivityIndicator, Image, Alert, RefreshControl, Modal, TextInput, ScrollView, Platform
} from 'react-native';
import { ArrowLeft, Plus, Pencil, Trash2, X, Utensils, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { marmitaService } from '../services/marmitaService';

export default function AdminMarmitasScreen({ navigation }) {
  const [marmitas, setMarmitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMarmita, setEditingMarmita] = useState(null);

  // Form states
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchMarmitas = async () => {
    try {
      const data = await marmitaService.getAll();
      setMarmitas(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar as marmitas.');
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append('file', blob, filename);
    } else {
      formData.append('file', {
        uri,
        name: filename,
        type,
      });
    }

    const response = await marmitaService.uploadImage(formData);
    return response.imageUrl;
  };

  const handleSave = async () => {
    if (!nome || !preco) {
      Alert.alert('Aviso', 'Preencha os campos obrigatórios.');
      return;
    }

    setUploading(true);
    try {
      let finalImageUrl = imageUrl;

      if (selectedImage) {
        finalImageUrl = await uploadImage(selectedImage);
      }

      const data = {
        nome,
        descricao,
        preco: parseFloat(preco),
        imageUrl: finalImageUrl || ''
      };

      if (editingMarmita) {
        await marmitaService.update(editingMarmita.id, data);
      } else {
        await marmitaService.create(data);
      }
      setModalVisible(false);
      fetchMarmitas();
      resetForm();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar marmita.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir esta marmita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await marmitaService.delete(id);
              fetchMarmitas();
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Erro ao excluir marmita.');
            }
          }
        }
      ]
    );
  };

  const openModal = (marmita = null) => {
    if (marmita) {
      setEditingMarmita(marmita);
      setNome(marmita.nome);
      setDescricao(marmita.descricao);
      setPreco(marmita.preco.toString());
      setImageUrl(marmita.imageUrl);
      setSelectedImage(null);
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingMarmita(null);
    setNome('');
    setDescricao('');
    setPreco('');
    setImageUrl('');
    setSelectedImage(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff3e0' }]}>
          <Utensils size={24} color="#f97316" />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openModal(item)} style={styles.actionBtn}>
          <Pencil size={20} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Marmitas</Text>
        <TouchableOpacity onPress={() => openModal()}>
          <Plus size={24} color="#f97316" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={marmitas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMarmita ? 'Editar Marmita' : 'Nova Marmita'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.label}>Nome*</Text>
              <TextInput value={nome} onChangeText={setNome} style={styles.input} placeholder="Ex: Marmita de Frango" />
              
              <Text style={styles.label}>Descrição</Text>
              <TextInput 
                value={descricao} 
                onChangeText={setDescricao} 
                style={[styles.input, { height: 80 }]} 
                multiline 
                placeholder="Ex: Frango grelhado, arroz, feijão..." 
              />
              
              <Text style={styles.label}>Preço*</Text>
              <TextInput 
                value={preco} 
                onChangeText={setPreco} 
                style={styles.input} 
                keyboardType="numeric" 
                placeholder="Ex: 25.90" 
              />
              
              <Text style={styles.label}>Imagem da Marmita</Text>
              <View style={styles.imagePickerContainer}>
                {(selectedImage || imageUrl) ? (
                  <Image 
                    source={{ uri: selectedImage || imageUrl }} 
                    style={styles.formImagePreview} 
                  />
                ) : (
                  <View style={styles.placeholderPreview}>
                    <Utensils size={40} color="#cbd5e1" />
                  </View>
                )}
                <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
                  <ImageIcon size={20} color="#fff" />
                  <Text style={styles.pickBtnText}>Selecionar Foto</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.saveBtn, uploading && styles.saveBtnDisabled]} 
                onPress={handleSave}
                disabled={uploading}
              >
                {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Salvar</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
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
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  image: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#eee' },
  info: { flex: 1, marginLeft: 12 },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  preco: { fontSize: 14, color: '#10b981', fontWeight: '600', marginTop: 2 },
  actions: { flexDirection: 'row' },
  actionBtn: { padding: 8, marginLeft: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  imagePickerContainer: { alignItems: 'center', marginBottom: 20, gap: 15 },
  formImagePreview: { width: '100%', height: 180, borderRadius: 12, backgroundColor: '#f1f5f9' },
  placeholderPreview: { width: '100%', height: 180, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  pickBtn: { backgroundColor: '#64748b', flexDirection: 'row', padding: 12, borderRadius: 8, alignItems: 'center', gap: 8 },
  pickBtnText: { color: '#fff', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#f97316', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
