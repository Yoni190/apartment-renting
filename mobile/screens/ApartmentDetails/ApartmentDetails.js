import React, { useEffect, useState, useMemo, useRef } from 'react'
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
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import Header from '../../components/Header'
import styles from './ApartmentDetailsStyle'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

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
  const [owner, setOwner] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [isFavourite, setIsFavourite] = useState(false)
  const [favouriteLoading, setFavouriteLoading] = useState(false)
  const [openHours, setOpenHours] = useState([])
  const [isDatePickerVisible, setDatePickerVisible] = useState(false)
  const [isTimePickerVisible, setTimePickerVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [timeSlotsModalVisible, setTimeSlotsModalVisible] = useState(false)
  const [timeSlots, setTimeSlots] = useState([])
  const [tourPanelVisible, setTourPanelVisible] = useState(false)
  const [availableDates, setAvailableDates] = useState([])
  const [showAllDates, setShowAllDates] = useState(false)
  const [selectedDateIndex, setSelectedDateIndex] = useState(0)
  const [bookingLoading, setBookingLoading] = useState(false)
  const flatListRef = useRef(null)

  useEffect(() => {
    if (!listingId) return

    const load = async () => {
      setLoading(true)
      try {
        const token = await SecureStore.getItemAsync('token')

        // fetch listing
        //add
        //add2
        //add3
        //pull
        //pull2
        //pull3
        //pull4
        const res = await axios.get(`${API_URL}/apartments/${listingId}`, {
          headers: { Accept: 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
        })
        setListing(res.data)
        setIsFavourite(res.data.is_favorite || false)

        // Owner data should be included in the listing response
        if (res.data.owner) {
          setOwner(res.data.owner)
        }

        // fetch user if token available (to determine owner controls)
        if (token) {
          try {
            const u = await axios.get(`${API_URL}/user`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
            setUser(u.data)
          } catch (e) {
            // ignore; user remains null
          }
              // use open_for_tour from listing meta (authoritative)
              try {
                const oftRaw = res.data?.meta?.open_for_tour || res.data?.meta?.openForTour || null
                let oft = null
                if (oftRaw) {
                  oft = typeof oftRaw === 'string' ? JSON.parse(oftRaw) : oftRaw
                }
                if (oft) {
                  setOpenHours([oft]) // store single meta object for simplicity
                } else {
                  setOpenHours([])
                }
              } catch (e) {
                setOpenHours([])
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
    return listing.user_id === user.id || (listing.user && listing.user.id === user.id)
  }, [listing, user])

  function getImageUrl(img) {
    if (!img) return null
    if (img.url) return img.url
    if (img.path) return `${API_URL}/storage/${img.path}`
    return img
  }

  // Get all images from listing
  const images = useMemo(() => {
    if (!listing?.images || !Array.isArray(listing.images)) return []
    return listing.images.map(img => getImageUrl(img)).filter(Boolean)
  }, [listing])

  // Format date string as dd-MM-yyyy
  const formatDate = (input) => {
    if (!input) return ''
    const d = new Date(input)
    if (isNaN(d.getTime())) return input
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  // Address composition: prefer structured meta.location fields when present
  const addressText = useMemo(() => {
    const loc = listing?.meta?.location || listing?.location || {}
    const parts = []
    if (loc.city) parts.push(loc.city)
    if (loc.subcity) parts.push(loc.subcity)
    if (loc.area) parts.push(loc.area)
    if (loc.landmark) parts.push(loc.landmark)
    if (parts.length > 0) return parts.join(', ')
    return listing?.address || ''
  }, [listing])

  // Map coordinates
  const coords = useMemo(() => {
    const loc = listing?.meta?.location || listing?.location || {}
    const lat = loc.lat || loc.latitude || loc.lat_dd || null
    const lng = loc.lng || loc.longitude || loc.lon || loc.lng_dd || null
    if (lat && lng) return { lat, lng }
    return null
  }, [listing])

  // Owner name - try multiple sources
  const ownerName = useMemo(() => {
    if (owner?.name) return owner.name
    if (listing?.owner?.name) return listing.owner.name
    if (listing?.user?.name) return listing.user.name
    return 'N/A'
  }, [owner, listing])

  // Owner phone
  const ownerPhone = useMemo(() => {
    return listing?.meta?.contact_phone || listing?.contact_phone || owner?.phone_number || listing?.owner?.phone_number || listing?.user?.phone_number || null
  }, [listing, owner])

  const openMap = async () => {
    if (coords) {
      const { lat, lng } = coords
      const url = Platform.select({
        ios: `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`,
        android: `google.navigation:q=${lat},${lng}`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      })
      try {
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
          await Linking.openURL(url)
        } else {
          // Fallback to Google Maps web
          await Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`)
        }
      } catch (e) {
        console.warn('Error opening maps', e)
        Alert.alert('Error', 'Could not open maps application')
      }
    } else if (addressText) {
      // Use address for search if coordinates not available
      const encodedAddress = encodeURIComponent(addressText)
      const url = Platform.select({
        ios: `maps://maps.apple.com/?q=${encodedAddress}`,
        android: `geo:0,0?q=${encodedAddress}`,
        default: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      })
      try {
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
          await Linking.openURL(url)
        } else {
          await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`)
        }
      } catch (e) {
        console.warn('Error opening maps', e)
        Alert.alert('Error', 'Could not open maps application')
      }
    } else {
      Alert.alert('No location', 'No location information available for this property')
    }
  }

  // Parse utilities - handle both array and string
  const utilitiesList = useMemo(() => {
    const utils = listing?.meta?.utilities
    if (!utils) return []
    if (Array.isArray(utils)) return utils
    if (typeof utils === 'string') {
      try {
        const parsed = JSON.parse(utils)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return [utils]
      }
    }
    return []
  }, [listing])

  // Parse amenities - handle both array and string
  const amenitiesList = useMemo(() => {
    const amens = listing?.meta?.amenities
    if (!amens) return []
    if (Array.isArray(amens)) return amens
    if (typeof amens === 'string') {
      try {
        const parsed = JSON.parse(amens)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return [amens]
      }
    }
    return []
  }, [listing])

  const handleFavourite = async () => {
    if (!user || !listingId) return
    
    setFavouriteLoading(true)
    try {
      const token = await SecureStore.getItemAsync('token')
      if (!token) {
        Alert.alert('Error', 'Please log in to save favorites')
        return
      }

      if (isFavourite) {
        // Remove from favorites
        await axios.delete(`${API_URL}/apartments/${listingId}/favorite`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        setIsFavourite(false)
      } else {
        // Add to favorites
        await axios.post(`${API_URL}/apartments/${listingId}/favorite`, {}, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        setIsFavourite(true)
      }
    } catch (error) {
      console.warn('Failed to toggle favorite', error)
      Alert.alert('Error', 'Failed to update favorite')
    } finally {
      setFavouriteLoading(false)
    }
  }

  const handleTour = () => {
    (async () => {
      const token = await SecureStore.getItemAsync('token')
      if (!token) {
        Alert.alert('Login required', 'Please log in to request a tour')
        return
      }

      if (!openHours || openHours.length === 0) {
        Alert.alert('Not available', 'This listing does not have open hours set by the owner')
        return
      }

      // build available dates and show the tour panel (date pills + time pills)
      const oft = getMetaOpenForTour()
      const dates = buildAvailableDates(oft)
      setAvailableDates(dates)
      setSelectedDateIndex(0)
      setShowAllDates(false)
      setTourPanelVisible(true)
    })()
  }

  const getMetaOpenForTour = () => {
    try {
      const oftRaw = listing?.meta?.open_for_tour || listing?.meta?.openForTour || null
      if (!oftRaw) return null
      return typeof oftRaw === 'string' ? JSON.parse(oftRaw) : oftRaw
    } catch (e) {
      return null
    }
  }

  const generateTimeSlots = (timeFrom, timeTo, intervalMinutes = 30) => {
    // timeFrom/timeTo are strings like '09:00' or '09:00:00'
    const normalize = t => {
      const parts = String(t).split(':')
      const hh = parseInt(parts[0] || '0', 10)
      const mm = parseInt(parts[1] || '0', 10)
      return { hh, mm }
    }
    const from = normalize(timeFrom)
    const to = normalize(timeTo)
    const slots = []
    let cur = new Date()
    cur.setHours(from.hh, from.mm, 0, 0)
    const end = new Date()
    end.setHours(to.hh, to.mm, 0, 0)
    while (cur <= end) {
      slots.push(new Date(cur))
      cur = new Date(cur.getTime() + intervalMinutes * 60000)
    }
    return slots
  }

  // Build an array of available date objects (Date) from meta.open_for_tour
  const buildAvailableDates = (oft, maxDays = 14) => {
    const dates = []
    if (!oft) return dates
    try {
      const from = oft.date_from ? new Date(oft.date_from) : null
      const to = oft.date_to ? new Date(oft.date_to) : null
      if (from && to) {
        // clamp to maxDays to avoid huge lists
        let cur = new Date(from)
        let added = 0
        while (cur <= to && added < maxDays) {
          dates.push(new Date(cur))
          cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000)
          added++
        }
      } else if (from && !to) {
        let cur = new Date(from)
        for (let i = 0; i < maxDays; i++) {
          dates.push(new Date(cur))
          cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000)
        }
      } else if (!from && to) {
        let cur = new Date()
        let added = 0
        while (cur <= to && added < maxDays) {
          dates.push(new Date(cur))
          cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000)
          added++
        }
      } else {
        // fallback: next maxDays days
        let cur = new Date()
        for (let i = 0; i < maxDays; i++) {
          dates.push(new Date(cur))
          cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    } catch (e) {
      return []
    }
    return dates
  }

  const formatDateShort = (d) => {
    if (!d) return ''
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    return `${days[d.getDay()]} ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
  }

  const onSelectDate = (index) => {
    setSelectedDateIndex(index)
  }

  const submitBookingForPill = async (timeStr) => {
    // timeStr like '09:00'
    const dateObj = availableDates[selectedDateIndex]
    if (!dateObj) return Alert.alert('Error', 'No date selected')
    const combined = new Date(dateObj)
    const parts = timeStr.split(':')
    combined.setHours(parseInt(parts[0],10), parseInt(parts[1],10), 0, 0)

    try {
      setBookingLoading(true)
      const token = await SecureStore.getItemAsync('token')
      const dateStr = combined.toISOString().slice(0,10)
      const timeOnly = combined.toTimeString().slice(0,5)
      await axios.post(`${API_URL}/apartments/${listingId}/book-tour`, { date: dateStr, time: timeOnly }, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
      })
      Alert.alert('Success', 'Tour requested — the owner will receive a notification.')
      setTourPanelVisible(false)
    } catch (err) {
      console.warn('Booking failed', err.response?.data || err.message)
      const message = err.response?.data?.message || 'Failed to request tour'
      Alert.alert('Error', message)
    } finally {
      setBookingLoading(false)
    }
  }

  const onConfirmDate = (date) => {
    const oft = getMetaOpenForTour()
    if (!oft) {
      setDatePickerVisible(false)
      Alert.alert('Not available', 'This listing does not have open for tour information set by the owner.')
      return
    }
    // validate date within date_from..date_to if provided
    if (oft.date_from || oft.date_to) {
      const from = oft.date_from ? new Date(oft.date_from) : null
      const to = oft.date_to ? new Date(oft.date_to) : null
      if (from && date < new Date(from.toDateString())) {
        Alert.alert('Invalid date', 'Selected date is before allowed window.')
        setDatePickerVisible(true)
        return
      }
      if (to && date > new Date(to.toDateString())) {
        Alert.alert('Invalid date', 'Selected date is after allowed window.')
        setDatePickerVisible(true)
        return
      }
    }

    setSelectedDate(date)
    setDatePickerVisible(false)
    // create timeslots from meta time range and show modal
    const oftObj = getMetaOpenForTour()
    const slots = generateTimeSlots(oftObj.time_from || oftObj.timeFrom, oftObj.time_to || oftObj.timeTo, 30)
    setTimeSlots(slots)
    setTimeSlotsModalVisible(true)
  }

  const selectTimeSlot = async (slot) => {
    setTimeSlotsModalVisible(false)
    if (!selectedDate) return
    // combine selectedDate and slot time
    const combined = new Date(selectedDate)
    combined.setHours(slot.getHours(), slot.getMinutes(), 0, 0)

    // submit booking
    try {
      setBookingLoading(true)
      const token = await SecureStore.getItemAsync('token')
      const dateStr = combined.toISOString().slice(0,10)
      const timeStr = combined.toTimeString().slice(0,5)
      const res = await axios.post(`${API_URL}/apartments/${listingId}/book-tour`, { date: dateStr, time: timeStr }, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
      })
      Alert.alert('Success', 'Tour requested — the owner will receive a notification.')
    } catch (err) {
      console.warn('Booking failed', err.response?.data || err.message)
      const message = err.response?.data?.message || 'Failed to request tour'
      Alert.alert('Error', message)
    } finally {
      setBookingLoading(false)
    }
  }

  const onCancelDate = () => setDatePickerVisible(false)
  const onCancelTime = () => setTimePickerVisible(false)

  const handleMessage = () => {
    navigation.navigate('Messages', { apartmentId: listingId })
  }

  const handleCall = () => {
    if (!ownerPhone) {
      Alert.alert('No phone', 'No contact phone provided')
      return
    }
    const phoneUrl = `tel:${ownerPhone}`
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert('Error', 'Could not make phone call')
    })
  }

  // Get floor plan data (first one or default values)
  const floorPlan = useMemo(() => {
    const plans = listing?.floor_plans || []
    if (plans.length > 0) {
      const plan = plans[0]
      return {
        name: plan.name || 'No name',
        beds: plan.beds ?? plan.bedrooms ?? 0,
        baths: plan.baths ?? plan.bathrooms ?? 0,
        price: plan.price_range || plan.price || listing?.price || listing?.meta?.price_range || 'N/A',
        available_from: plan.available_from || plan.available_units || listing?.meta?.available_from || listing?.meta?.availability || null,
        image: plan.image || (images.length > 0 ? images[0] : null),
      }
    }
    // If no floor plans, use listing data
    const price = listing?.price || listing?.meta?.price_range || 'N/A'
    const formattedPrice = typeof price === 'number' ? `$${price.toLocaleString()}` : price
    return {
      name: listing?.title || 'No name',
      beds: listing?.bedrooms || 0,
      baths: listing?.bathrooms || 0,
      price: formattedPrice,
      available_from: listing?.meta?.available_from || listing?.meta?.availability || null,
      image: images.length > 0 ? images[0] : null,
    }
  }, [listing, images])

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Listing Details" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    )
  }

  if (!listing) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Listing Details" />
        <View style={{ padding: 20 }}>
          <Text>Listing not found.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <Header title={listing.title || 'Listing Details'} />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Slider */}
        {images.length > 0 && (
          <View style={styles.imageContainer}>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => String(index)}
              onMomentumScrollEnd={(e) => {
                const contentOffsetX = e.nativeEvent.contentOffset.x
                const index = Math.round(contentOffsetX / width)
                setImageIndex(index)
              }}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.heroImage} resizeMode="cover" />
              )}
            />
            {images.length > 1 && (
              <View style={styles.imageDots}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[styles.dot, index === imageIndex && styles.activeDot]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <Text style={styles.listingTitle}>{listing.title || 'No Title'}</Text>
            {!isOwner && (
              <TouchableOpacity onPress={handleFavourite} style={styles.favouriteButton}>
                <Ionicons 
                  name={isFavourite ? 'heart' : 'heart-outline'} 
                  size={28} 
                  color={isFavourite ? '#e0245e' : '#666'} 
                />
              </TouchableOpacity>
            )}
          </View>

          {addressText ? <Text style={styles.headerAddress}>{addressText}</Text> : null}

          <TouchableOpacity style={styles.mapButton} onPress={openMap}>
            <Ionicons name="map-outline" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>View Map</Text>
          </TouchableOpacity>

          {/* Last updated date */}
          {listing?.updated_at && (
            <Text style={styles.updatedText}>Last Updated: {formatDate(listing.updated_at)}</Text>
          )}

          <View style={styles.ownerSection}>
            <Text style={styles.ownerLabel}>OWNED/MANAGED BY:</Text>
            <Text style={styles.ownerName}>{ownerName}</Text>
          </View>
        </View>

        {/* Pricing and Floor Plans Section */}
        <View style={styles.section}>
          {/* Unique features (owner provided) - show as bullets above floor plans */}
          {Array.isArray(listing.meta?.unique_features) && listing.meta.unique_features.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Unique features</Text>
              <View style={{ marginBottom: 8 }}>
                {listing.meta.unique_features.map((f, i) => (
                  <Text key={i} style={{ marginBottom: 4 }}>• {f}</Text>
                ))}
              </View>
            </>
          ) : null}

          <Text style={styles.sectionTitle}>Pricing & Floor Plans</Text>
          <View style={styles.floorPlanCard}>
            {floorPlan.image && (
              <Image source={{ uri: floorPlan.image }} style={styles.floorPlanImage} resizeMode="cover" />
            )}
            <View style={styles.floorPlanContent}>
              <Text style={styles.floorPlanName}>{floorPlan.name || 'No name'}</Text>
              <View style={styles.floorPlanDetails}>
                <Text style={styles.floorPlanMeta}>
                  {floorPlan.beds || 0} Bed{floorPlan.beds !== 1 ? 's' : ''}
                </Text>
                <Text style={styles.floorPlanSeparator}>•</Text>
                <Text style={styles.floorPlanMeta}>
                  {floorPlan.baths || 0} Bath{floorPlan.baths !== 1 ? 's' : ''}
                </Text>
              </View>
              <Text style={styles.floorPlanPrice}>{floorPlan.price}</Text>
              {floorPlan.available_from && (
                <Text style={styles.availableDate}>
                  Available on: {formatDate(floorPlan.available_from)}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {addressText ? <Text style={styles.aboutText}>{addressText}</Text> : null}
          <View style={styles.propertyInfoRow}>
            <Text style={styles.propertyInfoLabel}>Property ID:</Text>
            <Text style={styles.propertyInfoValue}>{listing.id || 'N/A'}</Text>
          </View>
          <View style={styles.propertyInfoRow}>
            <Text style={styles.propertyInfoLabel}>Purpose:</Text>
            <Text style={styles.propertyInfoValue}>
              {listing.meta?.purpose || listing.purpose || 'Rent'}
            </Text>
          </View>
          {listing.description ? (
            <Text style={styles.descriptionText}>{listing.description}</Text>
          ) : null}
        </View>

        {/* Unique Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unique Features</Text>
          
          {/* Owner's unique features description with bullets */}
          {listing.meta?.unique_features && (
            <View style={styles.uniqueFeaturesDescription}>
              {Array.isArray(listing.meta.unique_features) ? (
                listing.meta.unique_features.map((feature, index) => (
                  <View key={index} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{feature}</Text>
                  </View>
                ))
              ) : typeof listing.meta.unique_features === 'string' ? (
                (() => {
                  const raw = listing.meta.unique_features
                  // If string looks like JSON array (e.g. "[\"a\",\"b\"]"), try parse
                  try {
                    const maybe = raw.trim()
                    if ((maybe.startsWith('[') && maybe.endsWith(']')) || (maybe.startsWith('{') && maybe.endsWith('}'))) {
                      const parsed = JSON.parse(maybe)
                      if (Array.isArray(parsed)) {
                        return parsed.map((feature, index) => (
                          <View key={index} style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>{String(feature).trim()}</Text>
                          </View>
                        ))
                      }
                    }
                  } catch (e) {
                    // fall through to newline split
                  }

                  return raw.split('\n').map((feature, index) => {
                    const trimmed = feature.trim()
                    if (!trimmed) return null
                    // Remove bullet if already present
                    const cleanFeature = trimmed.replace(/^[•\-\*]\s*/, '')
                    return (
                      <View key={index} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{cleanFeature}</Text>
                      </View>
                    )
                  })
                })()
              ) : null}
            </View>
          )}

          {/* Structured unique features */}
          <View style={styles.featuresGrid}>
            {listing.meta?.floor && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Floor</Text>
                <Text style={styles.featureValue}>{listing.meta.floor}</Text>
              </View>
            )}
            {(listing.meta?.furnishing_status || listing.meta?.furnishing) && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Furnishing Status</Text>
                <Text style={styles.featureValue}>{listing.meta.furnishing_status || listing.meta.furnishing}</Text>
              </View>
            )}
            {(listing.meta?.availability || listing.meta?.available_from) && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Availability</Text>
                <Text style={styles.featureValue}>
                  {listing.meta.availability || formatDate(listing.meta.available_from)}
                </Text>
              </View>
            )}
            {listing.meta?.min_stay && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Min Stay</Text>
                <Text style={styles.featureValue}>{listing.meta.min_stay}</Text>
              </View>
            )}
            {utilitiesList.length > 0 && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Utilities</Text>
                <Text style={styles.featureValue}>{utilitiesList.join(', ')}</Text>
              </View>
            )}
            {listing.meta?.payment_period && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Payment Period</Text>
                <Text style={styles.featureValue}>{listing.meta.payment_period}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Amenities Section */}
        {amenitiesList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {amenitiesList.map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Ionicons name="checkmark-circle" size={18} color="#0ea5a4" style={styles.amenityIcon} />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contacts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacts</Text>
          {ownerPhone ? (
            <Text style={styles.contactPhone}>{ownerPhone}</Text>
          ) : (
            <Text style={styles.contactPhone}>No phone number provided</Text>
          )}
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButtonPrimary} onPress={handleTour}>
              <Text style={styles.contactButtonText}>Request Tour</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButtonSecondary} onPress={handleMessage}>
              <Text style={styles.contactButtonTextSecondary}>Message</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ownerContactSection}>
            <Text style={styles.ownerContactLabel}>Owned/Managed by:</Text>
            <Text style={styles.ownerContactName}>{ownerName}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.bottomNavButton} onPress={handleTour}>
          <Ionicons name="calendar-outline" size={22} color="#1778f2" />
          <Text style={styles.bottomNavButtonText}>Tour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavButton} onPress={handleMessage}>
          <Ionicons name="chatbubble-outline" size={22} color="#1778f2" />
          <Text style={styles.bottomNavButtonText}>Message</Text>
        </TouchableOpacity>
        {ownerPhone && (
          <TouchableOpacity style={styles.bottomNavButton} onPress={handleCall}>
            <Ionicons name="call-outline" size={22} color="#1778f2" />
            <Text style={styles.bottomNavButtonText}>Call</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Date & Time pickers for booking */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={onConfirmDate}
        onCancel={onCancelDate}
        minimumDate={(() => {
          const oft = listing?.meta?.open_for_tour ? (typeof listing.meta.open_for_tour === 'string' ? JSON.parse(listing.meta.open_for_tour) : listing.meta.open_for_tour) : null
          return oft && oft.date_from ? new Date(oft.date_from) : undefined
        })()}
        maximumDate={(() => {
          const oft = listing?.meta?.open_for_tour ? (typeof listing.meta.open_for_tour === 'string' ? JSON.parse(listing.meta.open_for_tour) : listing.meta.open_for_tour) : null
          return oft && oft.date_to ? new Date(oft.date_to) : undefined
        })()}
      />
      {/* time is selected from generated slots modal; no free-form time picker shown */}

      {/* Modal list of generated time slots (strict) */}
      {timeSlotsModalVisible && (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 120, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '90%', maxHeight: '60%', backgroundColor: '#fff', borderRadius: 8, padding: 12 }}>
            <Text style={{ fontWeight: '600', marginBottom: 8 }}>Select a time</Text>
            <ScrollView>
              {timeSlots.map((s, idx) => (
                <TouchableOpacity key={idx} onPress={() => selectTimeSlot(s)} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                  <Text>{s.toTimeString().slice(0,5)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setTimeSlotsModalVisible(false)} style={{ marginTop: 8, padding: 8 }}>
              <Text style={{ textAlign: 'center', color: '#d00' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Apartments.com-like Tour Panel: date pills + time pills */}
      {tourPanelVisible && (
        <View style={styles.tourPanelOverlay}>
          <View style={styles.tourPanel}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Request a tour</Text>
            <Text style={{ color: '#6b7280', marginBottom: 12 }}>Choose a date and available time</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datePillsRow}>
              {(showAllDates ? availableDates : availableDates.slice(0,7)).map((d, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.datePill, i === selectedDateIndex && styles.datePillActive]}
                  onPress={() => onSelectDate(i)}
                >
                  <Text style={[{ fontWeight: '700' }, i === selectedDateIndex && { color: '#fff' }]}>{formatDateShort(d)}</Text>
                </TouchableOpacity>
              ))}
              {availableDates.length > 7 && (
                <TouchableOpacity style={styles.showMoreButton} onPress={() => setShowAllDates(prev => !prev)}>
                  <Text style={styles.showMoreText}>{showAllDates ? 'Show less' : `+${availableDates.length - 7} more`}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <View style={styles.timePillsWrap}>
              {/* generate time pills from meta */}
              {(() => {
                const oft = getMetaOpenForTour()
                if (!oft) return <Text style={{ color: '#6b7280' }}>No time range set</Text>
                const slots = generateTimeSlots(oft.time_from || oft.timeFrom, oft.time_to || oft.timeTo, 30)
                // render as 'HH:MM' pills
                return (
                  <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {slots.map((s, idx) => (
                      <TouchableOpacity key={idx} style={styles.timePill} onPress={() => submitBookingForPill(`${String(s.getHours()).padStart(2,'0')}:${String(s.getMinutes()).padStart(2,'0')}`)}>
                        <Text style={{ fontWeight: '600' }}>{`${String(s.getHours()).padStart(2,'0')}:${String(s.getMinutes()).padStart(2,'0')}`}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )
              })()}
            </View>

            <View style={{ marginTop: 12 }}>
              <TouchableOpacity onPress={() => setTourPanelVisible(false)} style={{ padding: 10 }}>
                <Text style={{ textAlign: 'center', color: '#d00' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}
