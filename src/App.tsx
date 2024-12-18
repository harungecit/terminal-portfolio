import React from 'react';
import Terminal from './components/terminal/Terminal';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';

const App: React.FC = () => {
  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
            <LanguageProvider>
              <Terminal />
            </LanguageProvider>
        </main>
        <Footer />
    </div>
  );
}

export default App;