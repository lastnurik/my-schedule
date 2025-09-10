/// <reference types="vite/client" />

declare module 'virtual:pwa-register/react' {
  export function useRegisterSW(): {
    needRefresh: boolean
    updateServiceWorker: (reload?: boolean) => void
  }
}
