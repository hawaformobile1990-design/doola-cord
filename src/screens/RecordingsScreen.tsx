import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useCallRecorder, Recording } from '../hooks/useCallRecorder';
import Button from '../components/Button';

const RecordingsScreen: React.FC = () => {
  const { recordings, loadRecordings, deleteRecording, searchRecordings } = useCallRecorder();
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRecordings();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecordings(recordings);
    } else {
      setFilteredRecordings(searchRecordings(searchQuery));
    }
  }, [recordings, searchQuery]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'حذف التسجيل',
      'هل أنت متأكد من حذف هذا التسجيل؟',
      [
        { text: 'إلغاء', onPress: () => {}, style: 'cancel' },
        {
          text: 'حذف',
          onPress: () => deleteRecording(id),
          style: 'destructive',
        },
      ]
    );
  };

  const renderRecordingItem = ({ item }: { item: Recording }) => (
    <View style={styles.recordingCard}>
      <View style={styles.recordingContent}>
        <View style={styles.recordingHeader}>
          <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
          <Text style={styles.duration}>
            {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
          </Text>
        </View>
        <Text style={styles.date}>{item.date}</Text>
        <View style={styles.qualityBadge}>
          <Text style={styles.qualityText}>{item.quality.level}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>التسجيلات</Text>
        <Text style={styles.subtitle}>إدارة جميع تسجيلاتك</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث برقم أو تاريخ..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredRecordings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>لا توجد تسجيلات</Text>
          <Text style={styles.emptySubtext}>ابدأ بتسجيل مكالمة جديدة</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecordings}
          renderItem={renderRecordingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212121',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recordingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordingContent: {
    flex: 1,
  },
  recordingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  duration: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  qualityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qualityText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12,
  },
  deleteIcon: {
    fontSize: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default RecordingsScreen;
