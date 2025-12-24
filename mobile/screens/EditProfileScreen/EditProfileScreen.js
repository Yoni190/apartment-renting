import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './EditProfileScreenStyle'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { Eye, EyeClosed } from 'lucide-react-native'
import Header from '../../components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'

const EditProfileScreen = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const API_URL = process.env.EXPO_PUBLIC_API_URL

  const validate = () => {
    const fieldErrors = {}

    if (!name.trim()) fieldErrors.name = 'Name is required'
    // simple email regex
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!email.trim() || !emailRegex.test(email)) fieldErrors.email = 'Valid email is required'

    if (password.trim()) {
      if (!currentPassword.trim()) fieldErrors.current_password = 'Current password is required to change your password'
      if (password.length < 8) fieldErrors.password = 'Password must be at least 8 characters'
      if (password !== passwordConfirmation) fieldErrors.password_confirmation = 'Passwords do not match'
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors({ errors: fieldErrors })
      return false
    }

    setErrors({})
    return true
  }




  useEffect(() => {
    const getUser = async () => {
      const access_token = await SecureStore.getItemAsync("token")
      if (!access_token) return navigation.replace("Login")

      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/user`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`
          }
        })
        const u = response.data
        setUser(u)
  setName(u.name ?? '')
  setEmail(u.email ?? '')
  // backend returns phone_number
  setPhone(u.phone_number ?? '')
      } catch (error) {
        console.log(error?.response ?? error)
        navigation.replace('Login')
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const handleUpdate = async () => {
    setErrors({})
    // client-side validation
    if (!validate()) return
    const access_token = await SecureStore.getItemAsync('token')
    if (!access_token) {
      navigation.replace('Login')
      return
    }

    try {
      setLoading(true)
      // build payload; include password only when provided
  const payload = { name, email, phone_number: phone }
      if (password.trim()) {
        payload.password = password
        payload.password_confirmation = passwordConfirmation
        payload.current_password = currentPassword
      }

      // try PATCH first (some backends require PATCH for updates)
      let response
      try {
        response = await axios.patch(`${API_URL}/user`, payload, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`
          }
        })
      } catch (err) {
        const respErr = err?.response
        console.log('Patch attempt failed:', respErr?.status, respErr?.data)
        // fallback: if PATCH not allowed, try POST with method override header
        if (respErr?.status === 405 || respErr?.status === 419) {
          response = await axios.post(`${API_URL}/user`, payload, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${access_token}`,
              'X-HTTP-Method-Override': 'PATCH'
            }
          })
        } else {
          throw err
        }
      }

      const data = response.data ?? {}
      // backend might return { user: {...} } or user object directly
  const updatedUser = data.user ?? data
  setUser(updatedUser)
  setName(updatedUser.name ?? '')
  setEmail(updatedUser.email ?? '')
  setPhone(updatedUser.phone_number ?? '')
      // clear password fields after successful update
      setPassword('')
      setPasswordConfirmation('')
      setShowPasswordFields(false)
      Alert.alert('Success', 'Profile updated')
    } catch (error) {
      console.log('Update error:', error?.response ?? error)
      const resp = error?.response
      if (resp?.status === 422) {
        setErrors(resp.data || {})
      } else if (resp?.data?.message) {
        Alert.alert('Error', resp.data.message.toString())
      } else {
        Alert.alert('Error', 'Unable to update profile')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    Alert.alert(
      'Delete account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const access_token = await SecureStore.getItemAsync('token')
            if (!access_token) {
              navigation.replace('Login')
              return
            }
            try {
              setLoading(true)
              try {
                const response = await axios.delete(`${API_URL}/user`, {
                  headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${access_token}`
                  }
                })
                if (response?.data?.message) console.log('Delete response:', response.data)
              } catch (errDel) {
                const respDel = errDel?.response
                console.log('Delete attempt failed:', respDel?.status, respDel?.data)
                if (respDel?.status === 405 || respDel?.status === 419) {
                  // try POST with method override
                  await axios.post(`${API_URL}/user`, {}, {
                    headers: {
                      Accept: 'application/json',
                      Authorization: `Bearer ${access_token}`,
                      'X-HTTP-Method-Override': 'DELETE'
                    }
                  })
                } else {
                  throw errDel
                }
              }
              await SecureStore.deleteItemAsync('token')
              Alert.alert('Deleted', 'Your account has been deleted.')
              navigation.replace('Login')
            } catch (error) {
              console.log('Delete error:', error?.response ?? error)
              const resp = error?.response
              if (resp?.data?.message) {
                Alert.alert('Error', resp.data.message.toString())
              } else {
                Alert.alert('Error', 'Unable to delete account')
              }
            } finally {
              setLoading(false)
            }
          }
        }
      ]
    )
  }

  // don't render inputs until we tried to load the user
  if (user === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <Header title="Edit Profile" />
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {errors?.message && <Text style={styles.errorText}>{errors.message}</Text>}
      <TextInput
        placeholder="Name"
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />
      {errors?.errors?.name && <Text style={styles.errorText}>{errors.errors.name}</Text>}

      <TextInput
        placeholder="Email Address"
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors?.errors?.email && <Text style={styles.errorText}>{errors.errors.email}</Text>}

      <TextInput
        placeholder="Phone Number"
        style={styles.textInput}
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor="#999"
        keyboardType="phone-pad"
      />
      {errors?.errors?.phone && <Text style={styles.errorText}>{errors.errors.phone}</Text>}

      <TouchableOpacity onPress={() => setShowPasswordFields(prev => !prev)} style={{ marginTop: 12 }}>
        <Text style={[styles.linkText || { color: '#0066CC', fontWeight: '600' }]}>{showPasswordFields ? 'Cancel password change' : 'Change password'}</Text>
      </TouchableOpacity>

      {showPasswordFields && (
        <>
          <Text style={styles.subTitle || { fontSize: 16, fontWeight: '500', marginTop: 10 }}>Change password</Text>
          <View style={[styles.passwordContainer, { position: 'relative' }]}>
            <TextInput
              placeholder="Current Password"
              style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholderTextColor="#999"
              secureTextEntry={!showCurrentPassword}
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(prev => !prev)} style={styles.eyeButton}>
              {showCurrentPassword ? <Eye color="#666" /> : <EyeClosed color="#666" />}
            </TouchableOpacity>
          </View>
          {errors?.errors?.current_password && <Text style={styles.errorText}>{errors.errors.current_password}</Text>}

          <View style={[styles.passwordContainer, { position: 'relative' }]}>
            <TextInput
              placeholder="New Password"
              style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#999"
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(prev => !prev)} style={styles.eyeButton}>
              {showNewPassword ? <Eye color="#666" /> : <EyeClosed color="#666" />}
            </TouchableOpacity>
          </View>
          {errors?.errors?.password && <Text style={styles.errorText}>{errors.errors.password}</Text>}

          <View style={[styles.passwordContainer, { position: 'relative' }]}>
            <TextInput
              placeholder="Confirm Password"
              style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(prev => !prev)} style={styles.eyeButton}>
              {showConfirmPassword ? <Eye color="#666" /> : <EyeClosed color="#666" />}
            </TouchableOpacity>
          </View>
          {errors?.errors?.password_confirmation && (
            <Text style={styles.errorText}>{errors.errors.password_confirmation}</Text>
          )}
        </>
      )}

      <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handleUpdate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.deleteBtn ?? { marginTop: 12, padding: 12, alignItems: 'center' }, loading && { opacity: 0.6 }]} onPress={handleDelete} disabled={loading}>
        <Text style={styles.deleteBtnText ?? { color: '#b91c1c', fontWeight: '600' }}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfileScreen
