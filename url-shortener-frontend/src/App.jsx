import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import RedirectPage from "./Components/RedirectPage/RedirectPage";
import ShortenUrl from "./Components/ShortenUrl/ShortenUrl";
import UrlsList from "./Components/UrlsList/UrlsList";


function App() {
  
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UrlsList />} />
                <Route path="/shorten" element={<ShortenUrl />} />
                <Route path="/redirect/:code" element={<RedirectPage />} />
            </Routes>
        </Router>
    );
}

export default App;
