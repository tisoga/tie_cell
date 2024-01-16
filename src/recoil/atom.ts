import { atom } from "recoil";
import { DeviceListType, ThemeType } from "../type";
import { Green } from "../theme";

export const printerConnectedState = atom<DeviceListType>({
    key: 'printerConnectedState',
    default: { name: '', address: '' }
})

export const themeState = atom<ThemeType>({
    key: 'themeState',
    default: Green
})