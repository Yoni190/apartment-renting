import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
} from 'react-native'
import Header from '../../components/Header'
import { Ionicons } from '@expo/vector-icons'
import styles from './MessagesScreenStyle'
import messageService, { MessagePayload } from '../../services/messageService'
import * as SecureStore from 'expo-secure-store'
import { useIsFocused } from '@react-navigation/native'
import { Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const MessagesScreen = ({ route }) => {
  const [messages, setMessages] = useState([])
  const [receiverName, setReceiverName] = useState(null)
  const [text, setText] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)
  const flatRef = useRef(null)
  const backScale = useRef(new Animated.Value(1)).current
  const isFocused = useIsFocused()
  const [conversations, setConversations] = useState([])
  const [showNewModal, setShowNewModal] = useState(false)
  const [newReceiverId, setNewReceiverId] = useState('')

  // prefer explicit sender/receiver provided via route params
  const routeSenderId = route?.params?.senderId
  const routeReceiverId = route?.params?.receiverId
  const navigation = useNavigation()
  const apartmentId = route?.params?.apartmentId || route?.params?.listingId
  const routeUserId = route?.params?.userId || route?.params?.user_id
  const [inferredReceiver, setInferredReceiver] = useState(routeReceiverId || routeUserId || null)

  // whether this screen was opened for a specific conversation (message button)
  const hasTarget = (typeof routeSenderId !== 'undefined' || typeof routeReceiverId !== 'undefined' || Boolean(inferredReceiver) || Boolean(routeUserId))

  // compute effective sender / receiver ids for consistent behavior (owner or client)
  const effectiveSenderId = typeof routeSenderId !== 'undefined' ? Number(routeSenderId) : (currentUserId ? Number(currentUserId) : null)
  const effectiveReceiverId = typeof routeReceiverId !== 'undefined' ? Number(routeReceiverId) : (inferredReceiver ? Number(inferredReceiver) : (routeUserId ? Number(routeUserId) : null))

  useEffect(() => {
    // try to read a stored user id, fall back to token-less demo behaviour
    ;(async () => {
      try {
        const uid = await SecureStore.getItemAsync('user_id')
        if (uid) setCurrentUserId(Number(uid))
      } catch (err) {
        console.warn('Failed to read user_id from SecureStore', err)
      }
    })()
  }, [])

  // initialize receiverName from navigation params if available
  useEffect(() => {
    if (route?.params?.receiverName) setReceiverName(route.params.receiverName)
  }, [route?.params?.receiverName])

  // If component was opened with an apartmentId (from ApartmentDetails), fetch listing and infer owner id
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (!apartmentId) return
        // already have explicit receiver?
        if (routeReceiverId || routeUserId) return
        const listing = await messageService.getListing(Number(apartmentId))
        if (!mounted) return
        // try several common owner fields
        const ownerId = listing?.owner?.id || listing?.user_id || listing?.owner_id || null
        if (ownerId) setInferredReceiver(Number(ownerId))
      } catch (err) {
        console.warn('Failed to infer owner from apartmentId', err)
      }
    })()
    return () => { mounted = false }
  }, [apartmentId, routeReceiverId, routeUserId])

  useEffect(() => {
  // require both sender and receiver to load messages; sender can be routeSenderId or currentUserId
  const sender = effectiveSenderId
  const receiver = effectiveReceiverId
  if (!sender || !receiver) return

    let mounted = true
    ;(async () => {
      try {
        const data = await messageService.getMessages(Number(sender), Number(receiver))
        const msgs = Array.isArray(data) ? data : []
        msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        if (mounted) setMessages(msgs)
        // if we don't yet have a receiver display name, try to derive from messages (eager-loaded sender/receiver)
        if (!receiverName && msgs.length > 0) {
          const first = msgs.find(m => m.sender_id !== undefined)
          if (first) {
            const other = Number(first.sender_id) === Number(sender) ? first.receiver : first.sender
            const derived = other?.name ?? other?.full_name ?? null
            if (derived) setReceiverName(derived)
          }
        }
        // mark as read for the current user (sender)
        try {
          if (!Number.isNaN(sender)) {
            messageService.markMessagesAsRead(sender).catch(() => {})
          }
        } catch (e) {}
        // scroll to bottom after short delay
        setTimeout(() => flatRef.current?.scrollToEnd?.({ animated: true }), 200)
      } catch (err) {
        console.warn('Failed to load messages', err)
      }
    })()

    return () => { mounted = false }
  }, [effectiveSenderId, effectiveReceiverId, inferredReceiver, currentUserId])

  // Load conversation previews when opened without sender/receiver params
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        // only load if this screen is the generic messages tab (no specific convo)
        if (typeof routeSenderId !== 'undefined' || typeof routeReceiverId !== 'undefined') return
  const uidStr = await SecureStore.getItemAsync('user_id')
  const uid = uidStr ? Number(uidStr) : currentUserId
        if (!uid) return
        const data = await messageService.getConversations(uid)
        if (!active) return
        setConversations(Array.isArray(data) ? data : [])
      } catch (err) {
        console.warn('Failed to load conversations', err)
      }
    })()
    return () => { active = false }
  }, [routeSenderId, routeReceiverId, currentUserId, isFocused])

  const handleSend = async () => {
    if (!text.trim()) return
    const payload = {
      sender_id: effectiveSenderId || 0,
      receiver_id: effectiveReceiverId || 0,
      message: text.trim(),
    }

    // optimistic update with a temp id we can match later
    const tempId = Date.now()
    const tempMessage = {
      id: tempId,
      temp: true,
      sender_id: payload.sender_id,
      receiver_id: payload.receiver_id,
      sender_role: 'client',
      receiver_role: 'property_owner',
      message: payload.message,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setMessages((m) => [...m, tempMessage])
    setText('')
    setTimeout(() => flatRef.current?.scrollToEnd?.({ animated: true }), 50)

    try {
      const serverMsg = await messageService.sendMessage(payload)
      // if server returned the created message object, replace the temp message
      if (serverMsg && serverMsg.id) {
        setMessages((prev) => prev.map((m) => (m.id === tempId ? serverMsg : m)))
      } else {
        // fallback: reload conversation to pick up server-saved message
        try {
          const data = await messageService.getMessages(Number(payload.sender_id), Number(payload.receiver_id))
          const msgs = Array.isArray(data) ? data : []
          msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          setMessages(msgs)
        } catch (reloadErr) {
          // ignore reload failures
        }
      }
    } catch (err) {
      console.warn('sendMessage failed', err)
      // mark the temp message as failed so UI can show retry if desired
      setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, failed: true, temp: false } : m)))
    }
  }

  // Poll for new messages while a conversation is open so incoming messages appear
  useEffect(() => {
    if (!hasTarget) return
    let mounted = true
    const pollInterval = 3000
    const poll = setInterval(async () => {
      try {
        const sender = effectiveSenderId
        const receiver = effectiveReceiverId
        if (!sender || !receiver) return
        const data = await messageService.getMessages(Number(sender), Number(receiver))
        const msgs = Array.isArray(data) ? data : []
        msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        if (!mounted) return
        setMessages((prev) => {
          // preserve any local temp messages (unsent) and failed messages
          const localTemps = prev.filter((m) => m.temp || m.failed)
          // deduplicate: prefer server messages (by id) and append local temps
          const serverById = new Map()
          for (const s of msgs) serverById.set(String(s.id), s)
          const final = [...msgs]
          for (const t of localTemps) {
            // include temp/failed if not already present
            if (!t.id || !serverById.has(String(t.id))) final.push(t)
          }
          final.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          return final
        })
      } catch (e) {
        // ignore polling errors
      }
    }, pollInterval)

    return () => {
      mounted = false
      clearInterval(poll)
    }
  }, [hasTarget, effectiveSenderId, effectiveReceiverId])

  // when screen regains focus, attempt to mark as read for current user
  useEffect(() => {
    if (!isFocused) return
    // mark as read for the authenticated user (effectiveSenderId)
    try {
      const myId = effectiveSenderId
      if (myId && !Number.isNaN(myId)) messageService.markMessagesAsRead(myId).catch(() => {})
    } catch (e) {}
  }, [isFocused, effectiveSenderId])

  const renderItem = ({ item }) => {
    const isSent = Number(item.sender_id) === Number(effectiveSenderId)
    const time = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return (
      <View style={[styles.messageRow, isSent ? styles.messageRowSent : styles.messageRowReceived]}>
        <View style={[styles.bubble, isSent ? styles.bubbleSent : styles.bubbleReceived]}>
          <Text style={[styles.messageText, isSent ? styles.messageTextSent : styles.messageTextReceived]}>{item.message}</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>

        {isSent ? <View style={styles.sentSpacer} /> : null}
      </View>
    )
  }

  const renderConversation = ({ item }) => {
    const otherName = item.name || `User ${item.user_id || item.id}`
    const preview = item.last_message || ''
    const time = item.last_at ? new Date(item.last_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    return (
      <TouchableOpacity
        style={styles.convoRow}
        onPress={async () => {
          try {
            const uid = currentUserId ? Number(currentUserId) : null
            const other = Number(item.user_id || item.id)
            console.log('MessagesScreen: convo pressed, navigating', { uid, other, otherName })
            // climb to root navigator so we reliably open the chat screen
            let nav = navigation
            while (nav.getParent && nav.getParent()) {
              const p = nav.getParent()
              if (!p) break
              nav = p
            }
            // prefer dispatching a navigate action on the root navigation prop
            const params = { receiverId: other, receiverName: otherName }
            if (uid) params.senderId = uid
            if (nav && nav.dispatch) {
              nav.dispatch(require('@react-navigation/native').CommonActions.navigate({ name: 'Messages', params }))
            } else {
              navigation.navigate('Messages', params)
            }
          } catch (e) {
            console.warn('MessagesScreen conversation navigation failed', e)
            const params = { receiverId: Number(item.user_id || item.id), receiverName: otherName }
            if (currentUserId) params.senderId = Number(currentUserId)
            navigation.navigate('Messages', params)
          }
        }}
      >
        <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>{(otherName[0]||'U').toUpperCase()}</Text></View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.convoName}>{otherName}</Text>
            <Text style={styles.convoTime}>{time}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.convoPreview} numberOfLines={1}>{preview}</Text>
            {item.unread_count ? <View style={styles.unreadBadge}><Text style={styles.unreadText}>{item.unread_count}</Text></View> : null}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const openNewConversation = async () => {
    const rid = Number(newReceiverId)
    if (!rid) return
    setShowNewModal(false)
    // navigate to chat: prefer passing only receiverId; effectiveSenderId will pick currentUserId
    navigation.navigate('Messages', { senderId: Number(currentUserId), receiverId: rid })
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kb} keyboardVerticalOffset={90}>
  {/* Compact conversation header (Telegram-like) when opened for a specific conversation */}
  {hasTarget ? (
    // Custom dark-blue conversation header (Telegram-like)
    <View style={styles.chatHeader}>
      {/* Animated back button */}
      <Pressable
        onPress={() => {
          try { navigation.goBack() } catch (e) { navigation.navigate('Home') }
        }}
        onPressIn={() => {
          Animated.spring(backScale, { toValue: 0.92, useNativeDriver: true }).start()
        }}
        onPressOut={() => {
          Animated.spring(backScale, { toValue: 1, friction: 6, useNativeDriver: true }).start()
        }}
        style={styles.chatHeaderLeft}
      >
        <Animated.View style={[styles.chatBackContainer, { transform: [{ scale: backScale }] }]}> 
          <Text style={styles.chatBack}>{'<'}</Text>
        </Animated.View>
      </Pressable>

      <View style={styles.chatHeaderCenter}>
        <View style={styles.chatAvatar}><Text style={styles.chatAvatarText}>{(receiverName || route?.params?.receiverName || 'U').charAt(0).toUpperCase()}</Text></View>
        <Text style={styles.chatHeaderTitle} numberOfLines={1}>{receiverName ?? route?.params?.receiverName ?? 'Conversation'}</Text>
      </View>

      <View style={styles.chatHeaderRight} />
    </View>
  ) : (
    <Header title={receiverName ?? route?.params?.receiverName ?? 'Messages'} />
  )}

        {/* If opened without an explicit convo target (bottom tab), show conversation list; otherwise show the chat view */}
        {!hasTarget ? (
          <>
            {conversations.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No messages yet</Text>
              </View>
            ) : (
              <FlatList
                data={conversations}
                keyExtractor={(item, idx) => String(item.user_id ?? item.id ?? idx)}
                renderItem={renderConversation}
                contentContainerStyle={styles.listContent}
              />
            )}

            <TouchableOpacity style={styles.fab} onPress={() => setShowNewModal(true)}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            <Modal visible={showNewModal} transparent animationType="slide">
              <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <View style={{ backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Start new message</Text>
                  <TextInput placeholder="Receiver user id" value={newReceiverId} onChangeText={setNewReceiverId} style={[styles.input, { backgroundColor: '#fff' }]} keyboardType="numeric" />
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                    <TouchableOpacity onPress={() => setShowNewModal(false)} style={{ marginRight: 12 }}>
                      <Text style={{ color: '#6b7280' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openNewConversation}>
                      <Text style={{ color: '#1778f2', fontWeight: '700' }}>Open</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <>
            <FlatList
              ref={flatRef}
              data={messages}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              onContentSizeChange={() => flatRef.current?.scrollToEnd?.({ animated: true })}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Type a message"
                multiline={false}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend} accessibilityLabel="Send">
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default MessagesScreen
