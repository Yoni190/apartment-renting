import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import styles from './HomeForPOStyle'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'

const HomeForPO = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const API_URL = process.env.EXPO_PUBLIC_API_URL

  useEffect(() => {
    const load = async () => {
      try {
        const token = await SecureStore.getItemAsync('token')
        if (!token) {
          setListings([])
          setLoading(false)
          return
        }

        const res = await axios.get(`${API_URL}/my-apartments`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
        })
        setListings(res.data || [])
      } catch (err) {
        console.log('Failed to load listings', err.message)
        setListings([])
      } finally {
        setLoading(false)
      }
    }
    // load when screen becomes focused
    if (isFocused) {
      setLoading(true)
      load()
    }
  }, [isFocused])

  const handleAdd = () => {
    // navigate to an Add Listing screen if you have one; placeholder for now
    if (navigation && navigation.navigate) navigation.navigate('AddListing')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header title="My Listings" />
        <Text style={styles.sectionTitle}>Current Listings</Text>

        {!loading && listings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No listings yet</Text>
            <Text style={styles.emptySubtitle}>You haven't posted any listings.</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.85}>
              <Text style={styles.addButtonText}>ADD LISTING</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.apartmentsContainer}>
            {listings.map((item, idx) => (
              <View key={idx} style={styles.apartmentCard}>
                <Image source={ (item.images && item.images[0]) ? { uri: (item.images[0].url || item.images[0].path || item.images[0].filename) } : require('../../assets/apartment_dummy.jpeg') } style={styles.apartmentImage} />
                <View style={styles.apartmentBody}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.priceText}>{item.price ?? ''}</Text>
                    <Text style={styles.bedText}>{item.bedrooms ?? ''} bd</Text>
                  </View>
                  <Text style={styles.apartmentTitle}>{item.title}</Text>
                  <Text style={styles.addressText}>{item.address}</Text>
                  <Text style={styles.subCityText}>{item.location?.sub_city ?? ''}</Text>
                  <Text style={styles.descriptionText} numberOfLines={2}>{item.description}</Text>

                  <View style={styles.cardActions}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#9fc5f8' }]} onPress={() => navigation.navigate('OwnerMessages') }>
                      <Text style={styles.actionText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#eee' }]} onPress={() => Alert.alert('Contact', item.contact_phone ?? 'No contact') }>
                      <Text style={[styles.actionText, { color: '#333' }]}>Contacts</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeForPO
