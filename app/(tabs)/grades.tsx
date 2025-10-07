import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { GraduationCap, Award } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/Card';
import { GradientHeader } from '@/components/GradientHeader';
import Colors from '@/constants/colors';
import { Course } from '@/types';

export default function GradesScreen() {
  const { courses, gpaCalculation } = useApp();

  const renderCourseItem = ({ item }: { item: Course }) => (
    <Card style={styles.courseCard}>
      <View style={styles.courseHeader}>
        <View style={[styles.courseColorBar, { backgroundColor: item.color }]} />
        <View style={styles.courseContent}>
          <View style={styles.courseTop}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseName}>{item.name}</Text>
              <Text style={styles.courseCode}>{item.code}</Text>
            </View>
            <View style={[styles.gradeBadge, { backgroundColor: item.color + '20' }]}>
              <Text style={[styles.gradeBadgeText, { color: item.color }]}>
                {item.grade}
              </Text>
            </View>
          </View>
          <View style={styles.courseBottom}>
            <Text style={styles.courseTeacher}>{item.teacher}</Text>
            <Text style={styles.courseCredits}>{item.credits} Credits</Text>
          </View>
          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Numeric Grade</Text>
              <Text style={styles.statValue}>{item.numericGrade.toFixed(1)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Semester</Text>
              <Text style={styles.statValue}>{item.semester}</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <GradientHeader title="Grades" subtitle="Track your academic performance" />
      
      <View style={styles.content}>
        <View style={styles.summarySection}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryIconContainer}>
                <GraduationCap size={28} color={Colors.primary} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Cumulative GPA</Text>
                <Text style={styles.summaryValue}>{gpaCalculation.gpa.toFixed(2)}</Text>
              </View>
              <View style={[styles.letterGradeBadge, { backgroundColor: Colors.primary + '20' }]}>
                <Text style={[styles.letterGradeText, { color: Colors.primary }]}>
                  {gpaCalculation.letterGrade}
                </Text>
              </View>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStatItem}>
                <Award size={16} color={Colors.textSecondary} />
                <Text style={styles.summaryStatText}>
                  {gpaCalculation.totalGradePoints.toFixed(1)} Grade Points
                </Text>
              </View>
              <View style={styles.summaryStatItem}>
                <GraduationCap size={16} color={Colors.textSecondary} />
                <Text style={styles.summaryStatText}>
                  {gpaCalculation.totalCredits} Total Credits
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.coursesHeader}>
          <Text style={styles.coursesTitle}>All Courses</Text>
          <Text style={styles.coursesCount}>{courses.length} courses</Text>
        </View>

        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.coursesList}
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
  summarySection: {
    marginTop: 20,
    marginBottom: 20,
  },
  summaryCard: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  summaryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  letterGradeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  letterGradeText: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  summaryStats: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryStatText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  coursesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  coursesTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  coursesCount: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  coursesList: {
    paddingBottom: 20,
  },
  courseCard: {
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
  },
  courseHeader: {
    flexDirection: 'row',
  },
  courseColorBar: {
    width: 4,
  },
  courseContent: {
    flex: 1,
    padding: 16,
  },
  courseTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  gradeBadgeText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  courseBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  courseTeacher: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  courseCredits: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  courseStats: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 12,
  },
});
