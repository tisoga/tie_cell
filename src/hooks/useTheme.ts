import { useColorScheme } from "react-native"
import { useRecoilState } from "recoil"
import { themeState } from "../recoil/atom"

const useTheme = () => {
    const [theme, setTheme] = useRecoilState(themeState)
    const isDarkMode = useColorScheme() === 'dark'
    const colorScheme = isDarkMode ? 'dark' : 'light'
    const selectedTheme = theme[colorScheme]

    return { selectedTheme, setTheme }
}

export default useTheme 