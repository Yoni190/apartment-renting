import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import styles from './HomeForPOStyle'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'

const HomeForPO = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

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
    load()
  }, [])

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
          listings.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.card} activeOpacity={0.9}>
              <Image source={require('../../assets/apartment_dummy.jpeg')} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title ?? item.name ?? 'Listing'}</Text>
                <Text style={styles.cardSubtitle}>{item.address ?? item.location ?? ''}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeForPO
