import { AppProvider } from "./providers/AppProvider"
import { Outlet } from "react-router-dom"
import { NavBar } from "./components/NavBar"


function App() {
 
  return (
    <>
    <AppProvider>
    <header>
    <NavBar />
    </header>
    <main>
      <Outlet />
    </main>
    </AppProvider>
    </>
  )
}

export default App
