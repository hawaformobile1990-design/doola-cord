import { useState, useRef, useCallback } from 'react';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RecordingQuality {
  level: 'high' | 'medium' | 'low' | 'ultra';
  sampleRate: number;
  bitRate: number;
  format: 'wav' | 'mp3' | 'aac';
}

export interface Recording {
  id: string;
  uri: string;
  filename: string;
  duration: number;
  date: string;
  phoneNumber: string;
  quality: RecordingQuality;
  size: number;
  transcript?: string;
  summary?: string;
  sentiment?: 'happy' | 'angry' | 'neutral' | 'sad';
}

const QUALITY_PRESETS: Record<string, RecordingQuality> = {
  ultra: {
    level: 'ultra',
    sampleRate: 48000,
    bitRate: 320000,
    format: 'wav',
  },
  high: {
    level: 'high',
    sampleRate: 44100,
    bitRate: 256000,
    format: 'aac',
  },
  medium: {
    level: 'medium',
    sampleRate: 22050,
    bitRate: 128000,
    format: 'mp3',
  },
  low: {
    level: 'low',
    sampleRate: 16000,
    bitRate: 64000,
    format: 'mp3',
  },
};

export const useCallRecorder = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [quality, setQuality] = useState<RecordingQuality>(QUALITY_PRESETS.ultra);
  const recordingRef = useRef<any>(null);

  // تحميل التسجيلات المحفوظة
  const loadRecordings = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('recordings');
      if (stored) {
        setRecordings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recordings:', error);
    }
  }, []);

  // حفظ التسجيلات
  const saveRecordings = useCallback(async (newRecordings: Recording[]) => {
    try {
      await AsyncStorage.setItem('recordings', JSON.stringify(newRecordings));
      setRecordings(newRecordings);
    } catch (error) {
      console.error('Error saving recordings:', error);
    }
  }, []);

  // تغيير جودة التسجيل
  const changeQuality = useCallback((level: 'high' | 'medium' | 'low' | 'ultra') => {
    setQuality(QUALITY_PRESETS[level]);
  }, []);

  // حذف تسجيل
  const deleteRecording = useCallback(async (id: string) => {
    try {
      const recording = recordings.find(r => r.id === id);
      if (recording) {
        await FileSystem.deleteAsync(recording.uri);
        const updated = recordings.filter(r => r.id !== id);
        await saveRecordings(updated);
      }
    } catch (error) {
      console.error('Error deleting recording:', error);
    }
  }, [recordings, saveRecordings]);

  // البحث في التسجيلات
  const searchRecordings = useCallback((query: string) => {
    return recordings.filter(r =>
      r.phoneNumber.includes(query) ||
      r.filename.includes(query) ||
      r.date.includes(query)
    );
  }, [recordings]);

  // الحصول على إحصائيات
  const getStatistics = useCallback(() => {
    const totalDuration = recordings.reduce((sum, r) => sum + r.duration, 0);
    const totalSize = recordings.reduce((sum, r) => sum + r.size, 0);
    const averageDuration = recordings.length > 0 ? totalDuration / recordings.length : 0;

    return {
      totalRecordings: recordings.length,
      totalDuration,
      totalSize,
      averageDuration,
      lastRecording: recordings[0]?.date,
    };
  }, [recordings]);

  return {
    recordings,
    isRecording,
    quality,
    loadRecordings,
    saveRecordings,
    changeQuality,
    deleteRecording,
    searchRecordings,
    getStatistics,
    setIsRecording,
  };
};
