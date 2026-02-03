import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  kb: { flex: 1 },
  // leave space for the global/compact header so messages are not hidden underneath
  // increase bottom padding so the last message isn't hidden behind the input row
  // on Android we add extra bottom space to stay above soft navigation bars
  // NOTE: this value must be larger if the input is absolutely positioned so list content
  // can scroll above the input area
  listContent: { paddingHorizontal: 12, paddingBottom: Platform.OS === 'android' ? 140 : 100, paddingTop: 12},

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

  // spacer used to push sent messages further to the right edge
  sentSpacer: { width: 2 },

  inputRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    // place above bottom; Android needs a larger offset to clear soft nav
    bottom: Platform.OS === 'android' ? 36 : 12,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 14,
    // slightly taller touch area on iOS, taller on Android
    paddingVertical: Platform.OS === 'android' ? 12 : 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    // elevation/shadow so it sits above list content
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 6,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    // slightly more vertical padding on Android for taller hit area
    paddingVertical: Platform.OS === 'android' ? 12 : 8,
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
  mediaBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  mediaBtnText: {
    fontSize: 20,
    color: '#0f172a',
    fontWeight: '700',
    marginTop: -2,
  },
  mediaOption: {
    paddingVertical: 12,
  },
  mediaOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  mediaContainer: {
    width: 220,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 6,
    backgroundColor: '#0f172a',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  mediaLoadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  viewerOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewerClose: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  viewerBody: {
    flex: 1,
    paddingTop: 64,
  },
  viewerScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerImage: {
    width: '100%',
    height: '100%',
  },
  replyComposer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1778f2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyComposerLeft: {
    flex: 1,
  },
  replyComposerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  replyComposerText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  replyComposerClose: {
    padding: 6,
  },
  replySnippet: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
  },
  replySnippetSent: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderLeftColor: '#cfe6ff',
  },
  replySnippetReceived: {
    backgroundColor: '#f1f5f9',
    borderLeftColor: '#94a3b8',
  },
  replyName: {
    fontSize: 11,
    fontWeight: '700',
  },
  replyNameSent: {
    color: '#e0f2fe',
  },
  replyNameReceived: {
    color: '#0f172a',
  },
  replyText: {
    fontSize: 11,
    marginTop: 2,
  },
  replyTextSent: {
    color: '#e2e8f0',
  },
  replyTextReceived: {
    color: '#6b7280',
  },
  // compact conversation header (Telegram-like)
  compactHeader: {
    height: 64,
    paddingTop: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 26,
    color: '#0f172a',
    fontWeight: '700',
  },
  headerCenter: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerRight: {
    width: 48,
    alignItems: 'flex-end',
  },
  // custom chat header (dark blue, avatar, back icon)
  chatHeader: {
    height: 96,
    paddingTop: 22,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0088cc',
    borderBottomWidth: 1,
    borderBottomColor: '#006aa0',
  },
  chatHeaderLeft: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  chatBackContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  chatBack: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },
  chatHeaderCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#005f88',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  chatAvatarText: {
    color: '#fff',
    fontWeight: '700',
  },
  chatHeaderTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    maxWidth: '70%'
  },
  chatHeaderRight: { width: 48 },
})
