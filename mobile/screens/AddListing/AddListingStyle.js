import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 100,
    paddingBottom: 40,
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
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  btn: {
    backgroundColor: '#9fc5f8',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center'
  },
  btnText: {
    color: '#fff',
    fontWeight: '700'
  }
  ,
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
    color: '#222'
  },
  rowOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  optionPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f2f6fb',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8
  },
  optionPillActive: {
    backgroundColor: '#9fc5f8'
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
    backgroundColor: '#5aa0f6'
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
  imagesRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  thumb: { width: 72, height: 72, borderRadius: 8, marginRight: 8 },
  imageAdd: { width: 72, height: 72, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  imageAddText: { color: '#333' },
  errorBox: { backgroundColor: '#fff4f4', padding: 10, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#ffd6d6' },
  errorText: { color: '#a10e0e' }
})
