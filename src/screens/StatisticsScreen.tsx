import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useCallRecorder } from '../hooks/useCallRecorder';

const StatisticsScreen: React.FC = () => {
  const { recordings, loadRecordings, getStatistics } = useCallRecorder();
  const [stats, setStats] = useState<any>(null);
  const [topContacts, setTopContacts] = useState<any[]>([]);

  useEffect(() => {
    loadRecordings();
  }, []);

  useEffect(() => {
    const statistics = getStatistics();\n    setStats(statistics);

    // حساب أكثر الأشخاص اتصالاً
    const contactMap: Record<string, number> = {};
    recordings.forEach((r) => {
      contactMap[r.phoneNumber] = (contactMap[r.phoneNumber] || 0) + 1;
    });

    const sorted = Object.entries(contactMap)
      .map(([phone, count]) => ({ phone, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setTopContacts(sorted);
  }, [recordings]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}س ${minutes}د`;
  };

  return (
    <SafeAreaView style={styles.container}>\n      <ScrollView contentContainerStyle={styles.scrollContent}>\n        {/* Header */}\n        <View style={styles.header}>\n          <Text style={styles.title}>الإحصائيات</Text>\n          <Text style={styles.subtitle}>تحليل استخدامك للتطبيق</Text>\n        </View>\n\n        {/* Main Stats */}\n        <View style={styles.statsGrid}>\n          <View style={styles.statCard}>\n            <Text style={styles.statIcon}>📞</Text>\n            <Text style={styles.statValue}>{stats?.totalRecordings || 0}</Text>\n            <Text style={styles.statLabel}>إجمالي التسجيلات</Text>\n          </View>\n          <View style={styles.statCard}>\n            <Text style={styles.statIcon}>⏱️</Text>\n            <Text style={styles.statValue}>{formatDuration(stats?.totalDuration || 0)}</Text>\n            <Text style={styles.statLabel}>الوقت الإجمالي</Text>\n          </View>\n          <View style={styles.statCard}>\n            <Text style={styles.statIcon}>💾</Text>\n            <Text style={styles.statValue}>{formatBytes(stats?.totalSize || 0)}</Text>\n            <Text style={styles.statLabel}>إجمالي الحجم</Text>\n          </View>\n          <View style={styles.statCard}>\n            <Text style={styles.statIcon}>📊</Text>\n            <Text style={styles.statValue}>\n              {stats?.averageDuration ? Math.floor(stats.averageDuration / 60) : 0}د\n            </Text>\n            <Text style={styles.statLabel}>المتوسط</Text>\n          </View>\n        </View>\n\n        {/* Top Contacts */}\n        {topContacts.length > 0 && (\n          <View style={styles.section}>\n            <Text style={styles.sectionTitle}>أكثر الأشخاص اتصالاً</Text>\n            <View style={styles.contactsList}>\n              {topContacts.map((contact, index) => (\n                <View key={index} style={styles.contactItem}>\n                  <View style={styles.contactRank}>\n                    <Text style={styles.rankNumber}>{index + 1}</Text>\n                  </View>\n                  <View style={styles.contactInfo}>\n                    <Text style={styles.contactPhone}>{contact.phone}</Text>\n                    <Text style={styles.contactCount}>{contact.count} مكالمات</Text>\n                  </View>\n                  <View style={styles.progressBar}>\n                    <View\n                      style={[\n                        styles.progressFill,\n                        {\n                          width: `${(contact.count / topContacts[0].count) * 100}%`,\n                        },\n                      ]}\n                    />\n                  </View>\n                </View>\n              ))}\n            </View>\n          </View>\n        )}\n\n        {/* Quality Distribution */}\n        <View style={styles.section}>\n          <Text style={styles.sectionTitle}>توزيع الجودة</Text>\n          <View style={styles.qualityStats}>\n            {['ultra', 'high', 'medium', 'low'].map((level) => {\n              const count = recordings.filter((r) => r.quality.level === level).length;\n              const percentage = recordings.length > 0 ? (count / recordings.length) * 100 : 0;\n              return (\n                <View key={level} style={styles.qualityRow}>\n                  <Text style={styles.qualityName}>\n                    {level === 'ultra' && 'عالية جداً'}\n                    {level === 'high' && 'عالية'}\n                    {level === 'medium' && 'متوسطة'}\n                    {level === 'low' && 'منخفضة'}\n                  </Text>\n                  <View style={styles.qualityBar}>\n                    <View\n                      style={[\n                        styles.qualityFill,\n                        {\n                          width: `${percentage}%`,\n                          backgroundColor:\n                            level === 'ultra'\n                              ? '#2E7D32'\n                              : level === 'high'\n                              ? '#4CAF50'\n                              : level === 'medium'\n                              ? '#FFC107'\n                              : '#FF9800',\n                        },\n                      ]}\n                    />\n                  </View>\n                  <Text style={styles.qualityPercent}>{Math.round(percentage)}%</Text>\n                </View>\n              );\n            })}\n          </View>\n        </View>\n\n        {/* Last Recording */}\n        {stats?.lastRecording && (\n          <View style={styles.section}>\n            <Text style={styles.sectionTitle}>آخر تسجيل</Text>\n            <View style={styles.lastRecordingCard}>\n              <Text style={styles.lastRecordingDate}>{stats.lastRecording}</Text>\n            </View>\n          </View>\n        )}\n      </ScrollView>\n    </SafeAreaView>\n  );\n};\n\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    backgroundColor: '#F5F5F5',\n  },\n  scrollContent: {\n    paddingHorizontal: 16,\n    paddingVertical: 16,\n  },\n  header: {\n    marginBottom: 24,\n  },\n  title: {\n    fontSize: 28,\n    fontWeight: 'bold',\n    color: '#2E7D32',\n  },\n  subtitle: {\n    fontSize: 14,\n    color: '#999',\n    marginTop: 4,\n  },\n  statsGrid: {\n    flexDirection: 'row',\n    flexWrap: 'wrap',\n    justifyContent: 'space-between',\n    marginBottom: 24,\n    gap: 12,\n  },\n  statCard: {\n    width: '48%',\n    backgroundColor: '#FFFFFF',\n    borderRadius: 12,\n    padding: 16,\n    alignItems: 'center',\n    shadowColor: '#000',\n    shadowOffset: { width: 0, height: 2 },\n    shadowOpacity: 0.1,\n    shadowRadius: 4,\n    elevation: 3,\n  },\n  statIcon: {\n    fontSize: 32,\n    marginBottom: 8,\n  },\n  statValue: {\n    fontSize: 20,\n    fontWeight: 'bold',\n    color: '#2E7D32',\n    marginBottom: 4,\n  },\n  statLabel: {\n    fontSize: 12,\n    color: '#999',\n    textAlign: 'center',\n  },\n  section: {\n    marginBottom: 24,\n  },\n  sectionTitle: {\n    fontSize: 18,\n    fontWeight: '600',\n    color: '#212121',\n    marginBottom: 12,\n  },\n  contactsList: {\n    backgroundColor: '#FFFFFF',\n    borderRadius: 12,\n    padding: 12,\n    overflow: 'hidden',\n  },\n  contactItem: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    paddingVertical: 12,\n    borderBottomWidth: 1,\n    borderBottomColor: '#E0E0E0',\n  },\n  contactRank: {\n    width: 32,\n    height: 32,\n    borderRadius: 16,\n    backgroundColor: '#2E7D32',\n    justifyContent: 'center',\n    alignItems: 'center',\n    marginRight: 12,\n  },\n  rankNumber: {\n    color: '#FFFFFF',\n    fontWeight: 'bold',\n    fontSize: 14,\n  },\n  contactInfo: {\n    flex: 1,\n  },\n  contactPhone: {\n    fontSize: 14,\n    fontWeight: '600',\n    color: '#212121',\n  },\n  contactCount: {\n    fontSize: 12,\n    color: '#999',\n    marginTop: 2,\n  },\n  progressBar: {\n    width: 60,\n    height: 4,\n    backgroundColor: '#E0E0E0',\n    borderRadius: 2,\n    overflow: 'hidden',\n  },\n  progressFill: {\n    height: '100%',\n    backgroundColor: '#2E7D32',\n  },\n  qualityStats: {\n    backgroundColor: '#FFFFFF',\n    borderRadius: 12,\n    padding: 16,\n  },\n  qualityRow: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    marginBottom: 16,\n  },\n  qualityName: {\n    width: 70,\n    fontSize: 12,\n    color: '#212121',\n    fontWeight: '500',\n  },\n  qualityBar: {\n    flex: 1,\n    height: 8,\n    backgroundColor: '#E0E0E0',\n    borderRadius: 4,\n    marginHorizontal: 12,\n    overflow: 'hidden',\n  },\n  qualityFill: {\n    height: '100%',\n  },\n  qualityPercent: {\n    width: 40,\n    textAlign: 'right',\n    fontSize: 12,\n    fontWeight: '600',\n    color: '#2E7D32',\n  },\n  lastRecordingCard: {\n    backgroundColor: '#FFFFFF',\n    borderRadius: 12,\n    padding: 16,\n    alignItems: 'center',\n  },\n  lastRecordingDate: {\n    fontSize: 16,\n    fontWeight: '600',\n    color: '#2E7D32',\n  },\n});\n\nexport default StatisticsScreen;
