import React from 'react';
import Navbar from './Navbar.jsx';
import BossBattle from './BossBattle.jsx';

function BossBattlePage() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar activeId="boss-battle" />
      <BossBattle />
      <footer className="footer">
        <p className="footer-line1">-`♡´- Fansite Project made by RollzyBunny</p>
        <p className="footer-line2">Original Content &amp; Artist © by Independent Artist Management (iAM).</p>
      </footer>
    </div>
  );
}

export default BossBattlePage;
