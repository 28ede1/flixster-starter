import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    {/* Hooks all the routing stuff */}
    <BrowserRouter>
    {/* This links together the App component that controls everything. */}
      <App />
    </BrowserRouter>


  </React.StrictMode>,
)
