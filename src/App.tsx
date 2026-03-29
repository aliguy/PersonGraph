import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { NewScanPage } from './pages/NewScanPage';
import { ScansPage } from './pages/ScansPage';
import { ScanDetailPage } from './pages/ScanDetailPage';
import { AdminPage } from './pages/AdminPage';
import { ApiKeysPage } from './pages/ApiKeysPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<NewScanPage />} />
          <Route path="/scans" element={<ScansPage />} />
          <Route path="/scans/:id" element={<ScanDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/keys" element={<ApiKeysPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
