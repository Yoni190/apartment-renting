import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import styles from './ApartmentDetailsStyle'



const ApartmentReviews = ({ route }) => {
  const { apartmentId } = route.params
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${API_URL}/apartments/${apartmentId}/reviews`)
      .then(res => setReviews(res.data.reviews || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      {reviews.map(review => (
        <View key={review.id} style={styles.reviewCard}>
          <Text style={styles.reviewerName}>
            {review.user?.name || 'Anonymous'}
          </Text>

          <View style={styles.starsRowSmall}>
            {[1,2,3,4,5].map(i => (
              <Ionicons
                key={i}
                name={review.rating >= i ? 'star' : 'star-outline'}
                size={14}
                color="#fbbf24"
              />
            ))}
          </View>

          <Text style={styles.reviewText}>{review.comment}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default ApartmentReviews