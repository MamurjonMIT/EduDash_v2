import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GraduationCap, Trophy, TrendingUp, BookOpen } from 'lucide-react-native';
import { Logo } from '@/components/Logo';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/Card';
import { StatCard } from '@/components/StatCard';
import Colors from '@/constants/colors';

export default function DashboardScreen() {
  const { student, courses, gpaCalculation, unreadAnnouncementsCount } = useApp();
  const insets = useSafeAreaInsets();

  const percentile = Math.round(((student.totalStudents - student.rank) / student.totalStudents) * 100);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={[styles.headerContent, { paddingTop: insets.top + 24 }]}>
          <View>
            <Logo width={128} />
            <Text style={styles.greeting} testID="greeting-text">Welcome back,</Text>
            <Text style={styles.studentName} testID="student-name">{student.firstName} {student.lastName}</Text>
            <Text style={styles.studentInfo} testID="student-info">{student.grade} • Section {student.section}</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {student.firstName[0]}{student.lastName[0]}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <StatCard
            label="Current GPA"
            value={gpaCalculation.gpa.toFixed(2)}
            icon={<GraduationCap size={24} color={Colors.primary} />}
            color={Colors.primary}
          />
          <StatCard
            label="Class Rank"
            value={`#${student.rank}`}
            icon={<Trophy size={24} color={Colors.secondary} />}
            color={Colors.secondary}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Total Credits"
            value={gpaCalculation.totalCredits}
            icon={<BookOpen size={24} color={Colors.accent} />}
            color={Colors.accent}
          />
          <StatCard
            label="Percentile"
            value={`${percentile}%`}
            icon={<TrendingUp size={24} color={Colors.info} />}
            color={Colors.info}
          />
        </View>

        <Card style={styles.gpaCard}>
          <View style={styles.gpaCardHeader}>
            <Text style={styles.sectionTitle}>Academic Performance</Text>
            <View style={[styles.gradeBadge, { backgroundColor: Colors.primaryLight + '20' }]}>
              <Text style={[styles.gradeBadgeText, { color: Colors.primary }]}>
                {gpaCalculation.letterGrade}
              </Text>
            </View>
          </View>
          <View style={styles.gpaDetails}>
            <View style={styles.gpaDetailItem}>
              <Text style={styles.gpaDetailLabel}>Grade Points</Text>
              <Text style={styles.gpaDetailValue}>{gpaCalculation.totalGradePoints}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.gpaDetailItem}>
              <Text style={styles.gpaDetailLabel}>Total Courses</Text>
              <Text style={styles.gpaDetailValue}>{courses.length}</Text>
            </View>
          </View>
        </Card>

        {unreadAnnouncementsCount > 0 && (
          <TouchableOpacity activeOpacity={0.7}>
            <Card style={styles.notificationCard}>
              <View style={styles.notificationContent}>
                <View style={styles.notificationIcon}>
                  <Text style={styles.notificationBadge}>{unreadAnnouncementsCount}</Text>
                </View>
                <View style={styles.notificationText}>
                  <Text style={styles.notificationTitle}>New Announcements</Text>
                  <Text style={styles.notificationSubtitle}>
                    You have {unreadAnnouncementsCount} unread {unreadAnnouncementsCount === 1 ? 'announcement' : 'announcements'}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}

        <View style={styles.recentCoursesSection}>
          <Text style={styles.sectionTitle}>Recent Courses</Text>
          {courses.slice(0, 3).map((course) => (
            <Card key={course.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <View style={[styles.courseColorDot, { backgroundColor: course.color }]} />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>{course.name}</Text>
                  <Text style={styles.courseCode}>{course.code} • {course.teacher}</Text>
                </View>
                <View style={[styles.gradeChip, { backgroundColor: course.color + '20' }]}>
                  <Text style={[styles.gradeChipText, { color: course.color }]}>
                    {course.grade}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 4,
  },
  studentInfo: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gpaCard: {
    marginTop: 8,
    marginBottom: 20,
  },
  gpaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gradeBadgeText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  gpaDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpaDetailItem: {
    flex: 1,
  },
  gpaDetailLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  gpaDetailValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  notificationCard: {
    marginBottom: 20,
    backgroundColor: Colors.info + '10',
    borderWidth: 1,
    borderColor: Colors.info + '30',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.info,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  recentCoursesSection: {
    gap: 12,
  },
  courseCard: {
    marginTop: 12,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  courseColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  courseCode: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  gradeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gradeChipText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
});
