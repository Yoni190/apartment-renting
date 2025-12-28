import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
  Keyboard,
  Modal,
  KeyboardAvoidingView,
  findNodeHandle
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import styles from './AddListingStyle'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import MapView, { Marker } from 'react-native-maps'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

const PAYMENT_PERIODS = ['Monthly', 'Quarterly', 'Yearly']
const PROPERTY_TYPES = ['Apartment', 'Studio', 'Condominium', 'House/Villa', 'Shared Room']
const PURPOSES = ['For Rent', 'For Sale']
const FURNISHING = ['Furnished', 'Semi-furnished', 'Unfurnished']
const AMENITIES = ['Parking', 'Elevator', 'Generator', 'Security', 'Balcony', 'Wi-Fi', 'Water Tank', 'Gym']
const MIN_STAYS = ['1 month', '3 months', '6 months', '12 months']

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'

const AddListing = () => {
  const navigation = useNavigation()
  const scrollRef = useRef(null)
  const route = useRoute()
  const listingId = route.params?.listingId || null
  const HEADER_SHORT_HEIGHT = 64 // must match Header.headerShort.height
  // input refs for auto-scroll
  const titleRef = useRef(null)
  const subCityRef = useRef(null)
  const areaRef = useRef(null)
  const landmarkRef = useRef(null)
  const priceRef = useRef(null)
  const depositRef = useRef(null)
  const bedroomsRef = useRef(null)
  const bathroomsRef = useRef(null)
  const sizeRef = useRef(null)
  const floorRef = useRef(null)
  const descriptionRef = useRef(null)
  const contactPhoneRef = useRef(null)
  const uniqueFeatureInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [focusedInput, setFocusedInput] = useState(null)

  const [isEditMode, setIsEditMode] = useState(false)

  // Basic property details
  const [title, setTitle] = useState('')
  const [propertyType, setPropertyType] = useState(PROPERTY_TYPES[0])
  const [purpose, setPurpose] = useState(PURPOSES[0])

  // Location
  const [city, setCity] = useState('Addis Ababa')
  const [subCity, setSubCity] = useState('')
  const [area, setArea] = useState('')
  const [landmark, setLandmark] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  // Pricing & terms
  const [price, setPrice] = useState('')
  const [paymentPeriod, setPaymentPeriod] = useState(PAYMENT_PERIODS[0])
  const [depositRequired, setDepositRequired] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [utilities, setUtilities] = useState({ Water: false, Electricity: false, Internet: false })

  // Specs
  const [bedrooms, setBedrooms] = useState('1')
  const [bathrooms, setBathrooms] = useState('1')
  const [size, setSize] = useState('')
  const [floor, setFloor] = useState('1')
  const [furnishing, setFurnishing] = useState(FURNISHING[2])

  // Amenities
  const [amenities, setAmenities] = useState({})

  // Description & media
  const [description, setDescription] = useState('')
  // Unique features - owner-entered bullet points
  const [uniqueFeatures, setUniqueFeatures] = useState([])
  const [uniqueFeatureInput, setUniqueFeatureInput] = useState('')

  const addUniqueFeature = () => {
    const val = uniqueFeatureInput.trim()
    if (!val) return
    // Dismiss keyboard first to ensure input is committed
    Keyboard.dismiss()
    setUniqueFeatures(prev => [...prev, val])
    setUniqueFeatureInput('')
  }
  const [images, setImages] = useState([])
  const [premiumMessage, setPremiumMessage] = useState('')

  const MAX_IMAGES = 10

  // Map picker
  const [showMapModal, setShowMapModal] = useState(false)
  const [mapMarker, setMapMarker] = useState(null)
  const initialRegion = { latitude: 9.03, longitude: 38.74, latitudeDelta: 0.02, longitudeDelta: 0.02 }

  // Availability & contact
  //here
  //and
  //there
  //fore
  //forward
  //therefter
  //hereafter
  const [availableFrom, setAvailableFrom] = useState('')
  const [availableFromDate, setAvailableFromDate] = useState(null)
  const [tourDateFrom, setTourDateFrom] = useState(null)
  const [tourDateTo, setTourDateTo] = useState(null)
  const [tourTimeFrom, setTourTimeFrom] = useState(null)
  const [tourTimeTo, setTourTimeTo] = useState(null)
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
  const [datePickerTarget, setDatePickerTarget] = useState(null)
  const [minStay, setMinStay] = useState(MIN_STAYS[0])
  const [contactPhone, setContactPhone] = useState('')
  const [contactMethod, setContactMethod] = useState('In-app messaging only')

  useEffect(() => {
    // init amenities map
    const map = {}
    AMENITIES.forEach(a => (map[a] = false))
    setAmenities(map)
  }, [])

  useEffect(() => {
    // If listingId is provided, load existing listing for edit
    if (!listingId) return
    setIsEditMode(true)
    ;(async () => {
      try {
        const token = await SecureStore.getItemAsync('token')
        if (!token) return
        const res = await axios.get(`${API_URL}/apartments/${listingId}`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
        const apt = res.data
        // populate fields defensively
        setTitle(apt.title || '')
        setPropertyType(apt.property_type || propertyType)
        setPurpose(apt.purpose || purpose)
        const m = apt.meta || {}
        setCity(m.location?.city || city)
        // Preserve empty strings if they exist in meta, otherwise use empty string
        setSubCity(m.location?.sub_city !== undefined && m.location?.sub_city !== null ? m.location.sub_city : '')
        setArea(m.location?.area !== undefined && m.location?.area !== null ? m.location.area : '')
        setLandmark(m.location?.landmark !== undefined && m.location?.landmark !== null ? m.location.landmark : '')
        const lat = m.location?.latitude !== undefined && m.location?.latitude !== null ? m.location.latitude : (m.location?.lat !== undefined && m.location?.lat !== null ? m.location.lat : '')
        const lng = m.location?.longitude !== undefined && m.location?.longitude !== null ? m.location.longitude : (m.location?.lng !== undefined && m.location?.lng !== null ? m.location.lng : '')
        setLatitude(lat)
        setLongitude(lng)
        // Set map marker if coordinates exist
        if (lat && lng) {
          try {
            const latNum = parseFloat(lat)
            const lngNum = parseFloat(lng)
            if (!isNaN(latNum) && !isNaN(lngNum)) {
              setMapMarker({ latitude: latNum, longitude: lngNum })
            }
          } catch (e) {
            // ignore
          }
        }
        setPrice(apt.price || m.price || price || '')
        setPaymentPeriod(m.payment_period || paymentPeriod)
        // Preserve deposit_required: load from meta if available
        if (m.deposit_required !== undefined && m.deposit_required !== null) {
          // Convert to boolean: 1, true, '1' = true; 0, false, '0', null, undefined = false
          const depositReqValue = m.deposit_required
          setDepositRequired(depositReqValue === 1 || depositReqValue === true || depositReqValue === '1')
        } else {
          // If not in meta, default to false (preserve initial state)
          setDepositRequired(false)
        }
        setDepositAmount(m.deposit_amount || depositAmount || '')
        setBedrooms(String(apt.bedrooms || m.bedrooms || bedrooms || '1'))
        setBathrooms(String(apt.bathrooms || m.bathrooms || bathrooms || '1'))
        // Preserve size if it exists, even if it's 0 or empty
        const sizeValue = m.size !== undefined && m.size !== null ? m.size : (apt.size !== undefined && apt.size !== null ? apt.size : '')
        setSize(sizeValue !== '' ? String(sizeValue) : '')
        setFloor(String(m.floor || apt.floor || floor || '1'))
        setFurnishing(m.furnishing || apt.furnishing || furnishing)
        setDescription(apt.description || '')
        setUniqueFeatures(Array.isArray(m.unique_features) ? m.unique_features : (typeof m.unique_features === 'string' ? (m.unique_features ? JSON.parse(m.unique_features) : []) : uniqueFeatures))
        // Handle available_from date - preserve if it exists, even if empty string
        const availFrom = m.available_from !== undefined && m.available_from !== null ? m.available_from : ''
        setAvailableFrom(availFrom)
        if (availFrom && availFrom.trim() !== '') {
          try {
            const date = new Date(availFrom)
            if (!isNaN(date.getTime())) {
              setAvailableFromDate(date)
            } else {
              setAvailableFromDate(null)
            }
          } catch (e) {
            setAvailableFromDate(null)
          }
        } else {
          setAvailableFromDate(null)
        }
        setContactPhone(m.contact_phone || apt.contact_phone || contactPhone || '')
        setContactMethod(m.contact_method || contactMethod)
        // amenities/utilities
        if (Array.isArray(m.amenities)) {
          const amap = {}
          AMENITIES.forEach(a => (amap[a] = m.amenities.includes(a)))
          setAmenities(amap)
        }
        if (Array.isArray(m.utilities)) {
          const umat = { Water: false, Electricity: false, Internet: false }
          Object.keys(umat).forEach(k => (umat[k] = m.utilities.includes(k)))
          setUtilities(umat)
        }
        // open_for_tour
        try {
          const oftRaw = m.open_for_tour || m.openForTour || null
          const oft = oftRaw ? (typeof oftRaw === 'string' ? JSON.parse(oftRaw) : oftRaw) : null
          if (oft) {
            setTourDateFrom(oft.date_from ? new Date(oft.date_from) : null)
            setTourDateTo(oft.date_to ? new Date(oft.date_to) : null)
            setTourTimeFrom(oft.time_from ? new Date(`1970-01-01T${oft.time_from}:00`) : null)
            setTourTimeTo(oft.time_to ? new Date(`1970-01-01T${oft.time_to}:00`) : null)
          }
        } catch (e) {
          // ignore
        }
        // Load images
        if (apt.images && Array.isArray(apt.images) && apt.images.length > 0) {
          const imageUris = apt.images.map(img => {
            // Handle both URL and path formats
            if (img.url) return img.url
            if (img.path) return `${API_URL}/storage/${img.path}`
            return null
          }).filter(Boolean)
          setImages(imageUris)
        }
      } catch (e) {
        console.warn('Failed to load listing for edit', e.message)
      }
    })()
  }, [listingId])

  // rely on KeyboardAvoidingView to manage offsets; listeners removed to avoid extra padding

  // Scroll to the focused input. Delay the scroll slightly so it happens after the keyboard
  // animates in — this prevents the input jumping out of view when editing prefilled fields.
  const scrollToInput = (ref) => {
    try {
      if (!ref || !ref.current || !scrollRef.current) return
      const node = findNodeHandle(ref.current)
      if (!node) return
      // extra offset to place field comfortably above keyboard
      const extraOffset = 8
      // Small delay to wait for keyboard to appear (fixes edit-mode focus jump)
      setTimeout(() => {
        try {
          if (scrollRef.current.getScrollResponder) {
            scrollRef.current.getScrollResponder().scrollResponderScrollNativeHandleToKeyboard(node, HEADER_SHORT_HEIGHT + extraOffset, true)
          } else if (scrollRef.current.scrollTo) {
            // best-effort fallback: attempt to scroll to node using measureLayout
            ref.current.measureLayout(findNodeHandle(scrollRef.current), (x, y) => {
              scrollRef.current.scrollTo({ y: Math.max(0, y - HEADER_SHORT_HEIGHT - extraOffset), animated: true })
            }, () => {})
          }
        } catch (e) {
          // ignore inner errors
        }
      }, 260)
    } catch (e) {
      // ignore
    }
  }

  const pickImage = async () => {
    try {
      if (images.length >= MAX_IMAGES) {
        setPremiumMessage('You have reached the free limit of 10 images. Upgrade to premium to upload more than 10 images per listing.')
        return
      }
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Permission to access images is required.')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: false, quality: 0.7 })
      // normalize result for different expo-image-picker versions
      let pickedUri = null
      if (result) {
        if (result.assets && Array.isArray(result.assets) && result.assets.length > 0) {
          pickedUri = result.assets[0].uri
        } else if (result.uri) {
          pickedUri = result.uri
        } else if (result.cancelled === false && result[0] && result[0].uri) {
          // fallback shape
          pickedUri = result[0].uri
        }
      }

      if (pickedUri) {
        // enforce max
        if (images.length + 1 > MAX_IMAGES) {
          setPremiumMessage('You need a premium account to upload more than 10 images per listing.')
          return
        }
        setImages(prev => [...prev, pickedUri])
        setPremiumMessage('')
      }
    } catch (err) {
      console.log('Image picker error', err)
    }
  }

  const showPicker = target => {
    setDatePickerTarget(target)
    setIsDatePickerVisible(true)
  }

  const hidePicker = () => {
    setIsDatePickerVisible(false)
    setDatePickerTarget(null)
  }

  const handleConfirm = date => {
    // date is a JS Date
    if (datePickerTarget === 'available') {
      setAvailableFromDate(date)
      setAvailableFrom(date.toISOString().slice(0,10))
    } else if (datePickerTarget === 'tourFrom') {
      setTourDateFrom(date)
    } else if (datePickerTarget === 'tourTo') {
      setTourDateTo(date)
    } else if (datePickerTarget === 'timeFrom') {
      setTourTimeFrom(date)
    } else if (datePickerTarget === 'timeTo') {
      setTourTimeTo(date)
    }
    hidePicker()
  }

  const toggleUtility = key => setUtilities(prev => ({ ...prev, [key]: !prev[key] }))

  const toggleAmenity = key => setAmenities(prev => ({ ...prev, [key]: !prev[key] }))

  const validate = () => {
    const err = []
    if (!title.trim()) err.push('Title is required')
    if (!propertyType) err.push('Property type is required')
    if (!subCity.trim()) err.push('Sub-city is required')
    if (!area.trim()) err.push('Area / Neighborhood is required')
    // ensure we have an address string for backend (backend requires `address` non-null)
    const computedAddress = landmark.trim() ? `${area.trim()} - ${landmark.trim()}` : (area.trim() || `${subCity.trim()}, ${city}`)
    if (!computedAddress.trim()) err.push('Address is required')
    const sanitizedPrice = typeof price === 'string' ? price.replace(/,/g, '') : price
    if (!sanitizedPrice || isNaN(Number(sanitizedPrice))) err.push('Valid price is required')
    if (!bedrooms || isNaN(Number(bedrooms))) err.push('Valid number of bedrooms is required')
    if (!bathrooms || isNaN(Number(bathrooms))) err.push('Valid number of bathrooms is required')
    if (!floor || isNaN(Number(floor))) err.push('Valid floor number is required')
    if (depositRequired) {
      const sanitizedDeposit = typeof depositAmount === 'string' ? depositAmount.replace(/,/g, '') : depositAmount
      if (!sanitizedDeposit || isNaN(Number(sanitizedDeposit))) err.push('Valid deposit amount required')
    }
    if (!description.trim()) err.push('Description is required')
    if (!contactPhone.trim()) err.push('Contact phone number is required')
    setErrors(err)
    return err.length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const token = await SecureStore.getItemAsync('token')
      if (!token) throw new Error('Not authenticated')

      // Build payload. For edit we send JSON (simpler); for create we use multipart as before.
      const addressString = (landmark.trim() ? `${area.trim()} - ${landmark.trim()}` : (area.trim() || `${subCity.trim()}, ${city}`))

      const metaObj = {
        location: {
          city,
          sub_city: subCity.trim(),
          area: area.trim(),
          landmark: landmark.trim(),
          latitude: mapMarker ? String(mapMarker.latitude) : latitude.trim(),
          longitude: mapMarker ? String(mapMarker.longitude) : longitude.trim()
        },
        utilities: Object.keys(utilities).filter(k => utilities[k]),
        amenities: Object.keys(amenities).filter(k => amenities[k]),
        open_for_tour: {
          date_from: tourDateFrom ? tourDateFrom.toISOString().slice(0,10) : null,
          date_to: tourDateTo ? tourDateTo.toISOString().slice(0,10) : null,
          time_from: tourTimeFrom ? tourTimeFrom.toTimeString().slice(0,5) : null,
          time_to: tourTimeTo ? tourTimeTo.toTimeString().slice(0,5) : null
        },
        unique_features: Array.isArray(uniqueFeatures) ? uniqueFeatures : [],
        payment_period: paymentPeriod,
        deposit_required: depositRequired ? 1 : 0,
        deposit_amount: depositRequired ? String(Number(String(depositAmount).replace(/,/g, ''))) : 0,
        available_from: availableFrom || (availableFromDate ? availableFromDate.toISOString().slice(0,10) : null),
        min_stay: minStay,
        contact_phone: contactPhone.trim(),
        contact_method: contactMethod
      }

      if (isEditMode && listingId) {
        // PATCH with JSON payload (no image handling on edit for now)
        const payload = {
          title: title.trim(),
          address: addressString,
          price: String(price).replace(/,/g, ''),
          description: description.trim(),
          bedrooms: String(Number(bedrooms)),
          bathrooms: String(Number(bathrooms)),
          size: size ? String(Number(size)) : null,
          floor: String(Number(floor)),
          furnishing,
          property_type: propertyType,
          purpose,
          meta: metaObj
        }
        await axios.patch(`${API_URL}/apartments/${listingId}`, payload, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
        Alert.alert('Success', 'Listing updated')
        navigation.goBack()
      } else {
        // Create path (existing multipart form flow). Keep image upload as before.
        const formData = new FormData()
        formData.append('title', title.trim())
        formData.append('address', addressString)
        formData.append('property_type', propertyType)
        formData.append('purpose', purpose)
        formData.append('price', String(price).replace(/,/g, ''))
        formData.append('payment_period', paymentPeriod)
        formData.append('deposit_required', depositRequired ? '1' : '0')
        formData.append('deposit_amount', depositRequired ? String(Number(String(depositAmount).replace(/,/g, ''))) : '0')
        formData.append('bedrooms', String(Number(bedrooms)))
        formData.append('bathrooms', String(Number(bathrooms)))
        if (size) formData.append('size', String(Number(size)))
        formData.append('floor', String(Number(floor)))
        formData.append('furnishing', furnishing)
        formData.append('description', description.trim())
        formData.append('available_from', availableFrom || (availableFromDate ? availableFromDate.toISOString().slice(0,10) : ''))
        formData.append('min_stay', minStay)
        formData.append('contact_phone', contactPhone.trim())
        formData.append('contact_method', contactMethod)

        formData.append('location', JSON.stringify(metaObj.location))
        formData.append('utilities', JSON.stringify(metaObj.utilities))
        formData.append('amenities', JSON.stringify(metaObj.amenities))
        formData.append('open_for_tour', JSON.stringify(metaObj.open_for_tour))
        if (Array.isArray(metaObj.unique_features) && metaObj.unique_features.length > 0) {
          formData.append('unique_features', JSON.stringify(metaObj.unique_features))
        }

        for (let i = 0; i < images.length; i++) {
          let uri = images[i]
          if (!uri) continue
          if (typeof uri === 'object' && uri.uri) uri = uri.uri
          const filename = typeof uri === 'string' ? uri.split('/').pop() : `image_${i}.jpg`
          const match = /\.([0-9a-z]+)(?:\?.*)?$/i.exec(filename || '')
          const ext = match ? match[1] : 'jpg'
          const type = `image/${ext === 'jpg' ? 'jpeg' : ext}`
          try {
            formData.append('images[]', { uri, name: filename, type })
          } catch (e) {
            console.log('Failed to append image to FormData', e)
          }
        }

        await axios.post(`${API_URL}/apartments`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json', Authorization: `Bearer ${token}` }
        })
        Alert.alert('Success', 'Listing posted')
        navigation.goBack()
      }
    } catch (err) {
      console.log(err.response?.data || err.message)
      Alert.alert('Error', err.response?.data?.message || err.message || (isEditMode ? 'Failed to update listing' : 'Failed to post listing'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          ref={scrollRef} 
          contentContainerStyle={[styles.container, { paddingBottom: 12, flexGrow: 1 }]} 
          keyboardShouldPersistTaps="handled" 
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        > 
  <Header title="Post a New Listing" short />
  <View style={[styles.formCard, { marginTop: HEADER_SHORT_HEIGHT - 8 }]}>

        {errors.length > 0 && (
          <View style={styles.errorBox}>
            {errors.map((e, i) => (
              <Text key={i} style={styles.errorText}>• {e}</Text>
            ))}
          </View>
        )}

        {/* Basic Details */}
        <Text style={styles.sectionTitle}>Basic Property Details</Text>
  <Text style={styles.label}>Property title</Text>
  <TextInput 
    ref={titleRef} 
    onFocus={() => { setFocusedInput('title'); scrollToInput(titleRef); }} 
    onBlur={() => setFocusedInput(null)}
    style={[styles.input, focusedInput === 'title' && styles.inputFocused]} 
    value={title} 
    onChangeText={setTitle} 
    placeholder="e.g. Spacious 2-bedroom apartment"
    placeholderTextColor="#94a3b8"
  />

        <Text style={styles.label}>Property type</Text>
        <View style={styles.rowOptions}>
          {PROPERTY_TYPES.map(pt => (
            <TouchableOpacity key={pt} style={[styles.optionPill, propertyType === pt && styles.optionPillActive]} onPress={() => setPropertyType(pt)}>
              <Text style={propertyType === pt ? styles.optionTextActive : styles.optionText}>{pt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Purpose</Text>
        <View style={styles.rowOptions}>
          {PURPOSES.map(p => (
            <TouchableOpacity key={p} style={[styles.radio, purpose === p && styles.radioActive]} onPress={() => setPurpose(p)}>
              <Text style={purpose === p ? styles.radioTextActive : styles.radioText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location */}
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.label}>City</Text>
        <TextInput 
          style={[styles.input, focusedInput === 'city' && styles.inputFocused]} 
          value={city} 
          onChangeText={setCity}
          onFocus={() => setFocusedInput('city')}
          onBlur={() => setFocusedInput(null)}
          placeholderTextColor="#94a3b8"
        />

  <Text style={styles.label}>Sub-city</Text>
  <TextInput 
    ref={subCityRef} 
    onFocus={() => { setFocusedInput('subCity'); scrollToInput(subCityRef); }} 
    onBlur={() => setFocusedInput(null)}
    style={[styles.input, focusedInput === 'subCity' && styles.inputFocused]} 
    value={subCity} 
    onChangeText={setSubCity} 
    placeholder="e.g. Bole"
    placeholderTextColor="#94a3b8"
  />

  <Text style={styles.label}>Area / Neighborhood</Text>
  <TextInput 
    ref={areaRef} 
    onFocus={() => { setFocusedInput('area'); scrollToInput(areaRef); }} 
    onBlur={() => setFocusedInput(null)}
    style={[styles.input, focusedInput === 'area' && styles.inputFocused]} 
    value={area} 
    onChangeText={setArea} 
    placeholder="e.g. Around XYZ"
    placeholderTextColor="#94a3b8"
  />

  <Text style={styles.label}>Street or landmark (optional)</Text>
  <TextInput 
    ref={landmarkRef} 
    onFocus={() => { setFocusedInput('landmark'); scrollToInput(landmarkRef); }} 
    onBlur={() => setFocusedInput(null)}
    style={[styles.input, focusedInput === 'landmark' && styles.inputFocused]} 
    value={landmark} 
    onChangeText={setLandmark} 
    placeholder="Nearby landmark or street"
    placeholderTextColor="#94a3b8"
  />

        <Text style={styles.label}>Map location</Text>
        <View style={{ marginBottom: 12 }}>
          <TouchableOpacity style={[styles.optionPill, styles.mapBtn]} onPress={() => setShowMapModal(true)}>
            <Text style={[styles.optionText, styles.mapBtnText]}>Open map to pick location</Text>
          </TouchableOpacity>
          <Text style={{ marginTop: 8, color: '#555' }}>{mapMarker ? `Selected: ${mapMarker.latitude.toFixed(5)}, ${mapMarker.longitude.toFixed(5)}` : (latitude && longitude ? `${latitude}, ${longitude}` : 'No location selected')}</Text>
        </View>

        <Modal visible={showMapModal} animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <MapView style={{ flex: 1 }} initialRegion={initialRegion} onPress={e => setMapMarker(e.nativeEvent.coordinate)}>
                {mapMarker && <Marker coordinate={mapMarker} />}
              </MapView>
            </View>
            <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.btn, { flex: 1, marginRight: 8 }]} onPress={() => setShowMapModal(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={() => { setShowMapModal(false); if (mapMarker) { setLatitude(String(mapMarker.latitude)); setLongitude(String(mapMarker.longitude)); } }}>
                <Text style={styles.btnText}>Save location</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Pricing & Terms */}
        <Text style={styles.sectionTitle}>Pricing & Terms</Text>
  <Text style={styles.label}>Price</Text>
  <TextInput 
    ref={priceRef} 
    onFocus={() => { setFocusedInput('price'); scrollToInput(priceRef); }} 
    onBlur={() => setFocusedInput(null)}
    style={[styles.input, focusedInput === 'price' && styles.inputFocused]} 
    value={price} 
    onChangeText={setPrice} 
    placeholder="Numeric amount" 
    keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'}
    placeholderTextColor="#94a3b8"
  />

        <Text style={styles.label}>Payment period</Text>
        <View style={styles.rowOptions}>
          {PAYMENT_PERIODS.map(pp => (
            <TouchableOpacity key={pp} style={[styles.optionPill, paymentPeriod === pp && styles.optionPillActive]} onPress={() => setPaymentPeriod(pp)}>
              <Text style={paymentPeriod === pp ? styles.optionTextActive : styles.optionText}>{pp}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Deposit required</Text>
          <TouchableOpacity style={[styles.toggle, depositRequired && styles.toggleOn]} onPress={() => setDepositRequired(!depositRequired)}>
            <Text style={depositRequired ? styles.toggleTextOn : styles.toggleText}>{depositRequired ? 'Yes' : 'No'}</Text>
          </TouchableOpacity>
        </View>

        {depositRequired && (
          <>
            <Text style={styles.label}>Deposit amount</Text>
            <TextInput 
              ref={depositRef} 
              onFocus={() => { setFocusedInput('deposit'); scrollToInput(depositRef); }} 
              onBlur={() => setFocusedInput(null)}
              style={[styles.input, focusedInput === 'deposit' && styles.inputFocused]} 
              value={depositAmount} 
              onChangeText={setDepositAmount} 
              keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'} 
              placeholder="e.g. 5000"
              placeholderTextColor="#94a3b8"
            />
          </>
        )}

        <Text style={styles.label}>Utilities included</Text>
        <View style={styles.rowOptionsWrap}>
          {Object.keys(utilities).map(u => (
            <TouchableOpacity key={u} style={[styles.checkbox, utilities[u] && styles.checkboxChecked]} onPress={() => toggleUtility(u)}>
              <Text style={utilities[u] ? styles.checkboxTextChecked : styles.checkboxText}>{u}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Specifications */}
        <Text style={styles.sectionTitle}>Property Specifications</Text>
  <Text style={styles.label}>Number of bedrooms</Text>
  <TextInput 
    ref={bedroomsRef} 
    onFocus={() => { setFocusedInput('bedrooms'); scrollToInput(bedroomsRef); }} 
    onBlur={() => setFocusedInput(null)}
    style={[styles.input, focusedInput === 'bedrooms' && styles.inputFocused]} 
    value={bedrooms} 
    onChangeText={setBedrooms} 
    keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'}
    placeholderTextColor="#94a3b8"
  />

  <Text style={styles.label}>Number of bathrooms</Text>
  <TextInput 
    ref={bathroomsRef} 
    onFocus={() => { setFocusedInput('bathrooms'); scrollToInput(bathroomsRef); }} 
    onBlur={() => setFocusedInput(null)}
    style={[styles.input, focusedInput === 'bathrooms' && styles.inputFocused]} 
    value={bathrooms} 
    onChangeText={setBathrooms} 
    keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'}
    placeholderTextColor="#94a3b8"
  />

  <Text style={styles.label}>Total size (sqm) — optional</Text>
  <TextInput 
    ref={sizeRef} 
    onFocus={() => { setFocusedInput('size'); scrollToInput(sizeRef); }} 
    onBlur={() => setFocusedInput(null)}
    style={[styles.input, focusedInput === 'size' && styles.inputFocused]} 
    value={size} 
    onChangeText={setSize} 
    keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'}
    placeholderTextColor="#94a3b8"
  />

  <Text style={styles.label}>Floor number</Text>
  <TextInput 
    ref={floorRef} 
    onFocus={() => { setFocusedInput('floor'); scrollToInput(floorRef); }} 
    onBlur={() => setFocusedInput(null)}
    style={[styles.input, focusedInput === 'floor' && styles.inputFocused]} 
    value={floor} 
    onChangeText={setFloor} 
    keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'}
    placeholderTextColor="#94a3b8"
  />

        <Text style={styles.label}>Furnishing status</Text>
        <View style={styles.rowOptions}>
          {FURNISHING.map(f => (
            <TouchableOpacity key={f} style={[styles.radio, furnishing === f && styles.radioActive]} onPress={() => setFurnishing(f)}>
              <Text style={furnishing === f ? styles.radioTextActive : styles.radioText}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amenities */}
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.rowOptionsWrap}>
          {AMENITIES.map(a => (
            <TouchableOpacity key={a} style={[styles.amenityPill, amenities[a] && styles.amenityPillActive]} onPress={() => toggleAmenity(a)}>
              <Text style={amenities[a] ? styles.amenityTextActive : styles.amenityText}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Unique features - bullet list input */}
        <Text style={styles.sectionTitle}>Unique features</Text>
        <Text style={styles.label}>Add a feature (single short line)</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <TextInput
              ref={uniqueFeatureInputRef}
              style={[styles.input, styles.featureInput, { flex: 1 }, focusedInput === 'uniqueFeature' && styles.inputFocused]}
              value={uniqueFeatureInput}
              onChangeText={setUniqueFeatureInput}
              placeholder="e.g. Panoramic city view"
              placeholderTextColor="#94a3b8"
              returnKeyType="done"
              onFocus={() => { setFocusedInput('uniqueFeature'); scrollToInput(uniqueFeatureInputRef); }}
              onBlur={() => setFocusedInput(null)}
              onSubmitEditing={addUniqueFeature}
            />
          <TouchableOpacity
            style={[styles.addFeatureBtn]}
            onPress={addUniqueFeature}
            activeOpacity={0.85}
            accessibilityLabel="Add unique feature"
          >
            <Text style={styles.addFeatureBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {uniqueFeatures.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            {uniqueFeatures.map((f, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text>• {f}</Text>
                <TouchableOpacity onPress={() => setUniqueFeatures(prev => prev.filter((_, idx) => idx !== i))}>
                  <Text style={{ color: '#a00' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Description & Media */}
        <Text style={styles.sectionTitle}>Description & Media</Text>
  <Text style={styles.label}>Detailed description</Text>
  <TextInput 
    ref={descriptionRef} 
    onFocus={() => { setFocusedInput('description'); scrollToInput(descriptionRef); }} 
    onBlur={() => setFocusedInput(null)}
    style={[styles.input, { height: 120 }, focusedInput === 'description' && styles.inputFocused]} 
    value={description} 
    onChangeText={setDescription} 
    multiline 
    placeholder="Describe the property, nearby facilities, transport, etc."
    placeholderTextColor="#94a3b8"
  />

        <Text style={styles.label}>Images</Text>
        <ScrollView style={{ marginBottom: 8 }} horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imagesRow}>
            {images.map((img, i) => {
              const uri = typeof img === 'string' ? img : (img?.uri || null)
              return <Image key={i} source={ uri ? { uri } : require('../../assets/apartment_dummy.jpeg') } style={styles.thumb} />
            })}
            <TouchableOpacity style={styles.imageAdd} onPress={pickImage}>
              <Text style={styles.imageAddText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {premiumMessage ? <Text style={{ color: '#a10e0e', marginBottom: 8 }}>{premiumMessage}</Text> : null}

        {/* Availability & Contact */}
        <Text style={styles.sectionTitle}>Availability & Contact Preferences</Text>
        <Text style={styles.label}>Available from</Text>
        <TouchableOpacity style={[styles.input, styles.datePickerButton]} onPress={() => showPicker('available')}>
          <Text style={[styles.datePickerText, !availableFromDate && styles.datePickerPlaceholder]}>
            {availableFromDate ? availableFromDate.toISOString().slice(0,10) : 'Select date'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Open for tour (date range)</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.input, styles.datePickerButton, { flex: 1, marginRight: 8 }]} onPress={() => showPicker('tourFrom')}>
            <Text style={[styles.datePickerText, !tourDateFrom && styles.datePickerPlaceholder]}>
              {tourDateFrom ? tourDateFrom.toISOString().slice(0,10) : 'From'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.input, styles.datePickerButton, { flex: 1 }]} onPress={() => showPicker('tourTo')}>
            <Text style={[styles.datePickerText, !tourDateTo && styles.datePickerPlaceholder]}>
              {tourDateTo ? tourDateTo.toISOString().slice(0,10) : 'To'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Open for tour (time range)</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.input, styles.datePickerButton, { flex: 1, marginRight: 8 }]} onPress={() => showPicker('timeFrom')}>
            <Text style={[styles.datePickerText, !tourTimeFrom && styles.datePickerPlaceholder]}>
              {tourTimeFrom ? tourTimeFrom.toTimeString().slice(0,5) : 'From'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.input, styles.datePickerButton, { flex: 1 }]} onPress={() => showPicker('timeTo')}>
            <Text style={[styles.datePickerText, !tourTimeTo && styles.datePickerPlaceholder]}>
              {tourTimeTo ? tourTimeTo.toTimeString().slice(0,5) : 'To'}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={datePickerTarget && datePickerTarget.startsWith('time') ? 'time' : 'date'}
          onConfirm={handleConfirm}
          onCancel={hidePicker}
        />

        <Text style={styles.label}>Minimum stay duration</Text>
        <View style={styles.rowOptions}>
          {MIN_STAYS.map(m => (
            <TouchableOpacity key={m} style={[styles.optionPill, minStay === m && styles.optionPillActive]} onPress={() => setMinStay(m)}>
              <Text style={minStay === m ? styles.optionTextActive : styles.optionText}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

  <Text style={styles.label}>Contact phone number</Text>
  <TextInput 
    ref={contactPhoneRef} 
    onFocus={() => { setFocusedInput('contactPhone'); scrollToInput(contactPhoneRef); }} 
    onBlur={() => setFocusedInput(null)}
    style={[styles.input, focusedInput === 'contactPhone' && styles.inputFocused]} 
    value={contactPhone} 
    onChangeText={setContactPhone} 
    keyboardType={Platform.OS === 'web' ? 'default' : 'phone-pad'} 
    placeholder="e.g. +2519xxxxxxx"
    placeholderTextColor="#94a3b8"
  />

        <Text style={styles.label}>Preferred contact method</Text>
        <View style={styles.fieldRow}>
          <View style={styles.fieldHalf}>
            <TouchableOpacity style={[styles.radio, contactMethod === 'In-app messaging only' && styles.radioActive, { width: '100%' }]} onPress={() => setContactMethod('In-app messaging only')}>
              <Text style={contactMethod === 'In-app messaging only' ? styles.radioTextActive : styles.radioText}>In-app messaging only</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.fieldHalf}>
            <TouchableOpacity style={[styles.radio, contactMethod === 'Phone allowed' && styles.radioActive, { width: '100%' }]} onPress={() => setContactMethod('Phone allowed')}>
              <Text style={contactMethod === 'Phone allowed' ? styles.radioTextActive : styles.radioText}>Phone allowed</Text>
            </TouchableOpacity>
          </View>
        </View>

        </View>
        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? (isEditMode ? 'Updating...' : 'Posting...') : (isEditMode ? 'Update Listing' : 'Post Listing')}</Text>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AddListing
