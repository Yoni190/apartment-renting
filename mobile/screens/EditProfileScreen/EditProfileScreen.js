import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './EditProfileScreenStyle'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { Eye, EyeClosed } from 'lucide-react-native'
import Header from '../../components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, shadows, typography } from '../../theme'

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
        const response = await axios.get(`${API_URL}/api/user`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`
          }
        })
        const u = response.data
        setUser(u)
  setName(u.name ?? '')
  setEmail(u.email ?? '')
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
    if (!validate()) return
    const access_token = await SecureStore.getItemAsync('token')
    if (!access_token) {
      navigation.replace('Login')
      return
    }

    try {
      setLoading(true)
  const payload = { name, email, phone_number: phone }
      if (password.trim()) {
        payload.password = password
        payload.password_confirmation = passwordConfirmation
        payload.current_password = currentPassword
      }

      let response
      try {
        response = await axios.patch(`${API_URL}/api/user`, payload, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`
          }
        })
      } catch (err) {
        const respErr = err?.response
        console.log('Patch attempt failed:', respErr?.status, respErr?.data)
        if (respErr?.status === 405 || respErr?.status === 419) {
          response = await axios.post(`${API_URL}/api/user`, payload, {
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
  const updatedUser = data.user ?? data
  setUser(updatedUser)
  setName(updatedUser.name ?? '')
  setEmail(updatedUser.email ?? '')
  setPhone(updatedUser.phone_number ?? '')
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
                const response = await axios.delete(`${API_URL}/api/user`, {
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
                  await axios.post(`${API_URL}/api/user`, {}, {
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

  if (user === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Edit Profile" />
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {errors?.message && <Text style={styles.errorText}>{errors.message}</Text>}
      <TextInput
        placeholder="Name"
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        placeholderTextColor={colors.textMuted}
      />
      {errors?.errors?.name && <Text style={styles.errorText}>{errors.errors.name}</Text>}

      <TextInput
        placeholder="Email Address"
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={colors.textMuted}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors?.errors?.email && <Text style={styles.errorText}>{errors.errors.email}</Text>}

      <TextInput
        placeholder="Phone Number"
        style={styles.textInput}
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor={colors.textMuted}
        keyboardType="phone-pad"
      />
      {errors?.errors?.phone && <Text style={styles.errorText}>{errors.errors.phone}</Text>}

      <TouchableOpacity onPress={() => setShowPasswordFields(prev => !prev)} style={{ marginTop: spacing.md }}>
        <Text style={[styles.linkText || { color: colors.primary, fontWeight: '600' }]}>{showPasswordFields ? 'Cancel password change' : 'Change password'}</Text>
      </TouchableOpacity>

      {showPasswordFields && (
        <>
          <Text style={styles.subTitle || { fontSize: 16, fontWeight: '500', marginTop: spacing.md }}>Change password</Text>
          <View style={[styles.passwordContainer, { position: 'relative' }]}>
            <TextInput
              placeholder="Current Password"
              style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showCurrentPassword}
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(prev => !prev)} style={styles.eyeButton}>
              {showCurrentPassword ? <Eye color={colors.textSecondary} /> : <EyeClosed color={colors.textSecondary} />}
            </TouchableOpacity>
          </View>
          {errors?.errors?.current_password && <Text style={styles.errorText}>{errors.errors.current_password}</Text>}

          <View style={[styles.passwordContainer, { position: 'relative' }]}>
            <TextInput
              placeholder="New Password"
              style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(prev => !prev)} style={styles.eyeButton}>
              {showNewPassword ? <Eye color={colors.textSecondary} /> : <EyeClosed color={colors.textSecondary} />}
            </TouchableOpacity>
          </View>
          {errors?.errors?.password && <Text style={styles.errorText}>{errors.errors.password}</Text>}

          <View style={[styles.passwordContainer, { position: 'relative' }]}>
            <TextInput
              placeholder="Confirm Password"
              style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(prev => !prev)} style={styles.eyeButton}>
              {showConfirmPassword ? <Eye color={colors.textSecondary} /> : <EyeClosed color={colors.textSecondary} />}
            </TouchableOpacity>
          </View>
          {errors?.errors?.password_confirmation && (
            <Text style={styles.errorText}>{errors.errors.password_confirmation}</Text>
          )}
        </>
      )}

      <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handleUpdate} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.btnText}>Save</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.deleteBtn ?? { marginTop: spacing.md, padding: spacing.md, alignItems: 'center' }, loading && { opacity: 0.6 }]} onPress={handleDelete} disabled={loading}>
        <Text style={styles.deleteBtnText ?? { color: colors.danger, fontWeight: '600' }}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfileScreen
