import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  kb: { flex: 1 },
  listContent: { paddingHorizontal: 12, paddingBottom: 12 },

  // conversation list
  convoRow: { flexDirection: 'row', paddingVertical: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e6eefc', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#2563eb', fontWeight: '700' },
  convoName: { fontSize: 16, fontWeight: '700', color: '#111' },
  convoTime: { fontSize: 12, color: '#9ca3af' },
  convoPreview: { color: '#6b7280', flex: 1, marginRight: 8 },
  unreadBadge: { backgroundColor: '#1778f2', minWidth: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // empty state
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, color: '#6b7280', fontWeight: '600' },

  // floating new message button
  fab: { position: 'absolute', right: 18, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#1778f2', alignItems: 'center', justifyContent: 'center', elevation: 4 },

  messageRow: {
    marginVertical: 6,
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  messageRowSent: { justifyContent: 'flex-end' },
  messageRowReceived: { justifyContent: 'flex-start' },

  bubble: {
    maxWidth: '78%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  bubbleSent: {
    backgroundColor: '#0088cc',
    borderTopRightRadius: 6,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 6,
  },
  bubbleReceived: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 18,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTextSent: { color: '#fff' },
  messageTextReceived: { color: '#111' },

  timeText: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 6,
    textAlign: 'right',
  },

  // avatar in message rows
  avatarSmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e6eefc', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  avatarSmallText: { color: '#2563eb', fontWeight: '700' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f6f7fb',
    borderRadius: 20,
    marginRight: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1778f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
