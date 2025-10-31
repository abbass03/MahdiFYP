/// <reference types="react-scripts" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'react' {
  export = React;
  export as namespace React;
  export const useState: <T>(initialState: T | (() => T)) => [T, (newState: T | ((prevState: T) => T)) => void];
  export const useEffect: (effect: () => void | (() => void), deps?: any[]) => void;
  export const StrictMode: React.ComponentType<{ children?: React.ReactNode }>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
}

declare module 'react/jsx-runtime' {
  export = React;
  export as namespace React;
} 