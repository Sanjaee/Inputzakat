import { BrowserRouter, Routes, Route } from "react-router-dom";
import InputZakat from "./InputZakat";
import DeleteZakat from "./DeleteZakat";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputZakat />} />
        <Route path="/delete" element={<DeleteZakat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
