import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './EditProfileScreenStyle'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

const EditProfileScreen = () => {

    const navigation = useNavigation()
    const [user, setUser] = useState(null)

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
    const getUser = async () => {
      const access_token = await SecureStore.getItemAsync("token")
      if (!access_token) navigation.replace("Login")

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

//FOR REl?
//edit 
//why is user null initially?
//because
  return (
    <View styles={styles.container}>
      <TextInput 
        placeholder='Name'
        style={styles.textInput}
        value={user.name}
      />
      <TextInput 
        placeholder='Email Address'
        style={styles.textInput}
        value={user.email}
      />
      <TextInput
        placeholder='Phone Number'
        style={styles.textInput}
      />
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Edit</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EditProfileScreen

