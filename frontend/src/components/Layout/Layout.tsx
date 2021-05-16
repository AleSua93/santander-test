import React from 'react';
import Navbar from '../Navbar/Navbar';

const Layout =({children}: LayoutProps) =>{
  return(
    <>
      <div>
        <Navbar />
      </div>
      <main className="h-screen bg-gray-200">{children}</main>
    </>
  )
}

type LayoutProps = {
  children: JSX.Element,
};

export default Layout;