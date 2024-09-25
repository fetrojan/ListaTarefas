import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TasksScreen from './screens/TasksScreen'
import LastActivityScreen from './screens/LastActivityScreen';
import MessagesScreen from './screens/MessagesScreen';

const Tab = createMaterialTopTabNavigator()

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <NavigationContainer>
      <StatusBar />

      <Tab.Navigator initialRouteName='Tasks' screenOptions={{ tabBarIndicatorStyle: {backgroundColor: 'green'}}}>

        <Tab.Screen name='Messages' component={MessagesScreen}/>
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Last Activity" component={LastActivityScreen} />

      </Tab.Navigator>

      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
