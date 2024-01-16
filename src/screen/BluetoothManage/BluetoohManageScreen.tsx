import { Button, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native"
import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer'
import BluetoothStateManager from 'react-native-bluetooth-state-manager'
import { useEffect, useState } from "react"
import styles from "./styles"
import useTheme from "../../hooks/useTheme"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSetRecoilState } from "recoil"
import { printerConnectedState } from "../../recoil/atom"
import LoadingScreen from "../Loading"
import { DeviceListType } from "../../type"


const BluetoothManageScreen = () => {
    const { selectedTheme } = useTheme()
    // const btStatus = useSignal<boolean>(false)
    const [btStatus, setBTStatus] = useState<boolean>(false)
    const [deviceList, setDevice] = useState<DeviceListType[]>([])
    const [connectedDevice, setConnectedDevice] = useState<DeviceListType[]>([])
    const [isLoading, setLoading] = useState<boolean>(false)
    const setPrinter = useSetRecoilState(printerConnectedState)

    useEffect(() => {
        const checkBluetoothStatus = async () => {
            const result = await BluetoothManager.checkBluetoothEnabled()
            setBTStatus(result)
        }
        const subBluetoothStatus = BluetoothStateManager.onStateChange((bState) => {
            if (bState === 'PoweredOff') {
                setBTStatus(false)
                setDevice([])
            }
        }, true)

        checkBluetoothStatus()

        return () => subBluetoothStatus.remove()
    }, [btStatus])


    const activeBluetooth = async () => {
        await BluetoothManager.enableBluetooth()
        setBTStatus(true)
    }

    const scanDevice = async () => {
        setLoading(true)
        try {
            const res = await BluetoothManager.scanDevices()
            setDevice(JSON.parse(res).found)
            setLoading(false)
        }
        catch (e) {
            console.log(e)
        }
    }

    const connectDevice = async (device: DeviceListType) => {
        // console.log(device)
        try {
            await BluetoothManager.connect(device.address)
            setConnectedDevice((oldArr) => [...oldArr, device])
            AsyncStorage.setItem('lastConnected', JSON.stringify(device))
            setPrinter(device)
            Alert.alert('Success', `${device.name} successfully connected.`)
            // console.log(res)
        }
        catch (e) {
            Alert.alert('Error', 'Unable to connect device, please only connect to bluetooth thermal printer')
        }
    }

    const unpairDevice = async (device: DeviceListType) => {
        // console.log(connectedDevice)
        try {
            await BluetoothManager.unpair(device.address)
            const newList = connectedDevice.filter(item => item.address !== device.address)
            setConnectedDevice(newList)
            Alert.alert('Success', `${device.name} successfully unpair.`)
            // console.log(res)
        }
        catch (e) {
            Alert.alert('Error', 'Unable to connect device, please only connect to bluetooth thermal printer')
        }
    }


    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <Text style={[styles.titleText, { color: selectedTheme.text }]}>Bluetooth Manager</Text>
            </View>
            <View style={styles.bluetoothStatusContainer}>
                <Text style={[styles.normalText, { color: selectedTheme.text }]}>Bluetooth status: {btStatus ? 'ON' : 'OFF'}</Text>
                {btStatus ?
                    <Button
                        disabled={isLoading}
                        title="Scan Device"
                        onPress={scanDevice}
                    />
                    :
                    <Button
                        title="Active BT"
                        onPress={activeBluetooth}
                    />
                }
            </View>
            {isLoading
                ?
                <LoadingScreen />
                :
                <View style={styles.bluetoothDeviceContainer}>
                    {deviceList.map((item) => (
                        <View style={styles.bluetoothDevice} key={item.address}>
                            <View>
                                <Text style={[styles.textBluetoothDeviceName, { color: selectedTheme.text }]}>{item.name}</Text>
                                <Text style={styles.textBluetoothDeviceAdress}>{item.address}</Text>
                            </View>
                            {connectedDevice.some(dv => dv.address === item.address)
                                ?
                                <TouchableOpacity
                                    style={[styles.btnConnectBT, { backgroundColor: 'red' }]}
                                    activeOpacity={0.8}
                                    onPress={() => unpairDevice(item)}
                                >
                                    <Text style={{ color: 'white' }}>Unpair</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    style={[styles.btnConnectBT, { backgroundColor: 'blue' }]}
                                    activeOpacity={0.8}
                                    onPress={() => connectDevice(item)}
                                >
                                    <Text style={{ color: 'white' }}>Connect</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    ))}
                </View>
            }
            {/* <Button title="test" onPress={print} /> */}
        </View>
    )
}

export default BluetoothManageScreen