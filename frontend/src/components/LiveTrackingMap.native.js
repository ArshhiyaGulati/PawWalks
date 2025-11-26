import React from 'react';
import MapView, { Marker } from 'react-native-maps';

const LiveTrackingMap = ({ location }) => (
  <MapView
    style={{ flex: 1 }}
    region={{
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
  >
    <Marker
      coordinate={{ latitude: location.lat, longitude: location.lng }}
      title="Walker"
    />
  </MapView>
);

export default LiveTrackingMap;

