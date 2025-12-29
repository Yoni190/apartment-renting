import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Modal, Linking, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { ArrowUpDown, SlidersHorizontal, Search } from 'lucide-react-native'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'

const RequestedToursScreen = () => {
  const navigation = useNavigation()
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

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
      <View style={styles.bookingCardAlt}>
        <TouchableOpacity style={styles.bookingThumbWrap} onPress={() => navigation.navigate('ApartmentDetails', { listingId: listing.id })}>
          {listing.images && listing.images[0] ? (
            <Image source={{ uri: listing.images[0].url || `${API_URL}/storage/${listing.images[0].path}` }} style={styles.bookingThumb} />
          ) : (
            <View style={[styles.bookingThumb, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="home-outline" size={28} color="#9ca3af" />
            </View>
          )}
        </TouchableOpacity>

        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.bookingTitle}>{listing.title || 'Listing'}</Text>
          <Text style={styles.bookingMeta}>{client.name || client.email || 'Client'}</Text>
          <Text style={styles.bookingTime}>{scheduled ? scheduled.toLocaleString() : 'No time set'}</Text>
          <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
            <View style={[styles.statusBadge, item.status === 'pending' ? styles.statusPending : styles.statusPrimary]}>
              <Text style={styles.statusText}>{(item.status || 'pending').toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.actionBtn} onPress={() => { setSelectedClient({ ...client, listingId: listing.id }); setModalVisible(true) }}>
              <Ionicons name="person-circle-outline" size={18} color="#0f172a" />
              <Text style={styles.actionText}>Client</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => { const phone = client.phone || client.phone_number || client.phoneNumber; if (phone) { Linking.openURL(`tel:${phone}`).catch(()=>{}) } else { Alert.alert('No phone number available') } }}>
              <Ionicons name="call-outline" size={18} color="#059669" />
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Messages', { apartmentId: listing.id, userId: client.id })}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#2563eb" />
              <Text style={styles.actionText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const renderClientModal = () => {
    const c = selectedClient || {}
    return (
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="person-outline" size={34} color="#4f46e5" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>{c.name || c.email || 'Client'}</Text>
                <Text style={{ color: '#6b7280', marginTop: 4 }}>{c.email || ''}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#374151" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#10b981' }]} onPress={() => { const phone = c.phone || c.phone_number || c.phoneNumber; if (phone) { Linking.openURL(`tel:${phone}`).catch(()=>{}) } else { Alert.alert('No phone available') } }}>
                <Ionicons name="call" size={18} color="#fff" />
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#2563eb' }]} onPress={() => { setModalVisible(false); navigation.navigate('Messages', { userId: c.id }) }}>
                <Ionicons name="chatbubbles" size={18} color="#fff" />
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#f97316' }]} onPress={() => { setModalVisible(false); if (c.listingId) navigation.navigate('ApartmentDetails', { listingId: c.listingId }) }}>
                <Ionicons name="information-circle" size={18} color="#fff" />
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
            data={bookings.slice(0, 20)}
            keyExtractor={(b) => String(b.id)}
            renderItem={renderBookingItem}
            contentContainerStyle={{ paddingBottom: 8 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )}
      </View>
      {renderClientModal()}

    </View>
  )
}

export default RequestedToursScreen

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
  bookingCardAlt: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  bookingThumbWrap: {
    marginRight: 12,
  },
  bookingThumb: {
    width: 84,
    height: 84,
    borderRadius: 10,
    backgroundColor: '#eef2f7'
  },
  bookingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a'
  },
  bookingMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 6
  },
  bookingTime: {
    fontSize: 13,
    color: '#475569',
    marginTop: 6
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#fef3c7'
  },
  statusPrimary: {
    backgroundColor: '#e0f2fe'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e'
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#111827'
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalBtnText: {
    marginLeft: 8,
    fontWeight: '700'
  }
})
