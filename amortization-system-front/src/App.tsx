import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import CreditTypes from './pages/Dashboard/creditTypes';
import Settings from './pages/banks';
import Profile from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import LoanSettings from './pages/loansSettings';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext';
import ProtectedRoute from './utils/protectedRoute.utils';
import { authInterceptor } from './hooks/useInterceptor';
import Investments from './pages/Dashboard/investments';


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
                    <PageTitle title="Sign In | DevChickenBros" />
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
                <>
                  <PageTitle title="CreditTypes | DevChickenBros" />
                  <CreditTypes />
                </>
              }
            />
            <Route
              path='/investments'
              element={
                  <>
                    <PageTitle title="Investments | DevChickenBros" />
                    <Investments />
                  </>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRole={['A']}>
                  <>
                    <PageTitle title="Settings | DevChickenBros" />
                    <Settings />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <>
                    <PageTitle title="Profile | DevChickenBros" />
                    <Profile />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <ProtectedRoute requiredRole={['A']}>
                  <>
                    <PageTitle title="Sign Up | DevChickenBros" />
                    <SignUp />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/loanSettings"
              element={
                <ProtectedRoute requiredRole={['A']}>
                  <>
                    <PageTitle title="Loan Settings | DevChickenBros" />
                    <LoanSettings />
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

// export default App;
export default authInterceptor(App);
