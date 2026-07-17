import { useTranslation } from 'react-i18next'

function App() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-500">
            {t('uygulama_adi')}
          </h1>
          <nav className="flex gap-4">
            <button className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-red-600 transition-colors">
              {t('oyunlar')}
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-red-600 transition-colors">
              {t('istatistikler')}
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-red-600 transition-colors">
              {t('ayarlar')}
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">
            {t('oyunlar')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-red-600 transition-colors">
              <h3 className="text-lg font-medium text-red-400">Minecraft</h3>
              <p className="text-gray-400 mt-2">{t('toplam_sure')}: 0s</p>
              <p className="text-gray-500 text-sm">{t('son_oynama')}: --</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-red-600 transition-colors">
              <h3 className="text-lg font-medium text-red-400">Valorant</h3>
              <p className="text-gray-400 mt-2">{t('toplam_sure')}: 0s</p>
              <p className="text-gray-500 text-sm">{t('son_oynama')}: --</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-red-600 transition-colors">
              <h3 className="text-lg font-medium text-red-400">Steam</h3>
              <p className="text-gray-400 mt-2">{t('toplam_sure')}: 0s</p>
              <p className="text-gray-500 text-sm">{t('son_oynama')}: --</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">
            {t('istatistikler')}
          </h2>
          <p className="text-gray-400">Henüz istatistik bulunmuyor.</p>
        </div>
      </main>
    </div>
  )
}

export default App
