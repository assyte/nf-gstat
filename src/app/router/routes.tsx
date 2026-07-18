import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Shell } from '@/layouts/shell/Shell'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { LibraryPage } from '@/features/library/LibraryPage'
import { MinecraftPage } from '@/features/minecraft/MinecraftPage'
import { SteamPage } from '@/features/steam/SteamPage'
import { EpicPage } from '@/features/epic/EpicPage'
import { XboxPage } from '@/features/xbox/XboxPage'
import { PlayStationPage } from '@/features/playstation/PlayStationPage'
import { MicrosoftPage } from '@/features/microsoft/MicrosoftPage'
import { SettingsPage } from '@/features/settings/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'library', element: <LibraryPage /> },
      { path: 'minecraft', element: <MinecraftPage /> },
      { path: 'steam', element: <SteamPage /> },
      { path: 'epic', element: <EpicPage /> },
      { path: 'xbox', element: <XboxPage /> },
      { path: 'playstation', element: <PlayStationPage /> },
      { path: 'microsoft', element: <MicrosoftPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
