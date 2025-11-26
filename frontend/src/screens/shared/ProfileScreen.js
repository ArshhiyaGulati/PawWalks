import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.meta}>{user?.email}</Text>
      <Text style={styles.meta}>{user?.phone}</Text>
      <Text style={styles.role}>{user?.role?.toUpperCase()}</Text>
      <TouchableOpacity style={styles.primary} onPress={logout}>
        <Text style={styles.primaryText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 8 },
  name: { fontSize: 24, fontWeight: '700' },
  meta: { color: '#555' },
  role: {
    marginTop: 12,
    color: '#ff5a00',
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  primary: {
    marginTop: 'auto',
    backgroundColor: '#ff914d',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen;

