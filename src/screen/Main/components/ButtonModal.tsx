import { Text, TouchableOpacity } from "react-native"
import styles from "../styles"

type ButtonModalProps = {
    label: string
    color: 'green' | 'yellow' | 'red'
    onPress: () => void
}

const ButtonModal = ({ label, color, onPress }: ButtonModalProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.resetBtnModal, { backgroundColor: color }]}
        >
            <Text style={styles.textBtnModal}>{label}</Text>
        </TouchableOpacity>
    )
}

export default ButtonModal