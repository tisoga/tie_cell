/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { NavigationContainer } from '@react-navigation/native'
import { RecoilRoot } from 'recoil';

const Application = () => {
    return (
        <RecoilRoot>
            <NavigationContainer>
                <App />
            </NavigationContainer>
        </RecoilRoot>
    )
}

AppRegistry.registerComponent(appName, () => Application);
