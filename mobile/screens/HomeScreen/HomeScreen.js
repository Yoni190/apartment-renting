import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from "expo-secure-store"
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './HomeScreenStyle'
import { Ionicons } from '@expo/vector-icons'
import Header from '../../components/Header'
import { SlidersHorizontal, ToolCase } from 'lucide-react-native'

const HomeScreen = () => {
    const [user, setUser] = useState(null)
    const [apartments, setApartments] = useState([])

    const navigation = useNavigation()

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const dummy_recommendations = [
      {
        name: 'Villa',
        location: 'CMC',
        price: '90,000 Birr'
      },
      {
        name: 'ANother Villa',
        location: 'Summit',
        price: '50,000 Birr'
      },
      {
        name: 'ANother Villa Sui',
        location: 'Summit',
        price: '50,000 Birr'
      },
      {
        name: 'ANother Villa Si',
        location: 'Summit',
        price: '50,000 Birr'
      },
      {
        name: 'ANother Vi Sui',
        location: 'Summit',
        price: '50,000 Birr'
      },
      {
        name: 'ANother Vila Si',
        location: 'Summit',
        price: '50,000 Birr'
      },
    ]


    useEffect(() => {
      const getApartments = async () => {
        try {
          const response = await axios.get(`${API_URL}/apartment-list`, {
            headers: {
              Accept: 'application/json'
            }
          })

          setApartments(response.data)
        } catch (error) {
          console.log(error)
        }
      }

      getApartments()
    }, [])
    
    

    useEffect(() => {
      const getUser = async () => {
        const access_token = await SecureStore.getItemAsync("token")
        if(!access_token) navigation.replace('Login')

        try {
            const response = await axios.get(`${API_URL}/user`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${access_token}`
                }
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
            navigation.navigate("Login")
        }
        
      }

      getUser()
    }, [])
    
    const toggleFavorite = (title) => {
      // naive favorite toggle by title for demo; replace with persistent store
      setApartments(prev => prev.map(a => a.title === title ? { ...a, fav: !a.fav } : a))
    }

    const openContacts = (apartment) => {
      Alert.alert('Contact', apartment.contact_phone ?? 'No contact')
    }

    const openMessage = (apartment) => {
      navigation.navigate('Messages')
    }

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false}> 
        <Header 
          title='Home'
        />
        <Text style={styles.title}>Recommended</Text>
        <ScrollView 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.recommendationsContainer} 
          horizontal={true}
          >
          {dummy_recommendations.map((dummy) => 
            <TouchableOpacity style={styles.recommendations} key={dummy.name} activeOpacity={0.8}>
              {/* Top Part */}
              <View>
                <Image 
                  source={require('../../assets/apartment_dummy.jpeg')}
                  resizeMode='cover'
                  style={styles.recommendationsImage}
                />
              </View>
              {/* Bottom Part */}
              <View>
                <Text style={styles.apartmentTitle}>{dummy.name}</Text>
                <View style={styles.apartmentInfo}>
                  <Text style={styles.location}>{dummy.location}</Text>
                  <Text>{dummy.price}</Text>
                </View>
              </View>
              
            </TouchableOpacity>
          )}
        </ScrollView>
        
        <Text style={styles.title}>Apartments</Text>
        <View style={styles.apartmentsContainer}>
          {apartments.map((apartment) => 
            <View key={apartment.title} style={styles.apartments}>
              <View>
                <Image 
                  source={require('../../assets/apartment_dummy.jpeg')}
                  resizeMode='cover'
                  style={styles.recommendationsImage}
                />
                <TouchableOpacity style={styles.heartWrap} onPress={() => toggleFavorite(apartment.title)}>
                  <Ionicons name={apartment.fav ? 'heart' : 'heart-outline'} size={22} color={apartment.fav ? '#e0245e' : '#fff'} />
                </TouchableOpacity>
              </View>
              <View style={{ paddingTop: 8 }}>
                <Text style={styles.apartmentTitle}>{apartment.title}</Text>
                <View style={styles.apartmentInfo}>
                  <Text style={{ flex: 1 }}>{apartment.address}</Text>
                  <Text>{apartment.price}</Text>
                </View>
                <Text numberOfLines={2} style={{ marginTop: 6 }}>{apartment.description ?? ''}</Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <TouchableOpacity style={[styles.msgBtn, { backgroundColor: '#9fc5f8' }]} onPress={() => openMessage(apartment)}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.msgBtn, { backgroundColor: '#eee', marginLeft: 8 }]} onPress={() => openContacts(apartment)}>
                    <Text style={{ color: '#333', fontWeight: '700' }}>Contacts</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

