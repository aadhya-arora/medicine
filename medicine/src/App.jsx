import { BrowserRouter, Routes, Route } from "react-router-dom";
import Front from "./pages/front";
import Navbar from "./components/navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/front" element={<Front />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
