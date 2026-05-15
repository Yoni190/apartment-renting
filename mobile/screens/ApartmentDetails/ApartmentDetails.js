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
  TextInput
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import Header from '../../components/Header'
import styles from './ApartmentDetailsStyle'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { colors, spacing, radius, shadows, typography } from '../../theme'

const { width } = Dimensions.get('window')
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'

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
  const [selectedDateIndex, setSelectedDateIndex] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const flatListRef = useRef(null)

  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)

  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    if (!listingId) return

    const load = async () => {
      setLoading(true)
      try {
        const token = await SecureStore.getItemAsync('token')

        const res = await axios.get(`${API_URL}/api/apartments/${listingId}`, {
          headers: { Accept: 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
        })
        setListing(res.data)
        setIsFavourite(res.data.is_favorite || false)

        if (res.data.owner) {
          setOwner(res.data.owner)
        }

        if (token) {
          try {
            const u = await axios.get(`${API_URL}/api/user`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
            setUser(u.data)
          } catch (e) {
          }
              try {
                const oftRaw = res.data?.meta?.open_for_tour || res.data?.meta?.openForTour || null
                let oft = null
                if (oftRaw) {
                  oft = typeof oftRaw === 'string' ? JSON.parse(oftRaw) : oftRaw
                }
                if (oft) {
                  setOpenHours([oft])
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
    fetchReviews()
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

  const images = useMemo(() => {
    if (!listing?.images || !Array.isArray(listing.images)) return []
    return listing.images.map(img => getImageUrl(img)).filter(Boolean)
  }, [listing])

  const formatDate = (input) => {
    if (!input) return ''
    const d = new Date(input)
    if (isNaN(d.getTime())) return input
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

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

  const coords = useMemo(() => {
    const loc = listing?.meta?.location || listing?.location || {}
    const lat = loc.lat || loc.latitude || loc.lat_dd || null
    const lng = loc.lng || loc.longitude || loc.lon || loc.lng_dd || null
    if (lat && lng) return { lat, lng }
    return null
  }, [listing])

  const ownerName = useMemo(() => {
    if (owner?.name) return owner.name
    if (listing?.owner?.name) return listing.owner.name
    if (listing?.user?.name) return listing.user.name
    return 'N/A'
  }, [owner, listing])

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
          await Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`)
        }
      } catch (e) {
        console.warn('Error opening maps', e)
        Alert.alert('Error', 'Could not open maps application')
      }
    } else if (addressText) {
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

  const amenitiesList = useMemo(() => {
    const candidates = [
      listing?.meta?.amenities,
      listing?.amenities,
      listing?.meta?.amenity,
      listing?.amenity,
      listing?.meta?.amenities_list,
    ]

    let amens = null
    for (const c of candidates) {
      if (c !== undefined && c !== null) {
        amens = c
        break
      }
    }

    if (!amens) return []

    if (Array.isArray(amens)) return amens

    if (typeof amens === 'object') {
      try {
        const keys = Object.keys(amens)
        if (keys.length > 0) return keys.filter(k => !!amens[k])
      } catch (e) {
      }
      return []
    }

    if (typeof amens === 'string') {
      let s = amens.trim()

      for (let i = 0; i < 2; i++) {
        if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) {
          try {
            const parsed = JSON.parse(s)
            if (Array.isArray(parsed)) return parsed.map(p => String(p).trim()).filter(Boolean)
            if (typeof parsed === 'object' && parsed !== null) {
              const keys = Object.keys(parsed)
              if (keys.length > 0) return keys.filter(k => !!parsed[k])
            }
            s = typeof parsed === 'string' ? parsed : String(parsed)
          } catch (e) {
            break
          }
        } else {
          break
        }
      }

      const parts = s.split(/\r?\n|,/).map(p => p.trim()).filter(Boolean)
      return parts.length > 0 ? parts : [s]
    }
    return []
  }, [listing])

  const getAmenityEmoji = (amenity) => {
    if (!amenity) return '✔️'
    const s = String(amenity).toLowerCase()
    if (s.includes('wifi') || s.includes('internet')) return '📶'
    if (s.includes('park') || s.includes('parking')) return '🚗'
    if (s.includes('pool')) return '🏊'
    if (s.includes('ac') || s.includes('air')) return '❄️'
    if (s.includes('tv') || s.includes('television')) return '📺'
    if (s.includes('washer') || s.includes('laundry')) return '🧺'
    if (s.includes('gym') || s.includes('fitness')) return '🏋️'
    if (s.includes('kitchen')) return '🍽️'
    if (s.includes('heating') || s.includes('heater')) return '🔥'
    if (s.includes('security') || s.includes('guard')) return '🔒'
    if (s.includes('pet')) return '🐶'
    return '✔️'
  }

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
        await axios.delete(`${API_URL}/api/apartments/${listingId}/favorite`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        setIsFavourite(false)
      } else {
        await axios.post(`${API_URL}/api/apartments/${listingId}/favorite`, {}, {
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

      const oft = getMetaOpenForTour()
      const dates = buildAvailableDates(oft)
      setAvailableDates(dates)
      setSelectedDateIndex(null)
      setSelectedDate(null)
      setSelectedTime(null)
      setShowAllDates(false)
      setTourPanelVisible(true)
    })()
  }

  useEffect(() => {
    if (!tourPanelVisible) return undefined

    const refresh = () => {
      const oft = getMetaOpenForTour()
      const dates = buildAvailableDates(oft)
      setAvailableDates(dates)
      if (selectedDateIndex !== null) {
        const slots = generateTimeSlots(oft?.time_from || oft?.timeFrom, oft?.time_to || oft?.timeTo, 30, availableDates[selectedDateIndex])
        if (!slots || slots.length === 0) {
          setSelectedDateIndex(null)
          setSelectedDate(null)
          setSelectedTime(null)
        }
      }
    }

    refresh()
    const id = setInterval(refresh, 60 * 1000)
    return () => clearInterval(id)
  }, [tourPanelVisible, selectedDateIndex])

  const getMetaOpenForTour = () => {
    try {
      const oftRaw = listing?.meta?.open_for_tour || listing?.meta?.openForTour || null
      if (!oftRaw) return null
      return typeof oftRaw === 'string' ? JSON.parse(oftRaw) : oftRaw
    } catch (e) {
      return null
    }
  }

  const generateTimeSlots = (timeFrom, timeTo, intervalMinutes = 30, forDate = null) => {
    const normalize = t => {
      const parts = String(t).split(':')
      const hh = parseInt(parts[0] || '0', 10)
      const mm = parseInt(parts[1] || '0', 10)
      return { hh, mm }
    }
    const from = normalize(timeFrom)
    const to = normalize(timeTo)
    const slots = []
    const now = new Date()

    const cur = forDate ? new Date(forDate) : new Date()
    cur.setHours(from.hh, from.mm, 0, 0)
    const end = forDate ? new Date(forDate) : new Date()
    end.setHours(to.hh, to.mm, 0, 0)

    while (cur <= end) {
      slots.push(new Date(cur))
      cur.setTime(cur.getTime() + intervalMinutes * 60000)
    }

    return slots.filter(s => s.getTime() >= now.getTime())
  }

  const buildAvailableDates = (oft, maxDays = 14) => {
    const dates = []
    if (!oft) return dates
    try {
      const from = oft.date_from ? new Date(oft.date_from) : null
      const to = oft.date_to ? new Date(oft.date_to) : null

      const pushDatesBetween = (start, end) => {
        let cur = new Date(start)
        let added = 0
        while (cur <= end && added < maxDays) {
          const slots = generateTimeSlots(oft.time_from || oft.timeFrom, oft.time_to || oft.timeTo, 30, cur)
          if (slots.length > 0) {
            dates.push(new Date(cur))
            added++
          }
          cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000)
        }
      }

      if (from && to) {
        pushDatesBetween(from, to)
      } else if (from && !to) {
        pushDatesBetween(from, new Date(from.getTime() + (maxDays - 1) * 24 * 60 * 60 * 1000))
      } else if (!from && to) {
        pushDatesBetween(new Date(), to)
      } else {
        pushDatesBetween(new Date(), new Date(new Date().getTime() + (maxDays - 1) * 24 * 60 * 60 * 1000))
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

  const formatDatePill = (d) => {
    if (!d) return ''
    try {
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      const day = days[d.getDay()]
      const month = months[d.getMonth()]
      const dateNum = d.getDate()
      return `${day}, ${month} ${dateNum}`
    } catch (e) {
      return String(d)
    }
  }

  const formatTime12FromHHMM = (hhmm) => {
    if (!hhmm || typeof hhmm !== 'string') return hhmm
    const parts = hhmm.split(':')
    if (parts.length < 2) return hhmm
    const hh = parseInt(parts[0], 10)
    const mm = parseInt(parts[1], 10)
    if (isNaN(hh) || isNaN(mm)) return hhmm
    const ampm = hh < 12 ? 'AM' : 'PM'
    const hour12 = hh % 12 === 0 ? 12 : hh % 12
    return `${hour12}:${String(mm).padStart(2, '0')} ${ampm}`
  }

  const formatTime12FromDate = (d) => {
    if (!d) return ''
    try {
      const hh = d.getHours()
      const mm = d.getMinutes()
      return formatTime12FromHHMM(`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`)
    } catch (e) {
      return ''
    }
  }

  const onSelectDate = (index) => {
    setSelectedDateIndex(index)
  }

  const submitBookingForPill = async (timeStr) => {
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
      await axios.post(`${API_URL}/api/apartments/${listingId}/book-tour`, { date: dateStr, time: timeOnly }, {
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
  const oftObj = getMetaOpenForTour()
  const slots = generateTimeSlots(oftObj.time_from || oftObj.timeFrom, oftObj.time_to || oftObj.timeTo, 30, date)
  setTimeSlots(slots)
    setTimeSlotsModalVisible(true)
  }

  const selectTimeSlot = async (slot) => {
    setTimeSlotsModalVisible(false)
    if (!selectedDate) return
    const combined = new Date(selectedDate)
    combined.setHours(slot.getHours(), slot.getMinutes(), 0, 0)

    try {
      setBookingLoading(true)
      const token = await SecureStore.getItemAsync('token')
      const dateStr = combined.toISOString().slice(0,10)
      const timeStr = combined.toTimeString().slice(0,5)
      const res = await axios.post(`${API_URL}/api/apartments/${listingId}/book-tour`, { date: dateStr, time: timeStr }, {
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

const submitReview = async () => {
    if (!rating) {
      Alert.alert('Rating required', 'Please select a star rating')
      return
    }

    try {
      setReviewLoading(true)

      const token = await SecureStore.getItemAsync('token')
      if (!token) {
        Alert.alert('Login required', 'Please log in to submit a review')
        return
      }

      await axios.post(
        `${API_URL}/api/apartments/${listingId}/reviews`,
        {
          rating,
          comment: reviewText,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      Alert.alert('Success', 'Your review has been submitted 🎉')

      setRating(0)
      setReviewText('')

      fetchReviews()

    } catch (err) {
      console.warn('Review error', err.response?.data || err.message)
      const message = err.response?.data?.message || 'Failed to submit review'
      Alert.alert('Error', message)
    } finally {
      setReviewLoading(false)
    }
  }


  const fetchReviews = async () => {
    if (!listingId) return

    try {
      setReviewsLoading(true)

      const res = await axios.get(
        `${API_URL}/api/apartments/${listingId}/reviews`,
        { headers: { Accept: 'application/json' } }
      )

      setReviews(res.data.reviews || [])
      setAverageRating(res.data.average_rating || 0)
      setTotalReviews(res.data.total_reviews || 0)

    } catch (err) {
      console.warn('Failed to load reviews', err.message)
    } finally {
      setReviewsLoading(false)
    }
  }



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
        <View style={{ padding: spacing.xl }}>
          <Text>Listing not found.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
                  color={isFavourite ? colors.heartActive : colors.textSecondary} 
                />
              </TouchableOpacity>
            )}
          </View>

          {addressText ? <Text style={styles.headerAddress}>{addressText}</Text> : null}

          <TouchableOpacity style={styles.mapButton} onPress={openMap}>
            <Ionicons name="map-outline" size={20} color={colors.white} />
            <Text style={styles.mapButtonText}>View Map</Text>
          </TouchableOpacity>

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
                  }

                  return raw.split('\n').map((feature, index) => {
                    const trimmed = feature.trim()
                    if (!trimmed) return null
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

        {/* Ratings & Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ratings & Reviews</Text>

          <View style={styles.ratingSummary}>
            <Text style={styles.ratingValue}>{averageRating ? averageRating.toFixed(1) : '0.0'}</Text>

            <View style={styles.starsRow}>
              {[1,2,3,4,5].map((i) => (
                <Ionicons
                  key={i}
                  name={
                    averageRating >= i
                      ? 'star'
                      : averageRating >= i - 0.5
                      ? 'star-half'
                      : 'star-outline'
                  }
                  size={18}
                  color="#fbbf24"
                />
              ))}
            </View>

          <Text style={styles.reviewCount}>
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </Text>
          </View>

          {/* Write a Review */}
          <View style={styles.writeReviewCard}>
            <Text style={styles.writeReviewTitle}>Write a Review</Text>

            <View style={styles.writeStarsRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity key={value} onPress={() => setRating(value)}>
                  <Ionicons
                    name={value <= rating ? 'star' : 'star-outline'}
                    size={28}
                    color="#fbbf24"
                  />
                </TouchableOpacity>
              ))}
            </View>


            <View style={styles.reviewInputMock}>
              <TextInput
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Share your experience about this apartment..."
                multiline
                style={styles.reviewInput}
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <TouchableOpacity
              onPress={submitReview}
              style={styles.submitReviewBtn}
              disabled={reviewLoading}
              activeOpacity={0.8}>
              {reviewLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="send-outline" size={16} color={colors.white} />
                  <Text style={styles.submitReviewText}>Submit Review</Text>
                </>
              )}
            </TouchableOpacity>
          </View>


          {reviewsLoading && (
            <Text style={{ padding: spacing.md }}>Loading reviews...</Text>
          )}

          {!reviewsLoading && reviews.length === 0 && (
            <Text style={{ padding: spacing.md, color: colors.textSecondary }}>
              No reviews yet. Be the first to review!
            </Text>
          )}

          {reviews.slice(0, 3).map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>
                  {review.user?.name || 'Anonymous'}
                </Text>

                <View style={styles.starsRowSmall}>
                  {[1,2,3,4,5].map((i) => (
                    <Ionicons
                      key={i}
                      name={review.rating >= i ? 'star' : 'star-outline'}
                      size={14}
                      color="#fbbf24"
                    />
                  ))}
                </View>
              </View>

              {review.comment ? (
                <Text style={styles.reviewText}>{review.comment}</Text>
              ) : null}
            </View>
          ))}


          {totalReviews > 3 && (
              <TouchableOpacity
                style={styles.viewAllReviewsBtn}
                onPress={() =>
                  navigation.navigate('ApartmentReviews', {
                    apartmentId: listingId,
                    apartmentTitle: listing.title,
                  })
                }
              >
                <Text style={styles.viewAllReviewsText}>View all reviews</Text>
              </TouchableOpacity>
          )}
          
        </View>


        {/* Amenities Section */}
        {amenitiesList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {amenitiesList.map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Text style={styles.amenityEmoji}>{getAmenityEmoji(amenity)}</Text>
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
          <Ionicons name="calendar-outline" size={22} color={colors.primary} />
          <Text style={styles.bottomNavButtonText}>Tour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavButton} onPress={handleMessage}>
          <Ionicons name="chatbubble-outline" size={22} color={colors.primary} />
          <Text style={styles.bottomNavButtonText}>Message</Text>
        </TouchableOpacity>
        {ownerPhone && (
          <TouchableOpacity style={styles.bottomNavButton} onPress={handleCall}>
            <Ionicons name="call-outline" size={22} color={colors.primary} />
            <Text style={styles.bottomNavButtonText}>Call</Text>
          </TouchableOpacity>
        )}
      </View>
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

      {timeSlotsModalVisible && (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 120, bottom: 0, backgroundColor: colors.overlay, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '90%', maxHeight: '60%', backgroundColor: colors.white, borderRadius: radius.sm, padding: spacing.md }}>
            <Text style={{ fontWeight: '600', marginBottom: spacing.sm }}>Select a time</Text>
            <ScrollView>
              {timeSlots.map((s, idx) => (
                <TouchableOpacity key={idx} onPress={() => selectTimeSlot(s)} style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <Text>{formatTime12FromDate(s)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setTimeSlotsModalVisible(false)} style={{ marginTop: spacing.sm, padding: spacing.sm }}>
              <Text style={{ textAlign: 'center', color: colors.danger }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {tourPanelVisible && (
        <View style={styles.tourPanelOverlay}>
          <View style={styles.tourPanel}>
            <View style={styles.tourPanelHeader}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: spacing.xs }}>Request a tour</Text>
              <Text style={{ color: colors.textSecondary }}>Choose a date and available time</Text>
            </View>

            <View style={styles.tourPanelBody}>
              {(!availableDates || availableDates.length === 0) ? (
                <View style={{ padding: spacing.xxl, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.sm }}>No open slots available right now.</Text>
                  <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>Please try again later.</Text>
                </View>
              ) : (
                <View style={styles.tourPanelContent}>
                  <View style={styles.datesColumn}>
                    <ScrollView contentContainerStyle={styles.dateList}>
                      {(showAllDates ? availableDates : availableDates.slice(0, 3)).map((d, i) => (
                        <TouchableOpacity
                          key={i}
                          style={[styles.dateListItem, i === selectedDateIndex && styles.dateListItemActive]}
                          onPress={() => {
                            onSelectDate(i)
                            setSelectedDate(availableDates[i])
                            setSelectedTime(null)
                          }}
                        >
                          <Text style={[styles.dateListItemText, i === selectedDateIndex && styles.dateListItemTextActive, { textAlign: 'center' }]}>{formatDatePill(d)}</Text>
                          <Text style={[styles.dateListItemSub, { textAlign: 'center' }]}>{formatDate(d)}</Text>
                        </TouchableOpacity>
                      ))}

                      {availableDates.length > 3 && (
                        <TouchableOpacity style={styles.showMoreButton} onPress={() => setShowAllDates((p) => !p)}>
                          <Text style={styles.showMoreText}>{showAllDates ? 'Show less' : 'Show more dates'}</Text>
                        </TouchableOpacity>
                      )}
                    </ScrollView>
                  </View>

                  <View style={styles.timesColumn}>
                    {selectedDateIndex === null ? (
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: colors.textSecondary }}>Please pick a date above to see available times</Text>
                      </View>
                    ) : (
                      (() => {
                        const oft = getMetaOpenForTour()
                        if (!oft) return <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>No time range set</Text>
                        const slots = generateTimeSlots(oft.time_from || oft.timeFrom, oft.time_to || oft.timeTo, 30, availableDates[selectedDateIndex])
                        if (!slots || slots.length === 0) {
                          return (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
                              <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>No open times for this date. Please pick another date.</Text>
                            </View>
                          )
                        }
                        return (
                          <ScrollView contentContainerStyle={styles.timeList}>
                            {slots.map((s, idx) => {
                              const timeStr = `${String(s.getHours()).padStart(2, '0')}:${String(s.getMinutes()).padStart(2, '0')}`
                              return (
                                <TouchableOpacity key={idx} style={[styles.timeListItem, selectedTime === timeStr && styles.timeListItemActive]} onPress={() => setSelectedTime(timeStr)}>
                                  <Text style={[styles.timeListItemText, selectedTime === timeStr && styles.timeListItemTextActive]}>{formatTime12FromHHMM(timeStr)}</Text>
                                </TouchableOpacity>
                              )
                            })}
                          </ScrollView>
                        )
                      })()
                    )}
                  </View>
                </View>
              )}
            </View>

            <View style={styles.tourPanelFooter}>
              {selectedTime ? (
                <TouchableOpacity style={styles.confirmBtn} onPress={() => submitBookingForPill(selectedTime)} disabled={bookingLoading}>
                  {bookingLoading ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.confirmBtnText}>Request tour — {availableDates[selectedDateIndex] ? `${formatDate(availableDates[selectedDateIndex])} ${formatTime12FromHHMM(selectedTime)}` : formatTime12FromHHMM(selectedTime)}</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={{ height: 0 }} />
              )}

              <TouchableOpacity onPress={() => setTourPanelVisible(false)} style={styles.cancelBtnFooter}>
                <Text style={styles.cancelBtnFooterText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}
