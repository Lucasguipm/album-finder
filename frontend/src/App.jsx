import { useState } from 'react'
import './App.css'
import axios from 'axios'
import Searchbar from './components/Searchbar/Searchbar';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import Loading from './components/Loading/Loading';
import LeftPanel from './components/LeftPanel/LeftPanel';
import RightPanel from './components/RightPanel/RightPanel';

function App() {

  // === PASSO 1: CAIXINHAS DE MEMÓRIA (ESTADOS) ===
  const [searchQuery, setSearchQuery] = useState("");
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // === PASSO 2: FUNÇÃO QUE BUSCA OS DADOS NO BACKEND ===
  const fetchArtistInfo = async (e) => {
    e.preventDefault(); // Impede a página de recarregar ao submeter o formulário
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    setArtistData(null);

    try {
      // Faz a chamada para o seu servidor Flask usando o Axios
      const response = await axios.get("https://album-finder-ppd5.onrender.com/api/albums", {
        params: { artist: searchQuery }
      });

      // Salva o super JSON (bio, imagem e álbuns) no estado
      setArtistData(response.data);
    } catch (err) {
      const msgErro = err.response?.data?.error || "Erro ao conectar com o servidor.";
      setError(msgErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* === TOP BAR: Sempre visível (Seu esboço UI geral) === */}
      <Searchbar
        onSearch={fetchArtistInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      

      {/* === ÁREA DE STATUS (Avisos rápidos para o usuário) === */}
      {error && <div className="error-message">{error}</div>}

      {/* === PASSO 3: RENDERIZAÇÃO CONDICIONAL (OPERADOR TERNÁRIO) === */}
      {/* O que tá acontecendo abaixo => loading ? (<Loading />) : (artistData === null ? <WelcomeScreen /> : <Results />) */}

      {loading ? (
        /* 1. Se estiver carregando, mostra APENAS a tela de loading em tela cheia */
        <Loading />
        ) : artistData === null ? (
              /* 2. Se não estiver carregando E não houver dados, mostra a tela inicial */
              <WelcomeScreen />
            ) : (
                  /* 3. Se não estiver carregando E houver dados, mostra os resultados */
                  <div className="results-layout">
                    
                    <aside className="left-panel">
                      <LeftPanel 
                        artistImage={artistData.artist.image}
                        artistName={artistData.artist.name}
                        artistBio={artistData.artist.bio}
                      />
                    </aside>
                    
                    <main className="right-panel">
                      <RightPanel
                        dataAlbums={artistData.albums}
                      />
                    </main>

                  </div>
                )
      }
      
    </div>
  );

}

export default App
