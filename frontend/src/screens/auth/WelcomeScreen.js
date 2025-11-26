import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Image source={require('../../../assets/icon.png')} style={styles.logo} />
    <Text style={styles.title}>PawWalks- A Dog Walking App</Text>
    <Text style={styles.subtitle}>
      Connect with trusted walkers and track every step in real time.
    </Text>
    <TouchableOpacity
      style={styles.primary}
      onPress={() => navigation.navigate('Login')}
    >
      <Text style={styles.primaryText}>Log in</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.secondary}
      onPress={() => navigation.navigate('Signup')}
    >
      <Text style={styles.secondaryText}>Create account</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 32,
  },
  primary: {
    backgroundColor: '#ff914d',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
    width: '100%',
    marginBottom: 12,
  },
  primaryText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  secondary: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  secondaryText: { color: '#333', textAlign: 'center', fontSize: 16 },
});

export default WelcomeScreen;

