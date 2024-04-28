import {
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native'
import useTheme from './src/hooks/useTheme'
import MainScreen from './src/screen/Main'
import BluetoothManageScreen from './src/screen/BluetoothManage'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { requestMultiple, PERMISSIONS } from 'react-native-permissions'
import { setupFileListener } from './src/screen/Main/FileListener'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigation, RootStackParamList } from './src/type'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import BleManager from "react-native-ble-manager"

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = (): React.JSX.Element => {
  const { selectedTheme } = useTheme()
  const navigation = useNavigation<RootStackNavigation>()

  useEffect(() => {
    // DeviceEventEmitter.addListener(
    //   BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, async (response) => {
    //     console.log(response.devices);
    //     // setConnectedDevice(JSON.parse(response.devices))
    //     // response.devices would returns the paired devices array in JSON string.
    //   }
    // );

    const BTListener = BleManager.addListener("BleManagerPeripheralDidBond", (args) => {
      console.log(args)
    })

    BleManager.start().then(() => {
      // Success code
      console.log("Scan started");
    });

    const cleanupFileListener = setupFileListener({ navigation });

    ReceiveSharingIntent.getReceivedFiles((files: any) => {
      // files returns as JSON Array example
      //[{ filePath: null, text: null, weblink: null, mimeType: null, contentUri: null, fileName: null, extension: null }]
      console.log(files)
      navigation.navigate('Home', {
        file: files[0].contentUri,
        fileType: files[0].mimeType
      });
    },
      (error: any) => {
        // console.log(error);
      },
      'ShareMedia' // share url protocol (must be unique to your app, suggest using your apple bundle id)
    );



    // Clean up the file listener when the component unmounts
    return () => {
      cleanupFileListener();
      ReceiveSharingIntent.clearReceivedFiles();
      BTListener.remove()
    };

  }, [])

  useEffect(() => {
    requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT, PERMISSIONS.ANDROID.BLUETOOTH_SCAN, PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO, PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION

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