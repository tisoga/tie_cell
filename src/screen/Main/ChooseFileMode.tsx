import { useEffect, useState } from "react"
import { Button, TextInput, View, Text, KeyboardAvoidingView, StatusBar, ScrollView, RefreshControlBase } from "react-native"
import { Extractor } from "react-native-pdf-extractor"
import DocumentPicker, { isCancel, isInProgress, types } from 'react-native-document-picker'
import styles from "./styles"
import useTheme from "../../hooks/useTheme"
import { TextResult, Transient } from "react-native-pdf-extractor/src/types"
import ThermalPrinterModule from 'react-native-thermal-printer';
import { footerFormat, formatToIDR, headerFormat, makeFormattedString } from "../../utils"
import Modal from 'react-native-modal'
import TextInputModal from "./components/TextInputModal"
import ButtonModal from "./components/ButtonModal"
import { FileType } from "../../type"
import TextRecognition from "@react-native-ml-kit/text-recognition"

type ChooseFileModeProps = {
    pdfUri?: any
    imageUri?: any
}

const ChooseFileMode = ({ pdfUri, imageUri }: ChooseFileModeProps) => {
    const { selectedTheme } = useTheme()
    const [isModalVisible, setModalVisible] = useState(false)
    const [file, setFile] = useState<FileType>({
        name: '',
        uri: ''
    })
    const [fileUri, setFileUri] = useState<string>('')
    const [listOfData, setListOfData] = useState<string[][]>()
    const [harga, setHarga] = useState('')
    const [isDataEditable, setDataEditable] = useState(false)
    const [initialListOfData, setInitialData] = useState<string[][]>()
    const [fileTypeProcess, setFileTypeProcess] = useState('')

    useEffect(() => {
        if (pdfUri) {
            setFileUri(pdfUri)
            setModalVisible(true)
        }
        else if (imageUri) {
            imageToText(imageUri)
        }
    }, [pdfUri, imageUri])

    const ChooseFile = async () => {
        try {
            const result = await DocumentPicker.pickSingle({ type: [types.images, types.pdf] })
            // const result = await DocumentPicker.pickSingle()
            setFile({
                name: result.name as string,
                uri: result.uri
            })
        }
        catch (err: unknown) {
            if (isCancel(err)) {
                console.log('cancelled')
            }
            else if (isInProgress(err)) {
                console.log('multiple pickers were opened, only the last will be considered')
            }
            else {
                throw err
            }
        }
    }

    const strukVoucher = async (dataList: TextResult) => {
        let produk;
        const arr = dataList as Array<string>
        const dataStr = dataList.join(' ')
        const regex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/g;
        const tglTransaksi = dataStr.match(regex)?.toString() as string
        const indexProduk = arr.findIndex(item => item.toLowerCase().includes('produk :'))
        console.log(arr)
        if (indexProduk !== -1) {
            produk = arr[indexProduk].split(':')[1].trim()
        }

        if (dataStr.toLowerCase().includes('listrik prabayar')) {
            setFileTypeProcess('token')
            const idPel = arr[arr.findIndex(item => item.toLowerCase().includes('idpel :'))].split(' ')[2]
            const namaPel = arr[arr.findIndex(item => item.toLowerCase().includes('nama :'))].split(' ')[2]
            const daya = arr[arr.findIndex(item => item.toLowerCase().includes('trf/'))].split(' ')[2]
            const nominal = arr[arr.findIndex(item => item.toLowerCase().includes('nominal :'))].split(' ')[3].replace(',00', '')
            const ppn = arr[arr.findIndex(item => item.toLowerCase().includes('ppn :'))].split(' ')[3].replace(',00', '')
            const materai = arr[arr.findIndex(item => item.toLowerCase().includes('mat :'))].split(' ')[3].replaceAll(',00', '')
            const jmlKwh = arr[arr.findIndex(item => item.toLowerCase().includes('kwh :'))].split(' ')[3]
            const tokenIndex = arr.findIndex(item => item.toLowerCase().includes('token:'))
            const token = `${arr[tokenIndex + 1]}-${arr[tokenIndex + 2]}`

            const dataSet = [
                [tglTransaksi],
                ['IDPEL', idPel],
                ['NAMAPEL', namaPel],
                ['TRF/DAYA', daya],
                ['NOMINAL', `RP. ${nominal}`],
                ['PPN', `RP. ${ppn}`],
                ['ANGS/MAT', `RP. ${materai}`],
                ['JML KWH', jmlKwh],
                ['TOKEN', token]
            ]

            setListOfData(dataSet)
            setInitialData(dataSet)
        }
        else if (produk?.includes('DV')) {
            setFileTypeProcess('voucher')
            const noResi = arr[4].split(':')[1].trim()
            const keteranganIndex = dataStr.toLowerCase().indexOf('keterangan :')
            const statusIndex = dataStr.toLowerCase().indexOf('status :')
            const keterangan = dataStr.slice(keteranganIndex + 12, statusIndex).trim()
            const status = arr[arr.findIndex(item => item.toLowerCase().includes('status'))].split(' ')[2]
            const voucher = arr[arr.findIndex(item => item.toLowerCase().includes('voucher:')) + 1]

            const dataSet = [
                [tglTransaksi],
                ['NO RESI', noResi],
                ['PRODUK', produk],
                ['KETERANGAN', keterangan],
                ['STATUS', status],
                ['VOUCHER', voucher],
            ]

            setListOfData(dataSet)
            setInitialData(dataSet)
        }
        else if (produk?.includes('PLS')) {
            setFileTypeProcess('token')
            const idPel = arr[arr.findIndex(item => item.toLowerCase().includes('no tujuan :'))].split(' ')[3]
            const keteranganArr = arr[arr.findIndex(item => item.toLowerCase().includes('keterangan :'))].split(' ')
            const nominal = keteranganArr[keteranganArr.length - 1] + '000'
            const sn = dataStr.slice(dataStr.toLowerCase().indexOf('sn :') + 5, dataStr.toLowerCase().indexOf('harga :')).split('/')
            const token = sn[0].trim().replaceAll(' ', '')
            const namaPel = sn[1].trim().replaceAll(' ', '').replaceAll('-', ' ')
            const daya = `${sn[2]}/${sn[3]}`
            const jmlKwh = sn[4]

            const dataSet = [
                [tglTransaksi],
                ['IDPEL', idPel],
                ['NAMAPEL', namaPel],
                ['TRF/DAYA', daya],
                ['NOMINAL', formatToIDR(Number(nominal))],
                ['PPN', `Rp. 0`],
                ['ANGS/MAT', `Rp. 0/0`],
                ['JML KWH', jmlKwh],
                ['TOKEN', token]
            ]

            setListOfData(dataSet)
            setInitialData(dataSet)
        }
        else if (produk?.includes('PLN')) {
            setFileTypeProcess('token')
            const idPel = arr[arr.findIndex(item => item.toLowerCase().includes('no tujuan :'))].split(' ')[3]
            const keteranganArr = arr[arr.findIndex(item => item.toLowerCase().includes('keterangan :'))].split(' ')
            const nominal = keteranganArr[keteranganArr.length - 1] + '000'
            const sn = dataStr.slice(dataStr.toLowerCase().indexOf('sn :') + 5, dataStr.toLowerCase().indexOf('harga :')).split('/')
            const token = sn[0].trim().replaceAll(' ', '')
            const namaPel = sn[1].trim().replaceAll(' ', '').replaceAll('-', ' ')
            const daya = `${sn[2]}/${sn[3]}`
            const jmlKwh = sn[4].replaceAll(' ', '')
            const ppn = sn[6].split(':')[1]
            const materai = sn[8].split(':')[1]
            const plnRef = sn[9].split(';')[0].split(':')[1].replaceAll(' ', '')

            const dataSet = [
                [tglTransaksi],
                ['PLN REF', plnRef],
                ['IDPEL', idPel],
                ['NAMAPEL', namaPel],
                ['TRF/DAYA', daya],
                ['NOMINAL', `RP. ${nominal}`],
                ['PPN', `RP. ${ppn}`],
                ['ANGS/MAT', `RP. ${materai}`],
                ['JML KWH', jmlKwh],
                ['TOKEN', token]
            ]

            setListOfData(dataSet)
            setInitialData(dataSet)
        }

        else if (produk?.includes('BPLF')) {
            setFileTypeProcess('listrik')
            const idPel = arr[arr.findIndex(item => item.toLowerCase().includes('no tujuan :'))].split(' ')[3]
            const sn = dataStr.slice(dataStr.toLowerCase().indexOf('sn :') + 5, dataStr.toLowerCase().indexOf('harga :')).split('/')
            const namaPel = sn[0].trim()
            const daya = `${sn[2]}/${sn[3]}`.trim()
            const periode = sn[4].replaceAll(' ', '').split(':')[1].trim()
            const tagihan = sn[5].replaceAll(' ', '').split(':')[1].trim()
            const standmtrArr = sn[7].split(':')[1].replaceAll(' ', '').split('-')
            const standMtr = `${Number(standmtrArr[0])} - ${Number(standmtrArr[1])}`
            const plnRef = sn[10].replaceAll(' ', '').split(':')[1].trim()

            const dataSet = [
                [tglTransaksi],
                ['IDPEL', idPel],
                ['NAMA PEL', namaPel],
                ['TRF/DAYA', daya],
                ['PERIODE', periode],
                ['STAND MTR', standMtr],
                ['PLN REF', plnRef],
                ['RP TAG PLN', tagihan],
            ]

            console.log(sn)

            setListOfData(dataSet)
            setInitialData(dataSet)
        }
        else if (dataStr.toLowerCase().includes('tagihan listrik')) {
            setFileTypeProcess('listrik')
            const idPel = arr[arr.findIndex(item => item.toLowerCase().includes('idpel :'))].split(' ')[2]
            const namaPel = dataStr.slice(dataStr.toLowerCase().indexOf('nama :') + 6, dataStr.toLowerCase().indexOf('trf/daya :')).trim()
            const daya = dataStr.slice(dataStr.toLowerCase().indexOf('trf/daya :') + 10, dataStr.toLowerCase().indexOf('tagihan :')).trim()
            const periode = arr[arr.findIndex(item => item.toLowerCase().includes('bl/th :'))].split(' ')[2].split('/')[0]
            const tagihan = dataStr.slice(dataStr.toLowerCase().indexOf('tagihan :') + 9, dataStr.toLowerCase().indexOf('pln reff :')).replace('RP .', '').replace(',00', '').trim()
            const standMtrArr = dataStr.slice(dataStr.toLowerCase().indexOf('std mtr :') + 9, dataStr.toLowerCase().indexOf('adm bank :')).replace('SM:', '').replaceAll(' ', '').split('-')
            const standMtr = `${Number(standMtrArr[0])} - ${Number(standMtrArr[1])}`
            const plnRef = dataStr.slice(dataStr.toLowerCase().indexOf('pln reff :') + 10, dataStr.toLowerCase().indexOf('bl/th :')).replaceAll(' ', '').trim()

            const dataSet = [
                [tglTransaksi],
                ['IDPEL', idPel],
                ['NAMA PEL', namaPel],
                ['TRF/DAYA', daya],
                ['PERIODE', periode],
                ['STAND MTR', standMtr],
                ['PLN REF', plnRef],
                ['RP TAG PLN', tagihan],
            ]

            setListOfData(dataSet)
            setInitialData(dataSet)
        }
        else if (produk?.includes('BTEL')) {
            setFileTypeProcess('indihome')
            const idPel = arr[arr.findIndex(item => item.toLowerCase().includes('no tujuan :'))].split(' ')[3]
            const sn = dataStr.slice(dataStr.toLowerCase().indexOf('sn :') + 5, dataStr.toLowerCase().indexOf('harga :')).split('/')
            const namaPel = sn[0].trim()
            const periode = sn[1].split(':')[1].replaceAll(' ', '')
            const newPeriode = `${periode.slice(0, 4)}-${periode.slice(4, 6)}`
            const tagihan = sn[2].split(':')[1].replaceAll(' ', '')
            const ref = sn[6].trim().replaceAll(' ', '')

            const dataSet = [
                [tglTransaksi],
                ['IDPEL', idPel],
                ['NAMA PEL', namaPel],
                ['PERIODE', newPeriode],
                ['TAGIHAN', tagihan],
                ['NO REF', ref]
            ]

            setListOfData(dataSet)
            setInitialData(dataSet)
        }

        setModalVisible(true)
    }

    const onResult = (data: Transient | null) => {
        if (!data || !data.text) return
        if (!data.text.includes('** TIECELLREBORN **')) return console.log('invalid pdf file')
        if (data.text) strukVoucher(data.text)
    }

    const onProcess = async () => {
        const arr = file.uri.split('.')
        const fileType = arr[arr.length - 1]
        if (fileType === 'pdf') {
            setFileUri(file.uri)
        }
        else if (fileType === 'jpg' || fileType === 'png') {
            imageToText(file.uri)
        }
    }

    const onChangeText = (i: number, value: string) => {
        const newData = listOfData as string[][]
        if (i !== -1) {
            setListOfData(newData.map((item, index) => (index === i ? [item[0], value] : item)));
        }
        else {
            setHarga(value)
        }
    }

    const onPressEdit = () => {
        setInitialData(listOfData)
        setDataEditable(true)
    }

    const onPressReset = () => {
        setListOfData(initialListOfData)
        setDataEditable(false)
    }

    const onPressPrint = () => {
        if (harga) {
            if (fileTypeProcess === 'voucher') {
                const rpFormat = formatToIDR(Number(harga))
                const data = listOfData as string[][]
                const date = data.splice(0, 1)[0][0]
                data.splice(3, 0, ['HARGA', rpFormat])
                const formatedPrinted = headerFormat(date, 'voucher') + makeFormattedString(data) + footerFormat()
                console.log(formatedPrinted)
                try {
                    ThermalPrinterModule.printBluetooth({
                        payload: formatedPrinted,
                        mmFeedPaper: 3,
                        printerWidthMM: 58,
                        printerNbrCharactersPerLine: 30
                    })
                }
                catch (e) {
                    console.log(e)
                }
                console.log(initialListOfData)
                onCloseModal()
            }
            else if (fileTypeProcess === 'token') {
                const data = listOfData as string[][]
                const date = data.splice(0, 1)[0][0]
                const plnref = data[0][0] === 'PLN REF' ? data.splice(0, 1)[0][1] : false
                const numInt = data[3][1].toLowerCase().replace('rp.', '').replace('.', '')
                const rpFormat = formatToIDR(Number(harga) - Number(numInt))
                data.splice(7, 0, ['ADM & JASA', rpFormat])
                data.splice(8, 0, ['TOTAL HARGA', formatToIDR(Number(harga))])
                if (plnref) {
                    data.splice(6, 0, ['PLN REF', plnref])
                }
                const formatedPrinted = headerFormat(date, 'token') + makeFormattedString(data) + footerFormat('pln')
                console.log(formatedPrinted)
                try {
                    ThermalPrinterModule.printBluetooth({
                        payload: formatedPrinted,
                        mmFeedPaper: 3,
                        printerWidthMM: 58,
                        printerNbrCharactersPerLine: 30
                    })
                }
                catch (e) {
                    console.log(e)
                }
                onCloseModal()
            }
            else if (fileTypeProcess === 'listrik') {
                const data = listOfData as string[][]
                const date = data.splice(0, 1)[0][0]
                const rpFormat = formatToIDR(Number(harga) - Number(data[6][1]))
                data[6][1] = formatToIDR(Number(data[6][1]))
                data.splice(7, 0, ['ADM & JASA', rpFormat])
                data.splice(8, 0, ['TOTAL HARGA', formatToIDR(Number(harga))])
                const formatedPrinted = headerFormat(date, 'listrik') + makeFormattedString(data) + footerFormat("pln")
                console.log(formatedPrinted)
                try {
                    ThermalPrinterModule.printBluetooth({
                        payload: formatedPrinted,
                        mmFeedPaper: 3,
                        printerWidthMM: 58,
                        printerNbrCharactersPerLine: 30
                    })
                }
                catch (e) {
                    console.log(e)
                }
                onCloseModal()
            }
            else if (fileTypeProcess === 'indihome') {
                const data = listOfData as string[][]
                const date = data.splice(0, 1)[0][0]
                const rpFormat = formatToIDR(Number(harga) - Number(data[3][1]))
                data[3][1] = formatToIDR(Number(data[3][1]))
                data.splice(5, 0, ['ADM & JASA', rpFormat])
                data.splice(6, 0, ['TOTAL HARGA', formatToIDR(Number(harga))])
                const formatedPrinted = headerFormat(date, 'indihome') + makeFormattedString(data) + footerFormat('indihome')
                console.log(formatedPrinted)
                try {
                    ThermalPrinterModule.printBluetooth({
                        payload: formatedPrinted,
                        mmFeedPaper: 3,
                        printerWidthMM: 58,
                        printerNbrCharactersPerLine: 30
                    })
                }
                catch (e) {
                    console.log(e)
                }
                onCloseModal()
            }
            else if (fileTypeProcess === 'transfer') {
                const data = listOfData as string[][]
                const date = data.splice(0, 1)[0][0]
                const bankAsal = data.splice(0, 1)[0][0]
                const rpFormatAdm = formatToIDR(Number(harga))
                const total = formatToIDR(Number(harga) + Number(data[10][1]))
                data[10][1] = formatToIDR(Number(data[10][1]))
                data.splice(11, 0, ['ADM BANK', rpFormatAdm])
                data.splice(12, 0, ['TOTAL', total])
                const formatedPrinted = headerFormat(date, bankAsal as 'permata' | 'bri') + makeFormattedString(data) + footerFormat(bankAsal as 'permata' | 'bri')
                try {
                    ThermalPrinterModule.printBluetooth({
                        payload: formatedPrinted,
                        mmFeedPaper: 3,
                        printerWidthMM: 58,
                        printerNbrCharactersPerLine: 30
                    })
                }
                catch (e) {
                    console.log(e)
                }
                onCloseModal()
            }
        }
        else {
            console.log('err')
        }
    }

    const onCloseModal = () => {
        setHarga('')
        setFileUri('')
        setModalVisible(false)
    }

    const imageToText = async (uri: string) => {
        console.log(uri)
        try {
            const result = await TextRecognition.recognize(uri);
            const resultArr = result.text.split('\n')

            // console.log('Recognized text:', result.text);
            console.log('Recognized text:', resultArr);
            if (resultArr[0].toLocaleLowerCase() === 'permatabank') {
                setFileTypeProcess('transfer')
                const jumlahTrf = resultArr[5].replace('Rp', '').replace(',', '').replace('.00', '').trim()
                const penerima = resultArr[8]
                const bankPenerima = resultArr[9]
                const rekeningPenerima = resultArr[10].replace('(|DR)', '').trim()
                const pengirim = resultArr[12]
                const bankPengirim = resultArr[13]
                const rekeningPengirim = resultArr[14].replace('(|DR)', '').trim()
                const transferType = resultArr[16]
                const ref = resultArr[19]
                const tanggal = `${resultArr[20]} ${resultArr[21]}`

                const dataSet = [
                    [tanggal],
                    ['permata'],
                    ['NO REF', ref],
                    ['TRANSFER TYPE', transferType],
                    ['TF_SENDER'],
                    ['BANK ASAL', bankPengirim],
                    ['NOMOR REKENING', rekeningPengirim],
                    ['ATAS NAMA', pengirim],
                    ['TF_RECEIVER'],
                    ['BANK TUJUAN', bankPenerima],
                    ['NOMOR REKENING', rekeningPenerima],
                    ['ATAS NAMA', penerima],
                    ['NOMINAL', jumlahTrf]
                ]

                // console.log(dataSet)
                setListOfData(dataSet)
                setInitialData(dataSet)
                setModalVisible(true)
            }
            if (resultArr.includes('NPWP:01.001.608.7-093.000')) {
                setFileTypeProcess('transfer')
                const tanggal = resultArr[7].replace(', ', ' ').replaceAll('WIB', '').trim()
                const jumlahTrf = String(Number(resultArr[11].replace('Rp', '').replaceAll('.', '')) - 2500)
                const pengirim = resultArr[12]
                const bankPengirim = resultArr[13]
                const rekeningPengirim = resultArr[14].replaceAll(' ', '').trim()
                const penerima = resultArr[17]
                const bankPenerima = resultArr[18]
                const rekeningPenerima = resultArr[19].replaceAll(' ', '').trim()
                const ref = resultArr[30]
                const transferType = resultArr[33]

                const dataSet = [
                    [tanggal],
                    ['bri'],
                    ['NO REF', ref],
                    ['TRANSFER TYPE', transferType],
                    ['TF_SENDER'],
                    ['BANK ASAL', bankPengirim],
                    ['NOMOR REKENING', rekeningPengirim],
                    ['ATAS NAMA', pengirim],
                    ['TF_RECEIVER'],
                    ['BANK TUJUAN', bankPenerima],
                    ['NOMOR REKENING', rekeningPenerima],
                    ['ATAS NAMA', penerima],
                    ['NOMINAL', jumlahTrf]
                ]

                // console.log(dataSet)
                setListOfData(dataSet)
                setInitialData(dataSet)
                setModalVisible(true)
            }

        }
        catch (e) {
            console.log(e)
        }

    };


    return (
        <>
            <Modal isVisible={isModalVisible} style={{ flex: 1, marginVertical: 0 }} onBackButtonPress={onCloseModal} >
                <ScrollView style={[styles.modalContainer, { backgroundColor: selectedTheme.primary }]}>
                    <View style={styles.modalTitleContainer}>
                        <Text style={[styles.textTitle, { color: selectedTheme.text }]}>Detail Produk</Text>
                    </View>
                    <View>
                        {listOfData?.map((arr, index) => (
                            index !== 0 &&
                            <TextInputModal label={arr[0]} value={arr[1]} editable={isDataEditable} key={index} onChangeText={onChangeText} index={index} />
                        ))}
                        <TextInputModal
                            label={fileTypeProcess === 'transfer' ? 'ADMIN' : 'HARGA'}
                            value={harga}
                            placeholder={'Masukan Harga'}
                            editable={true}
                            type="numeric"
                            onChangeText={onChangeText}
                            index={-1} />
                        <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginTop: 10, gap: 4, marginBottom: 10 }}>
                            <ButtonModal label={isDataEditable ? 'Reset' : 'Edit'} color={isDataEditable ? 'red' : 'yellow'} onPress={isDataEditable ? onPressReset : onPressEdit} />
                            <ButtonModal label="Print" color="green" onPress={onPressPrint} />
                        </View>
                    </View>
                </ScrollView>
            </Modal>
            <View style={styles.ChooseFileContainer}>
                <TextInput
                    style={[styles.fileNameInput, { color: selectedTheme.text }]}
                    editable={false}
                    placeholder='Pilih File PDF ...'
                    value={file.name} />
                <Button
                    title='Pilih File'
                    onPress={ChooseFile}
                />
            </View>
            <Button
                title="Process"
                disabled={file.uri ? false : true}
                // onPress={onProcess}
                onPress={onProcess}
            />
            <Extractor onResult={onResult} uri={fileUri} />
        </>
    )
}

export default ChooseFileMode
