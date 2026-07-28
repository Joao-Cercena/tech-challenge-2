import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function Loading({ label = 'Carregando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#1d4ed8" />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

export function Message({ children, error = false }) {
  return <Text style={[styles.message, error && styles.error]}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 24, gap: 12 },
  text: { color: '#475569' },
  message: { color: '#475569', paddingVertical: 10 },
  error: { color: '#b91c1c' }
});
