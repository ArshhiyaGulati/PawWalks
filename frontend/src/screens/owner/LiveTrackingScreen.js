import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import io from 'socket.io-client';
import LiveTrackingMap from '../../components/LiveTrackingMap';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const LiveTrackingScreen = ({ route }) => {
  const { walkId } = route.params || {};
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.emit('join-walk', walkId);
    socket.on('location-update', (coords) => setLocation(coords));
    return () => socket.disconnect();
  }, [walkId]);

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 12 }}>Waiting for walker...</Text>
      </View>
    );
  }

  return <LiveTrackingMap location={location} />;
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default LiveTrackingScreen;

