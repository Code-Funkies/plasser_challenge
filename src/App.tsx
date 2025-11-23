import { useEffect } from 'react';
import './App.css'
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

async function loadPreline() {
  return import('preline/dist/index.js');
}

function App() {
  useEffect(() => {
    const initPreline = async () => {
      await loadPreline();

      if (
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === 'function'
      ) {
        window.HSStaticMethods.autoInit();
      }
    };

    initPreline();
  }, []);

  const handleLoginClick = () => {
    console.log('Login clicked');
    // Add your login logic here
  };

  return (
    <>
      <Navbar
        brandName="The Funkies"
        brandHref="/"
        onLoginClick={handleLoginClick}
      />
      <Dashboard />
    </>
  )
}

export default App
