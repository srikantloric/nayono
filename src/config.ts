// types
import { ConfigStates } from 'types/config';

// ==============================|| THEME CONSTANT ||============================== //

export const APP_DEFAULT_PATH = '/dashboard';
export const HORIZONTAL_MAX_ITEM = 8;
export const DRAWER_WIDTH = 280;
export const MINI_DRAWER_WIDTH = 90;
export const HEADER_HEIGHT = 74;
export const CSS_VAR_PREFIX = '';

export enum SimpleLayoutType {
  SIMPLE = 'simple',
  LANDING = 'landing'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export enum MenuOrientation {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  MINI_VERTICAL = 'mini-vertical'
}

export enum ThemeDirection {
  LTR = 'ltr',
  RTL = 'rtl'
}

export enum NavActionType {
  FUNCTION = 'function',
  LINK = 'link'
}

export const DEFAULT_THEME_MODE: ThemeMode = ThemeMode.SYSTEM;

// ==============================|| THEME CONFIG ||============================== //

const config: ConfigStates = {
  fontFamily: `Inter var`,
  i18n: 'en',
  menuOrientation: MenuOrientation.VERTICAL,
  menuCaption: true,
  container: true,
  presetColor: 'default',
  themeDirection: ThemeDirection.LTR,
  themeContrast: false
};

export default config;
