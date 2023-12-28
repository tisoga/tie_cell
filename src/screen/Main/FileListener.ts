import { Linking } from 'react-native'
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../type';

interface FileListenerProps {
    navigation: NavigationProp<RootStackParamList>; // Adjust the type as per your navigation prop
}

export const setupFileListener = ({ navigation }: FileListenerProps) => {
    const handleOpenURL = (event: any, background: boolean = false) => {
        // console.log(background)
        const fileUri = background ? event : event.url
        // console.log('File opened:', fileUri);

        // Use the navigation.navigate function to navigate to PDFViewer
        navigation.navigate('Home', {
            file: fileUri
        });
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