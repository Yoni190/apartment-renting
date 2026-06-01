import { StyleSheet } from 'react-native'
import { colors, radius, spacing } from '../../theme'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  wrapper: {
    padding: 20,
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },

  price: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
  },

  featureList: {
    marginBottom: 15,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textPrimary,
  },

  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
})