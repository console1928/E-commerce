import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from 'components/Header';
import Products from 'components/Pages/Products';
import Product from 'components/Pages/Product';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product">
          <Route path=":id" element={<Product />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
