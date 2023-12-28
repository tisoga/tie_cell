/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { ThemeProvider } from './src/context/ThemeContext';
import { NavigationContainer } from '@react-navigation/native'
import { RecoilRoot } from 'recoil';

const Application = () => {
    return (
        <RecoilRoot>
            <NavigationContainer>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </NavigationContainer>
        </RecoilRoot>
    )
}

AppRegistry.registerComponent(appName, () => Application);
