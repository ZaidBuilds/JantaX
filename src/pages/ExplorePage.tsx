import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, SearchX } from 'lucide-react';
import { PageHeader, ModuleIcon, MODULE_GROUPS, getModule, moduleHref, EmptyState, type ModuleInfo } from '../ui';
import { usePin } from '../core/context/PinContext';

function ModuleCard({ m, pin }: { m: ModuleInfo; pin: string }) {
  return (
    <Link to={moduleHref(m.id, pin)} className="card card-link module-card">
      <div className="module-card-top">
        <ModuleIcon id={m.id} />
        <ArrowRight size={16} className="module-card-arrow" aria-hidden="true" />
      </div>
      <h3 className="module-card-title">{m.shortName}</h3>
      <p className="module-card-hi" lang="hi">{m.hindi}</p>
      <p className="module-card-text">{m.summary}</p>
      <p className="module-card-source">{m.dataSource}</p>
    </Link>
  );
}

export function ExplorePage() {
  const { selectedPin } = usePin();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const group = params.get('group') || 'all';

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return MODULE_GROUPS.filter((g) => group === 'all' || g.id === group)
      .map((g) => ({
        ...g,
        items: g.modules
          .map((id) => getModule(id))
          .filter((m): m is ModuleInfo => !!m)
          .filter((m) =>
            !needle ||
            [m.shortName, m.nameEnglish, m.hindi, m.summary, m.dataSource].join(' ').toLowerCase().includes(needle)
          ),
      }))
      .filter((g) => g.items.length > 0);
  }, [q, group]);

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Explore' }]}
        title="Explore public records"
        lede="Eighteen modules built around three questions: what services reach my area, where did the money go, and who is accountable."
      />

      <div className="explore-toolbar">
        <div className="input-group" style={{ flex: '1 1 280px', maxWidth: 420 }}>
          <Search size={16} aria-hidden="true" />
          <input
            className="input"
            type="search"
            placeholder="Filter modules, e.g. ration, RTI, court"
            aria-label="Filter modules"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="cluster" role="group" aria-label="Filter by theme">
          {[{ id: 'all', title: 'All' }, ...MODULE_GROUPS].map((g) => (
            <button
              key={g.id}
              type="button"
              className="chip"
              aria-pressed={group === g.id}
              onClick={() => setParams(g.id === 'all' ? {} : { group: g.id }, { replace: true })}
            >
              {g.title}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="card">
          <EmptyState icon={SearchX} title="No module matches that" text="Try a broader word like school, water or court." action={<button type="button" className="btn btn-secondary" onClick={() => setQ('')}>Clear filter</button>} />
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.id} className="section" aria-labelledby={`grp-${g.id}`}>
            <div className="section-head">
              <div>
                <h2 id={`grp-${g.id}`} className="section-title">{g.title}</h2>
                <p className="section-sub">{g.description}</p>
              </div>
            </div>
            <div className="grid-3">
              {g.items.map((m) => (
                <ModuleCard key={m.id} m={m} pin={selectedPin} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
