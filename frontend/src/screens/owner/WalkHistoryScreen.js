import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';

const WalkHistoryScreen = () => {
  const { user } = useAuth();
  const { data: walks = [] } = useFetch('/walks/owner', [user?.id], {
    initialValue: [],
    skip: !user,
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={walks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.timeSlot}</Text>
            <Text style={styles.meta}>
              {item.duration} min • {item.status}
            </Text>
            {item.summary ? <Text style={styles.summary}>{item.summary}</Text> : null}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No walks logged yet.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fdfdfd' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  title: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#777', marginBottom: 6 },
  summary: { color: '#444' },
  empty: { color: '#999', textAlign: 'center', marginTop: 48 },
});

export default WalkHistoryScreen;

