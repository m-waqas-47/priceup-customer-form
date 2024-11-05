import "./App.css";
import EstimateFormPage from "./EstimateFormPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SubmitMessage from "./EstimateFormPage/SubmitMessage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<EstimateFormPage />} />
            <Route path="/submit-successful" element={<SubmitMessage />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </div>
  );
}

export default App;
