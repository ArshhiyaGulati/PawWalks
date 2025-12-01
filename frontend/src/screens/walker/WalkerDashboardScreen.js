import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import { useFocusEffect } from '@react-navigation/native';

const WalkerDashboardScreen = () => {
  const { user } = useAuth();

  const { data: walksRaw, refetch } = useFetch(
    '/walks/walker',
    [user?.id],
    []
  );

  const walks = Array.isArray(walksRaw) ? walksRaw : [];

  // Refresh whenever screen becomes active
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Polling: update walks every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const accepted = walks.filter((walk) => walk.status === 'accepted');
  const ongoing = walks.filter((walk) => walk.status === 'ongoing');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your queue</Text>

      <Text style={styles.section}>Ongoing</Text>
      <FlatList
        data={ongoing}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.timeSlot}</Text>
            <Text style={styles.meta}>{item.duration} min</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No active walk.</Text>}
      />

      <Text style={styles.section}>Accepted</Text>
      <FlatList
        data={accepted}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.timeSlot}</Text>
            <Text style={styles.meta}>{item.address}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No accepted walks.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  section: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    elevation: 2,
  },
  title: { fontWeight: '600' },
  meta: { color: '#777' },
  empty: { color: '#aaa', marginVertical: 8 },
});

export default WalkerDashboardScreen;
