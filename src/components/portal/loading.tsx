export function PortalLoading() {
 return <main className="portal-loading" aria-busy="true" aria-label="Loading university workspace"><div role="status"><strong>Wada university portal</strong><p>Loading your workspace…</p></div><div className="portal-loading-grid" aria-hidden="true">{[0,1,2,3].map(item => <div key={item}/>)}</div></main>;
}
