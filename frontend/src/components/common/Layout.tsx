import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="container"> {/* Added container class for content padding */}
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;