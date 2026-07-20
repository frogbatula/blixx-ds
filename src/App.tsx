import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PreferencesProvider } from '@/app/PreferencesProvider'
import { AuthProvider } from '@/app/AuthProvider'
import { AppLayout } from '@/app/AppLayout'
import { WelcomePage } from '@/pages/WelcomePage'
import { GettingStartedPage } from '@/pages/GettingStartedPage'
import { CasinoPage } from '@/pages/CasinoPage'
import { PromotionsPage } from '@/pages/PromotionsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { DocsLayout } from '@/pages/docs/DocsLayout'
import { DocsOverviewPage } from '@/pages/docs/DocsOverviewPage'
import { DocsTokensPage } from '@/pages/docs/DocsTokensPage'
import { DocsComponentsPage } from '@/pages/docs/DocsComponentsPage'
import { CmsGate } from '@/cms/pages/CmsGate'
import { CmsDashboardPage } from '@/cms/pages/CmsDashboardPage'
import { CmsCopyPage } from '@/cms/pages/CmsCopyPage'
import { CmsTokensPage } from '@/cms/pages/CmsTokensPage'
import { CmsPublishPage } from '@/cms/pages/CmsPublishPage'
import { CmsSettingsPage } from '@/cms/pages/CmsSettingsPage'

export function App() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="cms" element={<CmsGate />}>
              <Route index element={<CmsDashboardPage />} />
              <Route path="copy" element={<CmsCopyPage />} />
              <Route path="tokens" element={<CmsTokensPage />} />
              <Route path="publish" element={<CmsPublishPage />} />
              <Route path="settings" element={<CmsSettingsPage />} />
            </Route>

            <Route element={<AppLayout />}>
              <Route index element={<WelcomePage />} />
              <Route path="getting-started" element={<GettingStartedPage />} />
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
      </AuthProvider>
    </PreferencesProvider>
  )
}

export default App
