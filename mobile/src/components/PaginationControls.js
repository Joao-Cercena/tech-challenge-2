import { StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';

export default function PaginationControls({ pagination, onPageChange }) {
  if (!pagination) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AppButton title="Anterior" variant="secondary" disabled={pagination.page <= 1} onPress={() => onPageChange(pagination.page - 1)} />
      <Text style={styles.text}>Página {pagination.page} de {Math.max(pagination.totalPages, 1)}</Text>
      <AppButton title="Próxima" variant="secondary" disabled={pagination.page >= pagination.totalPages} onPress={() => onPageChange(pagination.page + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingVertical: 12 },
  text: { color: '#334155', fontWeight: '600', textAlign: 'center', flex: 1 }
});
