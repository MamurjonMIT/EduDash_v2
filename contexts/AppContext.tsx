import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Course, Student, Announcement, GPACalculation } from '@/types';
import { mockStudent, mockCourses, mockAnnouncements } from '@/mocks/data';

const STORAGE_KEYS = {
  STUDENT: '@edudash_student',
  COURSES: '@edudash_courses',
  ANNOUNCEMENTS: '@edudash_announcements',
  LAST_SYNC_AT: '@edudash_last_sync_at',
} as const;

function calculateGPA(courses: Course[]): GPACalculation {
  if (courses.length === 0) {
    return {
      gpa: 0,
      totalCredits: 0,
      totalGradePoints: 0,
      letterGrade: 'F',
    };
  }

  let totalGradePoints = 0;
  let totalCredits = 0;

  courses.forEach((course) => {
    totalGradePoints += course.numericGrade * course.credits;
    totalCredits += course.credits;
  });

  const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  let letterGrade: GPACalculation['letterGrade'] = 'F';
  if (gpa >= 3.85) letterGrade = 'A+';
  else if (gpa >= 3.7) letterGrade = 'A';
  else if (gpa >= 3.5) letterGrade = 'A-';
  else if (gpa >= 3.3) letterGrade = 'B+';
  else if (gpa >= 3.0) letterGrade = 'B';
  else if (gpa >= 2.7) letterGrade = 'B-';
  else if (gpa >= 2.3) letterGrade = 'C+';
  else if (gpa >= 2.0) letterGrade = 'C';
  else if (gpa >= 1.7) letterGrade = 'C-';
  else if (gpa >= 1.3) letterGrade = 'D+';
  else if (gpa >= 1.0) letterGrade = 'D';

  return {
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    totalGradePoints: Math.round(totalGradePoints * 100) / 100,
    letterGrade,
  };
}

export const [AppProvider, useApp] = createContextHook(() => {
  const [student, setStudent] = useState<Student>(mockStudent);
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [storedStudent, storedCourses, storedAnnouncements, storedLastSync] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.STUDENT),
        AsyncStorage.getItem(STORAGE_KEYS.COURSES),
        AsyncStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC_AT),
      ]);

      if (storedStudent) {
        setStudent(JSON.parse(storedStudent));
      }

      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      } else {
        setCourses(mockCourses);
        await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(mockCourses));
      }

      if (storedAnnouncements) {
        setAnnouncements(JSON.parse(storedAnnouncements));
      } else {
        setAnnouncements(mockAnnouncements);
        await AsyncStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(mockAnnouncements));
      }

      if (storedLastSync) {
        setLastSyncAt(storedLastSync);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setCourses(mockCourses);
      setAnnouncements(mockAnnouncements);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateStudent = useCallback(async (updatedStudent: Student) => {
    try {
      setStudent(updatedStudent);
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(updatedStudent));
    } catch (error) {
      console.error('Error updating student:', error);
    }
  }, []);

  const addCourse = useCallback(async (course: Course) => {
    try {
      const updatedCourses = [...courses, course];
      setCourses(updatedCourses);
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses));
      
      const gpaCalc = calculateGPA(updatedCourses);
      const updatedStudent = { ...student, gpa: gpaCalc.gpa };
      await updateStudent(updatedStudent);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  }, [courses, student, updateStudent]);

  const updateCourse = useCallback(async (courseId: string, updatedCourse: Course) => {
    try {
      const updatedCourses = courses.map((c) => (c.id === courseId ? updatedCourse : c));
      setCourses(updatedCourses);
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses));
      
      const gpaCalc = calculateGPA(updatedCourses);
      const updatedStudent = { ...student, gpa: gpaCalc.gpa };
      await updateStudent(updatedStudent);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  }, [courses, student, updateStudent]);

  const deleteCourse = useCallback(async (courseId: string) => {
    try {
      const updatedCourses = courses.filter((c) => c.id !== courseId);
      setCourses(updatedCourses);
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses));
      
      const gpaCalc = calculateGPA(updatedCourses);
      const updatedStudent = { ...student, gpa: gpaCalc.gpa };
      await updateStudent(updatedStudent);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }, [courses, student, updateStudent]);

  const markAnnouncementAsRead = useCallback(async (announcementId: string) => {
    try {
      const updatedAnnouncements = announcements.map((a) =>
        a.id === announcementId ? { ...a, read: true } : a
      );
      setAnnouncements(updatedAnnouncements);
      await AsyncStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(updatedAnnouncements));
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  }, [announcements]);

  const syncNow = useCallback(async () => {
    try {
      setIsSyncing(true);
      await new Promise((res) => setTimeout(res, 800));
      const ts = new Date().toISOString();
      setLastSyncAt(ts);
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC_AT, ts);
      console.log('[sync] Completed at', ts);
    } catch (e) {
      console.error('Sync failed', e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const gpaCalculation = useMemo(() => calculateGPA(courses), [courses]);
  const unreadAnnouncementsCount = useMemo(
    () => announcements.filter((a) => !a.read).length,
    [announcements]
  );

  return useMemo(
    () => ({
      student,
      courses,
      announcements,
      isLoading,
      gpaCalculation,
      unreadAnnouncementsCount,
      lastSyncAt,
      isSyncing,
      updateStudent,
      addCourse,
      updateCourse,
      deleteCourse,
      markAnnouncementAsRead,
      syncNow,
    }),
    [
      student,
      courses,
      announcements,
      isLoading,
      gpaCalculation,
      unreadAnnouncementsCount,
      lastSyncAt,
      isSyncing,
      updateStudent,
      addCourse,
      updateCourse,
      deleteCourse,
      markAnnouncementAsRead,
      syncNow,
    ]
  );
});
