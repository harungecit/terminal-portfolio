import Terminal from './components/terminal/Terminal';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Terminal />
    </LanguageProvider>
  );
}

export default App;