import React from 'react'
import ReactDOM from 'react-dom/client'
import { Footer } from './components/footer/footer'
import './index.css'
import {AppRoutes} from './routes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppRoutes />
    <Footer></Footer>
  </React.StrictMode>
)
