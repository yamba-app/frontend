import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { adminRoutes, authRoutes, pagesRoutes } from './constants/routes.constans';
import { PageLoadingSpinner } from './components/Spinner.components';
import PrivateRoute from './core/keys/protected.key';
import Profiles from './features/Profiles';
import ForbiddenPage from './pages/Forbiden';
import BusinessPublish from './features/BusinessPublish';
import Dashboard from './features/dashboard';
import EditBusiness from './features/EditBusiness';
import AdminBusinessViewPage from './features/ViewBusiness';
import MessagesPage from './features/Messages';

// Lazy load components for better performance
const PageLayout = lazy(() => import('./pages/Layout.pages'));
const HomePage = lazy(() => import('./pages/Home.pages').then(module => ({ default: module.HomePage })));
const AboutPage = lazy(() => import('./pages/About.pages').then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./pages/Contact.pages').then(module => ({ default: module.ContactPage })));
const BusinessDetailPage = lazy(() => import('./pages/BusinessDetails.pages').then(module => ({ default: module.BusinessDetailPage })));
const LoginPage = lazy(() => import('./auth/Login.auth'));
const NotFoundPage = lazy(() => import('./pages/PagesNotFound.pages'));
const BusinessFormPage = lazy(() => import('./pages/bussiness.pages'));
// Optimized PrivateRoute wrapper to reduce repetition
const withPrivateRoute = (Component, roles = ['admin']) => (
  <PrivateRoute element={<Component />} allowedRoles={roles} />
)
function App() {
  return (
    <Suspense fallback={<PageLoadingSpinner title="Chargement..."  variant={"page"}/>}>
      <Routes>
        {/* Main routes with layout */}
        <Route path="/" element={<PageLayout />}>
          <Route index element={<HomePage />} />
          <Route path={pagesRoutes.about} element={<AboutPage />} />
          <Route path={pagesRoutes.contact} element={<ContactPage />} />
          <Route path={pagesRoutes.businessDetails} element={<BusinessDetailPage />} />
          <Route path={pagesRoutes.addBusiness} element={<BusinessFormPage />} />
          <Route path={adminRoutes.profiles} element={withPrivateRoute(Profiles)} />
          <Route path={adminRoutes.businesses} element={withPrivateRoute(BusinessPublish)} />
          <Route path={adminRoutes.dashboard} element={withPrivateRoute(Dashboard)} />
          <Route path={adminRoutes.editBusiness} element={withPrivateRoute(EditBusiness)} />
          <Route path={adminRoutes.viewBusiness} element={withPrivateRoute(AdminBusinessViewPage)} />
          <Route path={adminRoutes.messages} element={withPrivateRoute(MessagesPage)} />


        </Route>
        
        {/* Authentication route */}
        <Route path={authRoutes.signIn} element={<LoginPage />} />
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;