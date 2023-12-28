import { NavigationProp } from "@react-navigation/native"

type DeviceListType = {
    name: string
    address: string
}

type FileType = {
    name: string,
    uri: string
}

type RootStackParamList = {
    Test: undefined,
    Home?: { file: string },
    Settings: undefined
}

type RootStackNavigation = NavigationProp<RootStackParamList>