import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'flex-start'
    },
    subTitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500'
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#e6e6e6',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        paddingRight: 44,
        marginBottom: 10,
        backgroundColor: '#fafafa',
        fontSize: 16,
        color: '#111'
    },
    linkText: {
        color: '#0066CC',
        fontWeight: '600'
    },
    btn: {
        backgroundColor: '#0066CC',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16
    },
    errorText: {
        color: '#b91c1c',
        marginBottom: 8,
        fontSize: 13
    },
    deleteBtn: {
        marginTop: 14,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f1c0c0'
    },
    deleteBtnText: {
        color: '#b91c1c',
        fontWeight: '700'
    }
    ,
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    }
    ,
    eyeButton: {
        position: 'absolute',
        right: 12,
        top: 10,
        padding: 6
    }
})

