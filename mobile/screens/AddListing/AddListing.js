import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
  Modal
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import styles from './AddListingStyle'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
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
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

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
  const [images, setImages] = useState([])
  const [premiumMessage, setPremiumMessage] = useState('')

  const MAX_IMAGES = 10

  // Map picker
  const [showMapModal, setShowMapModal] = useState(false)
  const [mapMarker, setMapMarker] = useState(null)
  const initialRegion = { latitude: 9.03, longitude: 38.74, latitudeDelta: 0.02, longitudeDelta: 0.02 }

  // Availability & contact
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
      if (!result.cancelled) {
        // enforce max
        if (images.length + 1 > MAX_IMAGES) {
          setPremiumMessage('You need a premium account to upload more than 10 images per listing.')
          return
        }
        setImages(prev => [...prev, result.uri])
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
    if (!price || isNaN(Number(price))) err.push('Valid price is required')
    if (!bedrooms || isNaN(Number(bedrooms))) err.push('Valid number of bedrooms is required')
    if (!bathrooms || isNaN(Number(bathrooms))) err.push('Valid number of bathrooms is required')
    if (!floor || isNaN(Number(floor))) err.push('Valid floor number is required')
    if (depositRequired && (!depositAmount || isNaN(Number(depositAmount)))) err.push('Valid deposit amount required')
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

      const payload = {
        title: title.trim(),
        // backend requires `address` column; compute an address string from area/landmark/subCity
        address: (landmark.trim() ? `${area.trim()} - ${landmark.trim()}` : (area.trim() || `${subCity.trim()}, ${city}`)),
        property_type: propertyType,
        purpose,
        location: {
          city,
          sub_city: subCity.trim(),
          area: area.trim(),
          landmark: landmark.trim(),
          latitude: mapMarker ? String(mapMarker.latitude) : latitude.trim(),
          longitude: mapMarker ? String(mapMarker.longitude) : longitude.trim()
        },
  // send price as string to match backend validation (backend expects string)
  price: String(price),
        payment_period: paymentPeriod,
        deposit_required: depositRequired,
        deposit_amount: depositRequired ? Number(depositAmount) : 0,
        utilities: Object.keys(utilities).filter(k => utilities[k]),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        size: size ? Number(size) : null,
        floor: Number(floor),
        furnishing,
        amenities: Object.keys(amenities).filter(k => amenities[k]),
        description: description.trim(),
        images, // array of URIs. Backend should accept multipart or handle later.
        available_from: availableFrom || (availableFromDate ? availableFromDate.toISOString().slice(0,10) : ''),
        open_for_tour: {
          date_from: tourDateFrom ? tourDateFrom.toISOString().slice(0,10) : null,
          date_to: tourDateTo ? tourDateTo.toISOString().slice(0,10) : null,
          time_from: tourTimeFrom ? tourTimeFrom.toTimeString().slice(0,5) : null,
          time_to: tourTimeTo ? tourTimeTo.toTimeString().slice(0,5) : null
        },
        min_stay: minStay,
        contact_phone: contactPhone.trim(),
        contact_method: contactMethod
      }

      const res = await axios.post(`${API_URL}/apartments`, payload, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
      })

      Alert.alert('Success', 'Listing posted')
      navigation.goBack()
    } catch (err) {
      console.log(err.response?.data || err.message)
      Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to post listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Post a New Listing" />

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
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Spacious 2-bedroom apartment" />

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
        <TextInput style={styles.input} value={city} onChangeText={setCity} />

        <Text style={styles.label}>Sub-city</Text>
        <TextInput style={styles.input} value={subCity} onChangeText={setSubCity} placeholder="e.g. Bole" />

        <Text style={styles.label}>Area / Neighborhood</Text>
        <TextInput style={styles.input} value={area} onChangeText={setArea} placeholder="e.g. Around XYZ" />

        <Text style={styles.label}>Street or landmark (optional)</Text>
        <TextInput style={styles.input} value={landmark} onChangeText={setLandmark} placeholder="Nearby landmark or street" />

        <Text style={styles.label}>Map location</Text>
        <View style={{ marginBottom: 12 }}>
          <TouchableOpacity style={styles.optionPill} onPress={() => setShowMapModal(true)}>
            <Text style={styles.optionText}>Open map to pick location</Text>
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
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Numeric amount" keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'} />

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
            <Text style={styles.toggleText}>{depositRequired ? 'Yes' : 'No'}</Text>
          </TouchableOpacity>
        </View>

        {depositRequired && (
          <>
            <Text style={styles.label}>Deposit amount</Text>
            <TextInput style={styles.input} value={depositAmount} onChangeText={setDepositAmount} keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'} placeholder="e.g. 5000" />
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
        <TextInput style={styles.input} value={bedrooms} onChangeText={setBedrooms} keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'} />

        <Text style={styles.label}>Number of bathrooms</Text>
        <TextInput style={styles.input} value={bathrooms} onChangeText={setBathrooms} keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'} />

        <Text style={styles.label}>Total size (sqm) — optional</Text>
        <TextInput style={styles.input} value={size} onChangeText={setSize} keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'} />

        <Text style={styles.label}>Floor number</Text>
        <TextInput style={styles.input} value={floor} onChangeText={setFloor} keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'} />

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

        {/* Description & Media */}
        <Text style={styles.sectionTitle}>Description & Media</Text>
        <Text style={styles.label}>Detailed description</Text>
        <TextInput style={[styles.input, { height: 120 }]} value={description} onChangeText={setDescription} multiline placeholder="Describe the property, nearby facilities, transport, etc." />

        <Text style={styles.label}>Images</Text>
        <ScrollView style={{ marginBottom: 8 }} horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imagesRow}>
            {images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.thumb} />
            ))}
            <TouchableOpacity style={styles.imageAdd} onPress={pickImage}>
              <Text style={styles.imageAddText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {premiumMessage ? <Text style={{ color: '#a10e0e', marginBottom: 8 }}>{premiumMessage}</Text> : null}

        {/* Availability & Contact */}
        <Text style={styles.sectionTitle}>Availability & Contact Preferences</Text>
        <Text style={styles.label}>Available from</Text>
        <TouchableOpacity style={styles.input} onPress={() => showPicker('available')}>
          <Text>{availableFromDate ? availableFromDate.toISOString().slice(0,10) : 'Select date'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Open for tour (date range)</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.input, { flex: 1, marginRight: 8 }]} onPress={() => showPicker('tourFrom')}>
            <Text>{tourDateFrom ? tourDateFrom.toISOString().slice(0,10) : 'From'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.input, { flex: 1 }]} onPress={() => showPicker('tourTo')}>
            <Text>{tourDateTo ? tourDateTo.toISOString().slice(0,10) : 'To'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Open for tour (time range)</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.input, { flex: 1, marginRight: 8 }]} onPress={() => showPicker('timeFrom')}>
            <Text>{tourTimeFrom ? tourTimeFrom.toTimeString().slice(0,5) : 'From'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.input, { flex: 1 }]} onPress={() => showPicker('timeTo')}>
            <Text>{tourTimeTo ? tourTimeTo.toTimeString().slice(0,5) : 'To'}</Text>
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
        <TextInput style={styles.input} value={contactPhone} onChangeText={setContactPhone} keyboardType={Platform.OS === 'web' ? 'default' : 'phone-pad'} placeholder="e.g. +2519xxxxxxx" />

        <Text style={styles.label}>Preferred contact method</Text>
        <View style={styles.rowOptions}>
          {['In-app messaging only', 'Phone allowed'].map(cm => (
            <TouchableOpacity key={cm} style={[styles.radio, contactMethod === cm && styles.radioActive]} onPress={() => setContactMethod(cm)}>
              <Text style={contactMethod === cm ? styles.radioTextActive : styles.radioText}>{cm}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Posting...' : 'Post Listing'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddListing
