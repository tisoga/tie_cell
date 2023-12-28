import { atom } from "recoil";

export const printerConnectedState = atom<DeviceListType>({
    key: 'printerConnectedState',
    default: { name: '', address: '' }
})