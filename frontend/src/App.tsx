import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { Home } from "@/pages/Home"
import { Workspace } from "@/pages/Workspace"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/research/:id" element={<Workspace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
