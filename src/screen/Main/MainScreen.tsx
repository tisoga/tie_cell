import { Button, Text, View } from "react-native"
import styles from "./styles"
import useTheme from "../../hooks/useTheme"
import ChooseFileMode from "./ChooseFileMode"
import { useRecoilState } from "recoil"
import { printerConnectedState } from "../../recoil/atom"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LoadingScreen from "../Loading"
import { RootStackParamList } from "../../type"
import BleManager from 'react-native-ble-manager'

type props = NativeStackScreenProps<RootStackParamList, 'Home'>

const MainScreen = ({ navigation, route }: props) => {
    const { selectedTheme } = useTheme()
    const [printer, setPrinter] = useRecoilState(printerConnectedState)
    const [isLoading, setLoading] = useState(false)
    const file = route.params?.file
    const fileType = route.params?.fileType

    const openSetting = () => {
        navigation.navigate('Settings')
    }

    useEffect(() => {
        const reconnectDevice = async () => {
            try {
                setLoading(true)
                const device = await AsyncStorage.getItem('lastConnected')
                if (device) {
                    const dvc = JSON.parse(device)
                    await BleManager.connect(dvc.address)
                    setPrinter(dvc)
                }
                setLoading(false)
            }
            catch (e) {
                console.log(e)
                // Alert.alert('Printer Tidak terhubung', 'Harap hubungkan printer terlebih dahulu.', [
                //     {
                //         text: 'ok',
                //         onPress: () => navigation.navigate('Settings')
                //     }
                // ])
                setLoading(false)
            }
        }
        reconnectDevice()
    }, [])

    return (
        <>
            {isLoading ?
                <LoadingScreen />
                :
                <>
                    <Text style={[styles.textTitle, { color: selectedTheme.text }]}>Tie Cell</Text>
                    <View style={styles.printerStatusContainer}>
                        <View>
                            <Text style={{ color: selectedTheme.text }}>Printer :</Text>
                            <Text style={{ fontWeight: 'bold', color: selectedTheme.text }}>{printer.name}</Text>
                        </View>
                        <Button
                            title='Change'
                            onPress={openSetting}
                        />
                    </View>
                    <ChooseFileMode fileBg={file} fileType={fileType} />
                </>
            }

        </>
    )
}

export default MainScreen