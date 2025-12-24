import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export default StyleSheet.create({
  apartmentImage: {
    width,
    height: 240,
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
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 8,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
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
