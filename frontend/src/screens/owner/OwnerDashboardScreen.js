import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';

const OwnerDashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { data: walksRaw, refetch } = useFetch('/walks/owner', [user?.id], {
    initialValue: [],
    skip: !user,
  });
  const walks = Array.isArray(walksRaw) ? walksRaw : [];

  // Polling: update walks every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const upcoming = useMemo(
    () => walks.filter((walk) => ['requested', 'accepted'].includes(walk.status)),
    [walks]
  );
  const active = useMemo(
    () => walks.find((walk) => walk.status === 'ongoing'),
    [walks]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hi {user?.name?.split(' ')[0]} 👋</Text>
      {active ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active walk</Text>
          <Text style={styles.cardBody}>{active.timeSlot}</Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() =>
              navigation.navigate('LiveTracking', { walkId: active._id })
            }
          >
            <Text style={styles.linkButtonText}>View live location</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No walk in progress</Text>
          <Text style={styles.cardBody}>Book a walker anytime.</Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>Upcoming walks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Walks')}>
            <Text style={styles.linkSmall}>History</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={upcoming}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.walkRow}>
              <Text style={styles.walkTitle}>{item.timeSlot}</Text>
              <Text style={styles.walkMeta}>{item.status}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No upcoming walks yet.</Text>
          }
        />
      </View>

      <TouchableOpacity
        style={styles.primary}
        onPress={() => navigation.navigate('BookWalk')}
      >
        <Text style={styles.primaryText}>Book walk</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },
  heading: { fontSize: 24, fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  cardBody: { color: '#555', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linkSmall: { color: '#ff914d' },
  walkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  walkTitle: { fontWeight: '500' },
  walkMeta: { color: '#777' },
  empty: { color: '#999', paddingVertical: 8 },
  primary: {
    backgroundColor: '#ff914d',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkButton: { marginTop: 8 },
  linkButtonText: { color: '#ff5a00', fontWeight: '600' },
});

export default OwnerDashboardScreen;

