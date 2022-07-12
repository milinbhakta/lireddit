import {
    ThemeOptions, ThemeProvider, Theme, createTheme as createLegacyModeTheme,
    unstable_createMuiStrictModeTheme as createStrictModeTheme,
    useMediaQuery,
} from "@material-ui/core";
import React, { ReactNode, useContext, useState } from "react";
import ArrowDropDownRounded from '@material-ui/icons/ArrowDropDownRounded';

const languageMap = {
    en: "enUS",
    zh: "zhCN",
    fa: "faIR",
    ru: "ruRU",
    pt: "ptBR",
    es: "esES",
    fr: "frFR",
    de: "deDE",
    ja: "jaJP",
};

const themeInitialOptions = {
    dense: false,
    direction: 'ltr',
    paletteColors: {},
    spacing: 8, // spacing unit
    paletteMode: 'light',
};

const highDensity = {
    components: {
        MuiButton: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiFilledInput: {
            defaultProps: {
                margin: 'dense',
            },
        },
        MuiFormControl: {
            defaultProps: {
                margin: 'dense',
            },
        },
        MuiFormHelperText: {
            defaultProps: {
                margin: 'dense',
            },
        },
        MuiIconButton: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                sizeSmall: {
                    // minimal touch target hit spacing
                    marginLeft: 4,
                    marginRight: 4,
                    padding: 12,
                },
            },
        },
        MuiInputBase: {
            defaultProps: {
                margin: 'dense',
            },
        },
        MuiInputLabel: {
            defaultProps: {
                margin: 'dense',
            },
        },
        MuiListItem: {
            defaultProps: {
                dense: true,
            },
        },
        MuiOutlinedInput: {
            defaultProps: {
                margin: 'dense',
            },
        },
        MuiFab: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiTable: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiTextField: {
            defaultProps: {
                margin: 'dense',
            },
        },
        MuiToolbar: {
            defaultProps: {
                variant: 'dense',
            },
        },
    },
};

type State = {
    themeOptions: any;
};

export const DispatchContext = React.createContext<[State, React.Dispatch<any>]>({themeOptions:themeInitialOptions});


DispatchContext.displayName = 'ThemeDispatchContext';


let createTheme: any;

createTheme = createStrictModeTheme;



export function MyThemeProvider(props: any) {
    const { children } = props;
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const preferredMode = prefersDarkMode ? 'dark' : 'light';
    const [themeOptions, dispatch] = React.useReducer(
        (state: any, action: any) => {
            switch (action.type) {
                case 'CHANGE':
                    return {
                        ...state,
                        paletteMode: action.payload.paletteMode || state.paletteMode,
                        direction: action.payload.direction || state.direction,
                        paletteColors: action.payload.paletteColors || state.paletteColors,
                    };
                default:
                    throw new Error(`Unrecognized type ${action.type}`);
            }
        },
        { ...themeInitialOptions, paletteMode: preferredMode },
    );

    const { dense, direction, paletteColors, paletteMode, spacing } = themeOptions;

    React.useEffect(() => {

        const nextPaletteColors = JSON.parse(getCookie('paletteColors') || 'null');
        const nextPaletteMode = getCookie('paletteMode') || preferredMode;

        dispatch({
            type: 'CHANGE',
            payload: { paletteColors: nextPaletteColors, paletteMode: nextPaletteMode },
        });

    }, [preferredMode]);


    React.useEffect(() => {
        const metas = document.querySelectorAll('meta[name="theme-color"]');
        metas.forEach((meta) => {
            meta.setAttribute('content', getMetaThemeColor(paletteMode));
        });
    }, [paletteMode]);

    const theme = React.useMemo(() => {
        const brandingDesignTokens = getDesignTokens(paletteMode);
        let nextTheme = createTheme(
            {
                direction,
                ...brandingDesignTokens,
                palette: {
                    ...brandingDesignTokens.palette,
                    ...paletteColors,
                    mode: paletteMode,
                },
                // v5 migration
                props: {
                    MuiBadge: {
                        overlap: 'rectangular',
                    },
                },
                spacing,
            },
            dense ? highDensity : null,
        );

        nextTheme = deepmerge(nextTheme, getThemedComponents(nextTheme));

        return nextTheme;
    }, [dense, direction, paletteColors, paletteMode, spacing]);

    React.useEffect(() => {
        // Expose the theme as a global variable so people can play with it.
        if (process.browser) {
            // window.theme = theme;
            // window.createTheme = createTheme;
        }
    }, [theme]);

    return (
        <>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </>
    );
}


declare module '@material-ui/core/styles/createPalette' {
    interface ColorRange {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    }

    interface PaletteColor extends ColorRange { }

    interface Palette {
        primaryDark: PaletteColor;
    }
}

declare module '@material-ui/core/styles/createTypography' {
    interface TypographyOptions {
        fontWeightExtraBold?: number;
        fontFamilyCode?: string;
    }

    interface Typography {
        fontWeightExtraBold: number;
        fontFamilyCode: string;
    }
}

// TODO: enable this once types conflict is fixed
// declare module '@mui/material/Button' {
//   interface ButtonPropsVariantOverrides {
//     code: true;
//   }
// }

const defaultTheme = createTheme();

const blue = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#A5D8FF',
    300: '#66B2FF',
    400: '#3399FF',
    main: '#007FFF', // contrast 3.83:1
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
    800: '#004C99',
    900: '#003A75',
};
export const blueDark = {
    50: '#E2EDF8',
    100: '#CEE0F3',
    200: '#91B9E3',
    300: '#5090D3',
    main: '#5090D3',
    400: '#265D97',
    500: '#1E4976',
    600: '#173A5E',
    700: '#132F4C', // contrast 13.64:1
    800: '#001E3C',
    900: '#0A1929',
};
const grey = {
    50: '#F3F6F9',
    100: '#EAEEF3',
    200: '#E5E8EC',
    300: '#D7DCE1',
    400: '#BFC7CF',
    500: '#AAB4BE',
    600: '#7F8E9D',
    700: '#46505A', // contrast 8.21:1
    800: '#2F3A45', // contrast 11.58:1
    900: '#20262D',
};

const systemFont = [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
];

export const getMetaThemeColor = (mode: 'light' | 'dark') => {
    const themeColor = {
        light: grey[50],
        dark: blueDark[800],
    };
    return themeColor[mode];
};

export const getDesignTokens = (mode: 'light' | 'dark') =>
({
    palette: {
        primary: {
            ...blue,
            ...(mode === 'dark' && {
                main: blue[400],
            }),
        },
        divider: mode === 'dark' ? blueDark[700] : grey[200],
        primaryDark: blueDark,
        mode,
        ...(mode === 'dark' && {
            background: {
                default: blueDark[800],
                paper: blueDark[900],
            },
        }),
        common: {
            black: '#1D1D1D',
        },
        ...(mode === 'light' && {
            text: {
                primary: grey[900],
                secondary: grey[700],
            },
        }),
        ...(mode === 'dark' && {
            text: {
                primary: '#fff',
                secondary: grey[500],
            },
        }),
        grey,
        error: {
            50: '#FFF0F1',
            100: '#FFDBDE',
            200: '#FFBDC2',
            300: '#FF99A2',
            400: '#FF7A86',
            500: '#FF505F',
            main: '#EB0014', // contrast 4.63:1
            600: '#EB0014',
            700: '#C70011',
            800: '#94000D',
            900: '#570007',
        },
        success: {
            50: '#E9FBF0',
            100: '#C6F6D9',
            200: '#9AEFBC',
            300: '#6AE79C',
            400: '#3EE07F',
            500: '#21CC66',
            600: '#1DB45A',
            ...(mode === 'dark' && {
                main: '#1DB45A', // contrast 6.17:1 (blueDark.800)
            }),
            ...(mode === 'light' && {
                main: '#1AA251', // contrast 3.31:1
            }),
            700: '#1AA251',
            800: '#178D46',
            900: '#0F5C2E',
        },
        warning: {
            50: '#FFF9EB',
            100: '#FFF4DB',
            200: '#FFEDC2',
            300: '#FFE4A3',
            400: '#FFD980',
            500: '#FCC419',
            600: '#FAB005',
            main: '#F1A204', // does not pass constrast ratio
            700: '#F1A204',
            800: '#DB9A00',
            900: '#8F6400',
        },
    },
    shape: {
        borderRadius: 10,
    },
    spacing: 10,
    typography: {
        fontFamily: ['"IBM Plex Sans"', ...systemFont].join(','),
        fontFamilyCode: ['"IBM Plex Mono"', ...systemFont].join(','),
        fontFamilyTagline: ['"PlusJakartaSans-ExtraBold"', ...systemFont].join(','),
        fontFamilySystem: systemFont.join(','),
        fontWeightExtraBold: 800,
        h1: {
            fontFamily: ['"PlusJakartaSans-ExtraBold"', ...systemFont].join(','),
            fontSize: 'clamp(2.625rem, 1.2857rem + 3.5714vw, 4rem)',
            fontWeight: 800,
            lineHeight: 78 / 70,
            ...(mode === 'light' && {
                color: blueDark[900],
            }),
        },
        h2: {
            fontFamily: ['"PlusJakartaSans-ExtraBold"', ...systemFont].join(','),
            fontSize: 'clamp(1.5rem, 0.9643rem + 1.4286vw, 2.25rem)',
            fontWeight: 800,
            lineHeight: 44 / 36,
            color: mode === 'dark' ? grey[200] : blueDark[700],
        },
        h3: {
            fontSize: defaultTheme.typography.pxToRem(36),
            lineHeight: 44 / 36,
            letterSpacing: 0,
        },
        h4: {
            fontSize: defaultTheme.typography.pxToRem(28),
            lineHeight: 42 / 28,
            letterSpacing: 0,
        },
        h5: {
            fontSize: defaultTheme.typography.pxToRem(24),
            lineHeight: 36 / 24,
            letterSpacing: 0,
        },
        h6: {
            fontSize: defaultTheme.typography.pxToRem(20),
            lineHeight: 30 / 20,
            letterSpacing: 0,
        },
        button: {
            textTransform: 'initial',
            fontWeight: 700,
            letterSpacing: 0,
        },
        subtitle1: {
            fontSize: defaultTheme.typography.pxToRem(18),
            lineHeight: 24 / 18,
            letterSpacing: 0,
            fontWeight: 500,
        },
        body1: {
            fontSize: defaultTheme.typography.pxToRem(16), // 16px
            lineHeight: 24 / 16,
            letterSpacing: 0,
        },
        body2: {
            fontSize: defaultTheme.typography.pxToRem(14), // 14px
            lineHeight: 21 / 14,
            letterSpacing: 0,
        },
        caption: {
            display: 'inline-block',
            fontSize: defaultTheme.typography.pxToRem(12), // 12px
            lineHeight: 18 / 12,
            letterSpacing: 0,
            fontWeight: 700,
        },
    },
} as ThemeOptions);

export function getThemedComponents(theme: Theme) {
    return {
        components: {
            MuiButtonBase: {
                defaultProps: {
                    disableTouchRipple: true,
                },
            },
            MuiButton: {
                defaultProps: {
                    disableElevation: true,
                },
                styleOverrides: {
                    sizeLarge: {
                        padding: '1rem 1.25rem',
                        ...theme.typography.body1,
                        lineHeight: 21 / 16,
                        fontWeight: 700,
                    },
                    containedPrimary: {
                        backgroundColor: theme.palette.primary[500],
                        color: '#fff',
                    },
                },
                variants: [
                    {
                        props: { variant: 'code' },
                        style: {
                            color:
                                theme.palette.type === 'dark' ? theme.palette.grey[400] : theme.palette.grey[800],
                            border: '1px solid',
                            borderColor:
                                theme.palette.type === 'dark'
                                    ? theme.palette.primaryDark[400]
                                    : theme.palette.grey[200],
                            backgroundColor:
                                theme.palette.type === 'dark'
                                    ? theme.palette.primaryDark[700]
                                    : theme.palette.grey[50],
                            fontFamily: theme.typography.fontFamilyCode,
                            '&:hover, &.Mui-focusVisible': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor:
                                    theme.palette.type === 'dark'
                                        ? theme.palette.primaryDark[600]
                                        : theme.palette.primary[50],
                                '& .MuiButton-endIcon': {
                                    color:
                                        theme.palette.type === 'dark'
                                            ? theme.palette.primary[300]
                                            : theme.palette.primary.main,
                                },
                            },
                            '& .MuiButton-startIcon': {
                                color: theme.palette.grey[400],
                            },
                            '& .MuiButton-endIcon': {
                                color:
                                    theme.palette.type === 'dark' ? theme.palette.grey[400] : theme.palette.grey[700],
                            },
                        },
                    },
                    {
                        props: { variant: 'code', size: 'large' },
                        style: {
                            ...theme.typography.body2,
                            fontFamily: theme.typography.fontFamilyCode,
                            fontWeight: theme.typography.fontWeightBold,
                        },
                    },
                ],
            },
            MuiContainer: {
                styleOverrides: {
                    root: {
                        [theme.breakpoints.up('md')]: {
                            paddingLeft: theme.spacing(2),
                            paddingRight: theme.spacing(2),
                        },
                    },
                },
            },
            MuiDivider: {
                styleOverrides: {
                    root: {
                        borderColor:
                            theme.palette.type === 'dark'
                                ? theme.palette.primaryDark[700]
                                : theme.palette.grey[100],
                    },
                },
            },
            MuiLink: {
                defaultProps: {
                    underline: 'none',
                },
                styleOverrides: {
                    root: {
                        color:
                            theme.palette.type === 'dark'
                                ? theme.palette.primary[400]
                                : theme.palette.primary[600],
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        '&.MuiTypography-body1 > svg': {
                            marginTop: 2,
                        },
                        '& svg:last-child': {
                            marginLeft: 2,
                        },
                    },
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 5,
                        '&:hover, &:focus': {
                            backgroundColor: theme.palette.type === 'dark' ? '' : theme.palette.grey[100],
                        },
                    },
                },
            },
            MuiSelect: {
                defaultProps: {
                    IconComponent: ArrowDropDownRounded,
                },
                styleOverrides: {
                    iconFilled: {
                        top: 'calc(50% - .25em)',
                    },
                },
            },
            MuiTab: {
                defaultProps: {
                    disableTouchRipple: true,
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor:
                            theme.palette.type === 'dark' ? theme.palette.primaryDark[900] : '#fff',
                        '&[href]': {
                            textDecorationLine: 'none',
                        },
                    },
                    outlined: {
                        display: 'block',
                        borderColor:
                            theme.palette.type === 'dark'
                                ? theme.palette.primaryDark[400]
                                : theme.palette.grey[200],
                        ...(theme.palette.type === 'dark' && {
                            backgroundColor: theme.palette.primaryDark[700],
                        }),
                        'a&, button&': {
                            '&:hover': {
                                boxShadow: '1px 1px 20px 0 rgb(90 105 120 / 20%)',
                            },
                        },
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        padding: theme.spacing(1, 2),
                        borderColor: theme.palette.divider,
                    },
                    head: {
                        color: theme.palette.text.primary,
                        fontWeight: 700,
                    },
                    body: {
                        color: theme.palette.text.secondary,
                    },
                },
            },
            MuiToggleButtonGroup: {
                styleOverrides: {
                    root: {
                        backgroundColor:
                            theme.palette.type === 'dark' ? theme.palette.primaryDark[900] : '#fff',
                    },
                },
            },
            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 700,
                        color:
                            theme.palette.type === 'dark' ? theme.palette.grey[300] : theme.palette.grey[700],
                        borderColor:
                            theme.palette.type === 'dark'
                                ? theme.palette.primaryDark[500]
                                : theme.palette.grey[200],
                        '&.Mui-selected': {
                            borderColor: `${theme.palette.primary[500]} !important`,
                            color: theme.palette.type === 'dark' ? '#fff' : theme.palette.primary[500],
                            backgroundColor:
                                theme.palette.type === 'dark'
                                    ? theme.palette.primary[800]
                                    : theme.palette.primary[50],
                        },
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        paddingTop: 7,
                        paddingBottom: 7,
                    },
                },
            },
            MuiSwitch: {
                styleOverrides: {
                    root: {
                        width: 32,
                        height: 20,
                        padding: 0,
                        '& .MuiSwitch-switchBase': {
                            '&.Mui-checked': {
                                transform: 'translateX(11px)',
                                color: '#fff',
                            },
                        },
                    },
                    switchBase: {
                        height: 20,
                        width: 20,
                        padding: 0,
                        color: '#fff',
                        '&.Mui-checked + .MuiSwitch-track': {
                            opacity: 1,
                        },
                    },
                    track: {
                        opacity: 1,
                        borderRadius: 32,
                        backgroundColor:
                            theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[400],
                    },
                    thumb: {
                        flexShrink: 0,
                        width: '14px',
                        height: '14px',
                    },
                },
            },
        },
    };
}

const darkTheme = createTheme(getDesignTokens('dark'));
export const brandingDarkTheme = deepmerge(darkTheme, getThemedComponents(darkTheme));

export function isPlainObject(item: unknown): item is Record<keyof any, unknown> {
    return (
        item !== null &&
        typeof item === 'object' &&
        // TS thinks `item is possibly null` even though this was our first guard.
        // @ts-expect-error
        item.constructor === Object
    );
}

export interface DeepmergeOptions {
    clone?: boolean;
}

export function deepmerge<T>(
    target: T,
    source: unknown,
    options: DeepmergeOptions = { clone: true },
): T {
    const output = options.clone ? { ...target } : target;

    if (isPlainObject(target) && isPlainObject(source)) {
        Object.keys(source).forEach((key) => {
            // Avoid prototype pollution
            if (key === '__proto__') {
                return;
            }

            if (isPlainObject(source[key]) && key in target && isPlainObject(target[key])) {
                // Since `output` is a clone of `target` and we have narrowed `target` in this block we can cast to the same type.
                (output as Record<keyof any, unknown>)[key] = deepmerge(target[key], source[key], options);
            } else {
                (output as Record<keyof any, unknown>)[key] = source[key];
            }
        });
    }

    return output;
}


/**
 * Get the value of a cookie
 * Source: https://vanillajstoolkit.com/helpers/getcookie/
 * @param name - The name of the cookie
 * @return The cookie value
 */
export function getCookie(name: string): string | undefined {
    if (typeof document === 'undefined') {
        throw new Error(
            'getCookie() is not supported on the server. Fallback to a different value when rendering on the server.',
        );
    }

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts[1].split(';').shift();
    }

    return undefined;
}

/**
 * @returns {(nextOptions: Partial<typeof themeInitialOptions>) => void}
 */
export function useChangeTheme() {
    const dispatch = React.useContext(DispatchContext);
    return React.useCallback((options) => dispatch({ type: 'CHANGE', payload: options }), [dispatch]);
}