import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { getPosts, searchPosts } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import { Loading, Message } from '../components/Feedback';
import { commonStyles } from '../styles/common';

function excerpt(content) {
  return content.length > 120 ? `${content.slice(0, 120)}…` : content;
}

export default function PostsListScreen({ navigation }) {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = useCallback(async (search = '') => {
    setLoading(true);
    setError('');

    try {
      const data = search.trim() ? await searchPosts(search.trim()) : await getPosts();
      setPosts(data);
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function clearSearch() {
    setQuery('');
    loadPosts();
  }

  return (
    <View style={commonStyles.screen}>
      <View style={styles.topRow}>
        <Text style={commonStyles.title}>Publicações</Text>
        <AppButton title={isAuthenticated ? 'Admin' : 'Login'} variant="secondary" onPress={() => navigation.navigate(isAuthenticated ? 'Admin' : 'Login')} />
      </View>
      <View style={styles.search}>
        <TextInput value={query} onChangeText={setQuery} placeholder="Buscar por palavra-chave" style={[commonStyles.input, styles.searchInput]} returnKeyType="search" onSubmitEditing={() => loadPosts(query)} />
        <AppButton title="Buscar" onPress={() => loadPosts(query)} />
        {query ? <AppButton title="Limpar" variant="secondary" onPress={clearSearch} /> : null}
      </View>

      {loading ? <Loading label="Carregando posts..." /> : null}
      {!loading && error ? <Message error>{error}</Message> : null}
      {!loading && !error && !posts.length ? <Message>Nenhum post encontrado.</Message> : null}
      {!loading && !error ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={commonStyles.card} onPress={() => navigation.navigate('PostDetails', { postId: item.id })}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={commonStyles.muted}>Por {item.author}</Text>
              <Text style={styles.content}>{excerpt(item.content)}</Text>
            </Pressable>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  search: { gap: 6, marginBottom: 10 },
  searchInput: { flex: 1 },
  list: { gap: 10, paddingBottom: 20 },
  postTitle: { color: '#0f172a', fontSize: 18, fontWeight: '700' },
  content: { color: '#334155', lineHeight: 20 }
});
