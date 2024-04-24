import { Image } from "react-native";
import permata from '../assets/image/permata.jpg';
import bri from '../assets/image/bri.jpg';

const splitStringLength = (str: string, maxLength: number, resultArray: Array<string> = []) => {
    const chunk: string = str.slice(0, maxLength);
    resultArray.push(chunk);

    if (str.length > maxLength) {
        splitStringLength(str.slice(maxLength), maxLength, resultArray);
    }

    return resultArray;
};

export const formatToIDR = (number: number) => {
    const formattedInteger = number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const formattedIDR = `Rp. ${formattedInteger}`;
    return formattedIDR;
}

const formattedString = (arr: Array<string>) => {
    const str1 = `[L]${arr[0]}`
    const str2 = []
    const arr1 = splitStringLength(arr[1], 15)
    for (let i = 0; i < arr1.length; i++) {
        if (i === 0) {
            str2.push(`[L]: ${arr1[i]}\n`)
        }
        else {
            str2.push(`[L][L]  ${arr1[i]}\n`)
        }
    }
    return str1 + str2.join('')
}

type vkode = 'TDV' | 'IDV' | 'XDV' | 'ADV' | 'THV' | 'SMD'

const formatForVoucher = (arr: string[], vkode: vkode) => {
    let voucher = ''
    let kodeVoucher = {
        TDV: '*133',
        IDV: '*556',
        XDV: '*817',
        ADV: '*838',
        THV: '*111',
        SMD: '999'
    }

    for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
            voucher += `[L]\n[C]<font size='normal'><b>KODE VOUCHER</b></font>\n`
        }
        else {
            voucher += `[C]<font size='tall'><b>${arr[i]}</b></font>\n`
        }
    }
    voucher += `[L]\n[C]<font size='normal'><b>CARA PENGGUNAAN VOUCHER</b></font>\n`
    if (vkode === 'SMD') {
        voucher += `[C]<font size='tall'><b>ISI kode_voucher kirim ke ${kodeVoucher[vkode]}</b></font>\n`
    }
    else {
        voucher += `[C]<font size='tall'><b>${kodeVoucher[vkode]}*kode_voucher#</b></font>\n`
    }

    return voucher
}

const formatForToken = (arr: string[]) => {
    const str1 = `[L]\n[C]** ${arr[0]} **\n`
    const str2 = []
    const arr1 = splitStringLength(arr[1], 15)
    for (let i = 0; i < arr1.length; i++) {
        str2.push(`[C]<font size='big'><b>${arr1[i].replace(/\-$/, '')}</b></font>\n`)
    }
    return str1 + str2.join('')
}

export const headerFormat = (tgl: string, type: 'voucher' | 'token' | 'listrik' | 'indihome' | 'permata' | 'bri') => {
    const headerStr = `[C]<font size='big'><b>TIE CELL PERUM</b></font>\n` +
        '[C]Pondok Asri Cikawao Blok D5/11\n' +
        `[L]\n[C]${tgl}\n`
    return headerStr + strukTypeFormat(type)
}
export const footerFormat = (type?: 'pln' | 'indihome' | 'permata' | 'bri') => {
    let footerStr = ''
    if (type === 'pln') {
        footerStr += `[L]\n[C]Info Hubungi Call Center 123\n`
        footerStr += '[C]Atau Hubungi PLN Terdekat\n'
    }
    else if (type === 'indihome') {
        footerStr += `[L]\n[C]Mohon Simpan Struk Ini Sebagai\n`
        footerStr += `[C]Bukti Pembayaran yang sah.\n\n`
        footerStr += `[C]Info Hubungi Call Center: 143\n`
    }
    else if (type === 'permata') {
        footerStr += `[L]\n[C]Informasi Lebih Lanjut,\n`
        footerStr += `[C]Hubungi PermataTel : 1500111\n`
        footerStr += `[C]Atau Kunjungi Permata Terdekat\n`
        footerStr += `[L]\n[C]Mohon Simpan Struk Ini Sebagai\n`
        footerStr += `[C]Bukti Pembayaran yang sah.\n`
    }
    else if (type === 'bri') {
        footerStr += `[L]\n[C]Informasi Lebih Lanjut,\n`
        footerStr += `[C]Hubungi ContactBRI : 1500017\n`
        footerStr += `[C]Atau Kunjungi BRI Terdekat\n`
        footerStr += `[L]\n[C]Mohon Simpan Struk Ini Sebagai\n`
        footerStr += `[C]Bukti Pembayaran yang sah.\n`
    }
    footerStr += `[L]\n[C]Terima Kasih\n`
    footerStr += `[C]Atas Kepercayaan Anda`
    return footerStr
}

const strukTypeFormat = (type: string) => {
    let strukTipe = `[L]------------------------------\n`
    if (type === 'voucher') {
        strukTipe += `[C]<font size='tall'><b>Struk Pembelian Voucher</b></font>\n`
        strukTipe += `[C]<font size='tall'><b>Data</b></font>\n`
        strukTipe += `[L]------------------------------\n`
    }
    else if (type === 'token') {
        strukTipe += `[C]<font size='tall'><b>Struk Pembelian Token</b></font>\n`
        strukTipe += `[C]<font size='tall'><b>Listrik</b></font>\n`
        strukTipe += `[L]------------------------------\n`
    }
    else if (type === 'listrik') {
        strukTipe += `[C]<font size='tall'><b>Struk Pembayaran Tagihan</b></font>\n`
        strukTipe += `[C]<font size='tall'><b>Listrik PascaBayar</b></font>\n`
        strukTipe += `[L]------------------------------\n`
    }
    else if (type === 'indihome') {
        strukTipe += `[C]<font size='tall'><b>Struk Pembayaran Tagihan</b></font>\n`
        strukTipe += `[C]<font size='tall'><b>Indihome</b></font>\n`
        strukTipe += `[L]------------------------------\n`
    }
    else if (type === 'permata') {
        const image = Image.resolveAssetSource(permata).uri
        strukTipe += `[L]<img>${image}</img>\n`
        strukTipe += `[L]\n[C]<font size='tall'><b>      Struk Bukti Transfer</b></font>\n[L]\n`
    }
    else if (type === 'bri') {
        const image = Image.resolveAssetSource(bri).uri
        strukTipe += `[L]<img>${image}</img>\n`
        strukTipe += `[L]\n[C]<font size='tall'><b>      Struk Bukti Transfer</b></font>\n[L]\n`
    }
    return strukTipe
}

export const makeFormattedString = (listString: string[][]) => {
    let resultStr = ''
    let vKode = 'TDV'

    listString.forEach(e => {
        if (e[0] === 'PRODUK') {
            vKode = e[1].slice(0, 3)
        }

        if (e[0] === 'VOUCHER') {
            resultStr += formatForVoucher(e, vKode as vkode)
        }
        else if (e[0] === 'TOKEN') {
            resultStr += formatForToken(e)
        }
        else if (e[0] === 'TF_SENDER') {
            resultStr += formatTransfer("PENGIRIM")
        }
        else if (e[0] === 'TF_RECEIVER') {
            resultStr += formatTransfer("PENERIMA")
        }
        else {
            resultStr += formattedString(e)
        }
    });
    return resultStr
}

const formatTransfer = (type: 'PENGIRIM' | 'PENERIMA') => {
    let str = `[L]\n[L]<font size='tall'><b>${type} : </b></font>\n[L]\n`
    return str
}