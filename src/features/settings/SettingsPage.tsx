import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Key, Gamepad2, CircleDot, Gamepad } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import { useAppStore } from '@/app/store/app.store'
import { steamApi, epicApi, xboxApi, playstationApi } from '@/shared/api'

function ApiKeySection({
  title,
  description,
  icon: Icon,
  fields,
  onSave,
  connected,
}: {
  title: string
  description: string
  icon: React.ElementType
  fields: { key: string; label: string; placeholder: string; value: string; onChange: (v: string) => void }[]
  onSave: () => void
  connected: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-red-500" />
            {title}
          </div>
          <Badge variant={connected ? 'default' : 'secondary'}>
            {connected ? 'Bagli' : 'Bagli Degil'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-[#71717A]">{description}</p>
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-xs text-[#A1A1AA] mb-1 block">{field.label}</label>
            <Input
              type="password"
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </div>
        ))}
        <Button onClick={onSave} size="sm">
          Kaydet
        </Button>
      </CardContent>
    </Card>
  )
}

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { language, setLanguage } = useAppStore()

  const [steamKey, setSteamKey] = useState(() => localStorage.getItem('gstat_steam_api_key') ?? '')
  const [epicToken, setEpicToken] = useState(() => localStorage.getItem('gstat_epic_token') ?? '')
  const [xboxAccess, setXboxAccess] = useState(() => localStorage.getItem('gstat_xbox_access_token') ?? '')
  const [xboxUser, setXboxUser] = useState(() => localStorage.getItem('gstat_xbox_user_token') ?? '')
  const [xboxXsts, setXboxXsts] = useState(() => localStorage.getItem('gstat_xbox_xsts_token') ?? '')
  const [psAccess, setPsAccess] = useState(() => localStorage.getItem('gstat_ps_access_token') ?? '')
  const [psNpsso, setPsNpsso] = useState(() => localStorage.getItem('gstat_ps_npsso') ?? '')

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    setLanguage(lang)
  }

  const saveSteamKey = async () => {
    localStorage.setItem('gstat_steam_api_key', steamKey)
    if (steamKey) await steamApi.setApiKey(steamKey)
  }

  const saveEpicToken = async () => {
    localStorage.setItem('gstat_epic_token', epicToken)
    if (epicToken) await epicApi.setToken(epicToken)
  }

  const saveXboxTokens = async () => {
    localStorage.setItem('gstat_xbox_access_token', xboxAccess)
    localStorage.setItem('gstat_xbox_user_token', xboxUser)
    localStorage.setItem('gstat_xbox_xsts_token', xboxXsts)
    if (xboxAccess && xboxUser && xboxXsts) {
      await xboxApi.setTokens(xboxAccess, xboxUser, xboxXsts)
    }
  }

  const savePsTokens = async () => {
    localStorage.setItem('gstat_ps_access_token', psAccess)
    localStorage.setItem('gstat_ps_npsso', psNpsso)
    if (psAccess && psNpsso) {
      await playstationApi.setTokens(psAccess, psNpsso)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('settings.title')}</h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-red-500" />
            {t('settings.language')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <button
              onClick={() => handleLanguageChange('tr')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                language === 'tr'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10'
              }`}
            >
              Turkce
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                language === 'en'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10'
              }`}
            >
              English
            </button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* API Keys Section */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-red-500" />
          {t('settings.api_keys')}
        </h2>
        <p className="text-sm text-[#71717A] mb-6">{t('settings.api_keys_desc')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApiKeySection
            title="Steam"
            description={t('settings.steam_key_desc')}
            icon={Gamepad2}
            fields={[
              { key: 'steam_key', label: 'API Key', placeholder: 'A1B2C3D4E5F6...', value: steamKey, onChange: setSteamKey },
            ]}
            onSave={saveSteamKey}
            connected={!!steamKey}
          />

          <ApiKeySection
            title="Epic Games"
            description={t('settings.epic_token_desc')}
            icon={CircleDot}
            fields={[
              { key: 'epic_token', label: 'Access Token', placeholder: 'eyJhbGciOiJIUzI1NiI...', value: epicToken, onChange: setEpicToken },
            ]}
            onSave={saveEpicToken}
            connected={!!epicToken}
          />

          <ApiKeySection
            title="Xbox"
            description={t('settings.xbox_tokens_desc')}
            icon={CircleDot}
            fields={[
              { key: 'xbox_access', label: 'Access Token', placeholder: 'eyJhbGciOiJSUzI1NiI...', value: xboxAccess, onChange: setXboxAccess },
              { key: 'xbox_user', label: 'User Token', placeholder: 'User Token...', value: xboxUser, onChange: setXboxUser },
              { key: 'xbox_xsts', label: 'XSTS Token', placeholder: 'XSTS Token...', value: xboxXsts, onChange: setXboxXsts },
            ]}
            onSave={saveXboxTokens}
            connected={!!(xboxAccess && xboxUser && xboxXsts)}
          />

          <ApiKeySection
            title="PlayStation"
            description={t('settings.ps_tokens_desc')}
            icon={Gamepad}
            fields={[
              { key: 'ps_access', label: 'Access Token', placeholder: 'eyJhbGciOiJSUzI1NiI...', value: psAccess, onChange: setPsAccess },
              { key: 'ps_npsso', label: 'NPSSO', placeholder: 'NPSSO Token...', value: psNpsso, onChange: setPsNpsso },
            ]}
            onSave={savePsTokens}
            connected={!!(psAccess && psNpsso)}
          />
        </div>
      </div>

      <Separator />

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.about')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#A1A1AA]">gStat v0.1.0</p>
          <p className="mt-1 text-xs text-[#71717A]">Game Statistics Tracker</p>
          <div className="mt-4 flex gap-2">
            <Badge variant="secondary">Tauri 2</Badge>
            <Badge variant="secondary">React 19</Badge>
            <Badge variant="secondary">SQLite</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
