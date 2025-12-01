import React, { useEffect, useState } from 'react';
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

const DURATIONS = [15, 30, 60];

const BookWalkScreen = () => {
  const navigation = useNavigation();
  const { token, user } = useAuth();
  const [dogs, setDogs] = useState([]);
  const [form, setForm] = useState({
    dogIds: [],
    timeSlot: '',
    duration: 30,
    address: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDogs = async () => {
      try {
        const data = await request('/dogs', { token });
        setDogs(data);
      } catch (err) {
        console.warn(err);
      }
    };
    loadDogs();
    const interval = setInterval(loadDogs, 5000);
    return () => clearInterval(interval);
  }, [token, user?.id]);

  const toggleDog = (id) => {
    setForm((prev) => ({
      ...prev,
      dogIds: prev.dogIds.includes(id)
        ? prev.dogIds.filter((dogId) => dogId !== id)
        : [...prev.dogIds, id],
    }));
  };

  const handleSubmit = async () => {
    if (!form.dogIds.length) {
      Alert.alert('Select at least one dog');
      return;
    }
    setLoading(true);
    try {
      await request('/walks/book', {
        method: 'POST',
        token,
        body: form,
      });
      Alert.alert('Success', 'Walk requested');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Unable to request walk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select dogs</Text>
      <View style={styles.tags}>
        {dogs.map((dog) => (
          <TouchableOpacity
            key={dog._id}
            style={[
              styles.tag,
              form.dogIds.includes(dog._id) && styles.tagActive,
            ]}
            onPress={() => toggleDog(dog._id)}
          >
            <Text
              style={[
                styles.tagText,
                form.dogIds.includes(dog._id) && styles.tagTextActive,
              ]}
            >
              {dog.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Preferred time slot"
        style={styles.input}
        value={form.timeSlot}
        onChangeText={(text) => setForm((prev) => ({ ...prev, timeSlot: text }))}
      />
      <Text style={styles.label}>Duration</Text>
      <View style={styles.tags}>
        {DURATIONS.map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.tag,
              form.duration === duration && styles.tagActive,
            ]}
            onPress={() => setForm((prev) => ({ ...prev, duration }))}
          >
            <Text
              style={[
                styles.tagText,
                form.duration === duration && styles.tagTextActive,
              ]}
            >
              {duration} min
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        placeholder="Address"
        style={styles.input}
        value={form.address}
        onChangeText={(text) => setForm((prev) => ({ ...prev, address: text }))}
      />
      <TextInput
        placeholder="Notes"
        style={[styles.input, { height: 100 }]}
        multiline
        value={form.notes}
        onChangeText={(text) => setForm((prev) => ({ ...prev, notes: text }))}
      />
      <TouchableOpacity
        style={styles.primary}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.primaryText}>
          {loading ? 'Booking...' : 'Request walk'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  label: { fontWeight: '600', marginTop: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
  },
  tagActive: {
    backgroundColor: '#ffeadf',
    borderColor: '#ff914d',
  },
  tagText: { color: '#444' },
  tagTextActive: { color: '#ff5a00', fontWeight: '600' },
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
    marginTop: 16,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default BookWalkScreen;

