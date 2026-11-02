import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import ScrollManager from './ScrollManager';

export default function Layout() {
  return (
    <div className="layout">
      <ScrollManager />
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}