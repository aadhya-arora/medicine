import { BrowserRouter, Routes, Route } from "react-router-dom";
import Front from "./pages/front";
import Navbar from "./components/navbar";
import Guide from "./pages/guide";
import Reminder from "./pages/reminder";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Front />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/reminder" element={<Reminder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
