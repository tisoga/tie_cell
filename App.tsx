import {
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native'
import useTheme from './src/hooks/useTheme'
import MainScreen from './src/screen/Main'
import BluetoothManageScreen from './src/screen/BluetoothManage'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer'
import { requestMultiple, PERMISSIONS } from 'react-native-permissions'
import { setupFileListener } from './src/screen/Main/FileListener'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigation, RootStackParamList } from './src/type'

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = (): React.JSX.Element => {
  const { selectedTheme } = useTheme()
  const navigation = useNavigation<RootStackNavigation>()

  useEffect(() => {
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, async (response) => {
        console.log(response.devices);
        // setConnectedDevice(JSON.parse(response.devices))
        // response.devices would returns the paired devices array in JSON string.
      }
    );

    const cleanupFileListener = setupFileListener({ navigation });

    // Clean up the file listener when the component unmounts
    return () => {
      cleanupFileListener();
    };

  }, [])

  useEffect(() => {
    requestMultiple(
      [
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      ]).then((res) => {
        console.log(res)
      })
  }, [])


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: [styles.mainContainer, { backgroundColor: selectedTheme.primary }]
      }}
    >
      <Stack.Screen name='Home' component={MainScreen} />
      <Stack.Screen name='Settings' component={BluetoothManageScreen} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10
  }
})

export default App