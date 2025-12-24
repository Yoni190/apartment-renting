import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import * as SecureStore from "expo-secure-store"
import { Eye, EyeClosed } from 'lucide-react-native'
import styles from './RegisterScreenStyle'

const RegisterScreen = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [passStatus, setPassStatus] = useState(true)
    const [confirmPassStatus, setConfirmPassStatus] = useState(true)
  const navigation = useNavigation()
  const route = useRoute()
  // role param if user selected before navigating; default to client (1)
  const selectedRoleParam = route.params?.role
  const selectedRole = selectedRoleParam ?? 1

  // fallback API URL if env var is not set (use emulator loopback by default)
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'


    const handleRegister = async () => {
      
        setErrors({})
        setLoading(true)
        try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        device_name: `${Platform.OS} ${Platform.Version}`,
        role: selectedRole,
        phone_number: phone
      }, {
                headers: {
                    Accept: "application/json"
                }
            })

            const access_token = response.data.token
            console.log('register token', access_token)

            await SecureStore.setItemAsync('token', access_token)
            // navigate according to selected role (owner=0 -> HomeForPO, client=1 -> Home)
            if (selectedRole === 0) {
              navigation.replace('HomeForPO')
            } else {
              navigation.replace('Home')
            }

        } catch (error) {
            console.log('Register error', error?.response || error.message)
            if (error?.response) {
                if (error.response.status === 422) {
                    setErrors(error.response.data)
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
    <View style={styles.innerContainer}>
        <Text style={styles.title}>Greetings</Text>
          <Text style={styles.subTitle}>Register to Continue</Text>
          {selectedRoleParam !== undefined && (
            <Text style={styles.roleInfo}>{selectedRole === 0 ? 'Signing in as Property Owner' : 'Signing in as Client'}</Text>
          )}

          {errors?.message && <Text style={styles.errorText}>{errors.message}</Text>}

         <TextInput 
            placeholder='Name'
            style={styles.textInput}
            placeholderTextColor="#999"
            value={name}
            onChangeText={(text) => setName(text)}
        />
        {errors?.errors?.name && (
        <Text style={styles.errorText}>{errors.errors.name}</Text>
      )}
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

      <TextInput 
        placeholder='Phone Number'
        keyboardType='phone-pad'
        style={styles.textInput}
        placeholderTextColor="#999"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput 
            placeholder='Password'
            secureTextEntry={passStatus}
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => setPassword(text)}
        />
    {errors?.errors?.password && (
      <Text style={styles.errorText}>{errors.errors.password}</Text>
    )}
        <TouchableOpacity onPress={() => setPassStatus(!passStatus)}>
            {passStatus ? <EyeClosed color="#666" /> : <Eye color="#666" />}
        </TouchableOpacity>
    </View>

        <View style={styles.passwordContainer}>
            <TextInput 
                placeholder='Confirm Password'
                secureTextEntry={confirmPassStatus}
                placeholderTextColor="#999"
                value={passwordConfirmation}
                onChangeText={(text) => setPasswordConfirmation(text)}
            />
            <TouchableOpacity onPress={() => setConfirmPassStatus(!confirmPassStatus)}>
                {confirmPassStatus ? <EyeClosed color="#666" /> : <Eye color="#666" />}
            </TouchableOpacity>
        </View>

      <TouchableOpacity 
      style={[styles.btn, loading && {opacity: 0.6}]}
      onPress={handleRegister}
      disabled={loading}
      >
        <Text style={styles.btnText}>{loading ? 'Loading...' : "Register"}</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account? <Text style={styles.linkText} onPress={() => navigation.replace("Login", { role: selectedRole })}>Log In</Text>
      </Text>
    </View>
    </KeyboardAvoidingView>
    
  )
}

export default RegisterScreen