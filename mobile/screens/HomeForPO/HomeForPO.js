import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import styles from './HomeForPOStyle'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import ListingCard from '../../components/ListingCard'

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

  const handleEdit = (apt) => {
    // navigate to edit screen
    console.log('edit', apt.id)
  }
  const handleDeactivate = (apt) => {
    // call server to change status
    console.log('deactivate', apt.id)
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
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            {listings.map((item) => {
              const images = (item.images || []).map(img => img.url || (img.path ? `${API_URL}/storage/${img.path}` : null)).filter(Boolean)
              const meta = item.meta || {}

              return (
                <ListingCard
                  key={item.id}
                  images={images.length ? images : undefined}
                  priceRange={item.price}
                  bedroomRange={item.bedrooms ? `${item.bedrooms} bd` : undefined}
                  title={item.title}
                  address={item.address}
                  amenities={meta.amenities}
                  isOwnerMode={true}
                  onEdit={() => handleEdit(item)}
                  onDeactivate={() => handleDeactivate(item)}
                  onPress={() => navigation.navigate('ApartmentDetails', { listingId: item.id })}
                />
              )
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeForPO
