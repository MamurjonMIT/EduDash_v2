import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/Card';
import Colors from '@/constants/colors';
import { Globe, Languages, Printer } from 'lucide-react-native';
import * as Print from 'expo-print';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: 'Oʻzbekcha' },
] as const;

export default function TranscriptsScreen() {
  const { student, courses, gpaCalculation } = useApp();
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<typeof languages[number]['code']>('en');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const translate = useCallback((text: string): string => {
    switch (lang) {
      case 'es':
        return text
          .replace('Transcript', 'Certificado Académico')
          .replace('Student', 'Estudiante')
          .replace('Grade', 'Grado')
          .replace('Section', 'Sección')
          .replace('GPA', 'Promedio')
          .replace('Courses', 'Cursos');
      case 'fr':
        return text
          .replace('Transcript', 'Relevé de Notes')
          .replace('Student', 'Élève')
          .replace('Grade', 'Classe')
          .replace('Section', 'Section')
          .replace('GPA', 'Moyenne')
          .replace('Courses', 'Cours');
      case 'ru':
        return text
          .replace('Transcript', 'Академическая выписка')
          .replace('Student', 'Ученик')
          .replace('Grade', 'Класс')
          .replace('Section', 'Секция')
          .replace('GPA', 'Средний балл')
          .replace('Courses', 'Курсы');
      case 'uz':
        return text
          .replace('Transcript', 'Akademik maʼlumotnoma')
          .replace('Student', 'Oʻquvchi')
          .replace('Grade', 'Sinf')
          .replace('Section', 'Boʻlim')
          .replace('GPA', 'Oʻrtacha ball')
          .replace('Courses', 'Fanlar');
      default:
        return text;
    }
  }, [lang]);

  const html = useMemo(() => {
    const base = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #0f172a; }
            .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .title { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { text-align: left; padding: 8px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
            th { background: #f8fafc; font-weight: 700; }
            .gpa { margin-top: 12px; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="title">Transcript</div>
          <div class="card">
            <div class="row"><strong>Student</strong><span>${student.firstName} ${student.lastName}</span></div>
            <div class="row"><strong>Grade</strong><span>${student.grade}</span></div>
            <div class="row"><strong>Section</strong><span>${student.section}</span></div>
            <div class="row"><strong>Student ID</strong><span>${student.studentId}</span></div>
          </div>
          <div class="card" style="margin-top:12px;">
            <div><strong>Courses</strong></div>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Teacher</th>
                  <th>Credits</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                ${courses
                  .map(
                    (c) => `
                  <tr>
                    <td>${c.code}</td>
                    <td>${c.name}</td>
                    <td>${c.teacher}</td>
                    <td>${c.credits}</td>
                    <td>${c.grade}</td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
            <div class="gpa">GPA: ${gpaCalculation.gpa.toFixed(2)} (${gpaCalculation.letterGrade})</div>
          </div>
        </body>
      </html>
    `;

    return translate(base);
  }, [courses, gpaCalculation.gpa, gpaCalculation.letterGrade, student.firstName, student.lastName, student.grade, student.section, student.studentId, translate]);

  const onExportPDF = useCallback(async () => {
    try {
      setIsPrinting(true);
      if (Platform.OS === 'web') {
        const w = window.open('', '_blank');
        if (w) {
          w.document.open();
          w.document.write(html);
          w.document.close();
          w.focus();
          w.print();
        }
        setIsPrinting(false);
        return;
      }
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      Alert.alert('Transcript ready', 'PDF created successfully');
      console.log('PDF file:', uri);
      setIsPrinting(false);
    } catch (e) {
      console.error('PDF export failed', e);
      setIsPrinting(false);
      Alert.alert('Error', 'Failed to export transcript. Please try again.');
    }
  }, [html]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 0 }]} testID="transcripts-screen">
      <Card style={{ marginBottom: 12 }}>
        <View style={styles.row}>
          <View style={styles.langRow}>
            <Globe size={18} color={Colors.primary} />
            <Text style={styles.title}>Transcripts</Text>
          </View>
          <TouchableOpacity onPress={onExportPDF} disabled={isPrinting} style={styles.exportBtn} testID="export-pdf">
            <Printer size={16} color="#fff" />
            <Text style={styles.exportText}>{isPrinting ? 'Exporting...' : 'Export PDF'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.langChips}>
          {languages.map((l) => (
            <TouchableOpacity
              key={l.code}
              onPress={() => setLang(l.code)}
              style={[styles.langChip, lang === l.code && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
              testID={`lang-${l.code}`}
            >
              <Languages size={14} color={lang === l.code ? '#fff' : Colors.primary} />
              <Text style={[styles.langText, { color: lang === l.code ? '#fff' : Colors.primary }]}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Preview</Text>
        <FlatList
          data={courses}
          keyExtractor={(c) => c.id}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListHeaderComponent={() => (
            <View style={styles.previewHeader}>
              <Text style={styles.studentName}>{student.firstName} {student.lastName}</Text>
              <Text style={styles.studentMeta}>{student.grade} • Section {student.section} • ID {student.studentId}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.courseRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.courseName}>{item.name}</Text>
                <Text style={styles.courseMeta}>{item.code} • {item.teacher}</Text>
              </View>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeText}>{item.grade}</Text>
              </View>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.gpaText}>GPA: {gpaCalculation.gpa.toFixed(2)} ({gpaCalculation.letterGrade})</Text>
            </View>
          )}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '700' as const, color: Colors.text, marginLeft: 8 },
  exportBtn: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  exportText: { color: '#fff', fontSize: 13, fontWeight: '700' as const },
  langRow: { flexDirection: 'row', alignItems: 'center' },
  langChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  langChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff' },
  langText: { fontSize: 12, fontWeight: '700' as const },
  sectionTitle: { fontSize: 16, fontWeight: '700' as const, color: Colors.text, marginBottom: 8 },
  previewHeader: { marginBottom: 8 },
  studentName: { fontSize: 18, fontWeight: '700' as const, color: Colors.text },
  studentMeta: { fontSize: 12, color: Colors.textSecondary },
  courseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  courseName: { fontSize: 14, fontWeight: '600' as const, color: Colors.text },
  courseMeta: { fontSize: 12, color: Colors.textSecondary },
  gradeBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.surfaceHover },
  gradeText: { fontSize: 12, fontWeight: '700' as const, color: Colors.text },
  sep: { height: 1, backgroundColor: Colors.border },
  gpaText: { fontSize: 14, fontWeight: '700' as const, color: Colors.text },
});
