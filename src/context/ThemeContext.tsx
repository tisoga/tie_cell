import React, { Dispatch, SetStateAction, createContext, useState } from 'react'
import { Green, ThemeListType, ThemeType } from './Theme'
import { useColorScheme } from 'react-native'


export type ThemeContextType = {
    theme: ThemeType,
    setTheme: Dispatch<SetStateAction<ThemeType>>
}

const defaultState = {
    theme: Green,
    setTheme: (theme: ThemeType) => { }
} as ThemeContextType

export const ThemeContext = createContext(defaultState)

type ThemeProviderProps = {
    children: React.JSX.Element
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<ThemeType>(Green)

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}