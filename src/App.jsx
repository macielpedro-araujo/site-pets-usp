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
import MeusPedidos from './pages/area/MeusPedidos.jsx'
import NovoPedido from './pages/area/NovoPedido.jsx'
import DetalhePedido from './pages/area/DetalhePedido.jsx'
import Painel from './pages/painel/Painel.jsx'
import DetalhePainel from './pages/painel/DetalhePainel.jsx'

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
        <Route path="/creditos" element={<Creditos />} />
        <Route path="/entrar" element={<Entrar />} />

        {/* Área do PET: só para contas com perfil "pet" */}
        <Route element={<RotaProtegida perfil="pet" />}>
          <Route path="/area-do-pet" element={<MeusPedidos />} />
          <Route path="/area-do-pet/novo" element={<NovoPedido />} />
          <Route path="/area-do-pet/pedidos/:id" element={<DetalhePedido />} />
        </Route>

        {/* Painel do CEPETUSP: só para contas com perfil "cepet" */}
        <Route element={<RotaProtegida perfil="cepet" />}>
          <Route path="/painel" element={<Painel />} />
          <Route path="/painel/pedidos/:id" element={<DetalhePainel />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
