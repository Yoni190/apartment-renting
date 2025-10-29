import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from "expo-secure-store"
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './HomeScreenStyle'
import Header from '../../components/Header'
import { SlidersHorizontal } from 'lucide-react-native'

const HomeScreen = () => {
    const [user, setUser] = useState(null)

    const navigation = useNavigation()

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    

    useEffect(() => {
      const getUser = async () => {
        const access_token = await SecureStore.getItemAsync("token")
        if(!access_token) navigation.replace("Login")

        try {
            const response = await axios.get(`${API_URL}/user`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${access_token}`
                }
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
            navigation.navigate("Login")
        }
        
      }

      getUser()
    }, [])
    
  return (
    <SafeAreaView>
      <Header 
        title='Home'
      />
      <View style={styles.searchContainer}>
        <TextInput 
          placeholder='Search..'
          style={styles.textInput}
        />
        <SlidersHorizontal style={styles.filter}/>
      </View>
      
      <Text>Greetings, {user && user.name}</Text>
    </SafeAreaView>
  )
}

export default HomeScreen

