import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import 'leaflet/dist/leaflet.css'
import './styles/index.css'
import 'react-phone-input-2/lib/style.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/carousel/styles.css'
import '@mantine/charts/styles.css'

import App from './App'
import { AuthProvider } from './Context'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <MantineProvider>
    <Notifications />

    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </MantineProvider>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}