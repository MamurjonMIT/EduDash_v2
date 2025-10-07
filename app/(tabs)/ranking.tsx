import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Trophy, TrendingUp, TrendingDown, Minus, Medal, Award } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/Card';
import { GradientHeader } from '@/components/GradientHeader';
import Colors from '@/constants/colors';
import { mockRankings } from '@/mocks/data';
import { RankingEntry } from '@/types';

export default function RankingScreen() {
  const { student } = useApp();

  const percentile = Math.round(((student.totalStudents - student.rank) / student.totalStudents) * 100);

  const getTrendIcon = (trend?: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} color={Colors.success} />;
      case 'down':
        return <TrendingDown size={16} color={Colors.error} />;
      default:
        return <Minus size={16} color={Colors.textTertiary} />;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal size={24} color="#FFD700" />;
    if (rank === 2) return <Medal size={24} color="#C0C0C0" />;
    if (rank === 3) return <Medal size={24} color="#CD7F32" />;
    return null;
  };

  const renderRankingItem = ({ item, index }: { item: RankingEntry; index: number }) => {
    const isCurrentStudent = item.rank === student.rank;
    
    return (
      <Card style={[
        styles.rankingCard,
        isCurrentStudent && styles.currentStudentCard
      ]}>
        <View style={styles.rankingContent}>
          <View style={styles.rankLeft}>
            <View style={[
              styles.rankBadge,
              isCurrentStudent && styles.currentRankBadge
            ]}>
              {getRankIcon(item.rank) || (
                <Text style={[
                  styles.rankNumber,
                  isCurrentStudent && styles.currentRankNumber
                ]}>
                  {item.rank}
                </Text>
              )}
            </View>
            <View style={styles.studentInfo}>
              <Text style={[
                styles.studentName,
                isCurrentStudent && styles.currentStudentName
              ]}>
                {item.studentName}
                {isCurrentStudent && <Text style={styles.youBadge}> (You)</Text>}
              </Text>
              <View style={styles.gpaContainer}>
                <Text style={styles.gpaLabel}>GPA: </Text>
                <Text style={[
                  styles.gpaValue,
                  isCurrentStudent && styles.currentGpaValue
                ]}>
                  {item.gpa.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.trendContainer}>
            {getTrendIcon(item.trend)}
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Class Ranking" subtitle="See where you stand" />
      
      <View style={styles.content}>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Trophy size={24} color={Colors.warning} />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Your Rank</Text>
                <Text style={styles.statValue}>#{student.rank}</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Award size={24} color={Colors.secondary} />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Percentile</Text>
                <Text style={styles.statValue}>{percentile}%</Text>
              </View>
            </View>
          </View>
          <View style={styles.totalStudents}>
            <Text style={styles.totalStudentsText}>
              Out of {student.totalStudents} students
            </Text>
          </View>
        </Card>

        <View style={styles.leaderboardHeader}>
          <Text style={styles.leaderboardTitle}>Leaderboard</Text>
          <Text style={styles.leaderboardSubtitle}>Top performers in your class</Text>
        </View>

        <FlatList
          data={mockRankings}
          renderItem={renderRankingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.rankingList}
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
  statsCard: {
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  totalStudents: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  totalStudentsText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  leaderboardHeader: {
    marginBottom: 16,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  rankingList: {
    paddingBottom: 20,
  },
  rankingCard: {
    marginBottom: 12,
  },
  currentStudentCard: {
    backgroundColor: Colors.primaryLight + '10',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  rankingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rankBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentRankBadge: {
    backgroundColor: Colors.primary,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  currentRankNumber: {
    color: '#ffffff',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  currentStudentName: {
    color: Colors.primary,
    fontWeight: '700' as const,
  },
  youBadge: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  gpaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpaLabel: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  gpaValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  currentGpaValue: {
    color: Colors.primary,
    fontWeight: '700' as const,
  },
  trendContainer: {
    marginLeft: 12,
  },
});
