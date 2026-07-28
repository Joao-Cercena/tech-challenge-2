import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import { Message } from '../components/Feedback';
import { commonStyles } from '../styles/common';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    setBusy(true);

    try {
      await login({ username, password });
    } catch (loginError) {
      setError(loginError.message || 'Não foi possível autenticar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={commonStyles.screen}>
      <Text style={commonStyles.title}>Login de professor</Text>
      <Text style={commonStyles.subtitle}>Acesse as funcionalidades administrativas.</Text>
      {error ? <Message error>{error}</Message> : null}
      <Text style={commonStyles.label}>Usuário</Text>
      <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} style={commonStyles.input} placeholder="Seu usuário" />
      <Text style={commonStyles.label}>Senha</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={commonStyles.input} placeholder="Sua senha" onSubmitEditing={handleLogin} />
      <AppButton title={busy ? 'Entrando...' : 'Entrar'} disabled={busy} onPress={handleLogin} />
      <AppButton title="Continuar como visitante" variant="secondary" onPress={() => navigation.navigate('Posts')} />
    </KeyboardAvoidingView>
  );
}
