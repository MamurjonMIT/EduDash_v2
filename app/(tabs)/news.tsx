import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, AlertCircle, Calendar, BookOpen, Megaphone, RefreshCw } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/Card';
import { GradientHeader } from '@/components/GradientHeader';
import Colors from '@/constants/colors';
import { Announcement } from '@/types';
import * as Notifications from 'expo-notifications';

export default function NewsScreen() {
  const { announcements, markAnnouncementAsRead, unreadAnnouncementsCount, lastSyncAt, isSyncing, syncNow } = useApp();
  const insets = useSafeAreaInsets();

  const getCategoryIcon = (category: Announcement['category']) => {
    switch (category) {
      case 'academic':
        return <BookOpen size={20} color={Colors.primary} />;
      case 'event':
        return <Calendar size={20} color={Colors.secondary} />;
      case 'urgent':
        return <AlertCircle size={20} color={Colors.error} />;
      default:
        return <Megaphone size={20} color={Colors.textSecondary} />;
    }
  };

  const getCategoryColor = (category: Announcement['category']) => {
    switch (category) {
      case 'academic':
        return Colors.primary;
      case 'event':
        return Colors.secondary;
      case 'urgent':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getPriorityBadge = (priority: Announcement['priority']) => {
    if (priority === 'high') {
      return (
        <View style={[styles.priorityBadge, { backgroundColor: Colors.error + '20' }]}>
          <Text style={[styles.priorityText, { color: Colors.error }]}>High Priority</Text>
        </View>
      );
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleAnnouncementPress = (announcement: Announcement) => {
    if (!announcement.read) {
      markAnnouncementAsRead(announcement.id);
    }
  };

  const enablePush = useCallback(async () => {
    try {
      const settings = await Notifications.getPermissionsAsync();
      let granted = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
      if (!granted) {
        const req = await Notifications.requestPermissionsAsync();
        granted = req.granted || req.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
      }
      if (Platform.OS === 'web') {
        Alert.alert('Push on Web', 'Push notifications are limited on web preview. You can still test in Expo Go on a device.');
      }
      if (granted) {
        await Notifications.setNotificationChannelAsync?.('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
        Alert.alert('Enabled', 'Push notifications enabled');
      } else {
        Alert.alert('Permission denied', 'Enable notifications in settings');
      }
    } catch (e) {
      console.error('Push setup failed', e);
      Alert.alert('Error', 'Failed to enable notifications.');
    }
  }, []);

  const renderAnnouncementItem = ({ item }: { item: Announcement }) => {
    const categoryColor = getCategoryColor(item.category);
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleAnnouncementPress(item)}
      >
        <Card style={[
          styles.announcementCard,
          !item.read && styles.unreadCard
        ]}>
          <View style={styles.cardHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
              {getCategoryIcon(item.category)}
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </View>

          <Text style={[
            styles.announcementTitle,
            !item.read && styles.unreadTitle
          ]}>
            {item.title}
          </Text>

          {getPriorityBadge(item.priority)}

          <Text style={styles.announcementContent} numberOfLines={3}>
            {item.content}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 0 }]}>
      <GradientHeader 
        title="Announcements" 
        subtitle={unreadAnnouncementsCount > 0 ? `${unreadAnnouncementsCount} unread` : 'All caught up!'} 
      />
      
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={enablePush} style={styles.toolbarBtn} testID="enable-push">
          <Bell size={16} color="#fff" />
          <Text style={styles.toolbarText}>Enable Push</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={syncNow} style={[styles.toolbarBtn, { backgroundColor: Colors.secondary }]} disabled={isSyncing} testID="sync-now">
          <RefreshCw size={16} color="#fff" />
          <Text style={styles.toolbarText}>{isSyncing ? 'Syncing...' : 'Sync Now'}</Text>
        </TouchableOpacity>
        <Text style={styles.syncMeta}>{lastSyncAt ? `Last sync: ${new Date(lastSyncAt).toLocaleString()}` : 'Never synced'}</Text>
      </View>
      
      <View style={styles.content}>
        {unreadAnnouncementsCount > 0 && (
          <Card style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <View style={styles.summaryIcon}>
                <Bell size={24} color={Colors.primary} />
              </View>
              <View style={styles.summaryText}>
                <Text style={styles.summaryTitle}>
                  {unreadAnnouncementsCount} New {unreadAnnouncementsCount === 1 ? 'Announcement' : 'Announcements'}
                </Text>
                <Text style={styles.summarySubtitle}>
                  Stay updated with the latest school news
                </Text>
              </View>
            </View>
          </Card>
        )}

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>All Announcements</Text>
          <Text style={styles.listCount}>{announcements.length} total</Text>
        </View>

        <FlatList
          data={announcements}
          renderItem={renderAnnouncementItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.announcementsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingTop: 12 },
  toolbarBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  toolbarText: { color: '#fff', fontSize: 12, fontWeight: '700' as const },
  syncMeta: { marginLeft: 'auto', fontSize: 12, color: Colors.textSecondary },
  summaryCard: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: Colors.primaryLight + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  summarySubtitle: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  listCount: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  announcementsList: {
    paddingBottom: 20,
  },
  announcementCard: {
    marginBottom: 12,
  },
  unreadCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  unreadTitle: {
    fontWeight: '700' as const,
    color: Colors.text,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
  },
  announcementContent: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  author: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  date: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: Colors.textTertiary,
  },
});
