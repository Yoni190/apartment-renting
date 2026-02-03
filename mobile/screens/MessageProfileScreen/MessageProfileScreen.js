import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Animated, Dimensions, Pressable, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import messageService from '../../services/messageService'
import styles from './MessageProfileScreenStyle'

const MessageProfileScreen = ({ navigation, route }) => {
	const { receiverName, receiverId, receiverEmail, receiverPhone } = route?.params || {}
	const screenWidth = Dimensions.get('window').width
	const translateX = useRef(new Animated.Value(screenWidth)).current
	const avatarScale = useRef(new Animated.Value(0.9)).current
	const contentOpacity = useRef(new Animated.Value(0)).current
	const [profile, setProfile] = useState({
		name: receiverName || 'User',
		email: receiverEmail || null,
		phone: receiverPhone || null,
	})

	useEffect(() => {
		Animated.parallel([
			Animated.timing(translateX, {
				toValue: 0,
				duration: 280,
				useNativeDriver: true,
			}),
			Animated.spring(avatarScale, {
				toValue: 1,
				friction: 6,
				useNativeDriver: true,
			}),
			Animated.timing(contentOpacity, {
				toValue: 1,
				duration: 280,
				useNativeDriver: true,
			}),
		]).start()
	}, [translateX])

	useEffect(() => {
		let mounted = true
		const loadProfile = async () => {
			try {
				if (!receiverId) return
				const data = await messageService.getUserById(Number(receiverId))
				if (!mounted) return
				setProfile({
					name: data?.name || receiverName || 'User',
					email: data?.email || receiverEmail || null,
					phone: data?.phone_number || receiverPhone || null,
				})
			} catch (e) {
				// fallback to existing values
			}
		}
		loadProfile()
		return () => { mounted = false }
	}, [receiverId, receiverName, receiverEmail, receiverPhone])

	const closeScreen = () => {
		try { navigation.goBack() } catch (e) {}
	}

	const initials = (profile.name || 'U').charAt(0).toUpperCase()

	return (
		<SafeAreaView style={styles.container}>
			<Animated.View style={[styles.panel, { transform: [{ translateX }] }]}
			>
				<View style={styles.header}>
					<Pressable onPress={closeScreen} style={styles.backBtn}>
						<Ionicons name="chevron-back" size={22} color="#ffffff" />
					</Pressable>
					<Text style={styles.headerTitle}>Profile</Text>
					<View style={styles.headerRight} />
				</View>

				<Animated.View style={[styles.content, { opacity: contentOpacity }]}
				>
					<Animated.View style={[styles.avatar, { transform: [{ scale: avatarScale }] }]}
					>
						<Text style={styles.avatarText}>{initials}</Text>
					</Animated.View>
					  <Text style={styles.nameText}>{profile.name || 'User'}</Text>

					<View style={styles.infoCard}>
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Email</Text>
							<Text style={styles.infoValue}>{profile.email || 'Not provided'}</Text>
						</View>
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Phone</Text>
							<Text style={styles.infoValue}>{profile.phone || 'Not provided'}</Text>
						</View>
						{receiverId ? (
							<View style={styles.infoRow}>
								<Text style={styles.infoLabel}>User ID</Text>
								<Text style={styles.infoValue}>{receiverId}</Text>
							</View>
						) : null}
					</View>
				</Animated.View>
			</Animated.View>
		</SafeAreaView>
	)
}

export default MessageProfileScreen
