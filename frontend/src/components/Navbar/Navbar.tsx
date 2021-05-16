import React, { useState, useRef } from "react";
import { Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import santander from "../../imgs/san-logo.png";

const Navbar =() =>{
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  return(
    <>
      <nav className="bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/">
                  <img className="h-8 w-8" src={santander} alt="Santander logo" />
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-5 flex items-baseline space-x-4">
                  <Link to="/" className="text-santander-red hover:bg-santander-red hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                  <Link to="/admin" className="text-santander-red hover:bg-santander-red hover:text-white px-3 py-2 rounded-md text-sm font-medium">Admin</Link>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-white inline-flex items-center
                justify-center p-2 rounded-md
                text-santander-red"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
              </button>
            </div>
          </div>
        </div>
        
        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden" id="mobile-menu">
            <div ref={mobileMenuRef} className="bg-santander-red px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="text-white hover:bg-red-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <Link to="/admin" className="text-white hover:bg-red-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Admin</Link>
            </div>
          </div>
        </Transition>
      </nav>
    </>
  )
}

export default Navbar;