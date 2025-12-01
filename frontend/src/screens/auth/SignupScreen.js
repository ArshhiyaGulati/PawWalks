import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const SignupScreen = () => {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'owner',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      await signup(form);
    } catch (err) {
      console.log('Signup error:', err);
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <TextInput
        placeholder="Full name"
        style={styles.input}
        value={form.name}
        onChangeText={(text) => onChange('name', text)}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={form.email}
        onChangeText={(text) => onChange('email', text)}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Phone"
        style={styles.input}
        value={form.phone}
        onChangeText={(text) => onChange('phone', text)}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={form.password}
        onChangeText={(text) => onChange('password', text)}
        secureTextEntry
      />
      <View style={styles.roleToggle}>
        {['owner', 'walker'].map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.roleButton,
              form.role === role && styles.roleButtonActive,
            ]}
            onPress={() => onChange('role', role)}
          >
            <Text
              style={[
                styles.roleText,
                form.role === role && styles.roleTextActive,
              ]}
            >
              {role === 'owner' ? 'Dog Owner' : 'Dog Walker'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.primary}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.primaryText}>
          {loading ? 'Creating...' : 'Create account'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  roleToggle: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },
  roleButtonActive: {
    backgroundColor: '#ffeadf',
    borderColor: '#ff914d',
  },
  roleText: { textAlign: 'center', color: '#555' },
  roleTextActive: { color: '#ff5a00', fontWeight: 'bold' },
  primary: {
    backgroundColor: '#ff914d',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  error: { color: 'red', marginBottom: 12 },
});

export default SignupScreen;

