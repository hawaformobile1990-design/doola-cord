import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useCallRecorder } from '../hooks/useCallRecorder';
import Button from '../components/Button';

const HomeScreen: React.FC = () => {
  const { recordings, loadRecordings, getStatistics } = useCallRecorder();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadRecordings();
  }, []);

  useEffect(() => {
    setStats(getStatistics());
  }, [recordings]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Doola Cord</Text>
          <Text style={styles.subtitle}>تسجيل آمن للمكالمات</Text>
        </View>

        {/* Statistics Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.totalRecordings || 0}</Text>
            <Text style={styles.statLabel}>عدد التسجيلات</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {Math.floor((stats?.totalDuration || 0) / 60)}
            </Text>
            <Text style={styles.statLabel}>دقائق</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {((stats?.totalSize || 0) / 1024 / 1024).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>MB</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإجراءات السريعة</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🎙️</Text>
              <Text style={styles.actionLabel}>تسجيل جديد</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionLabel}>التسجيلات</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionLabel}>الإعدادات</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionLabel}>الإحصائيات</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Recordings */}
        {recordings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>آخر التسجيلات</Text>
            {recordings.slice(0, 3).map((recording) => (
              <View key={recording.id} style={styles.recordingItem}>
                <View style={styles.recordingInfo}>
                  <Text style={styles.recordingPhone}>{recording.phoneNumber}</Text>
                  <Text style={styles.recordingDate}>{recording.date}</Text>
                </View>
                <Text style={styles.recordingDuration}>
                  {Math.floor(recording.duration / 60)}:{String(recording.duration % 60).padStart(2, '0')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المميزات الرئيسية</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>تسجيل تلقائي وانتقائي</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>4 مستويات دقة</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>AI ذكي</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>تشفير عسكري</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <Button
          title="ابدأ التسجيل الآن"
          onPress={() => {}}
          variant="primary"
          size="large"
          style={styles.ctaButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '500',
  },
  recordingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordingInfo: {
    flex: 1,
  },
  recordingPhone: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  recordingDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  recordingDuration: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  featureList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 18,
    color: '#2E7D32',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#212121',
  },
  ctaButton: {
    marginBottom: 20,
  },
});

export default HomeScreen;
