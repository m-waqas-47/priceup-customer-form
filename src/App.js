import logo from "./logo.svg";
import "./App.css";
import EstimateFormPage from "./EstimateFormPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SubmitMessage from "./EstimateFormPage/SubmitMessage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<EstimateFormPage />} />
          <Route path="/submit-successful" element={<SubmitMessage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
