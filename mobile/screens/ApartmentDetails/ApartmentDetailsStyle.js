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
  updatedText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    marginLeft: 2,
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
  amenityEmoji: {
    fontSize: 16,
    marginRight: 8,
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
    borderRadius: 14,
    padding: 16,
    // constrain height so body scroll areas can render correctly on small devices
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tourPanelHeader: {
    marginBottom: 12,
  },
  tourPanelBody: {
    // don't rely on flex:1 here since parent has no explicit height on some platforms
    paddingVertical: 6,
  },
  tourPanelContent: {
    // place dates and times side-by-side
    flexDirection: 'row',
    gap: 12,
  },
  tourPanelFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eef2f6',
    alignItems: 'center',
    gap: 8,
    // ensure footer stays visible and separated from scrollable content
    backgroundColor: '#fff',
  },
  datesColumn: {
    flex: 1,
    // limit height so scrollview is visible
    maxHeight: 320,
  },
  timesColumn: {
    flex: 1,
    maxHeight: 320,
  },
  dateList: {
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  dateListItem: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef2f6',
    marginBottom: 8,
  },
  dateListItemActive: {
    backgroundColor: '#1778f2',
    borderColor: '#1778f2',
  },
  dateListItemText: {
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  dateListItemTextActive: {
    color: '#fff',
  },
  dateListItemSub: {
    color: '#6b7280',
    fontSize: 12,
  },
  timeList: {
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  timeListItem: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#eef2f6',
    marginBottom: 8,
    alignItems: 'center',
  },
  timeListItemActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  timeListItemText: {
    fontWeight: '700',
    color: '#111827',
  },
  timeListItemTextActive: {
    color: '#fff',
  },
  cancelBtnFooter: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
  },
  cancelBtnFooterText: {
    color: '#d00',
    fontWeight: '700',
  },
  datePillsRow: {
    paddingBottom: 8,
    alignItems: 'center',
    gap: 8,
  },
  datePill: {
    backgroundColor: '#f8fafc',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eef2ff',
  },
  datePillActive: {
    backgroundColor: '#1778f2',
    color: '#fff',
    borderColor: '#1778f2',
    ...Platform.select({
      ios: {
        shadowColor: '#1778f2',
        shadowOpacity: 0.16,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
    }),
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
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },
  timePillActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  confirmBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  ratingSummary: {
    alignItems: 'center',
    marginBottom: 16,
  },

  ratingValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },

  starsRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },

  starsRowSmall: {
    flexDirection: 'row',
  },

  reviewCount: {
    fontSize: 13,
    color: '#6b7280',
  },

  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  reviewerName: {
    fontWeight: '600',
    color: '#111827',
  },

  reviewText: {
    color: '#374151',
    lineHeight: 20,
  },

  viewAllReviewsBtn: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },

  viewAllReviewsText: {
    color: '#1778f2',
    fontWeight: '600',
  },
  writeReviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  writeReviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },

  writeStarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },

  reviewInputMock: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    backgroundColor: '#f9fafb',
    marginBottom: 12,
  },

  reviewPlaceholder: {
    color: '#9ca3af',
    fontSize: 14,
  },

  submitReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1778f2',
    paddingVertical: 10,
    borderRadius: 8,
    opacity: 0.85, // gives "disabled" visual feel
  },

  submitReviewText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },


})
