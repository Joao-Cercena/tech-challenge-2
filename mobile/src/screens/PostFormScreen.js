import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput } from 'react-native';
import { createPost, getPost, updatePost } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import { Loading, Message } from '../components/Feedback';
import { commonStyles } from '../styles/common';

export default function PostFormScreen({ route, navigation }) {
  const postId = route.params?.postId;
  const { token } = useAuth();
  const [form, setForm] = useState({ title: '', content: '', author: '' });
  const [loading, setLoading] = useState(Boolean(postId));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadPost = useCallback(async () => {
    if (!postId) {
      return;
    }

    setLoading(true);
    try {
      const post = await getPost(postId);
      setForm({ title: post.title, content: post.content, author: post.author });
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar o post.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  function changeField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function savePost() {
    setError('');
    setBusy(true);

    try {
      const post = postId ? await updatePost(postId, form, token) : await createPost(form, token);
      navigation.replace('PostDetails', { postId: post.id });
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível salvar o post.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <Loading label="Carregando dados do post..." />;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        {error ? <Message error>{error}</Message> : null}
        <Text style={commonStyles.label}>Título</Text>
        <TextInput value={form.title} onChangeText={(value) => changeField('title', value)} style={commonStyles.input} placeholder="Título do post" />
        <Text style={commonStyles.label}>Autor</Text>
        <TextInput value={form.author} onChangeText={(value) => changeField('author', value)} style={commonStyles.input} placeholder="Autor do post" />
        <Text style={commonStyles.label}>Conteúdo</Text>
        <TextInput value={form.content} onChangeText={(value) => changeField('content', value)} multiline style={[commonStyles.input, commonStyles.inputMultiline]} placeholder="Conteúdo completo" />
        <AppButton title={busy ? 'Salvando...' : 'Salvar post'} disabled={busy} onPress={savePost} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
