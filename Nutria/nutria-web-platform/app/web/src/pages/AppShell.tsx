import { ReactNode, useState } from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { NutriaMark } from '../components/NutriaMark.js';
import { IconBelanja, IconHariIni, IconPrep, IconRencana } from '../components/TabIcons.js';
import { TabNavProvider, type AppTab } from '../navigation/TabNavContext.js';
import { Belanja } from './Belanja.js';
import { HariIni } from './HariIni.js';
import { Prep } from './Prep.js';
import { Rencana } from './Rencana.js';

const TAB_COPY: Record<AppTab, string> = {
  hari: 'Hari ini',
  rencana: 'Rencana',
  belanja: 'Belanja',
  prep: 'Prep',
};

export function AppShell() {
  const { logout } = useAuth();
  const [tab, setTab] = useState<AppTab>('hari');

  let body: ReactNode;
  if (tab === 'hari') body = <HariIni />;
  else if (tab === 'rencana') body = <Rencana />;
  else if (tab === 'belanja') body = <Belanja />;
  else body = <Prep />;

  return (
    <TabNavProvider goToTab={setTab}>
      <div className="app-shell app-shell--v2" data-active-tab={tab}>
        <header className="app-masthead" role="banner">
          <div className="app-masthead__left">
            <NutriaMark className="app-masthead__mark" />
            <div>
              <p className="app-masthead__name">Nutria</p>
              <p className="app-masthead__tagline" aria-hidden>
                Makan · Rencana · Stok
              </p>
            </div>
          </div>
          <button type="button" className="app-masthead__logout" onClick={() => void logout()}>
            Keluar
          </button>
        </header>
        <main key={tab} className="tab-panel" id="main" aria-label={TAB_COPY[tab]}>
          {body}
        </main>

        <nav className="tabs tabs--v2" aria-label="Navigasi utama">
          <div className="tabs__inner">
            <button
              type="button"
              className="tab"
              data-active={tab === 'hari'}
              onClick={() => setTab('hari')}
            >
              <IconHariIni active={tab === 'hari'} />
              <span className="tab__label">Hari ini</span>
            </button>
            <button
              type="button"
              className="tab"
              data-active={tab === 'rencana'}
              onClick={() => setTab('rencana')}
            >
              <IconRencana active={tab === 'rencana'} />
              <span className="tab__label">Rencana</span>
            </button>
            <button
              type="button"
              className="tab"
              data-active={tab === 'belanja'}
              onClick={() => setTab('belanja')}
            >
              <IconBelanja active={tab === 'belanja'} />
              <span className="tab__label">Belanja</span>
            </button>
            <button
              type="button"
              className="tab"
              data-active={tab === 'prep'}
              onClick={() => setTab('prep')}
            >
              <IconPrep active={tab === 'prep'} />
              <span className="tab__label">Prep</span>
            </button>
          </div>
        </nav>
      </div>
    </TabNavProvider>
  );
}
