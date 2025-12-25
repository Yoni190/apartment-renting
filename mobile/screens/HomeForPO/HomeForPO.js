import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
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
    if (navigation && navigation.navigate) navigation.navigate('AddListing')
  }

  const handleEdit = (apt) => {
    navigation.navigate('AddListing', { listingId: apt.id })
  }

  const handleDeactivate = (apt) => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('token')
        if (!token) return
        await axios.post(`${API_URL}/apartments/${apt.id}/deactivate`, { active: apt.status ? 0 : 1 }, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
        // refresh listings
        setLoading(true)
        const res = await axios.get(`${API_URL}/my-apartments`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
        setListings(res.data || [])
      } catch (e) {
        console.warn('Failed to toggle deactivate', e.message)
      } finally {
        setLoading(false)
      }
    })()
  }

  const handleDelete = (apt) => {
    (async () => {
      try {
        const ok = await new Promise((resolve) => {
          // simple confirm dialog
          const res = confirm ? true : true
          resolve(true)
        })
        // We will show a native alert instead of confirm to be cross-platform
      } catch (e) {
        // ignore
      }
      // use Alert since confirm() is not available in RN
      const { Alert } = require('react-native')
      Alert.alert('Delete listing', 'Are you sure you want to delete this listing?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const token = await SecureStore.getItemAsync('token')
            if (!token) return
            await axios.delete(`${API_URL}/apartments/${apt.id}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
            // refresh
            setLoading(true)
            const res = await axios.get(`${API_URL}/my-apartments`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
            setListings(res.data || [])
          } catch (e) {
            console.warn('Failed to delete listing', e.message)
          } finally {
            setLoading(false)
          }
        }}
      ])
    })()
  }

  const activeListings = listings.filter(l => l.status === 1 || l.status === true).length

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="My Listings" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Header Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="home-outline" size={24} color="#1778f2" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{listings.length}</Text>
              <Text style={styles.statLabel}>Total Listings</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.statIconActive]}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#10b981" />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statNumber, styles.statNumberActive]}>{activeListings}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Properties</Text>
          {listings.length > 0 && (
            <Text style={styles.sectionSubtitle}>{listings.length} {listings.length === 1 ? 'property' : 'properties'}</Text>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1778f2" />
            <Text style={styles.loadingText}>Loading your listings...</Text>
          </View>
        ) : listings.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="home-outline" size={64} color="#cbd5e1" />
            </View>
            <Text style={styles.emptyTitle}>No listings yet</Text>
            <Text style={styles.emptySubtitle}>
              Start by adding your first property listing. It only takes a few minutes!
            </Text>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={handleAdd} 
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle" size={24} color="#fff" style={styles.addButtonIcon} />
              <Text style={styles.addButtonText}>Add Your First Listing</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listingsContainer}>
            {listings.map((item) => {
              const images = (item.images || []).map(img => 
                img.url || (img.path ? `${API_URL}/storage/${img.path}` : null)
              ).filter(Boolean)
              const meta = item.meta || {}

              return (
                <ListingCard
                  key={item.id}
                  images={images.length ? images : undefined}
                  priceRange={item.price ? `$${Number(item.price).toLocaleString()}` : undefined}
                  bedroomRange={item.bedrooms ? `${item.bedrooms} Bed${item.bedrooms !== 1 ? 's' : ''}` : undefined}
                  title={item.title}
                  address={item.address || (meta.location ? `${meta.location.area || ''} ${meta.location.city || ''}`.trim() : undefined)}
                  amenities={Array.isArray(meta.amenities) ? meta.amenities : undefined}
                  isOwnerMode={true}
                  onEdit={() => handleEdit(item)}
                  onDeactivate={() => handleDeactivate(item)}
                  onDelete={() => handleDelete(item)}
                  onPress={() => navigation.navigate('ApartmentDetails', { listingId: item.id })}
                />
              )
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {!loading && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={handleAdd}
          activeOpacity={0.9}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

export default HomeForPO
