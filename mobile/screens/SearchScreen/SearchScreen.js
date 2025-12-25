import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { ArrowUpDown, SlidersHorizontal, Search } from 'lucide-react-native'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'

const SearchScreen = () => {
  const navigation = useNavigation()
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('token')
      if (!token) return
      setLoadingBookings(true)
      try {
        const res = await axios.get(`${API_URL}/owner/bookings`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
        setBookings(res.data.bookings || [])
      } catch (e) {
        console.warn('Failed to fetch owner bookings', e.message)
      } finally {
        setLoadingBookings(false)
      }
    })()
  }, [])

  const renderBookingItem = ({ item }) => {
    const scheduled = item.scheduled_at ? new Date(item.scheduled_at) : null
    const listing = item.listing || {}
    const client = item.user || {}
    return (
      <TouchableOpacity style={styles.bookingCard} onPress={() => navigation.navigate('ApartmentDetails', { listingId: listing.id })}>
        {listing.images && listing.images[0] && (
          <Image source={{ uri: listing.images[0].url || `${API_URL}/storage/${listing.images[0].path}` }} style={styles.bookingThumb} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.bookingTitle}>{listing.title || 'Listing'}</Text>
          <Text style={styles.bookingMeta}>{client.name || client.email || 'Client'} • {scheduled ? scheduled.toLocaleString() : 'n/a' }</Text>
          <Text style={styles.bookingStatus}>{item.status ? item.status.toUpperCase() : 'PENDING'}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <Header title="Requested Tours" />

      <View style={styles.searchContainer}>
        
        {/* Search Box */}
        <View style={styles.searchBox}>
          <Search size={18} color="#777" style={{ marginRight: 8 }} />
          <TextInput 
            placeholder="Search..."
            placeholderTextColor="#999"
            style={styles.textInput}
          />
        </View>

        {/* Filter Button */}
        <TouchableOpacity style={styles.iconButton}>
          <SlidersHorizontal size={20} color="#333" />
        </TouchableOpacity>

        {/* Sort Button */}
        <TouchableOpacity style={styles.iconButton}>
          <ArrowUpDown size={20} color="#333" />
        </TouchableOpacity>

      </View>

      {/* Owner bookings: Requested Tours (vertical list) */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
        {loadingBookings ? (
          <ActivityIndicator />
        ) : bookings.length === 0 ? (
          <Text style={{ color: '#6b7280' }}>No tour requests yet.</Text>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(b) => String(b.id)}
            renderItem={renderBookingItem}
            contentContainerStyle={{ paddingBottom: 8 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )}
      </View>

    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    elevation: 2,           // Shadow Android
    shadowColor: '#000',    // Shadow iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: -30,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
    color: '#333',
  },

  emptySubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  bookingCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  bookingThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#e5e7eb'
  },
  bookingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a'
  },
  bookingMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  bookingStatus: {
    marginTop: 6,
    fontSize: 12,
    color: '#1778f2',
    fontWeight: '700'
  }
})
