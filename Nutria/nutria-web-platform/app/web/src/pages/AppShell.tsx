import { ReactNode, useState } from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { IconBelanja, IconHariIni, IconPrep, IconRencana } from '../components/TabIcons.js';
import { TabNavProvider, type AppTab } from '../navigation/TabNavContext.js';
import { Belanja } from './Belanja.js';
import { HariIni } from './HariIni.js';
import { Prep } from './Prep.js';
import { Rencana } from './Rencana.js';

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
      <div className="app-shell">
        <div className="top-bar">
          <button type="button" onClick={() => void logout()}>
            Keluar
          </button>
        </div>
        <main>{body}</main>

        <nav className="tabs">
          <button
            type="button"
            className="tab"
            data-active={tab === 'hari'}
            onClick={() => setTab('hari')}
          >
            <IconHariIni active={tab === 'hari'} />
            Hari ini
          </button>
          <button
            type="button"
            className="tab"
            data-active={tab === 'rencana'}
            onClick={() => setTab('rencana')}
          >
            <IconRencana active={tab === 'rencana'} />
            Rencana
          </button>
          <button
            type="button"
            className="tab"
            data-active={tab === 'belanja'}
            onClick={() => setTab('belanja')}
          >
            <IconBelanja active={tab === 'belanja'} />
            Belanja
          </button>
          <button
            type="button"
            className="tab"
            data-active={tab === 'prep'}
            onClick={() => setTab('prep')}
          >
            <IconPrep active={tab === 'prep'} />
            Prep
          </button>
        </nav>
      </div>
    </TabNavProvider>
  );
}
