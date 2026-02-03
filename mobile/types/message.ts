// Shared chat message type for the mobile app
export type ChatRole = 'client' | 'property_owner'

/**
 * 1-to-1 chat message shape (server format)
 * - ids are numeric
 * - created_at is an ISO-8601 timestamp string from the server
 */
export interface ChatMessage {
  id: number
  sender_id: number
  receiver_id: number
  sender_role: ChatRole
  receiver_role: ChatRole
  message: string
  is_read: boolean
  created_at: string // ISO-8601 timestamp e.g. "2026-02-01T12:34:56Z"
}

export default ChatMessage
