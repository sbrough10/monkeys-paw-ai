import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import FeedPage from './pages/FeedPage.jsx';
import PostPage from './pages/PostPage.jsx';
import ApprovalsPage from './pages/ApprovalsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading the loading screen…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireTeam({ children }) {
  const { user, team, loading } = useAuth();
  if (loading) return <div className="loading">Loading the loading screen…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!team) return <Navigate to="/team" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/team"
        element={
          <RequireAuth>
            <Layout>
              <TeamPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/"
        element={
          <RequireTeam>
            <Layout>
              <FeedPage />
            </Layout>
          </RequireTeam>
        }
      />
      <Route
        path="/post"
        element={
          <RequireTeam>
            <Layout>
              <PostPage />
            </Layout>
          </RequireTeam>
        }
      />
      <Route
        path="/approvals"
        element={
          <RequireTeam>
            <Layout>
              <ApprovalsPage />
            </Layout>
          </RequireTeam>
        }
      />
      <Route
        path="/notifications"
        element={
          <RequireTeam>
            <Layout>
              <NotificationsPage />
            </Layout>
          </RequireTeam>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
