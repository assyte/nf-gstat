const isTauri = typeof window !== 'undefined' && '__TAURI__' in window
const isElectron = typeof window !== 'undefined' && 'electronAPI' in window

async function tauriInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke } = await import('@tauri-apps/api/core')
  return invoke<T>(command, args)
}

async function electronInvoke<T>(command: string): Promise<T> {
  const { electronAPI } = window as any
  return electronAPI[command]?.() as T
}

export async function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauri) {
    return tauriInvoke<T>(command, args)
  } else if (isElectron) {
    return electronInvoke<T>(command)
  }
  throw new Error('Unsupported environment')
}

export function getPlatform(): 'tauri' | 'electron' | 'web' {
  if (isTauri) return 'tauri'
  if (isElectron) return 'electron'
  return 'web'
}
