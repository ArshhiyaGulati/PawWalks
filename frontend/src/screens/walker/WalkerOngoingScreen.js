import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as Location from 'expo-location';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { request } from '../../api/client';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace('http', 'ws') || 'http://localhost:5000';

const WalkerOngoingScreen = () => {
  const { token } = useAuth();
  const [walk, setWalk] = useState(null);
  const [summary, setSummary] = useState('');
  const locationSub = useRef(null);
  const socketRef = useRef(null);

  const loadWalk = async () => {
    const data = await request('/walks/walker', { token });
    const active = data.find((item) => ['accepted', 'ongoing'].includes(item.status));
    setWalk(active || null);
  };

  useEffect(() => {
    if (token) loadWalk();
    return () => stopTracking();
  }, [token]);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow location access.');
      return;
    }
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current.emit('join-walk', walk._id);
    locationSub.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      (loc) => {
        const coords = {
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
          timestamp: new Date().toISOString(),
        };
        socketRef.current.emit('location-update', { walkId: walk._id, location: coords });
      }
    );
  };

  const stopTracking = async () => {
    if (locationSub.current) {
      locationSub.current.remove();
      locationSub.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const handleStart = async () => {
    try {
      await request(`/walks/start/${walk._id}`, { method: 'POST', token });
      await startTracking();
      loadWalk();
    } catch (err) {
      Alert.alert('Error', 'Unable to start walk');
    }
  };

  const handleEnd = async () => {
    try {
      await request(`/walks/end/${walk._id}`, {
        method: 'POST',
        token,
        body: { summary },
      });
      setSummary('');
      await stopTracking();
      loadWalk();
    } catch (err) {
      Alert.alert('Error', 'Unable to end walk');
    }
  };

  if (!walk) {
    return (
      <View style={styles.center}>
        <Text>No walk selected.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{walk.timeSlot}</Text>
      <Text style={styles.meta}>{walk.address}</Text>
      <Text style={styles.meta}>{walk.duration} min</Text>
      <TextInput
        placeholder="Summary after walk"
        style={styles.input}
        value={summary}
        onChangeText={setSummary}
        multiline
      />
      {walk.status === 'accepted' ? (
        <TouchableOpacity style={styles.primary} onPress={handleStart}>
          <Text style={styles.primaryText}>Start walk</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.success} onPress={handleEnd}>
          <Text style={styles.successText}>End walk</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  meta: { color: '#777' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
  },
  primary: {
    backgroundColor: '#ff914d',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  success: {
    backgroundColor: '#4caf50',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  successText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default WalkerOngoingScreen;

