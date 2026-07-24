import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PreferencesProvider } from '@/app/PreferencesProvider'
import { AuthProvider } from '@/app/AuthProvider'
import { PlayerAuthProvider } from '@/app/PlayerAuthProvider'
import { PlayerBrandSync } from '@/app/PlayerBrandSync'
import { AppLayout } from '@/app/AppLayout'
import { GameLaunchLayout } from '@/app/GameLaunchLayout'
import { TooltipProvider } from '@/components/ui/tooltip'
import { WelcomePage } from '@/pages/WelcomePage'
import { GettingStartedPage } from '@/pages/GettingStartedPage'
import { CasinoPage } from '@/pages/CasinoPage'
import { LiveCasinoPage } from '@/pages/LiveCasinoPage'
import { SportsPage } from '@/pages/SportsPage'
import { PromotionsPage } from '@/pages/PromotionsPage'
import { PromoDetailPage } from '@/pages/PromoDetailPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { GameLaunchPage } from '@/pages/GameLaunchPage'
import { PlayerAuthPage } from '@/pages/PlayerAuthPage'
import { AccountLayout } from '@/pages/account/AccountLayout'
import { AccountDashboard } from '@/pages/account/AccountDashboard'
import { WalletPage } from '@/pages/account/WalletPage'
import { HistoryPage } from '@/pages/account/HistoryPage'
import { BonusesPage } from '@/pages/account/BonusesPage'
import { ResponsibleGamingPage } from '@/pages/account/ResponsibleGamingPage'
import { AccountProfilePage } from '@/pages/account/AccountProfilePage'
import { DocsLayout } from '@/pages/docs/DocsLayout'
import { DocsOverviewPage } from '@/pages/docs/DocsOverviewPage'
import { DocsTokensPage } from '@/pages/docs/DocsTokensPage'
import { DocsComponentsPage } from '@/pages/docs/DocsComponentsPage'
import { CmsGate } from '@/cms/pages/CmsGate'
import { CmsDashboardPage } from '@/cms/pages/CmsDashboardPage'
import { CmsCopyPage } from '@/cms/pages/CmsCopyPage'
import { CmsTokensPage } from '@/cms/pages/CmsTokensPage'
import { CmsPublishPage } from '@/cms/pages/CmsPublishPage'
import { CmsAssetsPage } from '@/cms/pages/CmsAssetsPage'
import { CmsGamesPage } from '@/cms/pages/CmsGamesPage'
import { CmsPromosPage } from '@/cms/pages/CmsPromosPage'
import { CmsUsersPage } from '@/cms/pages/CmsUsersPage'
import { CmsPlayersPage } from '@/cms/pages/CmsPlayersPage'
import { CmsPlayerDetailPage } from '@/cms/pages/CmsPlayerDetailPage'
import { CmsSettingsPage } from '@/cms/pages/CmsSettingsPage'

export function App() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <PlayerAuthProvider>
          <PlayerBrandSync />
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="cms" element={<CmsGate />}>
                  <Route index element={<CmsDashboardPage />} />
                  <Route path="games" element={<CmsGamesPage />} />
                  <Route path="promos" element={<CmsPromosPage />} />
                  <Route path="copy" element={<CmsCopyPage />} />
                  <Route path="tokens" element={<CmsTokensPage />} />
                  <Route path="assets" element={<CmsAssetsPage />} />
                  <Route path="publish" element={<CmsPublishPage />} />
                  <Route path="users" element={<CmsUsersPage />} />
                  <Route path="players" element={<CmsPlayersPage />} />
                  <Route path="players/:playerId" element={<CmsPlayerDetailPage />} />
                  <Route path="settings" element={<CmsSettingsPage />} />
                </Route>

                <Route element={<AppLayout />}>
                  <Route index element={<WelcomePage />} />
                  <Route path="getting-started" element={<GettingStartedPage />} />
                  <Route path="casino" element={<CasinoPage />} />
                  <Route path="live" element={<LiveCasinoPage />} />
                  <Route path="sports" element={<SportsPage />} />
                  <Route path="promotions" element={<PromotionsPage />} />
                  <Route path="promotions/:promoId" element={<PromoDetailPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="login" element={<PlayerAuthPage />} />
                  <Route path="register" element={<PlayerAuthPage />} />
                  <Route path="account" element={<AccountLayout />}>
                    <Route index element={<AccountDashboard />} />
                    <Route path="wallet" element={<WalletPage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="bonuses" element={<BonusesPage />} />
                    <Route path="responsible-gaming" element={<ResponsibleGamingPage />} />
                    <Route path="profile" element={<AccountProfilePage />} />
                  </Route>
                  <Route path="docs" element={<DocsLayout />}>
                    <Route index element={<DocsOverviewPage />} />
                    <Route path="tokens" element={<DocsTokensPage />} />
                    <Route path="components" element={<DocsComponentsPage />} />
                  </Route>
                </Route>

                <Route element={<GameLaunchLayout />}>
                  <Route path="play/:gameId" element={<GameLaunchPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </PlayerAuthProvider>
      </AuthProvider>
    </PreferencesProvider>
  )
}

export default App
