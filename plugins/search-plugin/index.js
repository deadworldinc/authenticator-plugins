export default function init(sdk) {
    const { React, Icons, plugin, ui, components, db, crypto, utils } = sdk;
    const {
        Button,
        InputGroup,
        Spinner,
        Item,
        Separator,
    } = components;
    const { sorter } = utils;

    const GlobalSearch = () => {
        const [query, setQuery] = React.useState('');
        const [results, setResults] = React.useState({ active: [], corrupted: [] });
        const [searching, setSearching] = React.useState(false);
        const inputRef = React.useRef(null);

        const [tick, setTick] = React.useState(0);

        React.useEffect(() => {
            const interval = setInterval(() => setTick(t => t + 1), 10000);
            
            return () => {
                clearInterval(interval);
            };
        }, []);

        const performSearch = async (text) => {
            setQuery(text);
            if (text.trim().length < 1) {
                setResults({ active: [], corrupted: [] });
                return;
            }

            setSearching(true);
            try {
                const regex = new RegExp(text, 'i');
                const data = await db.find({
                    type: { $in: ["password", "totp", "token"] },
                    $or: [
                        { site: regex }, { service: regex }, { login: regex },
                        { account: regex }, { endpoint: regex }
                    ]
                });

                const allSorted = (data || []).map(doc => {
                    try {
                        const val = crypto.decrypt(doc.value);
                        return { ...doc, decryptedValue: val, isCorrupted: val === null };
                    } catch (e) {
                        return { ...doc, isCorrupted: true };
                    }
                }).sort(sorter);

                const groups = allSorted.reduce((acc, res) => {
                    res.isCorrupted ? acc.corrupted.push(res) : acc.active.push(res);
                    return acc;
                }, { active: [], corrupted: [] });

                setResults(groups);
            } finally {
                setSearching(false);
            }
        };

        const totalCount = (results.active?.length || 0) + (results.corrupted?.length || 0);

        const getMeta = (item) => {
            const config = {
                password: { icon: Icons.LockIcon, title: item.site, sub: item.login },
                totp: { icon: Icons.ClockIcon, title: item.service, sub: item.account },
                token: { icon: Icons.KeyRoundIcon, title: item.service, sub: item.endpoint }
            };
            return config[item.type] || { icon: Icons.File, title: 'Unknown', sub: '' };
        };

        const renderItem = (res) => {
            const meta = getMeta(res);
            const isCorrupted = !!res.isCorrupted;

            return React.createElement(Item.Item, {
                key: res._id,
                variant: 'outline',
                className: `dark:bg-muted/30 shadow-xs dark:shadow-none rounded-lg gap-2 ${!!isCorrupted && 'opacity-50'}`,
                size: 'sm',
            },
                React.createElement(Item.ItemMedia, { variant: 'icon', className: 'border-none bg-muted !p-1.5' },
                    React.createElement(!isCorrupted ? meta.icon : Icons.CircleAlertIcon, { className: 'size-4' })
                ),

                React.createElement(Item.ItemContent, { className: 'gap-0' },
                    !isCorrupted && React.createElement(Item.ItemTitle, { className: 'gap-1 text-xs' },
                        meta.title
                    ),
                    React.createElement(Item.ItemDescription, { className: `text-[11px] ${isCorrupted && 'pt-1'}` }, !isCorrupted ? meta.sub : ['Value for ', React.createElement('strong', { key: `title-${res._id}`}, meta.title), ' is corrupted'])
                ),

                React.createElement(Item.ItemActions, null,
                    React.createElement(Button, {
                        variant: 'outline',
                        disabled: !!isCorrupted,
                        className: 'h-7 text-xs p-2',
                        onClick: (e) => {
                            e.stopPropagation();
                            try {
                                let valueToCopy = res.decryptedValue;

                                if (res.type === 'totp') {
                                    const totpData = sdk.utils.getTOTP(res.decryptedValue);
                                    
                                    valueToCopy = typeof totpData === 'object' ? totpData.token : totpData;
                                }

                                window.navigator.clipboard.writeText(String(valueToCopy));
                                ui.notify(`Value for ${meta.title} has been copied to clipboard!`);
                            } catch (err) {
                                ui.notify('Copy Error', 'error');
                                console.error("TOTP Error:", err);
                            }
                        }
                    }, "Copy")
                )
            );
        }

        return React.createElement('div', { className: 'flex flex-col flex-1 min-h-0 gap-4' },

            React.createElement(InputGroup.InputGroup, { className: 'shrink-0' },
                React.createElement(InputGroup.InputGroupAddon, null,
                    searching
                        ? React.createElement(Spinner, { className: 'size-4' })
                        : React.createElement(Icons.Search, { className: 'size-4' })
                ),
                React.createElement(InputGroup.InputGroupInput, {
                    ref: inputRef,
                    placeholder: 'Search everywhere...',
                    value: query,
                    onChange: (e) => performSearch(e.target.value),
                    className: 'border-none focus-visible:ring-0 shadow-none'
                }),
                React.createElement(InputGroup.InputGroupAddon, { align: 'inline-end' },
                    `${totalCount} ${totalCount === 1 ? 'result' : 'results'}`
                )
            ),

            React.createElement('div', { className: 'flex-1 min-h-0 overflow-y-auto' },
                totalCount === 0 ? (
                    React.createElement('div', { className: 'flex flex-col h-full gap-2 items-center justify-center text-muted-foreground rounded-lg' },
                        React.createElement(query.length > 0 ? Icons.FrownIcon : Icons.SparklesIcon, { className: 'size-6' }),
                        React.createElement('p', { className: 'text-sm' }, query.length > 0 ? "Nothing found" : "Start typing to search...")
                    )
                ) : (
                    React.createElement('div', { className: 'flex flex-col gap-3' },
                        results.active.map(res => renderItem(res)),
                        results.corrupted.length > 0 && React.createElement(React.Fragment, { key: 'corrupted-section' },
                            React.createElement('div', { key: 'sep', className: 'flex items-center gap-4 py-2' },
                                React.createElement(Separator, { className: 'flex-1' }),
                                React.createElement('span', { className: 'text-[11px] text-muted-foreground' }, 'Corrupted Items'),
                                React.createElement(Separator, { className: 'flex-1' }),
                            ),
                            results.corrupted.map(res => renderItem(res))
                        )
                    )
                )
            )
        );
    };

    const action = {
        title: 'Global Search',
        icon: Icons.Search,
        onClick: () => ui.openSheet(GlobalSearch)
    };

    plugin.registerMenuAction('passwords-screen', action);
    plugin.registerMenuAction('totp-screen', action);
    plugin.registerMenuAction('tokens-screen', action);
}
