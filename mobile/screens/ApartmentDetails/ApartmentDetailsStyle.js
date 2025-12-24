import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export default StyleSheet.create({
  apartmentImage: {
    width,
    height: 320,
    resizeMode: 'cover',
  },

  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  activeDot: {
    backgroundColor: '#2563EB',
    width: 10,
  },

  content: {
    padding: 20,
    backgroundColor: '#ffffff',
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },

  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0ea5a4',
    marginBottom: 10,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },

  locationText: {
    color: '#666',
    fontSize: 14,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  infoItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },

  infoText: {
    fontSize: 12,
    color: '#333',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },
  ownerControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 8,
  },

  ownerBtn: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  deactivate: {
    backgroundColor: '#fff0f0',
  },

  updated: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 6,
  },

  floorPlanCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  floorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  floorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },

  floorPrice: {
    fontSize: 14,
    color: '#0ea5a4',
    marginTop: 4,
  },

  floorMeta: {
    color: '#6b7280',
    marginTop: 6,
    fontSize: 13,
  },

  small: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 6,
  },

  floorImage: {
    width: 110,
    height: 80,
    borderRadius: 8,
  },

  floorActions: {
    marginTop: 8,
  },

  linkBtn: {
    paddingVertical: 6,
  },

  linkText: {
    color: '#2563EB',
    fontWeight: '700',
  },

  unitsTable: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: '#e6e6e6',
    borderWidth: 1,
  },

  unitsRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },

  unitsHeader: {
    backgroundColor: '#f8fafc',
  },

  unitCell: {
    flex: 1,
    fontSize: 13,
    color: '#111',
  },

  badge: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },

  badgeText: {
    color: '#0f172a',
    fontSize: 13,
  },
  mapBox: {
    height: 120,
    borderRadius: 8,
    backgroundColor: '#e6eef8',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#dbeafe',
    borderWidth: 1,
    padding: 8,
  },
  mapText: {
    color: '#035388',
    fontSize: 13,
  },
  directionsBtn: {
    backgroundColor: '#0369a1',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionsText: {
    color: '#fff',
    fontWeight: '700',
  },
  metaLabelInline: {
    color: '#374151',
    fontWeight: '700',
    marginRight: 6,
  },

  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopColor: '#e6e6e6',
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  barInfo: {
    flex: 1,
  },

  barPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0ea5a4',
  },

  barBed: {
    color: '#6b7280',
  },

  barActions: {
    flexDirection: 'row',
    gap: 8,
  },

  barBtn: {
    backgroundColor: '#1778f2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  barBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  callBtn: {
    backgroundColor: '#fff',
    borderColor: '#e6e6e6',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  ownerBtnText: {
    color: '#0369a1',
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  tabActive: {
    backgroundColor: '#e0f2fe',
  },
  tabText: {
    color: '#374151',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0369a1',
  },
  /* Owner-provided meta display */
  metaBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomColor: '#f1f5f9',
    borderBottomWidth: 1,
  },
  metaKey: {
    width: 130,
    color: '#374151',
    fontWeight: '700',
    fontSize: 13,
  },
  metaValue: {
    flex: 1,
    color: '#111827',
    fontSize: 13,
    lineHeight: 18,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
})
