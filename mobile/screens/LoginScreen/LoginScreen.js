import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import * as SecureStore from "expo-secure-store"
import { Eye, EyeClosed } from 'lucide-react-native'
import styles from './LoginScreenStyle'
import Header from '../../components/Header'

const LoginScreen = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [passStatus, setPassStatus] = useState(true)
  const navigation = useNavigation()
  const route = useRoute()
  // role the user selected before arriving to Login (may be undefined)
  const selectedRoleParam = route.params?.role

    // fallback API URL if env var is not set (common for emulator/device setups)
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'


    const handleLogin = async () => {
        setErrors({})
        setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        role: selectedRoleParam,
        device_name: `${Platform.OS} ${Platform.Version}`
      }, {
        headers: {
          Accept: "application/json"
        }
      })

      console.log(`Role: ${selectedRoleParam}`)
      const access_token = response.data
      console.log('login token', access_token)

      await SecureStore.setItemAsync('token', access_token)
          // if a role was selected before logging in, honor that selection
          if (selectedRoleParam !== undefined) {
            if (selectedRoleParam === 0) navigation.replace('OwnerHome')
            else navigation.replace('Home')
          } else {
            // otherwise fetch the user to determine role and redirect accordingly
            try {
              const userRes = await axios.get(`${API_URL}/user`, {
                headers: { Accept: 'application/json', Authorization: `Bearer ${access_token}` }
              })
              const user = userRes.data
              if (user?.role === 0) {
                navigation.replace('OwnerHome')
              } else {
                navigation.replace('Home')
              }
            } catch (err) {
              console.warn('Failed to fetch user after login', err?.message)
              navigation.replace('Home')
            }
          }

            
    } catch (error) {
      console.log('Login error', error?.response || error.message)
      if (error?.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data)
        } else if (error.response.status === 401) {
          setErrors({ message: 'Invalid credentials' })
        } else {
          setErrors({ message: error.response.data?.message || 'Server error' })
        }
      } else {
        setErrors({ message: 'Network error — check API host and connectivity' })
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
      <Header 
        title="Login" />
    <View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subTitle}>Login to Continue</Text>
        {selectedRoleParam !== undefined && (
          <Text style={styles.roleInfo}>{selectedRoleParam === 0 ? 'Logging in as Property Owner' : 'Logging in as Client'}</Text>
        )}

        {errors?.message && <Text style={styles.errorText}>{errors.message}</Text>}

      <TextInput 
        placeholder='Email Address'
        keyboardType='email-address'
        style={styles.textInput}
        placeholderTextColor="#999"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize='none'
      />
      {errors?.errors?.email && (
        <Text style={styles.errorText}>{errors.errors.email}</Text>
      )}
      
      <View style={styles.passwordContainer}>
        <TextInput
            placeholder='Password'
            secureTextEntry={passStatus}
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPassStatus(!passStatus)}>
            {passStatus ? <EyeClosed color="#666" /> : <Eye color="#666" />}
        </TouchableOpacity>
        </View>
      
      {errors?.errors?.password && (
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
        Don't have an account? <Text style={styles.linkText} onPress={() => navigation.replace("Register", { role: selectedRoleParam ?? 1 })}>Sign Up</Text>
      </Text>
    </View>

          <View style={styles.orRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.googleBtn}>
            <Image 
            source={require('../../assets/google_icon.png')} 
            style={styles.googleIcon}
            />
            <Text style={styles.googleBtnText}>Login with Google</Text>
          </TouchableOpacity>
    </KeyboardAvoidingView>
    
  )
}

export default LoginScreen