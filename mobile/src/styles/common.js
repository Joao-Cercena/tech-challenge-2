import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 16, gap: 12 },
  title: { color: '#0f172a', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#475569', marginBottom: 10 },
  card: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 14, gap: 6 },
  label: { color: '#334155', fontWeight: '700', marginTop: 8 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, color: '#0f172a', minHeight: 44, paddingHorizontal: 12, paddingVertical: 10 },
  inputMultiline: { minHeight: 140, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  grow: { flex: 1 },
  muted: { color: '#64748b' }
});
