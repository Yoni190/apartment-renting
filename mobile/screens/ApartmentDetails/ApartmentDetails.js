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
  Linking,
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
  const [heroIndex, setHeroIndex] = useState(0)

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

  function getImageUrl(img) {
    if (!img) return null
    if (img.url) return img.url
    if (img.path) return `${API_URL}/storage/${img.path}`
    return img
  }

  // Format date string as dd-MM-yyyy (fallback to input if invalid)
  const formatDate = (input) => {
    if (!input) return ''
    const d = new Date(input)
    if (isNaN(d)) return input
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  const formatTime = (input) => {
    if (!input) return ''
    // assume input is HH:MM or ISO time
    if (/^\d{2}:\d{2}/.test(input)) return input.slice(0,5)
    const d = new Date(input)
    if (isNaN(d)) return input
    const hh = String(d.getHours()).padStart(2, '0')
    const mi = String(d.getMinutes()).padStart(2, '0')
    return `${hh}:${mi}`
  }

  // Build human-friendly tour string if meta contains tour info
  const tourInfoText = (() => {
    const meta = listing?.meta || {}
    if (!meta) return null
    // Accept several patterns: meta.open_for_tour true + dates in meta.open_for_tour_dates or separate keys
    const tour = meta.open_for_tour
    if (!tour && !meta.open_for_tour_dates && !meta.tour_from_date && !meta.open_for_tour_from_date) return null

    // Collect date/time values from common keys
    const fromDate = meta.open_for_tour_dates?.from || meta.tour_from_date || meta.open_for_tour_from_date || meta.open_for_tour_from || meta.open_for_tour?.from_date
    const toDate = meta.open_for_tour_dates?.to || meta.tour_to_date || meta.open_for_tour_to_date || meta.open_for_tour?.to_date
    const fromTime = meta.open_for_tour_dates?.start_time || meta.tour_from_time || meta.open_for_tour_from_time || meta.open_for_tour?.from_time || meta.open_for_tour?.start_time
    const toTime = meta.open_for_tour_dates?.end_time || meta.tour_to_time || meta.open_for_tour_to_time || meta.open_for_tour?.to_time || meta.open_for_tour?.end_time

    if (fromDate || toDate || fromTime || toTime) {
      const fd = formatDate(fromDate) || ''
      const td = formatDate(toDate) || ''
      const ft = formatTime(fromTime) || ''
      const tt = formatTime(toTime) || ''
      const datePart = fd && td ? `${fd} to ${td}` : fd || td || ''
      const timePart = ft && tt ? `from ${ft} to ${tt}` : ft || tt ? `from ${ft || tt}` : ''
      return `${datePart}${datePart && timePart ? ' ' : ''}${timePart}`.trim()
    }

    // If meta.open_for_tour is boolean true but no dates, show 'Open for tours'
    if (tour === true || tour === 'true') return 'Open for tours'
    return null
  })()

  // Address composition: prefer structured meta.location fields when present
  const addressFromMeta = (() => {
    const loc = listing?.meta?.location || listing?.location || {}
    const parts = []
    if (loc.city) parts.push(loc.city)
    if (loc.subcity) parts.push(loc.subcity)
    if (loc.area) parts.push(loc.area)
    if (loc.landmark) parts.push(loc.landmark)
    if (parts.length > 0) return parts.join(', ')
    return listing?.address || ''
  })()

  // Map coordinates (if provided in meta.location)
  const coords = (() => {
    const loc = listing?.meta?.location || listing?.location || {}
    const lat = loc.lat || loc.latitude || loc.lat_dd || null
    const lng = loc.lng || loc.longitude || loc.lon || loc.lng_dd || null
    if (lat && lng) return { lat, lng }
    return null
  })()

  const openDirections = async () => {
    if (!coords) return Alert.alert('No location', 'No coordinates available')
    const { lat, lng } = coords
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    try {
      await Linking.openURL(url)
    } catch (e) {
      Alert.alert('Error', 'Could not open maps')
    }
  }

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

  // Helper: pretty format keys from snake_case or camelCase to Title Case
  const formatKey = (key) => {
    if (!key) return ''
    // replace underscores and dashes, split camelCase
    const spaced = key
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    return spaced
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')
  }

  // Recursive renderer for owner-provided meta values
  const renderMetaValue = (value) => {
    if (value === null || value === undefined) return <Text style={styles.metaValue}>—</Text>
    if (Array.isArray(value)) {
      return (
        <View>
          {value.map((v, i) => (
            <Text key={i} style={styles.metaValue}>- {typeof v === 'object' ? JSON.stringify(v) : String(v)}</Text>
          ))}
        </View>
      )
    }
    if (typeof value === 'object') {
      return (
        <View>
          {Object.entries(value).map(([k, v]) => (
            <View key={k} style={{ marginBottom: 6 }}>
              <Text style={[styles.metaKey, { width: '100%', fontWeight: '600' }]}>{formatKey(k)}</Text>
              <Text style={styles.metaValue}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</Text>
            </View>
          ))}
        </View>
      )
    }
    return <Text style={styles.metaValue}>{String(value)}</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <Header title={listing.title || 'Listing'} />

      {/* Hero image */}
      {Array.isArray(listing?.images) && listing.images.length > 0 ? (
        <View>
          <Image source={{ uri: getImageUrl(listing.images[heroIndex]) }} style={styles.apartmentImage} />
        </View>
      ) : null}

      {/* Owner controls */}
      {isOwner && (
        <View style={styles.ownerControls}>
          <TouchableOpacity style={styles.ownerBtn} onPress={handleEdit}><Text style={styles.ownerBtnText}>Edit</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.ownerBtn, styles.deactivate]} onPress={handleDeactivate}><Text style={[styles.ownerBtnText, { color: '#333' }]}>Deactivate</Text></TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Header section: title + last updated */}
        <View style={styles.content}>
          {listing.title ? <Text style={styles.title}>{listing.title}</Text> : null}
          {overallPriceRange ? <Text style={styles.price}>{overallPriceRange}</Text> : null}
          {listing.updated_at ? <Text style={styles.updated}>Last updated: {new Date(listing.updated_at).toLocaleString()}</Text> : null}

          {/* Location */}
          {listing.address ? (
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>{listing.address}</Text>
            </View>
          ) : null}

          {/* Badges */}
          <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {tourInfoText ? <View style={styles.badge}><Text style={styles.badgeText}>{tourInfoText}</Text></View> : null}
            {listing.meta?.allow_phone ? <View style={styles.badge}><Text style={styles.badgeText}>Phone enabled</Text></View> : null}
          </View>

          {/* Location */}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Location</Text>
          {addressFromMeta ? <Text style={styles.locationText}>{addressFromMeta}</Text> : null}
          {coords ? (
            <View style={{ marginTop: 8 }}>
              <View style={styles.mapBox}>
                <Text style={styles.mapText}>Map location: {coords.lat}, {coords.lng}</Text>
              </View>
              <View style={{ marginTop: 8 }}>
                <TouchableOpacity style={styles.directionsBtn} onPress={openDirections} accessibilityRole="button">
                  <Text style={styles.directionsText}>Directions</Text>
                </TouchableOpacity>
              </View>
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

          {/* Amenities (owner-provided only) - comma-separated */}
          {Array.isArray(listing.meta?.amenities) && listing.meta.amenities.length > 0 ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Amenities</Text>
              <Text style={{ color: '#374151', marginTop: 6 }}>{listing.meta.amenities.join(', ')}</Text>
            </>
          ) : null}

          {/* Utilities (owner-provided) - comma-separated if present */}
          {Array.isArray(listing.meta?.utilities) && listing.meta.utilities.length > 0 ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Utilities</Text>
              <Text style={{ color: '#374151', marginTop: 6 }}>{listing.meta.utilities.join(', ')}</Text>
            </>
          ) : null}

          {/* Owner provided raw/meta data - show everything owner entered */}
          {listing.meta && Object.keys(listing.meta).length > 0 ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Owner provided data</Text>
              <View style={styles.metaBox}>
                {Object.entries(listing.meta).map(([k, v]) => (
                  <View key={k} style={styles.metaRow}>
                    <Text style={styles.metaKey}>{formatKey(k)}</Text>
                    <View style={{ flex: 1 }}>{renderMetaValue(v)}</View>
                  </View>
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
