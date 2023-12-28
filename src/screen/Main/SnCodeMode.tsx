import { Text, TextInput, TouchableOpacity, View } from "react-native"
import useTheme from "../../hooks/useTheme"
import styles from "./styles"

const SNCode = () => {
    const { selectedTheme } = useTheme()
    return (
        <View>
            <Text style={[styles.textSecondary, { color: selectedTheme.text }]}>Masukan Code SN</Text>
            <TextInput
                multiline={true}
                style={[styles.textArea, { color: selectedTheme.text }]}
            />
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.btnSend, { backgroundColor: selectedTheme.accent }]}
            >
                <Text style={styles.btnText}>Check</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SNCode