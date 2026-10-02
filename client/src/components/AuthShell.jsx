// import Brand from './Brand';
// import { priorityStripe } from './Badges';

// const SAMPLES = [
//   { title: 'Invoice shows the wrong amount', priority: 'High', status: 'In Progress' },
//   { title: 'Cannot reset my password', priority: 'Medium', status: 'Open' },
//   { title: 'How do I export my data?', priority: 'Low', status: 'Resolved' },
// ];

// export default function AuthShell({ title, subtitle, children, footer }) {
//   return (
//     <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
//       <aside className="hidden flex-col justify-between bg-ink p-12 text-white lg:flex">
//         <Brand light />
//         <div>
//           <h2 className="max-w-md text-4xl font-bold leading-tight">Every request, tracked until it's resolved.</h2>
//           <p className="mt-4 max-w-sm text-white/70">
//             Raise a ticket, follow its progress, and close it out. Admins see the whole queue at a glance.
//           </p>
//           <ul className="mt-10 max-w-md space-y-3" aria-hidden="true">
//             {SAMPLES.map((s) => (
//               <li key={s.title} className={`flex items-center justify-between rounded-lg border-l-4 bg-white/5 px-4 py-3 ${priorityStripe[s.priority]}`}>
//                 <span className="text-sm">{s.title}</span>
//                 <span className="text-xs text-white/60">{s.status}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <p className="text-sm text-white/50">Support tickets, without the clutter.</p>
//       </aside>

//       <main className="flex flex-col justify-center px-5 py-10 sm:px-12">
//         <div className="mx-auto w-full max-w-md">
//           <div className="mb-8 lg:hidden">
//             <Brand />
//           </div>
//           <h1 className="text-3xl font-bold">{title}</h1>
//           <p className="mt-2 text-ink-soft">{subtitle}</p>
//           <div className="mt-8">{children}</div>
//           <p className="mt-6 text-sm text-ink-soft">{footer}</p>
//         </div>
//       </main>
//     </div>
//   );
// }


import Brand from './Brand';
import { priorityStripe } from './Badges';

const SAMPLES = [
  { title: 'Invoice shows the wrong amount', priority: 'High', status: 'In Progress', meta: 'Billing · 2h ago' },
  { title: 'Cannot reset my password', priority: 'Medium', status: 'Open', meta: 'Account · 18m ago' },
  { title: 'How do I export my data?', priority: 'Low', status: 'Resolved', meta: 'Help · Yesterday' },
];

// Status pill / timeline dot colours
const STATUS_COLOR = {
  'In Progress': '#f59e0b',
  Open: '#94a3b8',
  Resolved: '#2dd4bf',
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&display=swap');

.dw-display { font-family: 'Bricolage Grotesque', inherit, system-ui, sans-serif; letter-spacing: -0.025em; }

@keyframes dw-rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes dw-drift {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50%      { transform: translate3d(24px, -18px, 0); }
}
.dw-ticket { opacity: 0; animation: dw-rise .6s cubic-bezier(.2,.7,.2,1) forwards; }
.dw-glow   { animation: dw-drift 14s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .dw-ticket { animation: none; opacity: 1; }
  .dw-glow   { animation: none; }
}
`;

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <style>{css}</style>

      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        {/* Decorative background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="dw-glow absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(45,212,191,.28), transparent 65%)' }}
          />
          <div
            className="dw-glow absolute -bottom-32 right-0 h-[380px] w-[380px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(32,113,106,.45), transparent 65%)', animationDelay: '-6s' }}
          />
          <div
            className="absolute inset-0 opacity-[.35]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,.18) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
              WebkitMaskImage: 'radial-gradient(ellipse at 30% 55%, #000 10%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse at 30% 55%, #000 10%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(94,234,212,.35), transparent)' }}
          />
        </div>

        <div className="relative">
          <Brand light />
        </div>

        <div className="relative">
          <h2 className="dw-display max-w-md text-[44px] font-bold leading-[1.08]">
            Every request, tracked until it's resolved.
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-white/70">
            Raise a ticket, follow its progress, and close it out. Admins see the whole queue at a glance.
          </p>

          <ul className="relative mt-10 max-w-md space-y-3.5 pl-5" aria-hidden="true">
            {/* Timeline line */}
            <span
              className="absolute bottom-6 left-0 top-6 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(245,158,11,.7), rgba(45,212,191,.7))' }}
            />
            {SAMPLES.map((s, i) => {
              const color = STATUS_COLOR[s.status];
              return (
                <li
                  key={s.title}
                  className={`dw-ticket relative flex items-center justify-between rounded-xl border-l-4 px-4 py-3.5 ring-1 ring-white/[.07] backdrop-blur-sm ${priorityStripe[s.priority]}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,.075), rgba(255,255,255,.025))',
                    boxShadow: '0 18px 40px -18px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.06)',
                    animationDelay: `${0.15 + i * 0.14}s`,
                  }}
                >
                  {/* Timeline dot */}
                  <span
                    className="absolute -left-[26px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ring-4 ring-ink"
                    style={{ background: color }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium">{s.title}</p>
                    <p className="mt-0.5 text-xs text-white/50">{s.meta}</p>
                  </div>
                  <span
                    className="ml-4 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ color, background: `${color}1f`, boxShadow: `inset 0 0 0 1px ${color}40` }}
                  >
                    {s.status}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative text-sm text-white/50">Support tickets, without the clutter.</p>
      </aside>

      <main className="flex flex-col justify-center px-5 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <h1 className="dw-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-sm text-ink-soft">{footer}</p>
        </div>
      </main>
    </div>
  );
}