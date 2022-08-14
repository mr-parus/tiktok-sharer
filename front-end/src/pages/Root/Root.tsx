import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from '../../components/Container/Container';
import { Loader } from '../../components/Loader/Loader';
import { useAuth } from '../../hooks/useAuth';
import { AuthPage } from '../AuthPage/AuthPage';
import { HomePage } from '../HomePage/HomePage';

const HOME_PATH = '/';
const AUTH_PATH = '/auth';
const LOADER_DELAY = 800; // in ms

export function Root() {
  const { isLoggedIn, isLoading } = useAuth({ loaderDelay: LOADER_DELAY });

  if (isLoading) {
    return <Container children={<Loader />} />;
  }

  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path={AUTH_PATH} element={isLoggedIn ? <Navigate to={HOME_PATH} replace /> : <AuthPage />} />
          <Route path={HOME_PATH} element={isLoggedIn ? <HomePage /> : <Navigate to={AUTH_PATH} replace />} />
          <Route path="*" element={<Navigate to={HOME_PATH} replace />} />
        </Routes>
      </Router>
    </div>
  );
}
