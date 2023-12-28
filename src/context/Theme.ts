
export type ThemeListType = {
    text: string,
    primary: string
    secondary: string
    accent: string
}

export type ThemeType = {
    light: ThemeListType,
    dark: ThemeListType
}

export const Green: ThemeType = {
    light: {
        text: '#0f0f0f',
        primary: '#a9eac4',
        secondary: '#d8e4dd',
        accent: '#c20003',
    },
    dark: {
        text: '#f0f0f0',
        primary: '#155630',
        secondary: '#1b2720',
        accent: '#ff3d40',
    }
}