import { NavigationProp } from "@react-navigation/native"

type DeviceListType = {
    name: string
    address: string
}

type ThemeListType = {
    text: string,
    primary: string
    secondary: string
    accent: string
}

type ThemeType = {
    light: ThemeListType,
    dark: ThemeListType
}

type FileType = {
    name: string,
    uri: string
}

type RootStackParamList = {
    Test: undefined,
    Home?: { file?: string, fileType?: 'image' | 'pdf' },
    Settings: undefined
}

type RootStackNavigation = NavigationProp<RootStackParamList>