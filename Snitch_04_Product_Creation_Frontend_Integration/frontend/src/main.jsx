
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './app/App.css';
import { Provider } from 'react-redux'
import { store } from './app/app.store'
import { RouterProvider } from 'react-router'
import routes from './app/app.routes'

// Global Theme Initialization
const savedTheme = localStorage.getItem('snitch-theme') || 'dark';
document.documentElement.classList.add(savedTheme);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={routes}>
      <App />
    </RouterProvider>
  </Provider>
)
