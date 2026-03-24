import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { FileText, Mail, Moon, Sun, Terminal, Home, FolderOpen } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (action: () => void) => {
    action();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="fixed inset-0" 
        onClick={() => setOpen(false)} 
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <Command
          className="w-full"
          shouldFilter={true}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
        >
          <div className="flex items-center px-4 py-3 border-b border-white/10">
            <Terminal className="w-5 h-5 text-white/40 mr-3" />
            <Command.Input 
              placeholder="Type a command or search..." 
              className="w-full bg-transparent border-none outline-none text-white text-base placeholder:text-white/40"
              autoFocus
            />
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
            <Command.Empty className="p-4 text-center text-sm text-white/50">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-xs text-white/40 uppercase tracking-widest font-semibold px-2 py-2">
              <Command.Item 
                onSelect={() => handleSelect(() => {
                  const el = document.getElementById('hero');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                })}
                className="flex items-center px-3 py-2.5 mt-1 rounded-lg cursor-pointer aria-selected:bg-white/10 text-white/80 aria-selected:text-white text-sm"
              >
                <Home className="w-4 h-4 mr-3" /> Go to Home
              </Command.Item>
              <Command.Item 
                onSelect={() => handleSelect(() => {
                  const el = document.getElementById('work');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                })}
                className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-white/10 text-white/80 aria-selected:text-white text-sm"
              >
                <FolderOpen className="w-4 h-4 mr-3" /> Go to Projects
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Actions" className="text-xs text-white/40 uppercase tracking-widest font-semibold px-2 py-2 border-t border-white/10 mt-1">
              <Command.Item 
                onSelect={() => handleSelect(() => window.open('/Shashwat-Upadhyay-Resume.pdf', '_blank'))}
                className="flex items-center px-3 py-2.5 mt-1 rounded-lg cursor-pointer aria-selected:bg-white/10 text-white/80 aria-selected:text-white text-sm"
              >
                <FileText className="w-4 h-4 mr-3" /> Download Resume
              </Command.Item>
              <Command.Item 
                onSelect={() => handleSelect(() => window.open('mailto:shashwatupadhyay@example.com'))}
                className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-white/10 text-white/80 aria-selected:text-white text-sm"
              >
                <Mail className="w-4 h-4 mr-3" /> Contact Me
              </Command.Item>
              <Command.Item 
                onSelect={() => handleSelect(() => {
                  const isDark = document.documentElement.classList.contains('dark');
                  localStorage.setItem('theme-mode', !isDark ? 'dark' : 'light');
                  if (!isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                  window.dispatchEvent(new Event('storage'));
                })}
                className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-white/10 text-white/80 aria-selected:text-white text-sm"
              >
                <Sun className="w-4 h-4 mr-3" /> Toggle Theme
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
