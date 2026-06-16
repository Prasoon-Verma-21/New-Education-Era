import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { ForumProvider } from './context/CommunityContext.jsx';
import {ThemeProvider} from "./context/ThemeContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ForumProvider>
          <ThemeProvider>
        <App />
          </ThemeProvider>
      </ForumProvider>
    </AuthProvider>
  </StrictMode>
)
