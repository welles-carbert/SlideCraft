import Layout from "./Layout.jsx";

import Generator from "./Generator";

import Projects from "./Projects";

import ImproveDeck from "./ImproveDeck";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Generator: Generator,
    
    Projects: Projects,
    
    ImproveDeck: ImproveDeck,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Generator />} />
                
                
                <Route path="/Generator" element={<Generator />} />
                
                <Route path="/Projects" element={<Projects />} />
                
                <Route path="/ImproveDeck" element={<ImproveDeck />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}