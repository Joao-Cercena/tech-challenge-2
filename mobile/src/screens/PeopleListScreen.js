import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { deleteProfessor, getProfessors } from '../api/professors';
import { deleteStudent, getStudents } from '../api/students';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import { Loading, Message } from '../components/Feedback';
import PaginationControls from '../components/PaginationControls';
import { commonStyles } from '../styles/common';

const entityConfig = {
  professor: {
    title: 'Professores',
    empty: 'Nenhum professor cadastrado.',
    list: getProfessors,
    remove: deleteProfessor,
    formScreen: 'ProfessorForm'
  },
  student: {
    title: 'Estudantes',
    empty: 'Nenhum estudante cadastrado.',
    list: getStudents,
    remove: deleteStudent,
    formScreen: 'StudentForm'
  }
};

export default function PeopleListScreen({ route, navigation }) {
  const { token } = useAuth();
  const config = entityConfig[route.params.entity];
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPage = useCallback(async (requestedPage = page) => {
    setLoading(true);
    setError('');

    try {
      const response = await config.list({ page: requestedPage, limit: 10 }, token);
      setData(response.data);
      setPagination(response.pagination);
      setPage(response.pagination.page);
    } catch (requestError) {
      setError(requestError.message || `Não foi possível carregar ${config.title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [config, page, token]);

  useFocusEffect(useCallback(() => {
    loadPage(page);
  }, [loadPage, page]));

  function confirmDelete(person) {
    Alert.alert(`Excluir ${config.title.slice(0, -1).toLowerCase()}`, `Deseja excluir ${person.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await config.remove(person.id, token);
            const nextPage = data.length === 1 && page > 1 ? page - 1 : page;
            loadPage(nextPage);
          } catch (requestError) {
            setError(requestError.message || 'Não foi possível excluir o registro.');
          }
        }
      }
    ]);
  }

  return (
    <View style={commonStyles.screen}>
      <AppButton title={`Novo ${config.title.slice(0, -1).toLowerCase()}`} onPress={() => navigation.navigate(config.formScreen)} />
      {loading ? <Loading label={`Carregando ${config.title.toLowerCase()}...`} /> : null}
      {error ? <Message error>{error}</Message> : null}
      {!loading && !error && !data.length ? <Message>{config.empty}</Message> : null}
      {!loading && !error ? (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={commonStyles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={commonStyles.muted}>{item.username}</Text>
              <View style={commonStyles.row}>
                <View style={commonStyles.grow}><AppButton title="Editar" variant="secondary" onPress={() => navigation.navigate(config.formScreen, { personId: item.id })} /></View>
                <View style={commonStyles.grow}><AppButton title="Excluir" variant="danger" onPress={() => confirmDelete(item)} /></View>
              </View>
            </View>
          )}
          ListFooterComponent={<PaginationControls pagination={pagination} onPageChange={loadPage} />}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, paddingVertical: 12 },
  name: { color: '#0f172a', fontSize: 17, fontWeight: '700' }
});
