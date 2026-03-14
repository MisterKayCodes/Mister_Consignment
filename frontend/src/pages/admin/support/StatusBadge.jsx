export const STATUS_STYLES = {
  Pending:   { badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  Resolving: { badge: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500'   },
  Resolved:  { badge: 'bg-green-100 text-green-700',  dot: 'bg-green-500'  },
  Open:      { badge: 'bg-green-100 text-green-700',  dot: 'bg-green-500'  },
  Closed:    { badge: 'bg-zinc-100 text-zinc-500',    dot: 'bg-zinc-400'   },
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${style.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
