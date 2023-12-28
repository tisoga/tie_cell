import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    headerContainer: {
        borderBottomWidth: 1,
    },
    bluetoothStatusContainer: {
        flexDirection: 'row',
        gap: 4,
        marginVertical: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingBottom: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4
    },
    titleText: {
        fontSize: 25,
        textAlign: 'center',
    },
    normalText: {
        fontSize: 16
    },
    bluetoothDeviceContainer: {
        flexDirection: 'column',
        gap: 10,
    },
    bluetoothDevice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        paddingHorizontal: 4,
        borderRadius: 10,
        paddingVertical: 3,
        backgroundColor: '#87ceeb'
    },
    textBluetoothDeviceName: {
        fontWeight: 'bold',
        fontSize: 20
    },
    textBluetoothDeviceAdress: {
        fontSize: 14
    },
    btnConnectBT: {
        borderWidth: 1,
        marginRight: 4,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderRadius: 10,
        width: 75,
        alignItems: 'center'
    }
})

export default styles