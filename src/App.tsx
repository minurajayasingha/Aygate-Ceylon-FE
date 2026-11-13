import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { PageTransition } from './components/layout/PageTransition'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { QualityPage } from './pages/QualityPage'
import { ExportPage } from './pages/ExportPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AccountPage } from './pages/account/AccountPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { SearchOverlay } from './components/shop/SearchOverlay'
import { CartDrawer } from './components/shop/CartDrawer'

export default function App() {
  return (
    <>
    <PageTransition>
      {(location) => (
        <Routes location={location}>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="quality" element={<QualityPage />} />
            <Route path="export-services" element={<ExportPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>
          <Route path="design-system" element={<DesignSystemPage />} />
        </Routes>
      )}
    </PageTransition>
    {/* Rendered once, outside the page layers, so they survive page changes. */}
    <SearchOverlay />
    <CartDrawer />
    </>
  )
}
