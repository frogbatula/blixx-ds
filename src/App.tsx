import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PreferencesProvider } from '@/app/PreferencesProvider'
import { AppLayout } from '@/app/AppLayout'
import { WelcomePage } from '@/pages/WelcomePage'
import { CasinoPage } from '@/pages/CasinoPage'
import { PromotionsPage } from '@/pages/PromotionsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { DocsLayout } from '@/pages/docs/DocsLayout'
import { DocsOverviewPage } from '@/pages/docs/DocsOverviewPage'
import { DocsTokensPage } from '@/pages/docs/DocsTokensPage'
import { DocsComponentsPage } from '@/pages/docs/DocsComponentsPage'

export function App() {
  return (
    <PreferencesProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<WelcomePage />} />
            <Route path="casino" element={<CasinoPage />} />
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="docs" element={<DocsLayout />}>
              <Route index element={<DocsOverviewPage />} />
              <Route path="tokens" element={<DocsTokensPage />} />
              <Route path="components" element={<DocsComponentsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PreferencesProvider>
  )
}

export default App
