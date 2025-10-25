import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'

const ProfileScreen = () => {
    const navigation = useNavigation()
    
    const handleLogout = async () => {
            await SecureStore.deleteItemAsync("token")
            .then(() => navigation.replace("Login"))
            .catch(err => console.error(err))
        }


  return (
    <SafeAreaView>
      <Text>ProfileScreen</Text>
      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
            <Text style={styles.btnText}>Log Out</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#111',
        borderRadius: 12,
        paddingVertical: 15,
        marginTop: 10    
    },
    btnText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontWeight: '800'
    },
})