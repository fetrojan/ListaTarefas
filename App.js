import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator()

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <NavigationContainer>
      <StatusBar />

      <Text>Open up App.js to start working on your app!</Text>
      
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
