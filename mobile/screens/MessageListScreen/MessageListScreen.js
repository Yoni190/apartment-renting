import React, { useEffect, useState, useMemo, useRef } from 'react'
import { SafeAreaView, View, FlatList, Text, TouchableOpacity, TextInput, Animated, Easing, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CommonActions } from '@react-navigation/native'
import styles from './MessageListScreenStyle'
import MessageListItem from '../../components/MessageListItem'
import messageService from '../../services/messageService'
import { onMessageUpdate, offMessageUpdate, emitMessageUpdate, setLocalReadState, getLocalReadState } from '../../services/messageService'
import * as SecureStore from 'expo-secure-store'
import Header from '../../components/Header'

// MessageListScreen: fetches conversation previews for the logged-in user
export default function MessageListScreen({ navigation }) {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [allMessages, setAllMessages] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [refreshing, setRefreshing] = useState(false)
  const loadersRef = useRef({})
  const emptyAnim = useRef(new Animated.Value(0)).current
  const emptyAllAnim = useRef(new Animated.Value(0)).current
  const [showNewModal, setShowNewModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newError, setNewError] = useState('')
  const [newLoading, setNewLoading] = useState(false)
  const [selectedMap, setSelectedMap] = useState({})

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      const l = loadersRef.current
      const p = []
      if (l.loadConversations) p.push(l.loadConversations())
      if (l.loadAllMessages) p.push(l.loadAllMessages())
      await Promise.all(p)
    } catch (e) {
      console.warn('Refresh failed', e)
    } finally {
      setRefreshing(false)
    }
  }

  // recompute unread counts for existing chats using raw messages we fetched
  const recomputeUnreadCounts = (uid, messages) => {
    try {
      if (!uid) return
      if (!Array.isArray(messages) || messages.length === 0) return
      const map = new Map()
      for (const m of messages) {
        try {
          // only count messages received by the current user that are not read
          if (Number(m.receiver_id) !== uid) continue
          const sid = Number(m.sender_id)
          if (!sid) continue
          if (m.is_read || m.read_at) continue
          const key = String(sid)
          map.set(key, (map.get(key) || 0) + 1)
        } catch (e) { }
      }
      // apply map to chats
      setChats(prev => (prev || []).map(c => {
        try {
          const id = Number(c.user_id ?? c.id ?? -1)
          const count = map.get(String(id)) || 0
          return { ...c, unread_count: count }
        } catch (e) { return c }
      }))
    } catch (e) { }
  }

  useEffect(() => {
    let mounted = true

    async function loadConversations() {
      try {
        const uidStr = await SecureStore.getItemAsync('user_id')
        const uid = uidStr ? Number(uidStr) : null
        if (mounted) setCurrentUserId(uid)
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
              const lastSender = it.last_sender_id ?? it.lastSenderId ?? it.sender_id ?? (it.sender && it.sender.id ? Number(it.sender.id) : null)
              const lastIsRead = it.last_message_is_read ?? it.lastMessageIsRead ?? (it.read_at ? true : false) ?? false
              const name = it.name ?? it.user?.name ?? (sid === userId ? it.sender?.name : it.receiver?.name) ?? it.sender?.name ?? it.receiver?.name ?? (userId ? `User ${userId}` : 'Unknown')
              return { user_id: userId, last_message: lastMessage, last_at: lastAt, unread_count: unread, name, last_sender_id: lastSender ? Number(lastSender) : null, last_message_is_read: !!lastIsRead }
            })
            convs.sort((a, b) => new Date(b.last_at || 0) - new Date(a.last_at || 0))
            if (mounted) {
              setChats(convs)
              setLoading(false)
              // adjust unread counts using raw messages if we have them
              try { recomputeUnreadCounts(uid, allMessages) } catch (e) {}
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

            // try to derive a display name for the other participant
            if (!existing.name) {
              // if sender/receiver objects included, prefer that
              if (m.sender && Number(m.sender.id) === otherId) existing.name = m.sender.name
              else if (m.receiver && Number(m.receiver.id) === otherId) existing.name = m.receiver.name
            }
            if (!existing.name) existing.name = `User ${otherId}`
            // record last message sender and read state for preview ticks
            if (!existing.last_at || (created && new Date(existing.last_at) < created)) {
              // this message becomes the latest for this conversation — use its read state
              existing.last_message = m.message ?? m.last_message ?? ''
              existing.last_at = m.created_at ?? m.created_at ?? null
              existing.last_message_is_read = !!m.is_read || !!m.read_at
            }
            if (Number(m.receiver_id) === uid && !(m.is_read || m.read_at)) existing.unread_count = (existing.unread_count || 0) + 1
            existing.last_sender_id = m.sender_id ? Number(m.sender_id) : existing.last_sender_id
            map.set(key, existing)
          }

          const convs = Array.from(map.values())
          // sort by last_at desc
          convs.sort((a, b) => new Date(b.last_at || 0) - new Date(a.last_at || 0))
          if (mounted) {
            setChats(convs)
            setLoading(false)
            // adjust unread counts using raw messages if we have them
            try { recomputeUnreadCounts(uid, allMessages) } catch (e) {}
          }
          return
        }

        // fallback: empty list
        if (mounted) {
          setChats([])
          setLoading(false)
          try { recomputeUnreadCounts(uid, allMessages) } catch (e) {}
        }
      } catch (err) {
        console.warn('Failed to load conversations', err)
        if (mounted) {
          setChats([])
          setLoading(false)
        }
      }
    }

    // subscribe to message updates (sent or received) so previews reflect latest message
    const handleMsg = async (m) => {
      try {
        // ensure we have a current user id; fall back to SecureStore if not yet loaded
        let uid = currentUserId
        if (!uid) {
          try {
            const uidStr = await SecureStore.getItemAsync('user_id')
            uid = uidStr ? Number(uidStr) : null
            if (uid) setCurrentUserId(uid)
          } catch (e) {
            uid = null
          }
        }

        // normalize incoming message shape
        const sid = Number(m.sender_id)
        const rid = Number(m.receiver_id)
        // determine the other participant relative to uid; if uid not known, pick the other id heuristically
        const other = (uid ? (sid === uid ? rid : sid) : (isFinite(sid) && sid !== 0 ? sid : rid))
        if (!other && other !== 0) return

        // update chats list preview immediately
        setChats(prev => {
          const copy = Array.isArray(prev) ? [...prev] : []
          const idx = copy.findIndex(c => Number(c.user_id) === Number(other))
          const preview = {
            user_id: other,
            name: (m.sender && Number(m.sender.id) === other) ? m.sender.name : ((m.receiver && Number(m.receiver.id) === other) ? m.receiver.name : `User ${other}`),
            last_message: m.message ?? m.last_message ?? copy[idx]?.last_message ?? '',
            last_at: m.created_at ?? m.createdAt ?? new Date().toISOString(),
            // count unread only if we know the current user id; otherwise leave as existing
            unread_count: (uid && Number(m.receiver_id) === uid && !(m.is_read || m.read_at)) ? ((copy[idx]?.unread_count || 0) + 1) : (copy[idx]?.unread_count || 0),
            last_sender_id: Number(m.sender_id),
            last_message_is_read: !!m.is_read || !!m.read_at || false,
          }
          if (idx >= 0) copy.splice(idx, 1)
          copy.unshift(preview)
          return copy
        })

        // update allMessages so grouped view refreshes
        setAllMessages(prev => {
          const arr = Array.isArray(prev) ? [...prev] : []
          if (m.id) {
            const found = arr.findIndex(x => String(x.id) === String(m.id))
            if (found >= 0) { arr[found] = m; return arr }
          }
          arr.unshift(m)
          return arr
        })

        // also refresh from server to ensure previews/ticks match authoritative state
        // Debounce these heavy refreshes to avoid triggering server rate limits
        try {
          const t = loadersRef.current
          // clear any pending refresh
          if (t._refreshTimer) clearTimeout(t._refreshTimer)
          t._refreshTimer = setTimeout(() => {
            try { t.loadConversations && t.loadConversations() } catch (e) {}
            try { t.loadAllMessages && t.loadAllMessages() } catch (e) {}
            t._refreshTimer = null
          }, 800)
        } catch (e) {}
      } catch (e) { }
    }

    const unsub = onMessageUpdate(handleMsg)

    async function loadAllMessages() {
      try {
        const uidStr = await SecureStore.getItemAsync('user_id')
        const uid = uidStr ? Number(uidStr) : null
        if (mounted) setCurrentUserId(uid)
        if (!uid) {
          if (mounted) setAllMessages([])
          return
        }
        const data = await messageService.getMessagesForUser(uid)
        // expect an array of messages
        if (Array.isArray(data)) {
          // sort by created_at desc
          data.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0))
          if (mounted) setAllMessages(data)
          // after we have raw messages, recompute unread counts for chats
          try { recomputeUnreadCounts(uid, data) } catch (e) {}
        } else {
          if (mounted) setAllMessages([])
          try { recomputeUnreadCounts(uid, []) } catch (e) {}
        }
      } catch (err) {
        console.warn('Failed to load all messages', err)
        if (mounted) setAllMessages([])
        try { recomputeUnreadCounts(uid, []) } catch (e) {}
      }
    }

      // expose loaders for pull-to-refresh
      loadersRef.current.loadConversations = loadConversations
      loadersRef.current.loadAllMessages = loadAllMessages

    loadConversations()
    // preload all messages in background so toggle is snappy
    loadAllMessages()

    return () => {
      mounted = false
      try { offMessageUpdate(handleMsg) } catch (e) {}
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
      if (!otherId) return
      // navigate to root stack's Messages screen so chat opens directly
      try {
        console.log('MessageListScreen: navigating to Messages', { uid, otherId, receiverName })
        // try dispatching a root navigate action for extra reliability
        let nav = navigation
        while (nav.getParent && nav.getParent()) {
          const p = nav.getParent()
          if (!p) break
          nav = p
        }
        const params = { receiverId: otherId, receiverName }
        if (uid) params.senderId = uid
        if (nav && nav.dispatch) {
          nav.dispatch(CommonActions.navigate({ name: 'Messages', params }))
        } else {
          navigation.navigate('Messages', params)
        }
      } catch (e) {
        console.warn('MessageListScreen navigation fallback', e)
        const params = { receiverId: otherId, receiverName }
        if (uid) params.senderId = uid
        navigation.navigate('Messages', params)
      }
      // locally clear unread badge for this conversation so UI is immediate
      try {
        // clear in chats list
        setChats(prev => (prev || []).map(c => {
          const id = Number(c.user_id ?? c.id ?? null)
          if (id === otherId) return { ...c, unread_count: 0 }
          return c
        }))

        // mark on server as read for this conversation (receiver = current user, sender = otherId)
        if (uid) {
          messageService.markMessagesAsRead(uid, otherId).catch(err => console.warn('mark read failed', err))
        }

        // update allMessages so groupedFromAll reflects the change immediately and emit updates
        try {
          setAllMessages(prev => {
            const arr = (prev || []).map(m => {
              try {
                const sid = Number(m.sender_id)
                const rid = Number(m.receiver_id)
                if (uid && sid === otherId && rid === uid) {
                  const updated = { ...m, is_read: true }
                  try { setLocalReadState(updated.id, true) } catch (e) {}
                  try { emitMessageUpdate(updated) } catch (e) {}
                  return updated
                }
              } catch (e) {}
              return m
            })
            return arr
          })
        } catch (e) { console.warn('Failed to update allMessages locally', e) }
      } catch (err) {
        console.warn('Failed to clear unread locally', err)
      }
    })()
  }

  const hasSelection = useMemo(() => Object.keys(selectedMap).length > 0, [selectedMap])

  const toggleSelect = (item) => {
    const id = String(item.user_id ?? item.id ?? '')
    if (!id) return
    setSelectedMap(prev => {
      const next = { ...(prev || {}) }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }

  const clearSelection = () => setSelectedMap({})

  const onMarkSelectedRead = async () => {
    try {
      const uidStr = await SecureStore.getItemAsync('user_id')
      const uid = uidStr ? Number(uidStr) : null
      if (!uid) return
      const ids = Object.keys(selectedMap)
      for (const sid of ids) {
        const otherId = Number(sid)
        if (!otherId) continue
        try { await messageService.markMessagesAsRead(uid, otherId) } catch (e) {}
      }
      // update local state
      setAllMessages(prev => (prev || []).map(m => {
        const sid = Number(m.sender_id)
        const rid = Number(m.receiver_id)
        if (rid === uid && selectedMap[String(sid)]) {
          return { ...m, is_read: true, read_at: new Date().toISOString() }
        }
        return m
      }))
      setChats(prev => (prev || []).map(c => {
        const id = String(c.user_id ?? c.id ?? '')
        if (selectedMap[id]) return { ...c, unread_count: 0 }
        return c
      }))
      clearSelection()
    } catch (e) {}
  }

  const onDeleteSelected = async () => {
    try {
      const ids = Object.keys(selectedMap)
      for (const sid of ids) {
        const otherId = Number(sid)
        if (!otherId) continue
        try { await messageService.deleteConversation(otherId) } catch (e) {}
      }
      // remove from local state
      setChats(prev => (prev || []).filter(c => !selectedMap[String(c.user_id ?? c.id ?? '')]))
      setAllMessages(prev => (prev || []).filter(m => {
        const other = Number(m.sender_id) === Number(currentUserId) ? Number(m.receiver_id) : Number(m.sender_id)
        return !selectedMap[String(other)]
      }))
      clearSelection()
    } catch (e) {}
  }

  const onStartChatByEmail = async () => {
    try {
      const email = String(newEmail || '').trim().toLowerCase()
      if (!email) {
        setNewError('Please enter an email.')
        return
      }
      setNewLoading(true)
      setNewError('')
      const user = await messageService.lookupUserByEmail(email)
      const receiverId = Number(user?.id)
      const receiverName = user?.name || email
      const uidStr = await SecureStore.getItemAsync('user_id')
      const uid = uidStr ? Number(uidStr) : null
      if (!receiverId) {
        setNewError('User not found.')
        return
      }
      if (uid && receiverId === uid) {
        setNewError('You cannot message yourself.')
        return
      }
      setShowNewModal(false)
      setNewEmail('')
      try {
        let nav = navigation
        while (nav.getParent && nav.getParent()) {
          const p = nav.getParent()
          if (!p) break
          nav = p
        }
        const params = { receiverId, receiverName }
        if (uid) params.senderId = uid
        if (nav && nav.dispatch) {
          nav.dispatch(CommonActions.navigate({ name: 'Messages', params }))
        } else {
          navigation.navigate('Messages', params)
        }
      } catch (e) {
        const params = { receiverId, receiverName }
        if (uid) params.senderId = uid
        navigation.navigate('Messages', params)
      }
    } catch (e) {
      setNewError('User not found.')
    } finally {
      setNewLoading(false)
    }
  }

  const renderItem = ({ item }) => (
    (() => {
      // find authoritative latest message for this conversation from allMessages
      const otherId = Number(item.user_id ?? item.id ?? null)
      let latest = null
      try {
        if (Array.isArray(allMessages) && otherId) {
          for (const m of allMessages) {
            const sid = Number(m.sender_id)
            const rid = Number(m.receiver_id)
            const other = sid === currentUserId ? rid : sid
            if (other !== otherId) continue
            if (!latest) latest = m
            else {
              const la = new Date(latest.created_at || latest.createdAt || 0)
              const ca = new Date(m.created_at || m.createdAt || 0)
              if (ca > la) latest = m
            }
          }
        }
      } catch (e) { latest = null }

      const lastMessageText = (latest && latest.media_url) ? 'image' : (latest?.message ?? item.last_message ?? '')
      const lastAt = latest?.created_at ?? latest?.createdAt ?? item.last_at ?? null
      const lastFromMe = latest ? (Number(latest.sender_id) === Number(currentUserId ?? -1)) : (Number(item.last_sender_id) === Number(currentUserId ?? -1))
      // prefer local read-state map for the exact message id to avoid transient mismatches
      const lastIsRead = (() => {
        try {
          if (latest && latest.id) {
            const local = getLocalReadState(latest.id)
            if (local !== null) return Boolean(local)
            return Boolean(latest.is_read || latest.read_at)
          }
          return Boolean(item.last_message_is_read)
        } catch (e) { return Boolean(item.last_message_is_read) }
      })()
      // local read-state for the authoritative latest message (if any)
      const lastLocallyRead = (() => {
        try {
          if (latest && latest.id) {
            const local = getLocalReadState(latest.id)
            return local === null ? null : Boolean(local)
          }
        } catch (e) {}
        return null
      })()
      const unreadCount = lastFromMe ? 0 : Number(unreadMap.get(String(otherId)) || item.unread_count || 0)

      return (
        <MessageListItem
          id={String(item.user_id ?? item.id)}
          recipientName={item.name || (`User ${item.user_id ?? item.id}`)}
          lastMessage={lastMessageText}
          timestamp={lastAt ? new Date(lastAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          // if selection is active, tap toggles selection; otherwise open chat
          onPress={() => (hasSelection ? toggleSelect(item) : onOpenChat(item))}
          onLongPress={() => toggleSelect(item)}
          selected={!!selectedMap[String(item.user_id ?? item.id)]}
          lastMessageFromMe={lastFromMe}
          lastMessageId={latest?.id ?? null}
          lastMessageWasReceived={latest ? (Number(latest.receiver_id) === Number(currentUserId ?? -1)) : (Number(item.last_sender_id) !== Number(currentUserId ?? -1))}
          lastMessageReadAt={latest?.read_at ?? latest?.readAt ?? null}
          lastMessageTimestamp={latest?.created_at ?? latest?.createdAt ?? null}
          lastMessageLocallyRead={lastLocallyRead}
          unreadCount={unreadCount}
          lastMessageIsRead={lastIsRead}
        />
      )
    })()
  )

  const renderMessageItem = ({ item }) => {
    const senderName = item.sender?.name ?? `User ${item.sender_id}`
    const time = item.created_at ? new Date(item.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' }) : ''
    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={async () => {
          // open chat with the other participant
          const uidStr = await SecureStore.getItemAsync('user_id')
          const uid = uidStr ? Number(uidStr) : null
          const sid = Number(item.sender_id)
          const rid = Number(item.receiver_id)
          const otherId = sid === uid ? rid : sid
          const receiverName = (otherId === sid) ? (item.sender?.name ?? `User ${sid}`) : (item.receiver?.name ?? `User ${rid}`)
          if (!otherId) return
          try {
            let nav = navigation
            while (nav.getParent && nav.getParent()) {
              const p = nav.getParent()
              if (!p) break
              nav = p
            }
            const params = { receiverId: otherId, receiverName }
            if (uid) params.senderId = uid
            nav.navigate('Messages', params)
          } catch (e) {
            const params = { receiverId: otherId, receiverName }
            if (uid) params.senderId = uid
            navigation.navigate('Messages', params)
          }
        }}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(senderName || 'U').charAt(0)}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.rowTop}>
            <Text style={styles.name}>{senderName}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <View style={styles.rowBottom}><Text numberOfLines={1} style={styles.lastMessage}>{item.message}</Text></View>
        </View>
      </TouchableOpacity>
    )
  }

  // When showing "All messages" we want to show one row per other participant
  // (deduplicated by counterpart). Build grouped conversation previews from
  // the raw messages so the UI shows each receiver only once.
  const groupedFromAll = useMemo(() => {
    if (!Array.isArray(allMessages)) return []
    const uid = currentUserId
    const map = new Map()
    for (const m of allMessages) {
      const sid = Number(m.sender_id)
      const rid = Number(m.receiver_id)
      const otherId = (sid && rid && uid) ? (sid === uid ? rid : sid) : (m.user_id ?? m.other_id ?? (sid === uid ? rid : sid))
      if (!otherId) continue
      const key = String(otherId)
      const existing = map.get(key) || { user_id: otherId, last_message: null, last_at: null, unread_count: 0, name: null }
      const created = m.created_at ? new Date(m.created_at) : (m.createdAt ? new Date(m.createdAt) : null)
      if (!existing.last_at || (created && new Date(existing.last_at) < created)) {
        // this message becomes the latest — use its content and read state
        existing.last_message = m.message ?? m.last_message ?? ''
        existing.last_at = m.created_at ?? m.createdAt ?? null
        existing.last_sender_id = m.sender_id ? Number(m.sender_id) : existing.last_sender_id
        existing.last_message_is_read = !!m.is_read || !!m.read_at
      }
      // count only messages that are received by the current user and not marked read
      if (Number(m.receiver_id) === uid && !(m.is_read || m.read_at)) existing.unread_count = (existing.unread_count || 0) + 1
      if (!existing.name) {
        if (m.sender && Number(m.sender.id) === otherId) existing.name = m.sender.name
        else if (m.receiver && Number(m.receiver.id) === otherId) existing.name = m.receiver.name
      }
      if (!existing.name) existing.name = `User ${otherId}`
  // (last_sender_id / last_message_is_read already set when this message became the latest)
      map.set(key, existing)
    }
    const arr = Array.from(map.values())
    arr.sort((a, b) => new Date(b.last_at || 0) - new Date(a.last_at || 0))
    return arr
  }, [allMessages, currentUserId])

  // debug: log unreadMap contents when it changes
  useEffect(() => {
    try {
      const uid = currentUserId
      if (!uid) return
      const entries = Array.from(unreadMap ? unreadMap.entries() : [])
      console.log('MessageListScreen: unreadMap entries', entries)
    } catch (e) {}
  }, [unreadMap, currentUserId])

  // authoritative unread counts per sender based on raw messages (is_read === false || read_at === null)
  const unreadMap = useMemo(() => {
    const map = new Map()
    try {
      const uid = currentUserId
      if (!uid || !Array.isArray(allMessages)) return map
      for (const m of allMessages) {
        try {
          const rid = Number(m.receiver_id)
          const sid = Number(m.sender_id)
          if (rid !== uid) continue
          if (!sid) continue
          if (m.is_read || m.read_at) continue
          const key = String(sid)
          map.set(key, (map.get(key) || 0) + 1)
        } catch (e) {}
      }
    } catch (e) {}
    return map
  }, [allMessages, currentUserId])

  const totalUnread = useMemo(() => {
    try {
      return Array.from(unreadMap.values()).reduce((sum, n) => sum + Number(n || 0), 0)
    } catch (e) { return 0 }
  }, [unreadMap])

  const filteredList = useMemo(() => {
    const base = (Array.isArray(groupedFromAll) && groupedFromAll.length > 0) ? groupedFromAll : (Array.isArray(chats) ? chats : [])
    const q = query.trim().toLowerCase()
    let list = base
    if (q) {
      list = list.filter(it => (it.name || '').toLowerCase().includes(q) || (it.last_message || '').toLowerCase().includes(q))
    }
    if (activeTab === 'unread') {
      list = list.filter(it => {
        try {
          const otherId = Number(it.user_id ?? it.id ?? null)
          if (!otherId) return false
          const count = Number(unreadMap.get(String(otherId)) || it.unread_count || 0)
          return count > 0
        } catch (e) { return false }
      })
    }
    return list
  }, [groupedFromAll, chats, query, activeTab, unreadMap])

  useEffect(() => {
    if (activeTab !== 'unread') return
    if (filteredList.length > 0) return
    try {
      emptyAnim.setValue(0)
      Animated.timing(emptyAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
    } catch (e) {}
  }, [activeTab, filteredList.length])

  useEffect(() => {
    if (activeTab !== 'all') return
    if (filteredList.length > 0) return
    try {
      emptyAllAnim.setValue(0)
      Animated.timing(emptyAllAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
    } catch (e) {}
  }, [activeTab, filteredList.length])

  // unread conversations derived from grouped all-messages (one row per counterpart)
  

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Messages" />
      {loading ? (
        <View style={styles.emptyContainer}><Text style={styles.emptyTitle}>Loading...</Text></View>
      ) : (
        <View style={styles.screenContent}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search conversations"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {query ? (
              <TouchableOpacity style={styles.searchClear} onPress={() => setQuery('')}>
                <Text style={{ color: '#6b7280' }}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>All messages ({totalUnread})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'unread' && styles.tabButtonActive]}
              onPress={() => setActiveTab('unread')}
            >
              <Text style={[styles.tabText, activeTab === 'unread' && styles.tabTextActive]}>Unread ({totalUnread})</Text>
            </TouchableOpacity>
          </View>
          {hasSelection ? (
            <View style={styles.selectionBar}>
              <Text style={styles.selectionText}>{Object.keys(selectedMap).length} selected</Text>
              <View style={styles.selectionActions}>
                <TouchableOpacity style={styles.selectionBtn} onPress={onMarkSelectedRead}>
                  <Text style={styles.selectionBtnText}>Mark read</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.selectionBtn, styles.selectionBtnDanger]} onPress={onDeleteSelected}>
                  <Text style={[styles.selectionBtnText, styles.selectionBtnTextDanger]}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectionBtnGhost} onPress={clearSelection}>
                  <Text style={styles.selectionBtnGhostText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          <FlatList
            data={filteredList}
            keyExtractor={(item, idx) => String(item.user_id ?? item.id ?? idx)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            ListEmptyComponent={() => {
              if (activeTab === 'unread') {
                return (
                  <Animated.View
                    style={[
                      styles.emptyUnreadContainer,
                      { transform: [{ scale: emptyAnim }], opacity: emptyAnim },
                    ]}
                  >
                    <Text style={styles.emptyUnreadText}>No unread messages.</Text>
                  </Animated.View>
                )
              }
              if (activeTab === 'all') {
                return (
                  <Animated.View
                    style={[
                      styles.emptyAllContainer,
                      { transform: [{ scale: emptyAllAnim }], opacity: emptyAllAnim },
                    ]}
                  >
                    <Ionicons name="chatbubble-ellipses" size={52} color="#94a3b8" />
                    <Text style={styles.emptyAllText}>No messages yet</Text>
                  </Animated.View>
                )
              }
              return null
            }}
          />
          {activeTab === 'all' ? (
            <TouchableOpacity style={styles.fab} onPress={() => setShowNewModal(true)}>
              <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
          ) : null}

          <Modal visible={showNewModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Start new message</Text>
                <TextInput
                  placeholder="Enter user email"
                  value={newEmail}
                  onChangeText={(t) => { setNewEmail(t); setNewError('') }}
                  style={styles.modalInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {newError ? <Text style={styles.modalError}>{newError}</Text> : null}
                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setShowNewModal(false)} style={styles.modalBtnGhost}>
                    <Text style={styles.modalBtnGhostText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onStartChatByEmail} style={styles.modalBtnPrimary} disabled={newLoading}>
                    <Text style={styles.modalBtnPrimaryText}>{newLoading ? 'Please wait...' : 'Start'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  )
}
