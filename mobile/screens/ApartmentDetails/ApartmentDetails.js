import {
  Image,
  ScrollView,
  Text,
  View,
  Dimensions,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bed, Bath, Maximize, Calendar, MapPin } from 'lucide-react-native'
import Header from '../../components/Header'
import styles from './ApartmentDetailsStyle'

const { width } = Dimensions.get('window')

const images = [
  require('../../assets/apartment_dummy.jpeg'),
  require('../../assets/apartment_dummy.jpeg'),
  require('../../assets/apartment_dummy.jpeg'),
  require('../../assets/apartment_dummy.jpeg'),
]

const ApartmentDetails = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef(null)

  // 🔁 Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        activeIndex === images.length - 1 ? 0 : activeIndex + 1

      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      })

      setActiveIndex(nextIndex)
    }, 3000) // slide every 3s

    return () => clearInterval(interval)
  }, [activeIndex])

  const handleScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    )
    setActiveIndex(index)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Apartment Details" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carousel */}
        <View>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {images.map((img, index) => (
              <Image
                key={index}
                source={img}
                style={styles.apartmentImage}
              />
            ))}
          </ScrollView>

          {/* Dots */}
          <View style={styles.dotsContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Sun Apartments</Text>
          <Text style={styles.price}>120,000 Birr/mo</Text>

          <View style={styles.locationRow}>
            <MapPin size={16} color="#666" />
            <Text style={styles.locationText}>Summit</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Bed size={20} color="#2563EB" />
              <Text style={styles.infoText}>3 Beds</Text>
            </View>
            <View style={styles.infoItem}>
              <Bath size={20} color="#2563EB" />
              <Text style={styles.infoText}>2 Bath</Text>
            </View>
            <View style={styles.infoItem}>
              <Maximize size={20} color="#2563EB" />
              <Text style={styles.infoText}>80 sq m</Text>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#2563EB" />
              <Text style={styles.infoText}>Available Now</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            Beautiful 3-bedroom apartment in the heart of the city. Recently
            renovated with modern finishes, hardwood floors, and large windows
            that provide plenty of natural light.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ApartmentDetails
