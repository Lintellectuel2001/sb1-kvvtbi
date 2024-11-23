import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initDB } from './lib/db';
import { SampleForm } from './components/SampleForm';
import { SamplesList } from './components/SamplesList';
import { Beaker } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [isDBReady, setIsDBReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const init = async () => {
      try {
        await initDB();
        setIsDBReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'initialisation');
        console.error('Database initialization error:', err);
      }
    };
    init();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 max-w-md mx-auto p-6">
          <p className="text-xl font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Rafraîchir la page
          </button>
        </div>
      </div>
    );
  }

  if (!isDBReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initialisation de la base de données...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Beaker className="w-8 h-8 text-blue-600" />
              Laboratoire de Béton
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <SampleForm 
              onSuccess={() => queryClient.invalidateQueries({ queryKey: ['samples'] })}
            />
            <SamplesList />
          </div>
        </main>

        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500">
              © {new Date().getFullYear()} Laboratoire de Béton. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;