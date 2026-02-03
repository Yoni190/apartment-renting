import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

// Base API URL (normalize trailing slash)
const rawApi = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api'
const API_URL = String(rawApi).replace(/\/$/, '')

// Throttle/coalesce frequent API calls to avoid rate limiting
const _inflight: Map<string, Promise<any>> = new Map()
const _lastCall: Map<string, number> = new Map()
const _cooldownUntil: Map<string, number> = new Map()

async function withThrottle<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const cooldown = _cooldownUntil.get(key) || 0
  if (cooldown > now) {
    // wait until cooldown ends, then retry
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        withThrottle(key, fn).then(resolve).catch(reject)
      }, cooldown - now)
    })
  }

  const last = _lastCall.get(key) || 0
  const existing = _inflight.get(key)
  if (existing && now - last < 800) return existing as Promise<T>

  const p = fn()
    .catch((err: any) => {
      if (err?.response?.status === 429) {
        _cooldownUntil.set(key, Date.now() + 3000)
      }
      throw err
    })
    .finally(() => {
      _inflight.delete(key)
      _lastCall.set(key, Date.now())
    })
  _inflight.set(key, p)
  return p
}

async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('token')
  } catch (err) {
    console.warn('Failed to read token from SecureStore', err)
    return null
  }
}

async function getAuthHeaders() {
  const token = await getToken()
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export interface MessagePayload {
  sender_id: number
  receiver_id: number
  message: string
  // optional: any extra metadata
  [key: string]: any
}

// Simple in-memory event emitter for message updates so different screens
// can react to new messages (optimistic or server-synced) without a global store.
type MsgCallback = (msg: any) => void
const _messageListeners: MsgCallback[] = []
export function onMessageUpdate(cb: MsgCallback) {
  if (typeof cb === 'function') _messageListeners.push(cb)
  return () => offMessageUpdate(cb)
}
export function offMessageUpdate(cb: MsgCallback) {
  const idx = _messageListeners.indexOf(cb)
  if (idx >= 0) _messageListeners.splice(idx, 1)
}
export function emitMessageUpdate(msg: any) {
  try {
    for (const cb of _messageListeners.slice()) {
      try { cb(msg) } catch (e) { /* ignore listener errors */ }
    }
  } catch (e) {}
}

// Local in-memory map to track per-message read state to avoid transient mismatches
const _localReadState: Map<string, boolean> = new Map()
export function setLocalReadState(id: any, isRead: boolean) {
  try { _localReadState.set(String(id), !!isRead) } catch (e) {}
}
export function getLocalReadState(id: any) {
  try { return _localReadState.has(String(id)) ? _localReadState.get(String(id)) : null } catch (e) { return null }
}

/**
 * Fetch messages between two users (sender & receiver).
 * Returns server response data (array of messages).
 */
export async function getMessages(senderId: number, receiverId: number) {
  const url = `${API_URL}/messages?sender_id=${encodeURIComponent(String(senderId))}&receiver_id=${encodeURIComponent(String(receiverId))}`
  try {
    return await withThrottle(`getMessages:${senderId}:${receiverId}`, async () => {
      const headers = await getAuthHeaders()
      const res = await axios.get(url, { headers })
      return res.data
    })
  } catch (err) {
    console.error('getMessages error', err)
    throw err
  }
}

/**
 * Fetch all messages where the user is either sender or receiver.
 * Returns an array of message objects (may include eager-loaded sender/receiver).
 */
export async function getMessagesForUser(userId: number) {
  const url = `${API_URL}/messages?user_id=${encodeURIComponent(String(userId))}`
  try {
    return await withThrottle(`getMessagesForUser:${userId}`, async () => {
      const headers = await getAuthHeaders()
      const res = await axios.get(url, { headers })
      return res.data
    })
  } catch (err) {
    console.error('getMessagesForUser error', err)
    throw err
  }
}

/**
 * Send a single message. Payload must include sender_id, receiver_id and message text.
 * Returns created message object from server.
 */
export async function sendMessage(payload: MessagePayload) {
  // Try common candidate endpoints — some backends use different paths.
  const candidates = [
    `${API_URL}/messages`,
    `${API_URL}/message`,
    `${API_URL}/chat/messages`,
    `${API_URL}/conversations/messages`,
    `${API_URL}/conversations`,
  ]

  const headers = await getAuthHeaders()
  let lastErr: any = null

  for (const url of candidates) {
    try {
      console.log('sendMessage POST', url, payload)
      const res = await axios.post(url, payload, { headers })
      return res.data?.message ?? res.data
    } catch (err: any) {
      lastErr = err
      console.warn('sendMessage candidate failed', { url, status: err?.response?.status })
      // if 404, try next candidate; otherwise surface the error immediately
      if (err?.response?.status === 404) continue
      console.error('sendMessage error', {
        message: err.message,
        status: err?.response?.status,
        responseData: err?.response?.data,
        requestUrl: err?.config?.url,
      })
      throw err
    }
  }

  // all candidates failed (likely 404 on every path) — log and throw the last error
  console.error('sendMessage failed for all candidate endpoints', {
    message: lastErr?.message,
    status: lastErr?.response?.status,
    responseData: lastErr?.response?.data,
  })
  throw lastErr
}

/**
 * Send a message with media (photo or video) using multipart/form-data.
 */
export async function sendMessageWithMedia(payload: MessagePayload, media: { uri: string; type?: string; name?: string }) {
  const url = `${API_URL}/messages`
  try {
    const headers = await getAuthHeaders()
    const form = new FormData()
    form.append('sender_id', String(payload.sender_id))
    form.append('receiver_id', String(payload.receiver_id))
    form.append('message', String(payload.message ?? ''))
    if (payload.reply_to_id) form.append('reply_to_id', String(payload.reply_to_id))
    if (payload.listing_id) form.append('listing_id', String(payload.listing_id))
    const safeName = media.name || (media.uri ? media.uri.split('/').pop() : 'upload') || 'upload'
    const safeType = media.type || (safeName.endsWith('.png') ? 'image/png' : safeName.endsWith('.jpg') || safeName.endsWith('.jpeg') ? 'image/jpeg' : safeName.endsWith('.gif') ? 'image/gif' : safeName.endsWith('.webp') ? 'image/webp' : 'image/jpeg')
    form.append('media', {
      uri: media.uri,
      type: safeType,
      name: safeName,
    } as any)

    const res = await axios.post(url, form, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data?.message ?? res.data
  } catch (err) {
    console.error('sendMessageWithMedia error', err)
    throw err
  }
}

/**
 * Mark messages as read for the given receiver.
 * This will call a "mark-read" endpoint on the server.
 */
export async function markMessagesAsRead(receiverId: number, senderId?: number) {
  const url = `${API_URL}/messages/mark-read`
  try {
    const headers = await getAuthHeaders()
    const payload: any = { receiver_id: receiverId }
    if (senderId) payload.sender_id = senderId
    const res = await axios.post(url, payload, { headers })
    return res.data
  } catch (err) {
    console.error('markMessagesAsRead error', err)
    throw err
  }
}

/**
 * Delete a conversation between the current user and another user.
 */
export async function deleteConversation(otherId: number) {
  const url = `${API_URL}/messages/conversation`
  try {
    const headers = await getAuthHeaders()
    const res = await axios.delete(url, { headers, data: { other_id: otherId } })
    return res.data
  } catch (err) {
    console.error('deleteConversation error', err)
    throw err
  }
}

/**
 * Try to load conversation threads / inbox for the given user.
 * This function is resilient: it will attempt several common endpoints and
 * will fall back to grouping raw messages into conversation previews.
 */
export async function getConversations(userId: number) {
  const headers = await getAuthHeaders()
  const candidates = [
    `${API_URL}/conversations`,
    `${API_URL}/messages/inbox`,
    `${API_URL}/messages?user_id=${encodeURIComponent(String(userId))}`,
    `${API_URL}/messages`,
  ]

  for (const url of candidates) {
    try {
      console.log('getConversations GET', url)
      const data = await withThrottle(`getConversations:${userId}:${url}`, async () => {
        const res = await axios.get(url, { headers })
        return res.data
      })
      // If API already provides conversations, return them directly
      if (Array.isArray(data) && data.length > 0 && data[0] && data[0].hasOwnProperty('last_message')) {
        return data
      }

      // If API returned an array (even empty), do not fall through to other candidates
      if (Array.isArray(data) && data.length === 0) {
        return data
      }

      // If API returned messages, group by counterpart to form previews
      if (Array.isArray(data)) {
        const msgs = data
        const map = new Map()
        for (const m of msgs) {
          const otherId = Number(m.sender_id) === Number(userId) ? Number(m.receiver_id) : Number(m.sender_id)
          const existing = map.get(otherId) || { user_id: otherId, last_message: null, last_at: null, unread_count: 0, name: null }
          const created = new Date(m.created_at)
          if (!existing.last_at || new Date(existing.last_at) < created) {
            existing.last_message = m.message
            existing.last_at = m.created_at
          }
          // count only messages received by the current user that are not marked read
          if (Number(m.receiver_id) === Number(userId) && !(m.is_read || m.read_at)) existing.unread_count = (existing.unread_count || 0) + 1
          // try to get a name from sender/receiver payloads if present
          existing.name = existing.name || (m.sender && m.sender.name) || (m.receiver && m.receiver.name) || existing.name
          map.set(otherId, existing)
        }
        return Array.from(map.values())
      }

      // if response shaped differently, try returning raw data
      return data
    } catch (err: any) {
      // try next candidate on error
      console.warn('getConversations candidate failed', { url, status: err?.response?.status })
      continue
    }
  }

  // If all candidates failed, throw last error
  throw new Error('Could not load conversations')
}

/**
 * Fetch a listing/apartment by id. Returns server response (listing object) when available.
 */
export async function getListing(listingId: number) {
  const url = `${API_URL}/apartments/${listingId}`
  try {
    const headers = await getAuthHeaders()
    console.log('getListing GET', url)
    const res = await axios.get(url, { headers })
    // common shape: { listing: { ... } } or direct object
    return res.data?.listing ?? res.data
  } catch (err) {
    console.error('getListing error', err)
    throw err
  }
}

/**
 * Lookup a user by email to start a chat.
 * Returns basic user info (id, name, email) or throws if not found.
 */
export async function lookupUserByEmail(email: string) {
  const url = `${API_URL}/users/lookup`
  try {
    const headers = await getAuthHeaders()
    const res = await axios.post(url, { email }, { headers })
    return res.data
  } catch (err) {
    console.error('lookupUserByEmail error', err)
    throw err
  }
}

/**
 * Fetch basic user profile by id.
 */
export async function getUserById(userId: number) {
  const url = `${API_URL}/users/${encodeURIComponent(String(userId))}`
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(url, { headers })
    return res.data
  } catch (err) {
    console.error('getUserById error', err)
    throw err
  }
}

const messageService = {
  getMessages,
  sendMessage,
  sendMessageWithMedia,
  markMessagesAsRead,
  getConversations,
  getListing,
  getMessagesForUser,
  lookupUserByEmail,
  getUserById,
  deleteConversation,
}

export default messageService
