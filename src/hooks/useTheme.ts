import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { useColorScheme } from "react-native"

const useTheme = () => {
    const { theme, setTheme } = useContext(ThemeContext)
    const isDarkMode = useColorScheme() === 'dark'
    const colorScheme = isDarkMode ? 'dark' : 'light'
    const selectedTheme = theme[colorScheme]

    return {selectedTheme, setTheme}
}

export default useTheme 