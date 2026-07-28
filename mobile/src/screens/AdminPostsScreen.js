import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { deletePost, getPosts } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import { Loading, Message } from '../components/Feedback';
import { commonStyles } from '../styles/common';

export default function AdminPostsScreen({ navigation }) {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setPosts(await getPosts());
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadPosts();
  }, [loadPosts]));

  function confirmDelete(post) {
    Alert.alert('Excluir post', `Deseja excluir “${post.title}”?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(post.id, token);
            setPosts((current) => current.filter((item) => item.id !== post.id));
          } catch (requestError) {
            setError(requestError.message || 'Não foi possível excluir o post.');
          }
        }
      }
    ]);
  }

  return (
    <View style={commonStyles.screen}>
      <AppButton title="Novo post" onPress={() => navigation.navigate('PostForm')} />
      <AppButton title="Atualizar lista" variant="secondary" onPress={loadPosts} />
      {loading ? <Loading label="Carregando posts..." /> : null}
      {error ? <Message error>{error}</Message> : null}
      {!loading && !error && !posts.length ? <Message>Nenhum post cadastrado.</Message> : null}
      {!loading && !error ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={commonStyles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={commonStyles.muted}>{item.author}</Text>
              <View style={commonStyles.row}>
                <View style={commonStyles.grow}><AppButton title="Editar" variant="secondary" onPress={() => navigation.navigate('PostForm', { postId: item.id })} /></View>
                <View style={commonStyles.grow}><AppButton title="Excluir" variant="danger" onPress={() => confirmDelete(item)} /></View>
              </View>
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, paddingVertical: 12 },
  title: { color: '#0f172a', fontWeight: '700', fontSize: 17 }
});
