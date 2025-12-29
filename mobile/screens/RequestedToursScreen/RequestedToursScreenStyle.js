import { StyleSheet } from "react-native";

export default StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    elevation: 2,           // Shadow Android
    shadowColor: '#000',    // Shadow iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: -30,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
    color: '#333',
  },

  emptySubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  bookingCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  bookingCardAlt: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  bookingThumbWrap: {
    marginRight: 12,
  },
  bookingThumb: {
    width: 84,
    height: 84,
    borderRadius: 10,
    backgroundColor: '#eef2f7'
  },
  bookingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a'
  },
  bookingMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 6
  },
  bookingTime: {
    fontSize: 13,
    color: '#475569',
    marginTop: 6
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#fef3c7'
  },
  statusPrimary: {
    backgroundColor: '#e0f2fe'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e'
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#111827'
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalBtnText: {
    marginLeft: 8,
    fontWeight: '700'
  }
})
