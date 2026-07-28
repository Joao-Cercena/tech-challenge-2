import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import AdminPostsScreen from '../screens/AdminPostsScreen';
import LoginScreen from '../screens/LoginScreen';
import PersonFormScreen from '../screens/PersonFormScreen';
import PeopleListScreen from '../screens/PeopleListScreen';
import PostDetailsScreen from '../screens/PostDetailsScreen';
import PostFormScreen from '../screens/PostFormScreen';
import PostsListScreen from '../screens/PostsListScreen';

const Stack = createNativeStackNavigator();

function RestoringSession() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#1d4ed8" />
    </View>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, isRestoring } = useAuth();

  if (isRestoring) {
    return <RestoringSession />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated
        ? <AuthenticatedNavigator key="professor" />
        : <PublicNavigator key="visitor" />}
    </NavigationContainer>
  );
}

function PublicNavigator() {
  return (
    <Stack.Navigator initialRouteName="Posts" screenOptions={screenOptions}>
      <Stack.Screen name="Posts" component={PostsListScreen} options={{ title: 'Posts' }} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} options={{ title: 'Post' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login professor' }} />
    </Stack.Navigator>
  );
}

function AuthenticatedNavigator() {
  return (
    <Stack.Navigator initialRouteName="Admin" screenOptions={screenOptions}>
      <Stack.Screen name="Posts" component={PostsListScreen} options={{ title: 'Posts' }} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} options={{ title: 'Post' }} />
      <Stack.Screen name="Admin" component={AdminHomeScreen} options={{ title: 'Administração' }} />
      <Stack.Screen name="AdminPosts" component={AdminPostsScreen} options={{ title: 'Administrar posts' }} />
      <Stack.Screen name="PostForm" component={PostFormScreen} options={({ route }) => ({ title: route.params?.postId ? 'Editar post' : 'Novo post' })} />
      <Stack.Screen name="Professors" component={PeopleListScreen} initialParams={{ entity: 'professor' }} options={{ title: 'Professores' }} />
      <Stack.Screen name="ProfessorForm" component={PersonFormScreen} initialParams={{ entity: 'professor' }} options={({ route }) => ({ title: route.params?.personId ? 'Editar professor' : 'Novo professor' })} />
      <Stack.Screen name="Students" component={PeopleListScreen} initialParams={{ entity: 'student' }} options={{ title: 'Estudantes' }} />
      <Stack.Screen name="StudentForm" component={PersonFormScreen} initialParams={{ entity: 'student' }} options={({ route }) => ({ title: route.params?.personId ? 'Editar estudante' : 'Novo estudante' })} />
    </Stack.Navigator>
  );
}

const screenOptions = {
  headerStyle: { backgroundColor: '#1d4ed8' },
  headerTintColor: '#ffffff',
  contentStyle: { backgroundColor: '#f8fafc' }
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc'
  }
});
