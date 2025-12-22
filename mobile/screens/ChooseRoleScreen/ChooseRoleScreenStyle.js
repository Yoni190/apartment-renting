import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 120,
  },

  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },

  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 13,
    textAlign: 'center',
    color: '#555',
    lineHeight: 18,
  },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },

  orText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#555',
  },
})
