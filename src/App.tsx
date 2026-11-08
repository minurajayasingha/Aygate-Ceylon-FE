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

export default function App() {
  return (
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
          </Route>
          <Route path="design-system" element={<DesignSystemPage />} />
        </Routes>
      )}
    </PageTransition>
  )
}
