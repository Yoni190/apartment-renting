import React from 'react'
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import styles from '../screens/TourScreen/TourScreenStyle'

const safeUri = (img) => img?.url || (img?.path ? `${process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'}/storage/${img.path}` : null)

export default function TourRequestCard({ booking, isOwner=false, onOpenClient=()=>{}, onOpenOwner=()=>{}, onApprove=()=>{}, onReject=()=>{}, updatingBookingId=null, updatingBookingAction=null, onViewDetails=()=>{} }){
  const listing = booking.listing || {}
  const client = booking.user || {}
  const scheduled = booking.scheduled_at ? new Date(booking.scheduled_at) : null

  return (
    <View style={{ width: '100%' }}>
      <View style={styles.bookingCardAlt}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={styles.bookingThumbWrap}>
            <TouchableOpacity onPress={() => onViewDetails(listing.id)}>
              {listing.images && listing.images[0] ? (
                <Image source={{ uri: safeUri(listing.images[0]) }} style={styles.bookingThumb} />
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
                  <TouchableOpacity style={[styles.splitBtn, { backgroundColor: '#2563eb' }]} onPress={() => onOpenOwner({ ...listing.owner, listingId: listing.id, navigateToMessages: true })}>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color="#fff" />
                    <Text style={styles.splitBtnText}>Message</Text>
                  </TouchableOpacity>
                  {listing.owner && (listing.owner.phone || listing.owner.phone_number) ? (
                    <TouchableOpacity style={[styles.splitBtn, { backgroundColor: '#10b981', marginLeft: 8 }]} onPress={() => { const phone = listing.owner.phone || listing.owner.phone_number; if (phone) { Linking.openURL(`tel:${phone}`).catch(()=>{}) } else { Alert.alert('No phone available') } }}>
                      <Ionicons name="call" size={16} color="#fff" />
                      <Text style={styles.splitBtnText}>Call</Text>
                    </TouchableOpacity>
                  ) : null}
                </>
              )}
            </View>
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
