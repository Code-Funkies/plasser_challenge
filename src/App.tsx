import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Report from './components/Report';

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

      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>
    </>
  )
}

export default App
