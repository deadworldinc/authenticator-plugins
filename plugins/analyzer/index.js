export default function init(sdk) {
  const { React, Icons, plugin, ui, components, db, crypto } = sdk;
  const { Button, Progress, Item, Separator, HoverCard } = components;

  const AnalyzerContent = () => {
    const [stats, setStats] = React.useState({ score: 0, weak: [], reused: [], corrupted: [] });
    const [analyzing, setAnalyzing] = React.useState(true);

    const analyze = async () => {
      setAnalyzing(true);
      const passwords = await db.find({ type: 'password' });

      const weak = [];
      const corrupted = [];
      const map = new Map();

      passwords.forEach(p => {
        try {
          const val = crypto.decrypt(p.value);
          const missingCount = 10 - val.length;
          if (val.length < 10) {
            weak.push({
              ...p,
              reason: 'Too short',
              missingCount,
            });
          }
          if (!map.has(val)) map.set(val, []);
          map.get(val).push(p);
        } catch (e) { 
          /* corrupted */ 
            corrupted.push({
              ...p,
              reason: 'Corrupted',
            });
        }
      });

      const reused = [];
      map.forEach((items) => {
        if (items.length > 1) {
          items.forEach(item => reused.push({ ...item, reason: 'Duplicate', count: items.length }));
        }
      });

      const total = passwords.length || 1;
      const badCount = new Set([...weak, ...reused, ...corrupted].map(p => p._id)).size;
      const score = Math.max(0, Math.round(((total - badCount) / total) * 100));

      setStats({ score, weak, reused, corrupted });
      setAnalyzing(false);
    };

    const issuesCount = stats.weak.length + stats.reused.length + stats.corrupted.length;

    React.useEffect(() => { analyze(); }, []);

    const renderIssue = (item) => React.createElement(Item.Item, {
      key: item._id,
      variant: 'outline',
      className: 'dark:bg-muted/30 shadow-xs dark:shadow-none rounded-lg',
      size: 'sm'
    },
      React.createElement(Item.ItemMedia, { variant: 'icon', className: 'border-none bg-muted !p-1.5' },
        React.createElement(Icons.CircleAlertIcon, { className: 'size-4' })
      ),

      React.createElement(Item.ItemContent, { className: 'gap-0' },
        React.createElement(Item.ItemTitle, { className: 'gap-1 text-xs' },
          item.site
        ),
        React.createElement(Item.ItemDescription, { className: 'text-[11px]' },
          item.reason === 'Too short' ? [
            React.createElement('span', { key: 't' }, 'Password is short: needs '),
            React.createElement('strong', { key: 'm', className: 'font-semibold' }, item.missingCount),
            React.createElement('span', { key: 'c' }, ` more ${item.missingCount === 1 ? 'char' : 'chars'}`)
          ] : item.reason === 'Duplicate' ? [
            React.createElement('span', { key: 't' }, 'This password reused '),
            React.createElement('strong', { key: 'c', className: 'font-semibold' }, item.count),
            React.createElement('span', { key: 'ti' }, ' times'),
          ] : [
            React.createElement('span', { key: 't' }, 'This password is corrupted and cannot be read.'),
          ]
        )
      ),
    );

    return React.createElement('div', { className: 'flex flex-col h-full gap-4 min-h-0' },
      React.createElement('div', { className: 'flex flex-col gap-2 items-center shrink-0' },
        React.createElement('div', { className: 'flex flex-col gap-1 text-center' },
          React.createElement('span', { className: 'text-2xl font-bold leading-none' }, `${stats.score}%`),
          React.createElement('span', { className: 'text-sm text-muted-foreground' }, 'Security Score'),
        ),
        React.createElement(Progress, { value: stats.score, className: 'h-1.5 w-full' })
      ),

      React.createElement('div', { className: 'flex flex-col gap-2 flex-1 overflow-y-auto' },
        stats.weak.length > 0 && React.createElement(React.Fragment, null,
          React.createElement('div', { key: 'weak-passwords-separator', className: 'flex items-center gap-4 py-4' },
            React.createElement(Separator, { className: 'flex-1' }),
            React.createElement('span', { className: 'text-[11px] text-muted-foreground' }, 'Weak Passwords'),
            React.createElement(Separator, { className: 'flex-1' }),
          ),
          stats.weak.map(renderIssue)
        ),

        stats.reused.length > 0 && React.createElement(React.Fragment, null,
          React.createElement('div', { key: 'reused-passwords-separator', className: 'flex items-center gap-4 py-4' },
            React.createElement(Separator, { className: 'flex-1' }),
            React.createElement('span', { className: 'text-[11px] text-muted-foreground' }, 'Reused Passwords'),
            React.createElement(Separator, { className: 'flex-1' }),
          ),
          stats.reused.map(renderIssue),
        ),

        stats.corrupted.length > 0 && React.createElement(React.Fragment, null,
          React.createElement('div', { key: 'corrupted-passwords-separator', className: 'flex items-center gap-4 py-4' },
            React.createElement(Separator, { className: 'flex-1' }),
            React.createElement('span', { className: 'text-[11px] text-muted-foreground' }, 'Corrupted Passwords'),
            React.createElement(Separator, { className: 'flex-1' }),
          ),
          stats.corrupted.map(renderIssue),
        ),

        !analyzing && issuesCount > 0 && React.createElement('div', { className: 'shrink-0 py-4 text-center' },
          React.createElement('span', { className: 'text-xs text-muted-foreground' },
            "You need to fix ", React.createElement('strong', null, issuesCount), ` ${issuesCount === 1 ? 'issue' : 'issues'} to get 100%!`
          ),
        ),

        !analyzing && issuesCount === 0 &&
        React.createElement('div', { className: 'flex flex-col gap-2 h-full items-center justify-center' },
          React.createElement(Icons.ShieldCheck, { className: 'w-8 h-8' }),
          React.createElement('span', { className: 'text-sm font-semibold' }, "No Issues"),
          React.createElement('span', { className: 'text-sm text-muted-foreground text-center' }, 'All of your passwords', React.createElement('br'), 'are healthy. Keep it up!'),
          React.createElement(HoverCard.HoverCard, { openDelay: 10, closeDelay: 100 },
            React.createElement(HoverCard.HoverCardTrigger, { asChild: true },
              React.createElement(Button, { variant: 'link', className: 'h-6 text-sm p-0' }, "Learn More")
            ),
            React.createElement(HoverCard.HoverCardContent, { className: 'flex flex-col w-56 gap-0.5 rounded-lg p-2.5' },
              React.createElement('div', { className: 'text-xs font-semibold' }, "Security Audit"),
              React.createElement('div', { className: 'text-xs' }, "No short or reused passwords found. Keep it up!"),
              React.createElement('div', { className: 'text-muted-foreground mt-1 text-xs' },
                "Verified on " + new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: '2-digit',
                  year: 'numeric'
                })
              )
            )
          )
        )
      )
    );
  };

  plugin.registerMenuAction('passwords-screen', {
    title: 'Security Audit',
    icon: Icons.ShieldCheck,
    onClick: () => ui.openSheet(AnalyzerContent)
  });
}
