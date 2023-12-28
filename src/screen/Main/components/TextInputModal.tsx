import { Text, TextInput, View } from "react-native"
import styles from "../styles"
import useTheme from "../../../hooks/useTheme"


type TextInputModalProps = {
    index: number
    label: string,
    value: string,
    placeholder?: string
    editable: boolean
    type?: 'numeric' | 'default'
    onChangeText: (index: number, val: string) => void
}

const TextInputModal = ({ index, label, value, placeholder, onChangeText, editable = false, type = 'default' }: TextInputModalProps) => {
    const { selectedTheme } = useTheme()
    return (
        <View style={styles.modalInputContainer}>
            <Text style={[styles.modalTextLabel, { color: selectedTheme.text }]}>{label}</Text>
            <TextInput
                style={styles.textInputModal}
                placeholder={placeholder}
                value={value}
                editable={editable}
                keyboardType={type}
                onChangeText={(val) => onChangeText(index, val)} />
        </View>
    )
}

export default TextInputModal