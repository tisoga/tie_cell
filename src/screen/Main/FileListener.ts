import { Linking } from 'react-native'
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../type';
import OpenCV from '../../utils/OpenCVModules';

interface FileListenerProps {
    navigation: NavigationProp<RootStackParamList>;
}

export const setupFileListener = ({ navigation }: FileListenerProps) => {
    const handleOpenURL = async (event: any, background: boolean = false) => {
        let fileType;
        // console.log(background)
        const fileUri = background ? event : event.url
        
        if (fileUri) {
            fileType = await OpenCV.getExtensionFile(fileUri)
        }

        navigation.navigate('Home', {
            file: fileUri,
            fileType: fileType
        });
    };

    Linking.addEventListener('url', handleOpenURL);

    Linking.getInitialURL().then(url => {
        handleOpenURL(url, true)
        // console.log(url)
    })

    // Clean up the event listener when needed
    return () => {
        Linking.removeAllListeners('url');
    };
};