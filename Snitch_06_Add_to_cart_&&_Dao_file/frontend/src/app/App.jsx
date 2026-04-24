import React, { useEffect } from 'react'
import AppLayout from './AppLayout'
import { useAuth } from '../features/auth/hooks/useAuth'

const App = () => {
  const { handleGetMe } = useAuth();
  useEffect(() => {
    handleGetMe();
  }, []);
  return (
    <AppLayout />
  )
}

export default App