import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './screens/LoginScreen/LoginScreen';

import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import HomeTabs from './screens/HomeTabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChooseRoleScreen from './screens/ChooseRoleScreen/ChooseRoleScreen';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar'
import EditProfileScreen from './screens/EditProfileScreen/EditProfileScreen';
import HomeForPO from './screens/HomeForPO/HomeForPO';
import AddListing from './screens/AddListing/AddListing';
import OwnerTabs from './screens/OwnerTabs'
import ApartmentDetails from './screens/ApartmentDetails/ApartmentDetails';
import './i18n';
import ApartmentReviews from './screens/ApartmentDetails/ApartmentReviews';

const Stack = createStackNavigator()

export default function App() {
  useEffect(() => {
    const hideNavBar = async () => {
      await NavigationBar.setVisibilityAsync('hidden')
      await NavigationBar.setBehaviorAsync('overlay-swipe')
    }

    hideNavBar()
  }, [])
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Gojoye" component={ChooseRoleScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="OwnerHome" component={OwnerTabs} options={{ headerShown: false }} />
        <Stack.Screen name="HomeForPO" component={HomeForPO} options={{ headerShown: false }} />
        <Stack.Screen name="AddListing" component={AddListing} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }}/>
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ApartmentDetails" component={ApartmentDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="ApartmentReviews" component={ApartmentReviews} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
