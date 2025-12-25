import { StyleSheet, Dimensions, Platform } from 'react-native'

const { width } = Dimensions.get('window')

export default StyleSheet.create({
  // Image Slider
  imageContainer: {
    width: width,
    height: 320,
    position: 'relative',
    backgroundColor: '#000',
  },
  heroImage: {
    width: width,
    height: 320,
  },
  imageDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 12,
    height: 8,
    borderRadius: 4,
  },

  // Header Section
  headerSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  listingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
    lineHeight: 34,
  },
  favouriteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
  },
  headerAddress: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 22,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1778f2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#1778f2',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  ownerSection: {
    marginTop: 16,
  },
  ownerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },

  // Section Styles
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },

  // Floor Plan Card
  floorPlanCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  floorPlanImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  floorPlanContent: {
    flex: 1,
  },
  floorPlanName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  floorPlanDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  floorPlanMeta: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  floorPlanSeparator: {
    fontSize: 14,
    color: '#9ca3af',
  },
  floorPlanPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0ea5a4',
    marginBottom: 8,
  },
  availableDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  // About Section
  aboutText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  propertyInfoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  propertyInfoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
    width: 110,
  },
  propertyInfoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  descriptionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginTop: 12,
  },

  // Unique Features Section
  uniqueFeaturesDescription: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 18,
    color: '#0ea5a4',
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    flex: 1,
  },
  featuresGrid: {
    gap: 16,
  },
  featureItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  featureLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  featureValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    lineHeight: 22,
  },
  // Amenities Section
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  amenityIcon: {
    marginRight: 6,
  },
  amenityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },

  // Contacts Section
  contactPhone: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  contactButtonPrimary: {
    flex: 1,
    backgroundColor: '#1778f2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#1778f2',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contactButtonSecondary: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1778f2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  contactButtonTextSecondary: {
    color: '#1778f2',
    fontSize: 16,
    fontWeight: '700',
  },
  ownerContactSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  ownerContactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  ownerContactName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },

  // Bottom Navigation Bar
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -2 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bottomNavButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  bottomNavButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1778f2',
  },
  // Tour panel styles (date pills + time pills)
  tourPanelOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  tourPanel: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  datePillsRow: {
    paddingBottom: 8,
    alignItems: 'center',
    gap: 8,
  },
  datePill: {
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
  },
  datePillActive: {
    backgroundColor: '#1778f2',
    color: '#fff',
  },
  showMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showMoreText: {
    color: '#1778f2',
    fontWeight: '700',
  },
  timePillsWrap: {
    marginTop: 12,
  },
  timePill: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
})
