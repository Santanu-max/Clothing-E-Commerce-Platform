import React, { useContext } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Registration from './pages/Registration'
import Home from './pages/Home'
import Login from './pages/Login'
import Nav from './components/Nav'
import { userDataContext } from './context/UserContext'

import About from './pages/About'
import Collections from './pages/Collections'
import Product from './pages/Product'
import Contact from './pages/Contact'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Order'
import TrackOrder from './pages/TrackOrder'
import Profile from './pages/Profile'

import { ToastContainer } from 'react-toastify'
import NotFound from './pages/NotFound'
import Ai from './components/Ai'

function App() {
  let { userData } = useContext(userDataContext)
  let location = useLocation()

  return (
    <>
      <ToastContainer />

      {userData && <Nav />}

      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={
            userData
              ? <Navigate to={location.state?.from || "/"} />
              : <Login />
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            userData
              ? <Navigate to={location.state?.from || "/"} />
              : <Registration />
          }
        />

        {/* Home */}
        <Route
          path="/"
          element={
            userData
              ? <Home />
              : <Navigate to="/login" state={{ from: location.pathname }} />
          }
        />

        {/* About */}
        <Route
          path="/about"
          element={
            userData
              ? <About />
              : <Navigate to="/login" state={{ from: location.pathname }} />
          }
        />

        {/* Collections */}
        <Route
          path="/collections"
          element={
            userData
              ? <Collections />
              : <Navigate to="/login" state={{ from: location.pathname }} />
          }
        />

        {/* Products */}
        <Route
          path="/product"
          element={
            userData
              ? <Product />
              : <Navigate to="/login" state={{ from: location.pathname }} />
          }
        />

        {/* Contact */}
        <Route
          path="/contact"
          element={
            userData
              ? <Contact />
              : <Navigate to="/login" state={{ from: location.pathname }} />
          }
        />

        {/* Product Details */}
        <Route
          path="/productdetail/:productId"
          element={
            userData
              ? <ProductDetail />
              : <Navigate to="/login" state={{ from: location.pathname }} />
          }
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            userData
              ? <Cart />
              : <Navigate to="/login" state={{ from: location.pathname }} />
          }
        />

        {/* Place Order */}
        <Route
          path="/placeorder"
          element={
            userData
              ? <PlaceOrder />
              : <Navigate to="/login" state={{ from: location.pathname }} />
          }
        />

        {/* Orders */}
        <Route
          path="/order"
          element={
            userData
              ? <Order />
              : <Navigate to="/login" state={{ from: location.pathname }} />
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            userData
              ? <Profile />
              : <Navigate to="/login" state={{ from: location.pathname }} />
          }
        />

        {/* Track Order */}
        <Route
          path="/track-order/:orderId"
          element={
            userData
              ? <TrackOrder />
              : <Navigate to="/login" state={{ from: location.pathname }} />
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      <Ai />
    </>
  )
}

export default App