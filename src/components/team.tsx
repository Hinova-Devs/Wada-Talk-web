const team=[
  {img:'chancellor',name:'Prof. Dr. Mohamed Faarax',role:'Chancellor'},
  {img:'academic-advisor',name:'Mr. Oj. Onyango',role:'Academic Advisor'},
  {img:'ceo',name:'Maslah Mohamed Ali',role:'Chief Executive Officer (CEO)'},
  {img:'cto',name:'Faarax Abdishakur Daahir',role:'Chief Technology Officer (CTO)'},
  {img:'coo',name:'Muse Abdisalan Daahir',role:'Chief Operating Officer (COO)'},
  {img:'cmo',name:'',role:'Chief Marketing Officer (CMO)'},
  {img:'head-of-learning',name:'Abdirizaq Haryale Mumin',role:'Head of Learning'},
];

export function Team(){
  return <section className="team" aria-labelledby="team-title">
    <h2 id="team-title">Our team</h2>
    <div className="team-grid">
      {team.map(m=><figure key={m.img} className="team-card">
        <img src={`/team/${m.img}.webp`} width={640} height={800} alt={m.name?`${m.name}, ${m.role}`:m.role} loading="lazy"/>
        <figcaption>{m.name&&<strong>{m.name}</strong>}<span>{m.role}</span></figcaption>
      </figure>)}
    </div>
  </section>;
}
