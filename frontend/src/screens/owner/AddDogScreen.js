import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { request } from '../../api/client';

const AddDogScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: '',
    age: '',
    breed: '',
    size: 'medium',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await request('/dogs', {
        method: 'POST',
        token,
        body: { ...form, age: Number(form.age) || undefined },
      });
      Alert.alert('Success', 'Dog profile created');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Unable to save dog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {['name', 'age', 'breed', 'size', 'notes'].map((field) => (
        <TextInput
          key={field}
          placeholder={field === 'notes' ? 'Notes (optional)' : field.toUpperCase()}
          style={styles.input}
          value={form[field]}
          onChangeText={(text) => onChange(field, text)}
        />
      ))}
      <TouchableOpacity
        style={styles.primary}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.primaryText}>
          {loading ? 'Saving...' : 'Save dog'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
  },
  primary: {
    backgroundColor: '#ff914d',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default AddDogScreen;

