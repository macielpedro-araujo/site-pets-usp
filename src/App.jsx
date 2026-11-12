import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'
import Home from './pages/Home/Home.jsx'
import TodosPets from './pages/TodosPets/TodosPets.jsx'
import PetPage from './pages/PetPage/PetPage.jsx'
import Sobre from './pages/Sobre/Sobre.jsx'
import Institucional from './pages/Institucional/Institucional.jsx'
import Entrar from './pages/Entrar/Entrar.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
import Creditos from './pages/Creditos/Creditos.jsx'
import EditarPagina from './pages/area/EditarPagina.jsx'
import Painel from './pages/painel/Painel.jsx'
import EditarPetPainel from './pages/painel/EditarPetPainel.jsx'
import Historico from './pages/painel/Historico.jsx'
import NoticiasAdmin from './pages/noticiasAdmin/NoticiasAdmin.jsx'
import EditarNoticia from './pages/noticiasAdmin/EditarNoticia.jsx'
import Noticias from './pages/Noticias/Noticias.jsx'
import Noticia from './pages/Noticias/Noticia.jsx'

// Rotas do site (SPEC §5). Todas usam o mesmo Layout (cabeçalho + rodapé).
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/todos-os-pets-da-usp" element={<TodosPets />} />
        <Route path="/pets/:slug" element={<PetPage />} />
        <Route path="/sobre-o-programa-na-usp" element={<Sobre />} />
        <Route path="/institucional" element={<Institucional />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:id" element={<Noticia />} />
        <Route path="/creditos" element={<Creditos />} />
        <Route path="/entrar" element={<Entrar />} />

        {/* Área do PET: editor da página do próprio PET */}
        <Route element={<RotaProtegida perfis={['pet']} />}>
          <Route path="/area-do-pet" element={<EditarPagina />} />
        </Route>

        {/* Painel do CEPETUSP: todos os PETs, editor e histórico */}
        <Route element={<RotaProtegida perfis={['cepet']} />}>
          <Route path="/painel" element={<Painel />} />
          <Route path="/painel/pets/:slug" element={<EditarPetPainel />} />
          <Route path="/painel/pets/:slug/historico" element={<Historico />} />
        </Route>

        {/* Notícias da Home: secretaria do PET USP e CEPETUSP */}
        <Route element={<RotaProtegida perfis={['secretaria', 'cepet']} />}>
          <Route path="/noticias-admin" element={<NoticiasAdmin />} />
          <Route path="/noticias-admin/nova" element={<EditarNoticia />} />
          <Route path="/noticias-admin/:id" element={<EditarNoticia />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
