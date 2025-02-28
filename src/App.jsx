
import './App.css'
import NavBar from './components/Navbar'
import { Routes, Route } from "react-router-dom";
import { Dashboard } from './pages/Dashboard';
import { Ingresos } from './pages/Ingresos';
import { Gastos } from './pages/Gastos';
import { Ajustes } from './pages/Ajustes';

function App() {


  return (
    <>
<NavBar/>
<Routes>
    <Route path='/' element={<Dashboard/>} />
    <Route path='/ingreso' element={<Ingresos/>} />
    <Route path='/gastos' element={<Gastos/>} />
    <Route path='/config' element={<Ajustes/>} />
</Routes>





    </>
  )
}

export default App
