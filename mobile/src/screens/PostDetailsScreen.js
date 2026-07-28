import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { getPost } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import { Loading, Message } from '../components/Feedback';
import { commonStyles } from '../styles/common';

export default function PostDetailsScreen({ route, navigation }) {
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const postId = route.params.postId;

  const loadPost = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setPost(await getPost(postId));
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar o post.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  if (loading) {
    return <Loading label="Carregando post..." />;
  }

  if (error || !post) {
    return <Message error>{error || 'Post não encontrado.'}</Message>;
  }

  return (
    <ScrollView contentContainerStyle={commonStyles.scrollContent}>
      <Text style={commonStyles.title}>{post.title}</Text>
      <Text style={commonStyles.muted}>Por {post.author}</Text>
      <Text style={styles.content}>{post.content}</Text>
      {isAuthenticated ? <AppButton title="Editar post" onPress={() => navigation.navigate('PostForm', { postId: post.id })} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { color: '#1e293b', fontSize: 16, lineHeight: 25, marginTop: 14 }
});
