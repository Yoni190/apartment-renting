import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 40,
    backgroundColor: '#f8fafc',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
    color: '#1e293b',
    letterSpacing: 0.2
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 15,
    color: '#1e293b',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputFocused: {
    borderColor: '#3b82f6',
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  btn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderWidth: 0,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
    color: '#0f172a',
    letterSpacing: 0.3
  },
  rowOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  optionPill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  optionPillActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  optionText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  radio: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  radioActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  radioText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14
  },
  radioTextActive: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  toggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  toggleOn: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  toggleText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14
  },
  toggleTextOn: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  rowOptionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  checkbox: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  checkboxText: { 
    color: '#475569',
    fontWeight: '600',
    fontSize: 14
  },
  checkboxTextChecked: { 
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  amenityPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginRight: 10,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  amenityPillActive: { 
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  amenityText: { 
    color: '#475569',
    fontWeight: '600',
    fontSize: 14
  },
  amenityTextActive: { 
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  /* Unique feature UI */
  featureInput: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: 15,
    color: '#1e293b',
  },
  addFeatureBtn: {
    marginLeft: 10,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  addFeatureBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  /* Form layout helpers */
  formCard: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 0,
  },
  /* subtle spacing to separate header */
  formCardTopSpacer: { marginTop: 8 },
  sectionCard: {
    backgroundColor: '#fafcff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eef6ff'
  },
  /* Verification / identity */
  verificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e6eefc',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  docTile: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    minHeight: 170,
  },
  docTileLast: {
    marginRight: 0,
  },
  docTileLabel: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center'
  },
  docTileActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  docActionButton: {
    marginRight: 14,
  },
  docActionText: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '600',
  },
  docActionTextRemove: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  docSmallNote: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 6,
  },
  /* Agent-specific card (mirrors verification card) */
  agentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e6eefc',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  fieldHalf: {
    flex: 1,
  },
  /* Map button styling */
  mapBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mapBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15
  },
  imagesRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  thumb: { 
    width: 80, 
    height: 80, 
    borderRadius: 12, 
    marginRight: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imageAdd: { 
    width: 80, 
    height: 80, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#f8fafc'
  },
  imageAddText: { 
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14
  },
  errorBox: { 
    backgroundColor: '#fef2f2', 
    padding: 14, 
    borderRadius: 12, 
    marginBottom: 16, 
    borderWidth: 1.5, 
    borderColor: '#fecaca',
    ...Platform.select({
      ios: {
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  errorText: { 
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500'
  },
  datePickerButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  datePickerText: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500'
  },
  datePickerPlaceholder: {
    color: '#94a3b8',
    fontWeight: '400'
  }
})

