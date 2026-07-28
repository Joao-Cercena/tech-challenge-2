import { ScrollView, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import { commonStyles } from '../styles/common';

export default function AdminHomeScreen({ navigation }) {
  const { professor, logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={commonStyles.scrollContent}>
      <Text style={commonStyles.title}>Área administrativa</Text>
      <Text style={commonStyles.subtitle}>Professor: {professor.username}</Text>
      <View style={commonStyles.card}>
        <AppButton title="Administrar posts" onPress={() => navigation.navigate('AdminPosts')} />
        <AppButton title="Novo post" onPress={() => navigation.navigate('PostForm')} />
        <AppButton title="Professores" variant="secondary" onPress={() => navigation.navigate('Professors')} />
        <AppButton title="Estudantes" variant="secondary" onPress={() => navigation.navigate('Students')} />
      </View>
      <AppButton title="Sair" variant="danger" onPress={logout} />
    </ScrollView>
  );
}
