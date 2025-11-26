import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { request } from '../../api/client';

const WalkerRequestsScreen = () => {
  const { token } = useAuth();
  const [walks, setWalks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadWalks = async () => {
    try {
      const data = await request('/walks/walker', { token });
      setWalks(data.filter((walk) => walk.status === 'requested'));
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (token) loadWalks();
  }, [token]);

  const handleAction = async (walkId, action) => {
    try {
      await request(`/walks/${action}/${walkId}`, { method: 'POST', token });
      Alert.alert('Success', `Walk ${action}ed`);
      loadWalks();
    } catch (err) {
      Alert.alert('Error', 'Unable to update walk');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={walks}
        keyExtractor={(item) => item._id}
        onRefresh={() => {
          setRefreshing(true);
          loadWalks().finally(() => setRefreshing(false));
        }}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.timeSlot}</Text>
            <Text style={styles.meta}>{item.duration} min • {item.address}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.reject]}
                onPress={() => handleAction(item._id, 'reject')}
              >
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.accept]}
                onPress={() => handleAction(item._id, 'accept')}
              >
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No requests.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#777', marginBottom: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  reject: { borderWidth: 1, borderColor: '#ff5a5f' },
  accept: { backgroundColor: '#4caf50' },
  rejectText: { color: '#ff5a5f', fontWeight: '600' },
  acceptText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 40, color: '#aaa' },
});

export default WalkerRequestsScreen;

