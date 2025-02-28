
import './App.css'
import NavBar from './components/Navbar'
import { Routes, Route } from "react-router-dom";
import { Dashboard } from './pages/Dashboard';
import { Ingresos } from './pages/Ingresos';

function App() {


  return (
    <>
<NavBar/>
<Routes>
    <Route path='/' element={<Dashboard/>} />
    <Route path='/ingreso' element={<Ingresos/>} />
</Routes>





    </>
  )
}

export default App
