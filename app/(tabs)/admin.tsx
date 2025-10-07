import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Card } from '@/components/Card';
import { Shield, Users, Bell, Database, Plus, PencilLine, Trash2 } from 'lucide-react-native';

interface ToolItem { id: string; title: string; subtitle: string; icon: React.ReactNode; color: string }
interface UserRow { id: string; name: string; role: 'Student' | 'Teacher' | 'Parent'; }

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState<UserRow[]>([
    { id: 'u1', name: 'Alex Johnson', role: 'Student' },
    { id: 'u2', name: 'Dr. Sarah Mitchell', role: 'Teacher' },
    { id: 'u3', name: 'Michael Johnson', role: 'Parent' },
  ]);

  const tools = useMemo<ToolItem[]>(() => ([
    { id: 't1', title: 'Manage Users', subtitle: 'Add, edit, or remove users', icon: <Users size={20} color={Colors.primary} />, color: Colors.primary },
    { id: 't2', title: 'Announcements', subtitle: 'Send school-wide notices', icon: <Bell size={20} color={Colors.secondary} />, color: Colors.secondary },
    { id: 't3', title: 'Data Backup', subtitle: 'Export/import JSON', icon: <Database size={20} color={Colors.accent} />, color: Colors.accent },
  ]), []);

  const addUser = useCallback(() => {
    const id = `u${Date.now()}`;
    const newUser: UserRow = { id, name: 'New User', role: 'Student' };
    setUsers((prev) => [newUser, ...prev]);
  }, []);

  const editUser = useCallback((id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, name: u.name + ' *' } : u)));
  }, []);

  const deleteUser = useCallback((id: string) => {
    Alert.alert('Delete user', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setUsers((prev) => prev.filter((u) => u.id !== id)) },
    ]);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]} testID="admin-screen">
      <View style={styles.headerRow}>
        <Shield size={18} color={Colors.textSecondary} />
        <Text style={styles.title}>Admin Tools</Text>
        <TouchableOpacity style={styles.addBtn} onPress={addUser} testID="admin-add-user">
          <Plus size={16} color="#fff" />
          <Text style={styles.addBtnText}>Add user</Text>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 12 }}>
        {tools.map((t) => (
          <Card key={t.id}>
            <View style={styles.toolRow}>
              <View style={[styles.iconDot, { backgroundColor: t.color + '20' }]}>
                {t.icon}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toolTitle}>{t.title}</Text>
                <Text style={styles.toolSub}>{t.subtitle}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Card style={{ marginTop: 16, flex: 1 }}>
        <Text style={styles.sectionTitle}>Users</Text>
        <FlatList
          data={users}
          keyExtractor={(i) => i.id}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <View style={styles.userRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userRole}>{item.role}</Text>
              </View>
              <TouchableOpacity onPress={() => editUser(item.id)} accessibilityRole="button" testID={`edit-${item.id}`}>
                <PencilLine size={18} color={Colors.info} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteUser(item.id)} accessibilityRole="button" style={{ marginLeft: 12 }} testID={`delete-${item.id}`}>
                <Trash2 size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          )}
          style={{ marginTop: 8 }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16, gap: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '700' as const, color: Colors.text, flex: 1 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' as const },
  toolRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconDot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  toolTitle: { fontSize: 16, fontWeight: '700' as const, color: Colors.text },
  toolSub: { fontSize: 13, color: Colors.textSecondary },
  sectionTitle: { fontSize: 16, fontWeight: '700' as const, color: Colors.text },
  sep: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  userName: { fontSize: 14, fontWeight: '600' as const, color: Colors.text },
  userRole: { fontSize: 12, color: Colors.textSecondary },
});
