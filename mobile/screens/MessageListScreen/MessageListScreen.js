import React, { useEffect, useState, useMemo, useRef } from 'react'
import { SafeAreaView, View, FlatList, Text, TouchableOpacity, TextInput } from 'react-native'
import { CommonActions } from '@react-navigation/native'
import styles from './MessageListScreenStyle'
import MessageListItem from '../../components/MessageListItem'
import messageService from '../../services/messageService'
import { onMessageUpdate, offMessageUpdate } from '../../services/messageService'
import * as SecureStore from 'expo-secure-store'
import Header from '../../components/Header'

// MessageListScreen: fetches conversation previews for the logged-in user
export default function MessageListScreen({ navigation }) {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [allMessages, setAllMessages] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [query, setQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const loadersRef = useRef({})

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
            if (!existing.last_at || (created && new Date(existing.last_at) < created)) {
              existing.last_message = m.message ?? m.last_message ?? ''
              existing.last_at = m.created_at ?? m.created_at ?? null
            }
            if (Number(m.receiver_id) === uid && !(m.is_read || m.read_at)) existing.unread_count = (existing.unread_count || 0) + 1

            // try to derive a display name for the other participant
            if (!existing.name) {
              // if sender/receiver objects included, prefer that
              if (m.sender && Number(m.sender.id) === otherId) existing.name = m.sender.name
              else if (m.receiver && Number(m.receiver.id) === otherId) existing.name = m.receiver.name
            }
            if (!existing.name) existing.name = `User ${otherId}`
            // record last message sender and read state for preview ticks
            existing.last_sender_id = m.sender_id ? Number(m.sender_id) : existing.last_sender_id
            existing.last_message_is_read = existing.last_message_is_read || !!m.is_read || !!m.read_at
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
    const handleMsg = (m) => {
      try {
        const uid = currentUserId
        if (!uid) return
        // normalize incoming message shape
        const sid = Number(m.sender_id)
        const rid = Number(m.receiver_id)
        const other = sid === uid ? rid : sid
        if (!other) return

        // update chats list preview
        setChats(prev => {
          const copy = Array.isArray(prev) ? [...prev] : []
          const idx = copy.findIndex(c => Number(c.user_id) === Number(other))
          const preview = {
            user_id: other,
            name: (m.sender && Number(m.sender.id) === other) ? m.sender.name : ((m.receiver && Number(m.receiver.id) === other) ? m.receiver.name : `User ${other}`),
            last_message: m.message ?? m.last_message ?? copy[idx]?.last_message ?? '',
            last_at: m.created_at ?? m.createdAt ?? new Date().toISOString(),
            unread_count: (Number(m.receiver_id) === uid && !(m.is_read || m.read_at)) ? ((copy[idx]?.unread_count || 0) + 1) : (copy[idx]?.unread_count || 0),
            last_sender_id: Number(m.sender_id),
            last_message_is_read: !!m.is_read || !!m.read_at || false,
          }
          if (idx >= 0) copy.splice(idx, 1)
          copy.unshift(preview)
          return copy
        })

        // update allMessages list so grouped view refreshes
        setAllMessages(prev => {
          const arr = Array.isArray(prev) ? [...prev] : []
          // avoid duplicates by id when possible
          if (m.id) {
            const found = arr.findIndex(x => String(x.id) === String(m.id))
            if (found >= 0) { arr[found] = m; return arr }
          }
          arr.unshift(m)
          return arr
        })
        // also refresh from server to ensure previews/ticks match authoritative state
        try { loadConversations(); loadAllMessages(); } catch (e) {}
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

        // update allMessages so groupedFromAll reflects the change immediately
        setAllMessages(prev => (prev || []).map(m => {
          try {
            const sid = Number(m.sender_id)
            const rid = Number(m.receiver_id)
            if (uid && sid === otherId && rid === uid) {
              return { ...m, is_read: true }
            }
            return m
          } catch (e) { return m }
        }))
      } catch (err) {
        console.warn('Failed to clear unread locally', err)
      }
    })()
  }

  const renderItem = ({ item }) => (
    <MessageListItem
      id={String(item.user_id ?? item.id)}
      recipientName={item.name || (`User ${item.user_id ?? item.id}`)}
      lastMessage={item.last_message || item.last_message || ''}
      timestamp={item.last_at ? new Date(item.last_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' }) : ''}
      // pass a wrapper so we always call onOpenChat with the original item (avoids
      // MessageListItem creating a smaller payload that can lose the user id)
      onPress={() => onOpenChat(item)}
      unreadCount={Number(unreadMap.get(String(item.user_id ?? item.id)) || item.unread_count || 0)}
      lastMessageFromMe={Number(item.last_sender_id) === Number(currentUserId ?? -1)}
      lastMessageIsRead={Boolean(item.last_message_is_read)}
    />
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
        existing.last_message = m.message ?? m.last_message ?? ''
        existing.last_at = m.created_at ?? m.createdAt ?? null
      }
      // count only messages that are received by the current user and not marked read
      if (Number(m.receiver_id) === uid && !(m.is_read || m.read_at)) existing.unread_count = (existing.unread_count || 0) + 1
      if (!existing.name) {
        if (m.sender && Number(m.sender.id) === otherId) existing.name = m.sender.name
        else if (m.receiver && Number(m.receiver.id) === otherId) existing.name = m.receiver.name
      }
      if (!existing.name) existing.name = `User ${otherId}`
  // record last sender and read state so conversation preview can render ticks
  existing.last_sender_id = m.sender_id ? Number(m.sender_id) : existing.last_sender_id
  existing.last_message_is_read = existing.last_message_is_read || !!m.is_read || !!m.read_at
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

  const filteredList = useMemo(() => {
    if (!query || query.trim() === '') return groupedFromAll
    const q = query.trim().toLowerCase()
    return groupedFromAll.filter(it => (it.name || '').toLowerCase().includes(q) || (it.last_message || '').toLowerCase().includes(q))
  }, [groupedFromAll, query])

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
          <FlatList
            data={filteredList}
            keyExtractor={(item, idx) => String(item.user_id ?? item.id ?? idx)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
          />
        </View>
      )}
    </SafeAreaView>
  )
}
