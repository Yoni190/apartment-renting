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
        resultsContainer: {
            marginTop: 40
        },
        filterOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            },

            filterMenu: {
            width: '80%',
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 20,
            elevation: 5,
            },

            filterTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            },

            filterLabel: {
            marginTop: 10,
            fontWeight: '600',
            },

            filterOptions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 5,
            },

            filterOption: {
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            },

            closeButton: {
            marginTop: 20,
            backgroundColor: '#007AFF',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            },

})