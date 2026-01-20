import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 32,
        paddingHorizontal: 12,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#f2f2f2',
    },
    input: {
        flex: 1,
        marginHorizontal: 10,
        fontSize: 16,
        color: '#000',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        },

        placeholderTitle: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        },

        placeholderText: {
        marginTop: 8,
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        },
})