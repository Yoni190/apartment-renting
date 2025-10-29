import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderRadius: 10,
        flex: 1,
        padding: 10,
        marginHorizontal: 5
    },
    searchContainer: {
        flexDirection: 'row',
    },
    filter: {
        justifyContent: 'center',
        marginRight: 5
    },
    recommendations: {
        width: 200,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
        padding: 15,
        backgroundColor: '#fff',
        },
    recommendationsContainer: {
        flexDirection: 'row',
    },
    recommendedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20
    },
    recommendationsImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 10,
    },
    apartmentTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    location: {
        fontSize: 12,
    },
    apartmentInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})