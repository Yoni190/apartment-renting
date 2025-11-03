import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from "expo-secure-store"
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './HomeScreenStyle'
import Header from '../../components/Header'
import { Plus, SlidersHorizontal, ToolCase } from 'lucide-react-native'

const HomeScreen = () => {
    const [user, setUser] = useState(null)

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
    
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false}> 
        <Header 
          title='Home'
        />
        <View style={styles.searchContainer}>
          <TextInput 
            placeholder='Search..'
            style={styles.textInput}
          />
          <TouchableOpacity style={styles.filter}>
            <SlidersHorizontal />
          </TouchableOpacity>
        </View>

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
          {dummy_recommendations.map((dummy) => 
            <TouchableOpacity key={dummy.name} style={styles.apartments} activeOpacity={0.8}>
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
                <Text>{dummy.name}</Text>
                <View style={styles.apartmentInfo}>
                  <Text>{dummy.location}</Text>
                  <Text>{dummy.price}</Text>
                </View>
              </View>
              
            </TouchableOpacity>

          )}
        </View>

        <TouchableOpacity>
          <Text><Plus /></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

