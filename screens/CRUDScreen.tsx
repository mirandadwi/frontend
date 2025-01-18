import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axiosInstance from '../utils/axiosInstance';

interface Matkul {
  _id: string;
  name: string;
  hari: string;
  jam: string;
}

const CRUDScreen = ({ navigation }: { navigation: any }) => {
  const [items, setItems] = useState<Matkul[]>([]);
  const [name, setName] = useState('');
  const [hari, setHari] = useState('');
  const [jam, setJam] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchMatkuls = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/matkuls');
      setItems(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch matkuls.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateMatkul = async () => {
    if (!name || !hari || !jam) {
      Alert.alert('Validation', 'Name, Hari, and Jam are required.');
      return;
    }

    try {
      if (editMode && editingId) {
        await axiosInstance.put(`/matkuls/${editingId}`, { name, hari, jam });
        Alert.alert('Success', 'Matkul updated successfully!');
      } else {
        const response = await axiosInstance.post('/matkuls', { name, hari, jam });
        Alert.alert('Success', 'Matkul added successfully!');
        setItems((prevItems) => [...prevItems, response.data]);
      }
      resetForm();
      fetchMatkuls();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to save Matkul.');
    }
  };

  const handleDeleteMatkul = async (id: string) => {
    try {
      await axiosInstance.delete(`/matkuls/${id}`);
      Alert.alert('Success', 'Matkul deleted successfully!');
      fetchMatkuls();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to delete Matkul.');
    }
  };

  const handleEditMatkul = (item: Matkul) => {
    setName(item.name);
    setHari(item.hari);
    setJam(item.jam);
    setEditMode(true);
    setEditingId(item._id);
  };

  const resetForm = () => {
    setName('');
    setHari('');
    setJam('');
    setEditMode(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchMatkuls();
  }, []);

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}>Mata Kuliah</Text>
      <Text style={styles.tableHeaderText}>Hari</Text>
      <Text style={styles.tableHeaderText}>Jam</Text>
      <Text style={styles.tableHeaderText}>Actions</Text>
    </View>
  );

  const renderTableRow = ({ item }: { item: Matkul }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableRowText}>{item.name}</Text>
      <Text style={styles.tableRowText}>{item.hari}</Text>
      <Text style={styles.tableRowText}>{item.jam}</Text>
      <View style={styles.actionButtons}>
        <Pressable style={styles.iconButton} onPress={() => handleEditMatkul(item)}>
          <AntDesign name="edit" size={20} color="#C3B091" />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={() => handleDeleteMatkul(item._id)}>
          <AntDesign name="delete" size={20} color="#FF6347" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your Schedule</Text>
      <Text style={styles.subtitle}>{editMode ? 'Edit the selected item' : 'Add new items or view existing ones'}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mata Kuliah"
          placeholderTextColor="#5C5346"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Hari"
          placeholderTextColor="#5C5346"
          value={hari}
          onChangeText={setHari}
        />
        <TextInput
          style={styles.input}
          placeholder="Jam"
          placeholderTextColor="#5C5346"
          value={jam}
          onChangeText={setJam}
        />
      </View>

      <Pressable style={styles.addButton} onPress={handleAddOrUpdateMatkul}>
        <Text style={styles.addButtonText}>{editMode ? 'Update Item' : 'Add Item'}</Text>
      </Pressable>

      <FlatList
        ListHeaderComponent={renderTableHeader}
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderTableRow}
        contentContainerStyle={styles.tableContainer}
        refreshing={loading}
        onRefresh={fetchMatkuls}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFE4F2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop: 40,
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFB3D9',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#C27BA0',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#FFB3D9',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#5C5346',
  },
  addButton: {
    backgroundColor: '#FFB3D9',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableContainer: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3D1E6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5C5346',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableRowText: {
    fontSize: 14,
    color: '#8B7E74',
    flex: 1,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    padding: 5,
  },
});

export default CRUDScreen;
