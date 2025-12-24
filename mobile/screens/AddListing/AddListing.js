import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import styles from './AddListingStyle'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'

const AddListing = () => {
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  const API_URL = process.env.EXPO_PUBLIC_API_URL

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const token = await SecureStore.getItemAsync('token')
      if (!token) throw new Error('Not authenticated')

      const payload = { title, address, price, description }
      const res = await axios.post(`${API_URL}/apartments`, payload, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
      })

      Alert.alert('Success', 'Listing added')
      navigation.goBack()
    } catch (err) {
      console.log(err.response?.data || err.message)
      Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to add listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Add Listing" />
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. 2-bedroom apartment" />

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Street, city" />

        <Text style={styles.label}>Price</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="e.g. 50,000" />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, { height: 120 }]} value={description} onChangeText={setDescription} multiline placeholder="Details about the property" />

        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Saving...' : 'Save Listing'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddListing
