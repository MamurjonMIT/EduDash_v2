import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import { Card } from '@/components/Card';
import { useApp } from '@/contexts/AppContext';
import { User, GraduationCap, Users, FilePlus2, Camera, Trash2 } from 'lucide-react-native';

 type Role = 'Student' | 'Teacher' | 'Parent';

 interface AttachmentItem {
  id: string;
  uri: string;
  name: string;
}

export default function ProfilesScreen() {
  const insets = useSafeAreaInsets();
  const { student, updateStudent } = useApp();
  const [role, setRole] = useState<Role>('Student');
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const teacher = useMemo(() => ({
    name: 'Dr. Sarah Mitchell',
    email: 's.mitchell@school.edu',
    subjects: ['Advanced Mathematics', 'Algebra II'],
    officeHours: 'Mon/Wed 2:00–4:00 PM',
  }), []);
  const parent = useMemo(() => ({
    name: 'Michael Johnson',
    relation: 'Father',
    email: 'm.johnson@example.com',
    phone: '+1 (555) 123-9876',
  }), []);

  const onPickAvatar = useCallback(async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Please allow photo library access to pick an avatar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const uri = result.assets[0].uri;
        const updated = { ...student, avatar: uri };
        await updateStudent(updated);
        console.log('[Profiles] Avatar updated:', uri);
      }
    } catch (error) {
      console.error('[Profiles] Error picking avatar:', error);
      Alert.alert('Error', 'Could not update avatar. Please try again.');
    }
  }, [student, updateStudent]);

  const onAddAttachment = useCallback(async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Allow access to add attachments.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const asset = result.assets[0];
        const name = asset.fileName ?? `attachment-${Date.now()}`;
        const item: AttachmentItem = { id: `${Date.now()}`, uri: asset.uri, name };
        setAttachments((prev) => [item, ...prev]);
        console.log('[Profiles] Attachment added:', item);
      }
    } catch (error) {
      console.error('[Profiles] Error adding attachment:', error);
      Alert.alert('Error', 'Could not add attachment.');
    }
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]} testID="profiles-screen">
      <Text style={styles.title}>Profiles</Text>

      <View style={styles.segment}>
        {(['Student','Teacher','Parent'] as Role[]).map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setRole(r)}
            style={[styles.segBtn, role === r && styles.segBtnActive]}
            testID={`role-tab-${r.toLowerCase()}`}
            activeOpacity={0.7}
          >
            {r === 'Student' && <GraduationCap size={16} color={role === r ? '#fff' : Colors.textSecondary} />}
            {r === 'Teacher' && <Users size={16} color={role === r ? '#fff' : Colors.textSecondary} />}
            {r === 'Parent' && <User size={16} color={role === r ? '#fff' : Colors.textSecondary} />}
            <Text style={[styles.segText, role === r && styles.segTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {role === 'Student' && (
        <Card>
          <View style={styles.row}>
            <TouchableOpacity onPress={onPickAvatar} style={styles.avatarWrap} testID="pick-avatar">
              {student.avatar ? (
                <Image source={{ uri: student.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Camera size={24} color={Colors.textSecondary} />
                </View>
              )}
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{student.firstName} {student.lastName}</Text>
              <Text style={styles.meta}>{student.email}</Text>
              <Text style={styles.meta}>ID • {student.studentId}</Text>
              <Text style={styles.meta}>{student.grade} • Section {student.section}</Text>
            </View>
          </View>
        </Card>
      )}

      {role === 'Teacher' && (
        <Card>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.meta}>{teacher.email}</Text>
          <Text style={styles.meta}>Subjects: {teacher.subjects.join(', ')}</Text>
          <Text style={styles.meta}>Office Hours: {teacher.officeHours}</Text>
        </Card>
      )}

      {role === 'Parent' && (
        <Card>
          <Text style={styles.name}>{parent.name}</Text>
          <Text style={styles.meta}>{parent.relation}</Text>
          <Text style={styles.meta}>{parent.email}</Text>
          <Text style={styles.meta}>{parent.phone}</Text>
        </Card>
      )}

      <Card style={styles.attachCard}>
        <View style={styles.attachHeader}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          <TouchableOpacity onPress={onAddAttachment} style={styles.addBtn} testID="add-attachment">
            <FilePlus2 size={18} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 12 }}>
          {attachments.length === 0 ? (
            <Text style={styles.placeholder} testID="attachments-empty">No attachments yet.</Text>
          ) : (
            attachments.map((a) => (
              <View key={a.id} style={styles.attachmentRow}>
                <Image source={{ uri: a.uri }} style={styles.attachmentThumb} />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={styles.attachmentName}>{a.name}</Text>
                  <Text style={styles.attachmentMeta}>{Platform.OS} • Local</Text>
                </View>
                <TouchableOpacity onPress={() => removeAttachment(a.id)} accessibilityRole="button" testID={`remove-${a.id}`}>
                  <Trash2 size={18} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 16 },
  title: { fontSize: 24, fontWeight: '700' as const, color: Colors.text },
  segment: { flexDirection: 'row', gap: 8 },
  segBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.surfaceHover, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: Colors.border },
  segBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primaryDark },
  segText: { fontSize: 14, fontWeight: '600' as const, color: Colors.textSecondary },
  segTextActive: { color: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarWrap: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden', backgroundColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 72, height: 72 },
  avatarPlaceholder: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '700' as const, color: Colors.text },
  meta: { fontSize: 13, fontWeight: '500' as const, color: Colors.textSecondary, marginTop: 2 },
  attachCard: { },
  attachHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700' as const, color: Colors.text },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' as const },
  placeholder: { color: Colors.textSecondary, fontSize: 14 },
  attachmentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  attachmentThumb: { width: 48, height: 48, borderRadius: 8, backgroundColor: Colors.borderLight },
  attachmentName: { fontSize: 14, fontWeight: '600' as const, color: Colors.text },
  attachmentMeta: { fontSize: 12, color: Colors.textTertiary },
});
