import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Front from "./pages/front";
import Guide from "./pages/guide";
import Reminder from "./pages/reminder";
import Auth from "./pages/auth";
import Navbar from "./components/navbar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route
          element={
            <>
              <Navbar />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={<Front />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/reminder" element={<Reminder />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
