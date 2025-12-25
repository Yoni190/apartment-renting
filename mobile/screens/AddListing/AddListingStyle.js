import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    padding: 18,
    paddingTop: 12,
    paddingBottom: 40,
    backgroundColor: '#f3f8ff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    backgroundColor: '#fff'
  },
  btn: {
    backgroundColor: '#0b69ff',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 18,
    alignItems: 'center',
    shadowColor: '#0b69ff',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  btnText: {
    color: '#fff',
    fontWeight: '700'
  }
  ,
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    color: '#123a66'
  },
  rowOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  optionPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eef6ff',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8
  },
  optionPillActive: {
    backgroundColor: '#6ea8ff'
  },
  optionText: {
    color: '#333'
  },
  optionTextActive: {
    color: '#fff'
  },
  radio: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f7f7f7'
  },
  radioActive: {
    backgroundColor: '#2d74d6'
  },
  radioText: {
    color: '#333'
  },
  radioTextActive: {
    color: '#fff'
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  toggle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee'
  },
  toggleOn: {
    backgroundColor: '#9fc5f8'
  },
  toggleText: {
    color: '#222'
  },
  rowOptionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  checkbox: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff'
  },
  checkboxChecked: {
    backgroundColor: '#9fc5f8',
    borderColor: '#9fc5f8'
  },
  checkboxText: { color: '#333' },
  checkboxTextChecked: { color: '#fff' },
  amenityPill: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f5f7fa',
    marginRight: 8,
    marginBottom: 8
  },
  amenityPillActive: { backgroundColor: '#9fc5f8' },
  amenityText: { color: '#333' },
  amenityTextActive: { color: '#fff' },
  /* Unique feature UI */
  featureInput: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6eefb',
    backgroundColor: '#fff'
  },
  addFeatureBtn: {
    marginLeft: 8,
    backgroundColor: '#0477c9',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addFeatureBtnText: {
    color: '#fff',
    fontWeight: '700'
  },
  /* Form layout helpers */
  formCard: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f4f8'
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
    backgroundColor: '#012a6b',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapBtnText: {
    color: '#fff',
    fontWeight: '700'
  },
  imagesRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  thumb: { width: 72, height: 72, borderRadius: 8, marginRight: 8 },
  imageAdd: { width: 72, height: 72, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  imageAddText: { color: '#333' },
  errorBox: { backgroundColor: '#fff4f4', padding: 10, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#ffd6d6' },
  errorText: { color: '#a10e0e' }
})

