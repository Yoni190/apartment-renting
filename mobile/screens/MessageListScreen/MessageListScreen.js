import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, FlatList, Text } from 'react-native'
import styles from './MessageListScreenStyle'
import MessageListItem from '../../components/MessageListItem'
import messageService from '../../services/messageService'
import * as SecureStore from 'expo-secure-store'
import Header from '../../components/Header'

// MessageListScreen: fetches conversation previews for the logged-in user
export default function MessageListScreen({ navigation }) {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadConversations() {
      try {
        const uidStr = await SecureStore.getItemAsync('user_id')
        const uid = uidStr ? Number(uidStr) : null
        if (!uid) {
          // nothing to load for anonymous user
          if (mounted) {
            setChats([])
            setLoading(false)
          }
          return
        }

        const data = await messageService.getConversations(uid)

        // If API already returned conversation previews (has last_message or lastMessage), normalize and use them
        if (Array.isArray(data) && data.length > 0 && data[0]) {
          const first = data[0]
          const looksLikePreview = first.hasOwnProperty('last_message') || first.hasOwnProperty('lastMessage') || (first.hasOwnProperty('user_id') && (first.hasOwnProperty('last_message') || first.hasOwnProperty('message')))
          if (looksLikePreview) {
            const convs = data.map((it) => {
              // try to determine the other participant id relative to current user (uid)
              let userId = it.user_id ?? it.id ?? it.other_id ?? null
              const sid = it.sender?.id ? Number(it.sender.id) : (it.sender_id ? Number(it.sender_id) : null)
              const rid = it.receiver?.id ? Number(it.receiver.id) : (it.receiver_id ? Number(it.receiver_id) : null)
              if (!userId) {
                if (sid && rid) userId = (sid === uid ? rid : sid)
                else userId = sid ?? rid ?? null
              }

              const lastMessage = it.last_message ?? it.lastMessage ?? it.message ?? ''
              const lastAt = it.last_at ?? it.lastAt ?? it.updated_at ?? it.created_at ?? null
              const unread = it.unread_count ?? it.unreadCount ?? 0
              const name = it.name ?? it.user?.name ?? (sid === userId ? it.sender?.name : it.receiver?.name) ?? it.sender?.name ?? it.receiver?.name ?? (userId ? `User ${userId}` : 'Unknown')
              return { user_id: userId, last_message: lastMessage, last_at: lastAt, unread_count: unread, name }
            })
            convs.sort((a, b) => new Date(b.last_at || 0) - new Date(a.last_at || 0))
            if (mounted) {
              setChats(convs)
              setLoading(false)
            }
            return
          }

          // Otherwise assume we got an array of raw messages and group them by counterpart
          const map = new Map()
          for (const m of data) {
            const sid = Number(m.sender_id)
            const rid = Number(m.receiver_id)
            // determine the other participant relative to current user
            const otherId = sid === uid ? rid : sid
            if (!otherId) continue

            const key = String(otherId)
            const existing = map.get(key) || { user_id: otherId, last_message: null, last_at: null, unread_count: 0, name: null }
            const created = m.created_at ? new Date(m.created_at) : null
            if (!existing.last_at || (created && new Date(existing.last_at) < created)) {
              existing.last_message = m.message ?? m.last_message ?? ''
              existing.last_at = m.created_at ?? m.created_at ?? null
            }
            if (!m.is_read && Number(m.receiver_id) === uid) existing.unread_count = (existing.unread_count || 0) + 1

            // try to derive a display name for the other participant
            if (!existing.name) {
              // if sender/receiver objects included, prefer that
              if (m.sender && Number(m.sender.id) === otherId) existing.name = m.sender.name
              else if (m.receiver && Number(m.receiver.id) === otherId) existing.name = m.receiver.name
            }
            if (!existing.name) existing.name = `User ${otherId}`
            map.set(key, existing)
          }

          const convs = Array.from(map.values())
          // sort by last_at desc
          convs.sort((a, b) => new Date(b.last_at || 0) - new Date(a.last_at || 0))
          if (mounted) {
            setChats(convs)
            setLoading(false)
          }
          return
        }

        // fallback: empty list
        if (mounted) {
          setChats([])
          setLoading(false)
        }
      } catch (err) {
        console.warn('Failed to load conversations', err)
        if (mounted) {
          setChats([])
          setLoading(false)
        }
      }
    }

    loadConversations()

    return () => {
      mounted = false
    }
  }, [])

  const onOpenChat = (item) => {
    // `item` can be either a conversation object from the list or the small payload
    // passed by MessageListItem: { id, recipientName }
    const otherId = Number(item.user_id ?? item.id ?? item.other_id ?? null)
    const receiverName = item.recipientName ?? item.name ?? item.user?.name ?? item.sender?.name ?? item.receiver?.name ?? null

    ;(async () => {
      const uidStr = await SecureStore.getItemAsync('user_id')
      const uid = uidStr ? Number(uidStr) : null
      if (!uid || !otherId) return
      // navigate to root stack's Messages screen so chat opens directly
      try {
        let nav = navigation
        while (nav.getParent && nav.getParent()) {
          const p = nav.getParent()
          if (!p) break
          nav = p
        }
        nav.navigate('Messages', { senderId: uid, receiverId: otherId, receiverName })
      } catch (e) {
        navigation.navigate('Messages', { senderId: uid, receiverId: otherId, receiverName })
      }
    })()
  }

  const renderItem = ({ item }) => (
    <MessageListItem
      id={String(item.user_id ?? item.id)}
      recipientName={item.name || (`User ${item.user_id ?? item.id}`)}
      lastMessage={item.last_message || item.last_message || ''}
      timestamp={item.last_at ? new Date(item.last_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' }) : ''}
      onPress={onOpenChat}
    />
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Messages" />
      {loading ? (
        <View style={styles.emptyContainer}><Text style={styles.emptyTitle}>Loading...</Text></View>
      ) : chats.length === 0 ? (
        <View style={styles.emptyContainer}><Text style={styles.emptyTitle}>No messages yet</Text></View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item, idx) => String(item.user_id ?? item.id ?? idx)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      )}
    </SafeAreaView>
  )
}
