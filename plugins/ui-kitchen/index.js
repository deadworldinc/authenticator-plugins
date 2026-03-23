export default function init(sdk) {
  const { React, Icons, plugin, ui, components, utils } = sdk;
  const {
    Label,
    Button,
    ButtonGroup,
    InputGroup,
    Select,
    Spinner,
    Combobox,
    Switch,
    Checkbox,
    RadioGroup,
    Toggle,
    Badge,
    Kbd,
    Progress,
    Skeleton,
    Slider,
    Tooltip,
    Popover,
    HoverCard,
    DropdownMenu,
    Tabs,
    Card,
  } = components;

  const { cn } = utils;

  const screens = [
    "Passwords",
    "Codes",
    "Tokens",
    "Settings",
  ];

  const KitchenContent = () => {
    const [toggleChecked, setToggleChecked] = React.useState(false);

    return React.createElement('div', { className: 'flex flex-col gap-4 overflow-y-auto' },

      React.createElement('div', { className: 'flex flex-col gap-2' },
        React.createElement(Label, null, 'Buttons'),
        React.createElement('div', { className: 'flex flex-row gap-1.5 flex-wrap p-4 border-2 border-dashed rounded-lg' },
          React.createElement(Button, null, 'Primary'),
          React.createElement(Button, { variant: 'secondary' }, 'Secondary'),
          React.createElement(Button, { variant: 'outline' }, 'Outline'),
          React.createElement(Button, { variant: 'outline', size: 'icon' },
            React.createElement(Icons.CogIcon, { className: 'h-4 w-4' })
          ),
          React.createElement(Button, { variant: 'outline', disabled: true, }, 'Disabled'),
          React.createElement(Button, { variant: 'ghost' }, 'Ghost'),
          React.createElement(Button, { variant: 'destructive' }, 'Destructive'),
          React.createElement(Button, { variant: 'link' }, 'Link'),
          React.createElement(Button, { variant: 'outline' },
            React.createElement(Icons.GitFork, { className: 'h-4 w-4' }), 'With Icon'),
          React.createElement(Button, { variant: 'outline' },
            React.createElement(Spinner, { className: 'h-4 w-4' }),
            'Spinner'
          ),
          React.createElement(ButtonGroup.ButtonGroup, null,
            React.createElement(Button, { variant: "outline" },
              React.createElement(Icons.ArrowLeftIcon, { className: 'h-4 w-4' })
            ),
            React.createElement(Button, { variant: "outline" },
              React.createElement(Icons.ArrowRightIcon, { className: 'h-4 w-4' })
            )
          )
        ),
      ),

      React.createElement('div', { className: 'flex flex-col gap-2' },
        React.createElement(Label, null, 'Inputs'),
        React.createElement('div', { className: 'flex flex-row gap-4 flex-wrap p-4 border-2 border-dashed rounded-lg' },
          React.createElement('div', { className: 'flex flex-col gap-2 w-full' },
            React.createElement(Label, null, 'Select'),
            React.createElement(Select.Select, null,
              React.createElement(Select.SelectTrigger, { className: 'w-full' },
                React.createElement(Select.SelectValue, { placeholder: "Select a plugin" })
              ),
              React.createElement(Select.SelectContent, {
              },
                React.createElement(Select.SelectGroup, null,
                  React.createElement(Select.SelectLabel, null, "Plugins"),
                  React.createElement(Select.SelectItem, { value: "search" }, "Search Plugin"),
                  React.createElement(Select.SelectItem, { value: "import" }, "Import Plugin"),
                  React.createElement(Select.SelectItem, { value: "export" }, "Export Plugin"),
                  React.createElement(Select.SelectItem, { value: "backup" }, "Backup Plugin"),
                  React.createElement(Select.SelectItem, { value: "background" }, "Background Plugin"),
                )
              )
            ),
          ),
          React.createElement('div', { className: 'flex flex-col gap-2' },
            React.createElement(Label, { htmlFor: 'input-group' }, 'Input Group'),
            React.createElement(InputGroup.InputGroup, null,
              React.createElement(InputGroup.InputGroupAddon, null,
                "https://webstray.com/"
              ),
              React.createElement(InputGroup.InputGroupInput, { placeholder: "authenticator", className: '!pl-0', id: 'input-group' }),
            )
          ),
          React.createElement('div', { className: 'flex flex-col gap-2 w-full' },
            React.createElement(Label, { htmlFor: 'combobox' }, 'Combobox'),
            React.createElement('div', { className: 'w-full' },
              React.createElement(Combobox.Combobox, {
                items: screens,
              },
                React.createElement(Combobox.ComboboxInput, {
                  placeholder: "Select a screen",
                  id: 'combobox',
                  showClear: true,
                }),

                React.createElement(Combobox.ComboboxContent, {
                  style: {
                    zIndex: 9999,
                    pointerEvents: 'auto',
                    position: 'relative'
                  },
                  onPointerDown: (e) => e.preventDefault(),
                },
                  React.createElement(Combobox.ComboboxEmpty, null, "No items found."),
                  React.createElement(Combobox.ComboboxList, null,
                    (item) => React.createElement(
                      Combobox.ComboboxItem, { key: item, value: item, className: 'cursor-pointer' }, item
                    )
                  )
                )
              )
            )
          )
        ),
      ),

      React.createElement('div', { className: 'flex flex-col gap-2' },
        React.createElement(Label, null, 'Toggles & Selectors'),
        React.createElement('div', { className: 'flex flex-row gap-4 flex-wrap p-4 border-2 border-dashed rounded-lg items-center' },
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement(Switch, { id: 'sw-1' }),
            React.createElement(Label, { htmlFor: 'sw-1' }, 'Switch')
          ),
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement(Checkbox, { id: 'ch-1' }),
            React.createElement(Label, { htmlFor: 'ch-1' }, 'Checkbox')
          ),
          React.createElement(RadioGroup.RadioGroup, { defaultValue: '1', className: 'flex gap-4' },
            React.createElement('div', { className: 'flex items-center gap-1.5' },
              React.createElement(RadioGroup.RadioGroupItem, { value: '1', id: 'r1' }),
              React.createElement(Label, { htmlFor: 'r1' }, 'Radio 1')
            ),
            React.createElement('div', { className: 'flex items-center gap-1.5' },
              React.createElement(RadioGroup.RadioGroupItem, { value: '2', id: 'r2' }),
              React.createElement(Label, { htmlFor: 'r2' }, 'Radio 2')
            ),
            React.createElement('div', { className: 'flex items-center gap-1.5' },
              React.createElement(RadioGroup.RadioGroupItem, { value: '3', id: 'r3' }),
              React.createElement(Label, { htmlFor: 'r3' }, 'Radio 3')
            )
          ),
          React.createElement(Toggle, { variant: 'outline', onPressedChange: (pressed) => setToggleChecked(pressed), },
            React.createElement(Icons.Bookmark, { className: cn("w-4 h-4", toggleChecked ? 'fill-foreground' : '') }),
            'Toggle'
          ),
        )
      ),

      React.createElement('div', { className: 'flex flex-col gap-2' },
        React.createElement(Label, null, 'Feedback & Status'),
        React.createElement('div', { className: 'flex flex-col gap-4 p-4 border-2 border-dashed rounded-lg' },
          React.createElement('div', { className: 'flex flex-col gap-2' },
            React.createElement(Label, null, 'Badges'),
            React.createElement('div', { className: 'flex flex-wrap gap-1.5 items-center' },
              React.createElement(Badge, null, 'Primary'),
              React.createElement(Badge, { variant: 'secondary' }, 'Secondary'),
              React.createElement(Badge, { variant: 'destructive' }, 'Destructive'),
              React.createElement(Badge, { variant: 'outline' }, 'Outline'),
            ),
          ),
          React.createElement('div', { className: 'flex flex-col gap-2' },
            React.createElement(Label, null, 'Progress'),
            React.createElement(Progress, { value: 75, className: 'w-full' }),
          ),
          React.createElement('div', { className: 'flex flex-col gap-2' },
            React.createElement(Label, null, 'Kbd'),
            React.createElement('div', { className: 'flex flex-wrap gap-1.5 items-center' },
              React.createElement('div', { className: 'flex flex-row gap-1.5 items-center' },
                React.createElement(Kbd.Kbd, { className: 'font-mono' }, 'Ctrl'),
                React.createElement(Kbd.Kbd, { className: 'font-mono' }, 'Alt'),
                React.createElement(Kbd.Kbd, { className: 'font-mono' }, 'Shift'),
                React.createElement(Kbd.Kbd, { className: 'font-mono' }, 
                  React.createElement(Icons.CornerDownLeft, { className: 'h-4 w-4' })
                ),
                React.createElement(Kbd.Kbd, { className: 'font-mono w-20' }, 'Space'),
                React.createElement(Kbd.Kbd, { className: 'font-mono' }, 'C'),
                React.createElement(Kbd.Kbd, { className: 'font-mono' }, 'V'),
                React.createElement(Kbd.Kbd, { className: 'font-mono' }, 'X'),
              )
            ),
          ),
          React.createElement('div', { className: 'flex flex-col gap-2' },
            React.createElement(Label, null, 'Skeleton'),
            React.createElement(Skeleton, { className: 'h-4 w-full' }),
          ),
        )
      ),

      React.createElement('div', { className: 'flex flex-col gap-2' },
        React.createElement(Label, null, 'Complex components & Overlays'),
        React.createElement('div', { className: 'flex flex-row gap-4 flex-wrap p-4 border-2 border-dashed rounded-lg items-center' },
          React.createElement('div', { className: 'flex flex-col gap-2 w-full' },
            React.createElement(Label, null, 'Slider'),
            React.createElement(Slider, { defaultValue: [50], max: 100, step: 1 })
          ),
          React.createElement('div', { className: 'flex flex-col gap-2' },
            React.createElement(Label, null, 'Overlays'),
            React.createElement('div', { className: 'flex flex-row gap-1.5 flex-wrap' },
              React.createElement(Tooltip.TooltipProvider, null,
                React.createElement(Tooltip.Tooltip, null,
                  React.createElement(Tooltip.TooltipTrigger, { asChild: true },
                    React.createElement(Button, { variant: 'outline' }, 'Tooltip')
                  ),
                  React.createElement(Tooltip.TooltipContent, null, 'This is a tooltip!')
                )
              ),
              React.createElement(Popover.Popover, null,
                React.createElement(Popover.PopoverTrigger, { asChild: true },
                  React.createElement(Button, { variant: 'outline' }, 'Popover')
                ),
                React.createElement(Popover.PopoverContent, { align: 'start', className: 'w-fit p-2' },
                  React.createElement('div', { className: 'flex flex-col w-40 gap-0.5' },
                    React.createElement('div', { className: 'text-xs font-semibold' }, "WebStray Authenticator"),
                    React.createElement('div', { className: 'text-xs' }, "This is a short text inside a popover component."),
                    React.createElement('div', { className: 'text-muted-foreground text-xs' },
                      "Created by WebStray"
                    )
                  )
                )
              ),
              React.createElement(HoverCard.HoverCard, { openDelay: 10, closeDelay: 100 },
                React.createElement(HoverCard.HoverCardTrigger, { asChild: true },
                  React.createElement(Button, { variant: 'outline' }, 'Hover Card')
                ),
                React.createElement(HoverCard.HoverCardContent, { className: 'flex flex-col w-56 gap-0.5 rounded-lg p-2.5' },
                  React.createElement('div', { className: 'text-xs font-semibold' }, "WebStray Authenticator"),
                  React.createElement('div', { className: 'text-xs' }, "This is a short text inside a hover card component."),
                  React.createElement('div', { className: 'text-muted-foreground text-xs' },
                    "Created by WebStray"
                  )
                )
              ),
              React.createElement(DropdownMenu.DropdownMenu, null,
                React.createElement(DropdownMenu.DropdownMenuTrigger, { asChild: true },
                  React.createElement(Button, { variant: 'outline' }, 'Menu')
                ),
                React.createElement(DropdownMenu.DropdownMenuContent, { align: 'end' },
                  React.createElement(DropdownMenu.DropdownMenuGroup, null,
                    React.createElement(DropdownMenu.DropdownMenuLabel, null, 'Plugins'),
                    React.createElement(DropdownMenu.DropdownMenuItem, null, 'Search'),
                    React.createElement(DropdownMenu.DropdownMenuItem, null, 'Import'),
                    React.createElement(DropdownMenu.DropdownMenuItem, null, 'Export')
                  )
                )
              )
            )
          ),
        )
      ),

      React.createElement('div', { className: 'flex flex-col gap-2' },
        React.createElement(Label, null, 'Layout & Navigation'),
        React.createElement('div', { className: 'flex flex-col gap-4 p-4 border-2 border-dashed rounded-lg' },
          React.createElement('div', { className: 'flex flex-col gap-2' },
            React.createElement(Label, null, 'Tabs'),
            React.createElement(Tabs.Tabs, { defaultValue: 'import', className: 'w-full' },
              React.createElement(Tabs.TabsList, { variant: 'line', className: 'w-full' },
                React.createElement(Tabs.TabsTrigger, { value: 'import' }, 'Import'),
                React.createElement(Tabs.TabsTrigger, { value: 'export' }, 'Export'),
                React.createElement(Tabs.TabsTrigger, { value: 'add' }, 'Add'),
                React.createElement(Tabs.TabsTrigger, { value: 'edit' }, 'Edit'),
                React.createElement(Tabs.TabsTrigger, { value: 'delete' }, 'Delete'),
              )
            ),
          ),
          React.createElement(Card.Card, { className: 'gap-1 py-3' },
            React.createElement(Card.CardTitle, { className: 'text-sm px-3' }, 'Card example'),
            React.createElement(Card.CardDescription, { className: 'text-sm px-3' }, 'Here you can see list of your passwords'),
            React.createElement(Card.CardContent, null, 
              React.createElement('div', { className: 'flex flex-row justify-center items-center gap-1.5 text-muted-foreground py-10 animate-pulse' },
                React.createElement(Icons.SearchIcon, { className: 'size-4' }),
                React.createElement('p', { className: 'text-sm' }, "Searching for passwords...")
              )
            ),
            React.createElement(Card.CardFooter, { className: 'gap-1 justify-end p-3' }, 
              React.createElement(Button, { variant: 'outline' }, 'Close'),
              React.createElement(Button, null, 'Save'),
            )
          )
        )
      )
    )
  };

  const action = {
      title: 'UI Kitchen Pro',
      icon: Icons.Search,
      onClick: () => ui.openSheet(KitchenContent)
  };

  plugin.registerMenuAction('passwords-screen', action);
  plugin.registerMenuAction('totp-screen', action);
  plugin.registerMenuAction('tokens-screen', action);
}