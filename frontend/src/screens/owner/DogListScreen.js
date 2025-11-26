import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';

const DogListScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { data: dogs = [] } = useFetch('/dogs', [user?.id], {
    initialValue: [],
    skip: !user,
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={dogs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.breed} • {item.size}
            </Text>
            {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No dogs yet. Add your first pup profile!
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <TouchableOpacity
        style={styles.primary}
        onPress={() => navigation.navigate('AddDog')}
      >
        <Text style={styles.primaryText}>Add dog</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: '600' },
  meta: { color: '#777', marginBottom: 4 },
  notes: { color: '#555' },
  empty: { textAlign: 'center', color: '#999', marginTop: 48 },
  primary: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#ff914d',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default DogListScreen;

