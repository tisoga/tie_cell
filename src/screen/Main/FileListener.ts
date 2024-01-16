import { Linking } from 'react-native'
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../type';
import RNFS from 'react-native-fs'

interface FileListenerProps {
    navigation: NavigationProp<RootStackParamList>;
}

export const setupFileListener = ({ navigation }: FileListenerProps) => {
    const handleOpenURL = async (event: any, background: boolean = false) => {
        // console.log(event)
        // console.log(background)
        if (event) {
            let fileType: 'image' | 'pdf';
            const fileUri = background ? event : event.url
            const fileData = await (await RNFS.stat(fileUri)).originalFilepath
            const fileExtension = fileData.split('.').pop()

            if (fileExtension === 'pdf') {
                fileType = 'pdf'
            }
            else {
                fileType = 'image'
            }

            // Use the navigation.navigate function to navigate to PDFViewer
            navigation.navigate('Home', {
                file: fileUri,
                fileType: fileType
            });
        }
    };

    Linking.addEventListener('url', handleOpenURL);

    Linking.getInitialURL().then(url => {
        handleOpenURL(url, true)
        console.log(url)
    })

    // Clean up the event listener when needed
    return () => {
        Linking.removeAllListeners('url');
    };
};