import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },

  emptyState: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#333'
  },

  emptySubtitle: {
    color: '#666',
    marginBottom: 18,
    textAlign: 'center'
  },

  addButton: {
    backgroundColor: '#9fc5f8',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: '700'
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 14
  },

  cardImage: {
    width: 110,
    height: 100,
  },

  cardBody: {
    padding: 12,
    flex: 1,
    justifyContent: 'center'
  },

  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardSubtitle: { color: '#666' }
,
  apartmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  apartmentCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee'
  },
  apartmentImage: {
    width: '100%',
    height: 140
  },
  apartmentBody: {
    padding: 10
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  priceText: { fontWeight: '700', color: '#1a73e8' },
  bedText: { color: '#666' },
  apartmentTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  addressText: { color: '#666', fontSize: 12 },
  subCityText: { color: '#666', fontSize: 12 },
  descriptionText: { color: '#444', marginTop: 6 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  actionBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginRight: 8 },
  actionText: { color: '#fff', fontWeight: '700' }
})
