import { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Terminal from './components/Terminal';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onLoadComplete={() => setLoading(false)} />}
      {!loading && <Terminal />}
    </>
  );
}

export default App;
