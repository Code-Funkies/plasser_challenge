import { useEffect } from 'react';
import './App.css'
import Navbar from './components/Navbar';

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className='text-3xl font-bold underline'>Hola, somos The Funkies! :)</p>
      </div>
    </>
  )
}

export default App
