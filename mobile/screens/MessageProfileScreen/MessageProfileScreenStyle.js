import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0088cc',
	},
	panel: {
		flex: 1,
		backgroundColor: '#eaf2ff',
		// backgroundColor: '#0088cc',
	},
	header: {
		height: 96,
		paddingTop: 22,
		paddingHorizontal: 12,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#006aa0',
		backgroundColor: '#0088cc'
	},
	backBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255,0.12)',
	},
	headerTitle: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '700',
	},
	headerRight: {
		width: 32,
	},
	content: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 24,
	},
	avatar: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: '#005f88',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 14,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 6 },
		elevation: 6,
	},
	avatarText: {
		color: '#ffffff',
		fontSize: 42,
		fontWeight: '700',
	},
	nameText: {
		color: '#005f88',
		fontSize: 22,
		fontWeight: '700',
		marginBottom: 14,
	},
	infoCard: {
		width: '88%',
		height: '20%',
		backgroundColor:'#0088cc',
		borderRadius: 16,
		paddingVertical: 12,
		paddingHorizontal: 14,
		gap: 25,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	infoLabel: {
		color: '#c6cacf',
		fontSize: 16,
		fontWeight: '600',
	},
	infoValue: {
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '600',
	},
})

export default styles
