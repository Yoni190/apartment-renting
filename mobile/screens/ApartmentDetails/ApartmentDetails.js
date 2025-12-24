import React, { useEffect, useState, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import Header from '../../components/Header'
import styles from './ApartmentDetailsStyle'

const { width } = Dimensions.get('window')
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'

/**
 * ApartmentDetails (ListingDetails)
 * - Expects route.params.listingId
 * - Fetches `/apartments/{id}` and renders only owner-provided fields.
 */
export default function ApartmentDetails() {
  const route = useRoute()
  const navigation = useNavigation()
  const listingId = route.params?.listingId || route.params?.id

  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState(null)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    if (!listingId) return

    const load = async () => {
      setLoading(true)
      try {
        const token = await SecureStore.getItemAsync('token')

        // fetch listing
        const res = await axios.get(`${API_URL}/apartments/${listingId}`, {
          headers: { Accept: 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
        })
        setListing(res.data)

        // fetch user if token available (to determine owner controls)
        if (token) {
          try {
            const u = await axios.get(`${API_URL}/user`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
            setUser(u.data)
          } catch (e) {
            // ignore; user remains null
          }
        }
      } catch (e) {
        console.warn('Failed to load listing', e.message)
        Alert.alert('Error', 'Could not load listing')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [listingId])

  const isOwner = useMemo(() => {
    if (!listing || !user) return false
    // API may return user_id or owner.id
    return listing.user_id === user.id || (listing.user && listing.user.id === user.id)
  }, [listing, user])

  // floor plan filtering helpers
  const floorPlans = listing?.floor_plans || []

  const filteredPlans = useMemo(() => {
    if (activeTab === 'All') return floorPlans
    if (activeTab === 'Studio') return floorPlans.filter(p => (p.beds === 0) || (p.name && p.name.toLowerCase().includes('studio')))
    if (activeTab === '1 Bed') return floorPlans.filter(p => p.beds === 1)
    if (activeTab === '2 Beds') return floorPlans.filter(p => p.beds === 2)
    if (activeTab === '3+ Beds') return floorPlans.filter(p => p.beds >= 3)
    return floorPlans
  }, [floorPlans, activeTab])

  const overallPriceRange = listing?.price_range
  const overallBedroomRange = listing?.bedroom_range

  const handleTour = () => {
    Alert.alert('Tour', 'Request a tour — not yet implemented')
  }

  const handleMessage = () => {
    // navigate to in-app Messages
    navigation.navigate('Messages', { apartmentId: listingId })
  }

  const handleCall = () => {
    const phone = listing?.meta?.contact_phone || listing?.contact_phone
    if (!phone) return Alert.alert('No phone', 'No contact phone provided')
    // For mobile you can use Linking.openURL(`tel:${phone}`)
    Alert.alert('Call', phone)
  }

  const handleEdit = () => {
    navigation.navigate('EditListing', { listingId })
  }

  const handleDeactivate = async () => {
    Alert.alert('Deactivate', 'Deactivate listing? (not implemented)')
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Listing" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    )
  }

  if (!listing) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Listing" />
        <View style={{ padding: 20 }}>
          <Text>Listing not found.</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Helper: render units table rows
  const renderUnits = (units) => {
    if (!Array.isArray(units) || units.length === 0) return null
    return (
      <View style={styles.unitsTable}>
        <View style={[styles.unitsRow, styles.unitsHeader]}>
          <Text style={styles.unitCell}>Unit</Text>
          <Text style={styles.unitCell}>Price</Text>
          <Text style={styles.unitCell}>Sqft</Text>
          <Text style={styles.unitCell}>Availability</Text>
        </View>
        {units.map((u) => (
          <View key={u.unit_number || u.id} style={styles.unitsRow}>
            <Text style={styles.unitCell}>{u.unit_number}</Text>
            <Text style={styles.unitCell}>{u.base_price}</Text>
            <Text style={styles.unitCell}>{u.sqft}</Text>
            <Text style={styles.unitCell}>{u.availability || u.available_from || '—'}</Text>
          </View>
        ))}
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title={listing.title || 'Listing'} />

      {/* Owner controls */}
      {isOwner && (
        <View style={styles.ownerControls}>
          <TouchableOpacity style={styles.ownerBtn} onPress={handleEdit}><Text style={styles.ownerBtnText}>Edit</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.ownerBtn, styles.deactivate]} onPress={handleDeactivate}><Text style={[styles.ownerBtnText, { color: '#333' }]}>Deactivate</Text></TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header section: title + last updated */}
        <View style={styles.content}>
          {listing.title ? <Text style={styles.title}>{listing.title}</Text> : null}
          {listing.updated_at ? <Text style={styles.updated}>Last updated: {new Date(listing.updated_at).toLocaleString()}</Text> : null}

          {/* Location */}
          {listing.address ? (
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>{listing.address}</Text>
            </View>
          ) : null}

          {/* Pricing & Floor Plans */}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Pricing & Floor Plans</Text>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {['All', 'Studio', '1 Bed', '2 Beds', '3+ Beds'].map((t) => (
              <TouchableOpacity key={t} onPress={() => setActiveTab(t)} style={[styles.tab, activeTab === t && styles.tabActive]}>
                <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Floor plans list */}
          {filteredPlans.length === 0 ? (
            <Text style={{ marginTop: 12 }}>No floor plans provided.</Text>
          ) : (
            filteredPlans.map((plan) => (
              <View key={plan.id} style={styles.floorPlanCard}>
                <View style={styles.floorHeader}>
                  <View style={{ flex: 1 }}>
                    {plan.name ? <Text style={styles.floorName}>{plan.name}</Text> : null}
                    {plan.price_range ? <Text style={styles.floorPrice}>{plan.price_range}</Text> : null}
                    <Text style={styles.floorMeta}>{plan.beds != null ? `${plan.beds} bd` : ''}{plan.baths != null ? ` • ${plan.baths} ba` : ''}{plan.sqft ? ` • ${plan.sqft} sqft` : ''}</Text>
                    {typeof plan.available_units === 'number' ? <Text style={styles.small}>{plan.available_units} units available</Text> : null}
                  </View>

                  {plan.image ? (
                    <Image source={{ uri: plan.image }} style={styles.floorImage} />
                  ) : null}
                </View>

                <View style={styles.floorActions}>
                  <TouchableOpacity onPress={() => navigation.navigate('FloorPlanDetails', { planId: plan.id })} style={styles.linkBtn}>
                    <Text style={styles.linkText}>Floor Plan Details</Text>
                  </TouchableOpacity>
                </View>

                {/* Units table for this plan */}
                {renderUnits(plan.units)}
              </View>
            ))
          )}

          {/* Amenities (owner-provided only) */}
          {Array.isArray(listing.meta?.amenities) && listing.meta.amenities.length > 0 ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {listing.meta.amenities.map((a) => (
                  <View key={a} style={styles.badge}><Text style={styles.badgeText}>{a}</Text></View>
                ))}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      {/* Bottom sticky action bar */}
      <View style={styles.stickyBar}>
        <View style={styles.barInfo}>
          {overallPriceRange ? <Text style={styles.barPrice}>{overallPriceRange}</Text> : null}
          {overallBedroomRange ? <Text style={styles.barBed}>{overallBedroomRange}</Text> : null}
        </View>

        <View style={styles.barActions}>
          {listing.meta?.open_for_tour ? (
            <TouchableOpacity style={styles.barBtn} onPress={handleTour}><Text style={styles.barBtnText}>Tour</Text></TouchableOpacity>
          ) : null}

          <TouchableOpacity style={styles.barBtn} onPress={handleMessage}><Text style={styles.barBtnText}>Message</Text></TouchableOpacity>

          {(listing.meta?.allow_phone || listing.allow_phone) && (listing.meta?.contact_phone || listing.contact_phone) ? (
            <TouchableOpacity style={[styles.barBtn, styles.callBtn]} onPress={handleCall}><Text style={styles.barBtnText}>Call</Text></TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  )
}
