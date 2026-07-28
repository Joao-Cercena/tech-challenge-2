import { Pressable, StyleSheet, Text } from 'react-native';

export default function AppButton({ title, onPress, variant = 'primary', disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, styles[variant], (pressed || disabled) && styles.inactive]}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginVertical: 4
  },
  primary: { backgroundColor: '#1d4ed8' },
  danger: { backgroundColor: '#b91c1c' },
  secondary: { backgroundColor: '#e2e8f0' },
  inactive: { opacity: 0.6 },
  text: { color: '#ffffff', fontWeight: '700' },
  secondaryText: { color: '#1e293b' }
});
