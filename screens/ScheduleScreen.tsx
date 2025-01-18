import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import axiosInstance from '../utils/axiosInstance';

interface Matkul {
  _id: string;
  name: string;
  hari: string;
  jam: string;
}

const ScheduleScreen = ({ route }: { route: any }) => {
  const [matkuls, setMatkuls] = useState<Matkul[]>([]);

  useEffect(() => {
    const fetchMatkuls = async () => {
      try {
        const response = await axiosInstance.get('/matkuls');
        setMatkuls(response.data);
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.error || 'Failed to fetch matkuls.');
      }
    };

    fetchMatkuls();

    if (route.params?.newMatkul) {
      setMatkuls((prevMatkuls) => [...prevMatkuls, route.params.newMatkul]);
    }
  }, [route.params?.newMatkul]);

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}>Mata Kuliah</Text>
      <Text style={styles.tableHeaderText}>Hari</Text>
      <Text style={styles.tableHeaderText}>Jam</Text>
    </View>
  );

  const renderTableRow = ({ item }: { item: Matkul }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableRowText}>{item.name}</Text>
      <Text style={styles.tableRowText}>{item.hari}</Text>
      <Text style={styles.tableRowText}>{item.jam}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matkul Schedule</Text>
      <FlatList
        ListHeaderComponent={renderTableHeader}
        data={matkuls}
        keyExtractor={(item) => item._id}
        renderItem={renderTableRow}
        contentContainerStyle={styles.tableContainer}
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#C27BA0',
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
});

export default ScheduleScreen;
