import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import axiosInstance from '../utils/axiosInstance';

interface Matkul {
  _id: string;
  name: string;
  hari: string;
  jam: string;
}

const HomeScreen = ({ route }: { route: any }) => {
  const [matkuls, setMatkuls] = useState<Matkul[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchMatkuls = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/matkuls');
      setMatkuls(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch matkuls.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axiosInstance.get('/matkuls');
      setMatkuls(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to refresh matkuls.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMatkuls();
  }, [fetchMatkuls]);

  useEffect(() => {
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
    <FlatList
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Mata Kuliah Schedule</Text>
          <Text style={styles.subtitle}>Kelola mata kuliah dan praktikum dengan mudah</Text>
          {renderTableHeader()}
        </>
      }
      data={matkuls}
      keyExtractor={(item) => item._id}
      renderItem={renderTableRow}
      contentContainerStyle={styles.tableContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4F2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: 225,
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFB3D9',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 34,
    color: '#C27BA0',
  },
  tableContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  loader: {
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#8B7E74',
    marginTop: 20,
  },
});

export default HomeScreen;
