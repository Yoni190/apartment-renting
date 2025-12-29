import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Modal, Linking, Alert } from 'react-native'
import Header from '../../components/Header'
import { ArrowUpDown, SlidersHorizontal, Search } from 'lucide-react-native'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import styles from './TourScreenStyle'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'

/*
  OwnerTours: default export (used by OwnerTabs)
  MyTours: named export (used by HomeTabs)
*/

const OwnerTours = () => {
  const navigation = useNavigation()
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [updatingBookingId, setUpdatingBookingId] = useState(null)

  useEffect(() => {
    ;(async () => {
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

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      setUpdatingBookingId(bookingId)
      const token = await SecureStore.getItemAsync('token')
      if (!token) throw new Error('Unauthenticated')
      await axios.patch(`${API_URL}/tour-bookings/${bookingId}`, { status }, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
      setBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, status } : b)))
    } catch (e) {
      console.warn('Failed to update booking status', e.message)
      Alert.alert('Error', 'Could not update booking status')
    } finally {
      setUpdatingBookingId(null)
    }
  }

  const renderBookingItem = ({ item }) => {
    const scheduled = item.scheduled_at ? new Date(item.scheduled_at) : null
    const listing = item.listing || {}
    const client = item.user || {}

    return (
      <View style={{ width: '100%' }}>
        <View style={styles.bookingCardAlt}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={styles.bookingThumbWrap}>
              <TouchableOpacity onPress={() => navigation.navigate('ApartmentDetails', { listingId: listing.id })}>
                {listing.images && listing.images[0] ? (
                  <Image source={{ uri: listing.images[0].url || `${API_URL}/storage/${listing.images[0].path}` }} style={styles.bookingThumb} />
                ) : (
                  <View style={[styles.bookingThumb, { justifyContent: 'center', alignItems: 'center' }]}> 
                    <Ionicons name="home-outline" size={28} color="#9ca3af" />
                  </View>
                )}
              </TouchableOpacity>

              <View style={{ marginTop: 8, alignItems: 'center' }}>
                <View style={[styles.statusBadge, item.status === 'pending' ? styles.statusPending : styles.statusPrimary]}>
                  <Text style={styles.statusText}>{(item.status || 'pending').toUpperCase()}</Text>
                </View>
              </View>
            </View>

            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.bookingTitle}>{listing.title || 'Listing'}</Text>
              <Text style={styles.bookingMeta}>{client.name || client.email || 'Client'}</Text>
              <Text style={styles.bookingTime}>{scheduled ? scheduled.toLocaleString() : 'No time set'}</Text>

              <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
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

          {/* Full-width approve/reject buttons inside the card (footer) */}
          {item.status === 'pending' ? (
            <View style={styles.pendingFooter}>
              <TouchableOpacity style={[styles.pendingBtnLeft, { backgroundColor: '#10b981' }]} onPress={() => handleUpdateStatus(item.id, 'approved')}>
                {updatingBookingId === item.id ? <ActivityIndicator color="#fff" /> : <Text style={styles.splitBtnText}>Approve</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.pendingBtnRight, { backgroundColor: '#ef4444' }]} onPress={() => handleUpdateStatus(item.id, 'rejected')}>
                {updatingBookingId === item.id ? <ActivityIndicator color="#fff" /> : <Text style={styles.splitBtnText}>Reject</Text>}
              </TouchableOpacity>
            </View>
          ) : null}

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
        <View style={styles.searchBox}>
          <Search size={18} color="#777" style={{ marginRight: 8 }} />
          <TextInput placeholder="Search..." placeholderTextColor="#999" style={styles.textInput} />
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <SlidersHorizontal size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <ArrowUpDown size={20} color="#333" />
        </TouchableOpacity>
      </View>

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

export function MyTours() {
  const navigation = useNavigation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState(null)
  const [ownerModalVisible, setOwnerModalVisible] = useState(false)

  useEffect(() => {
    ;(async () => {
      const token = await SecureStore.getItemAsync('token')
      if (!token) return
      setLoading(true)
      try {
        const res = await axios.get(`${API_URL}/my-tours`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
        setBookings(res.data.bookings || [])
      } catch (e) {
        console.warn('Failed to fetch my tours', e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const renderItem = ({ item }) => {
    const scheduled = item.scheduled_at ? new Date(item.scheduled_at) : null
    const listing = item.listing || {}
    const owner = listing.owner || {}
    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.thumbWrap} onPress={() => navigation.navigate('ApartmentDetails', { listingId: listing.id })}>
          {listing.images && listing.images[0] ? (
            <Image source={{ uri: listing.images[0].url || `${API_URL}/storage/${listing.images[0].path}` }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="home-outline" size={28} color="#9ca3af" />
            </View>
          )}
        </TouchableOpacity>

        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.title}>{listing.title || 'Listing'}</Text>
          <TouchableOpacity onPress={() => { setSelectedOwner({ ...owner, listingId: listing.id }); setOwnerModalVisible(true) }}>
            <Text style={styles.meta}>Owner: {owner.name || owner.email || 'Owner'}</Text>
          </TouchableOpacity>
          <Text style={styles.time}>{scheduled ? scheduled.toLocaleString() : 'No time set'}</Text>
          <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
            <View style={[styles.statusBadge, item.status === 'pending' ? styles.statusPending : styles.statusPrimary]}>
              <Text style={styles.statusText}>{(item.status || 'pending').toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {owner.phone || owner.phone_number ? (
                <View style={{ flexDirection: 'row', width: 160, borderRadius: 8, overflow: 'hidden' }}>
                  <TouchableOpacity style={[styles.splitBtn, { backgroundColor: '#2563eb' }]} onPress={() => navigation.navigate('Messages', { apartmentId: listing.id, userId: owner.id })}>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color="#fff" />
                    <Text style={styles.splitBtnText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.splitBtn, { backgroundColor: '#10b981' }]} onPress={() => { const phone = owner.phone || owner.phone_number; if (phone) { Linking.openURL(`tel:${phone}`).catch(()=>{}) } else { Alert.alert('No phone available') } }}>
                    <Ionicons name="call" size={16} color="#fff" />
                    <Text style={styles.splitBtnText}>Call</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={[styles.splitBtn, { backgroundColor: '#2563eb' }]} onPress={() => navigation.navigate('Messages', { apartmentId: listing.id, userId: owner.id })}>
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color="#fff" />
                  <Text style={styles.splitBtnText}>Message</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('ApartmentDetails', { listingId: listing.id })}>
                <Ionicons name="information-circle-outline" size={16} color="#fff" />
                <Text style={[styles.splitBtnText, { color: '#fff' }]}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

  const renderOwnerModal = () => {
    const o = selectedOwner || {}
    return (
      <Modal visible={ownerModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="person-outline" size={34} color="#4f46e5" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>{o.name || o.email || 'Owner'}</Text>
                <Text style={{ color: '#6b7280', marginTop: 4 }}>{o.email || ''}</Text>
                {o.phone || o.phone_number ? <Text style={{ color: '#6b7280', marginTop: 4 }}>Phone: {o.phone || o.phone_number}</Text> : null}
              </View>
              <TouchableOpacity onPress={() => setOwnerModalVisible(false)}>
                <Ionicons name="close" size={22} color="#374151" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#10b981' }]} onPress={() => { const phone = o.phone || o.phone_number; if (phone) { Linking.openURL(`tel:${phone}`).catch(()=>{}) } else { Alert.alert('No phone available') } }}>
                <Ionicons name="call" size={18} color="#fff" />
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#2563eb', marginLeft: 8 }]} onPress={() => { setOwnerModalVisible(false); navigation.navigate('Messages', { userId: o.id }) }}>
                <Ionicons name="chatbubbles" size={18} color="#fff" />
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#f97316', marginLeft: 8 }]} onPress={() => { setOwnerModalVisible(false); navigation.navigate('ApartmentDetails', { listingId: o.listingId }) }}>
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
      <Header title="My Tours" />
      <View style={{ paddingHorizontal: 16, paddingTop: 110, paddingBottom: 24 }}>
        {loading ? <ActivityIndicator /> : bookings.length === 0 ? <Text style={{ color: '#6b7280' }}>No tours found.</Text> : (
          <FlatList data={bookings} keyExtractor={(b) => String(b.id)} renderItem={renderItem} ItemSeparatorComponent={() => <View style={{ height: 12 }} />} />
        )}
      </View>
      {renderOwnerModal()}
    </View>
  )
}

export default OwnerTours
