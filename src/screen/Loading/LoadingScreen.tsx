import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import useTheme from '../../hooks/useTheme'

const LoadingScreen = () => {
    const { selectedTheme } = useTheme()
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={'green'} />
            <Text style={[styles.normalText, { color: selectedTheme.text }]}>Please Wait......</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4
    },
    normalText: {
        fontSize: 16
    },
})

export default LoadingScreen