import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import CreditTypes from './pages/Dashboard/creditTypes';
import Profile from './pages/cooperative';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import RoutesRegistration from './pages/Dashboard/routes.processes';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext';
import ProtectedRoute from './utils/protectedRoute.utils';
import { authInterceptor } from './hooks/useInterceptor';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  //user authenticated?
  const { authUser } = useAuthContext();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Condición para determinar si aplicar o no DefaultLayout
  const isAuthRoute = pathname === '/auth/signin';
  // const isAuthRoute = false;

  return loading ? (
    <Loader />
  ) : (
    <>
      {isAuthRoute ? (
        <>
          <Routes>
            <Route
              path="/auth/signin"
              element={
                authUser ? <Navigate to='/' /> :
                  <>
                    <PageTitle title="Signin | ChaskiPass" />
                    <SignIn />
                  </>
              }
            />
          </Routes>
          <Toaster />
        </>
      ) : (
        <DefaultLayout>
          <Routes>
            <Route
              path='/'
              element={
                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="CreditTypes Dashboard | ChaskiPass" />
                    <CreditTypes />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <>
                    <PageTitle title="Cooperativa | ChaskiPass" />
                    <Profile />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <>
                    <PageTitle title="Settings | ChaskiPass" />
                    <Settings />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <ProtectedRoute requiredRole={['admin']}>
                  <>
                    <PageTitle title="Signin | ChaskiPass" />
                    <SignUp />
                  </>
                </ProtectedRoute>
              }
            />
            {/* Added by me  */}
            <Route
              path="/processes/routes"
              element={
                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="Routes | ChaskiPass" />
                    <RoutesRegistration />
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </DefaultLayout>
      )}
    </>
  );
}

export default App;
// export default authInterceptor(App);
