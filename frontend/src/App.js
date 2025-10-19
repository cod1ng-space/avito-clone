import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateAd from './pages/CreateAd';
import EditAd from './pages/EditAd';
import AdDetail from './pages/AdDetail';
import MyAds from './pages/MyAds';
import CategoryAds from './pages/CategoryAds';
import PrivateRoute from './components/common/PrivateRoute';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ads/:id" element={<AdDetail />} />
            <Route path="/category/:id" element={<CategoryAds />} />
            <Route path="/search" element={<Home />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/my-ads" element={
              <PrivateRoute>
                <MyAds />
              </PrivateRoute>
            } />
            <Route path="/create-ad" element={
              <PrivateRoute>
                <CreateAd />
              </PrivateRoute>
            } />
            <Route path="/edit-ad/:id" element={
              <PrivateRoute>
                <EditAd />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;