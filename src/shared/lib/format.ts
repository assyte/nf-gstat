export function formatPlaytime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) return `${hours}s ${minutes}d`
  if (minutes > 0) return `${minutes}d ${secs}sn`
  return `${secs}sn`
}

export function formatPlaytimeLong(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) return `${hours} saat ${minutes} dakika`
  if (minutes > 0) return `${minutes} dakika`
  return `${seconds} saniye`
}

export function formatPlaytimeHours(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) return `${hours}s ${mins}d`
  return `${mins}d`
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('tr-TR').format(n)
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function formatTimestamp(ts: number | null): string {
  if (!ts) return '--'
  const date = new Date(ts * 1000)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
