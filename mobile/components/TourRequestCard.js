import React from 'react'
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import styles from '../screens/TourScreen/TourScreenStyle'

const safeUri = (img) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'
  if (!img) return null

  // if the image is already a URL string
  if (typeof img === 'string') {
    if (img.startsWith('http')) return img
    if (img.startsWith('/')) return `${API_URL}${img}`
    // assume it's a storage path
    return `${API_URL}/storage/${img}`
  }

  // If object, try several common fields
  const url = img.url || img.uri || img.preview || img.thumb || img.thumbnail
  if (url) {
    if (typeof url === 'string') {
      if (url.startsWith('http')) return url
      if (url.startsWith('/')) return `${API_URL}${url}`
      return `${API_URL}/storage/${url}`
    }
  }

  const path = img.path || img.filename || img.file
  if (path) {
    if (typeof path === 'string') {
      if (path.startsWith('http')) return path
      if (path.startsWith('/')) return `${API_URL}${path}`
      return `${API_URL}/storage/${path}`
    }
  }

  return null
}

export default function TourRequestCard({ booking, isOwner=false, onOpenClient=()=>{}, onOpenOwner=()=>{}, onApprove=()=>{}, onReject=()=>{}, onCancel=()=>{}, updatingBookingId=null, updatingBookingAction=null, onViewDetails=()=>{} }){
  // bookings from different endpoints may name the relation differently
  const listing = booking.listing || booking.apartment || booking.property || {}
  const client = booking.user || {}
  const scheduled = booking.scheduled_at ? new Date(booking.scheduled_at) : null

  // Support different shapes returned by the API: listing.images may be an array, an object with data, or images may be strings
  const firstImage = (() => {
    if (!listing) return null
    // direct array of image objects or strings
    if (Array.isArray(listing.images) && listing.images.length > 0) return listing.images[0]
    // nested resource envelope { data: [...] }
    if (listing.images && Array.isArray(listing.images.data) && listing.images.data.length > 0) return listing.images.data[0]
    // single image field
    if (listing.image) return listing.image
    if (listing.thumbnail) return listing.thumbnail
    // fallback to media/gallery
    if (Array.isArray(listing.media) && listing.media.length > 0) return listing.media[0]
    return null
  })()

  const imageUri = safeUri(firstImage)

  return (
    <View style={{ width: '100%' }}>
      <View style={styles.bookingCardAlt}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={styles.bookingThumbWrap}>
            <TouchableOpacity onPress={() => onViewDetails(listing.id)}>
                {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.bookingThumb} />
              ) : (
                <View style={[styles.bookingThumb, { justifyContent: 'center', alignItems: 'center' }]}> 
                  <Ionicons name="home-outline" size={28} color="#9ca3af" />
                </View>
              )}
            </TouchableOpacity>

            <View style={{ marginTop: 8, alignItems: 'center' }}>
              <View style={[styles.statusBadge, (booking.status || '').toString().toLowerCase() === 'pending' ? styles.statusPending : styles.statusPrimary]}>
                <Text style={styles.statusText}>{(booking.status || 'pending').toString().toUpperCase()}</Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.bookingTitle}>{listing.title || 'Listing'}</Text>
            <Text style={styles.bookingMeta}>{isOwner ? (client.name || client.email || 'Client') : (listing.owner?.name || listing.owner?.email || 'Owner')}</Text>
            <Text style={styles.bookingTime}>{scheduled ? scheduled.toLocaleString() : 'No time set'}</Text>

            <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
              {isOwner ? (
                <>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => onOpenClient({ ...client, listingId: listing.id })}>
                    <Ionicons name="person-circle-outline" size={18} color="#0f172a" />
                    <Text style={styles.actionText}>Client</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn} onPress={() => { const phone = client.phone || client.phone_number || client.phoneNumber; if (phone) { Linking.openURL(`tel:${phone}`).catch(()=>{}) } else { Alert.alert('No phone number available') } }}>
                    <Ionicons name="call-outline" size={18} color="#059669" />
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn} onPress={() => onOpenClient({ ...client, listingId: listing.id, navigateToMessages: true })}>
                    <Ionicons name="chatbubble-ellipses-outline" size={18} color="#2563eb" />
                    <Text style={styles.actionText}>Message</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Render owner actions in the compact style (same as owner sees client) */}
                  <TouchableOpacity style={styles.actionBtn} onPress={() => onOpenOwner({ ...listing.owner, listingId: listing.id })}>
                    <Ionicons name="person-circle-outline" size={18} color="#0f172a" />
                    <Text style={styles.actionText}>Owner</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn} onPress={() => onOpenOwner({ ...listing.owner, listingId: listing.id, navigateToMessages: true })}>
                    <Ionicons name="chatbubble-ellipses-outline" size={18} color="#2563eb" />
                    <Text style={styles.actionText}>Message</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn} onPress={() => { const phone = listing.owner?.phone || listing.owner?.phone_number || listing.owner?.phoneNumber; if (phone) { Linking.openURL(`tel:${phone}`).catch(()=>{}) } else { Alert.alert('No phone available') } }}>
                    <Ionicons name="call-outline" size={18} color="#059669" />
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Client: show Cancel action when booking is Pending */}
            {!isOwner && (booking.status || '').toString() === 'Pending' ? (
              <View style={styles.pendingFooter}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => onCancel ? onCancel(booking.id) : null}
                  activeOpacity={0.85}
                >
                  {updatingBookingId === booking.id && updatingBookingAction === 'cancel' ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="close-circle" size={18} color="#fff" style={{ marginRight: 10 }} />
                      <Text style={styles.cancelBtnText}>Cancel Tour</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

        </View>

        {/* Owner actions: full-width split buttons under status */}
        {isOwner && (booking.status || '').toString().toLowerCase() === 'pending' ? (
          <View style={styles.pendingFooter}>
            <TouchableOpacity style={[styles.pendingBtnLeft, { backgroundColor: '#10b981' }]} onPress={() => onApprove(booking.id)}>
              {updatingBookingId === booking.id && updatingBookingAction === 'approve' ? <ActivityIndicator color="#fff" /> : <Text style={styles.splitBtnText}>Approve</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pendingBtnRight, { backgroundColor: '#ef4444' }]} onPress={() => onReject(booking.id)}>
              {updatingBookingId === booking.id && updatingBookingAction === 'reject' ? <ActivityIndicator color="#fff" /> : <Text style={styles.splitBtnText}>Reject</Text>}
            </TouchableOpacity>
          </View>
        ) : null}

      </View>
    </View>
  )
}
