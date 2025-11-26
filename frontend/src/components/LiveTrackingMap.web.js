import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LiveTrackingMap = ({ location }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Live map is only available on mobile.</Text>
    {location ? (
      <Text style={styles.coords}>
        Lat: {location.lat.toFixed(5)} Lon: {location.lng.toFixed(5)}
      </Text>
    ) : (
      <Text style={styles.coords}>Waiting for walker location...</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  coords: { color: '#555', textAlign: 'center' },
});

export default LiveTrackingMap;

