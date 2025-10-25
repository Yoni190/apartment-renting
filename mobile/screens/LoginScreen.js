import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import * as SecureStore from "expo-secure-store"

const LoginScreen = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()

    const API_URL = process.env.EXPO_PUBLIC_API_URL;


    const handleLogin = async () => {
        setErrors({})
        setLoading(true)
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password,
                device_name: `${Platform.OS} ${Platform.Version}`
            }, {
                headers: {
                    Accept: "application/json"
                }
            })

            const access_token = response.data
            console.log(access_token)

            await SecureStore.setItemAsync('token', access_token)
            .then(() => navigation.replace("Home"))
            .catch(err => console.error(err))

            
        } 
        catch (error) {
            if(error.response.status === 422){
                setErrors(error.response.data)
            }
                
        } finally {
            setLoading(false)
        } 
    }
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
    >
    <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subTitle}>Login to Continue</Text>

      <TextInput 
        placeholder='Email Address'
        keyboardType='email-address'
        style={styles.textInput}
        placeholderTextColor="#999"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize='none'
      />
      {errors && Object.keys(errors).length > 0 && errors.errors.email && (
        <Text style={styles.errorText}>{errors.errors.email}</Text>
      )}
      
      <TextInput 
        placeholder='Password'
        secureTextEntry={true}
        style={styles.textInput}
        placeholderTextColor="#999"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {errors && Object.keys(errors).length > 0 && errors.errors.password && (
        <Text style={styles.errorText}>{errors.errors.password}</Text>
      )}

      <TouchableOpacity 
      style={[styles.btn, loading && {opacity: 0.6}]}
      onPress={handleLogin}
      disabled={loading}
      >
        <Text style={styles.btnText}>{loading ? 'Loading...' : "Login"}</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account? <Text style={styles.linkText} onPress={() => navigation.replace("Register")}>Sign Up</Text>
      </Text>
    </View>
    </KeyboardAvoidingView>
    
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
        paddingHorizontal: 25
    },
    innerContainer: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1, //?
        shadowRadius: 8,//?
        shadowOffset: {width: 0, height: 3} //?
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: '#F5F5F5'
    },
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
    title: {
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '700',
        color: "#111"
    },
    subTitle: {
        textAlign: "center",
        color: '#666',
        marginBottom: 30
    },
    footerText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666'
    },
    linkText: {
        color: '#111',
        fontWeight: 'bold'
    },
    errorText: {
        color: "red",
        marginBottom: 5
    }
})