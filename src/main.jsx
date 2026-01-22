import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { ForumProvider } from './context/CommunityContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ForumProvider>
        <App />
      </ForumProvider>
    </AuthProvider>
  </StrictMode>
)
