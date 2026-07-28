import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput } from 'react-native';
import { createProfessor, getProfessor, updateProfessor } from '../api/professors';
import { createStudent, getStudent, updateStudent } from '../api/students';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import { Loading, Message } from '../components/Feedback';
import { commonStyles } from '../styles/common';

const entityConfig = {
  professor: {
    label: 'professor',
    get: getProfessor,
    create: createProfessor,
    update: updateProfessor
  },
  student: {
    label: 'estudante',
    get: getStudent,
    create: createStudent,
    update: updateStudent
  }
};

export default function PersonFormScreen({ route, navigation }) {
  const entity = route.params.entity;
  const personId = route.params.personId;
  const config = entityConfig[entity];
  const { token } = useAuth();
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [loading, setLoading] = useState(Boolean(personId));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadPerson = useCallback(async () => {
    if (!personId) {
      return;
    }

    setLoading(true);
    try {
      const person = await config.get(personId, token);
      setForm({ name: person.name, username: person.username, password: '' });
    } catch (requestError) {
      setError(requestError.message || `Não foi possível carregar o ${config.label}.`);
    } finally {
      setLoading(false);
    }
  }, [config, personId, token]);

  useEffect(() => {
    loadPerson();
  }, [loadPerson]);

  function changeField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function savePerson() {
    setError('');
    setBusy(true);

    try {
      const payload = { name: form.name, username: form.username };

      if (entity === 'professor' && (!personId || form.password)) {
        payload.password = form.password;
      }

      if (personId) {
        await config.update(personId, payload, token);
      } else {
        await config.create(payload, token);
      }

      navigation.goBack();
    } catch (requestError) {
      setError(requestError.message || `Não foi possível salvar o ${config.label}.`);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <Loading label={`Carregando ${config.label}...`} />;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        {error ? <Message error>{error}</Message> : null}
        <Text style={commonStyles.label}>Nome</Text>
        <TextInput value={form.name} onChangeText={(value) => changeField('name', value)} style={commonStyles.input} placeholder="Nome" />
        <Text style={commonStyles.label}>Usuário</Text>
        <TextInput value={form.username} onChangeText={(value) => changeField('username', value)} autoCapitalize="none" autoCorrect={false} style={commonStyles.input} placeholder="Usuário" />
        {entity === 'professor' ? (
          <>
            <Text style={commonStyles.label}>{personId ? 'Nova senha (opcional)' : 'Senha'}</Text>
            <TextInput value={form.password} onChangeText={(value) => changeField('password', value)} secureTextEntry style={commonStyles.input} placeholder="Senha" />
          </>
        ) : null}
        <AppButton title={busy ? 'Salvando...' : 'Salvar'} disabled={busy} onPress={savePerson} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
