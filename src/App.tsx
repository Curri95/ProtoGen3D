/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Technologies from './components/Technologies';
import Process from './components/Process';
import Projects from './components/Projects';
import Company from './components/Company';
import ClientPortal from './components/ClientPortal';
import QuoteSection from './components/QuoteSection';
import Footer from './components/Footer';
import TechChatWidget from './components/TechChatWidget';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Technologies />
          <Process />
          <Projects />
          <Company />
          <ClientPortal />
          <QuoteSection />
        </main>
        <Footer />
        <TechChatWidget />
      </div>
    </AuthProvider>
  );
}
