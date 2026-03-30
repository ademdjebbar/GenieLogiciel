import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { 
  Plus, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  BarChart3,
  BrainCircuit,
} from "lucide-react"
import { useModalStore } from "@/store/useModalStore"

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, openTaskModal } = useModalStore()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen(!isCommandPaletteOpen)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isCommandPaletteOpen, setCommandPaletteOpen])

  const handleClose = (open: boolean) => {
    setCommandPaletteOpen(open)
  }

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={handleClose}>
      <CommandInput placeholder="Tapez une commande ou recherchez..." />
      <CommandList className="bg-white border-t border-[#cdb4db]/15">
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <CommandGroup heading="Actions Rapides">
          <CommandItem className="hover:bg-[#ffc8dd]/10 cursor-pointer" onSelect={() => { openTaskModal(); setCommandPaletteOpen(false); }}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nouvelle Tâche</span>
          </CommandItem>
          <CommandItem className="hover:bg-[#ffc8dd]/10 cursor-pointer" onSelect={() => { window.location.href = '/ai'; }}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Prioriser avec l'IA</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator className="bg-[#ffc8dd]/10" />
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => { window.location.href = '/'; setCommandPaletteOpen(false); }}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => { window.location.href = '/tasks'; setCommandPaletteOpen(false); }}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <span>Mes Tâches</span>
          </CommandItem>
          <CommandItem onSelect={() => { window.location.href = '/calendar'; setCommandPaletteOpen(false); }}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendrier</span>
          </CommandItem>
          <CommandItem onSelect={() => { window.location.href = '/ai'; setCommandPaletteOpen(false); }}>
            <BrainCircuit className="mr-2 h-4 w-4" />
            <span>IA Studio</span>
          </CommandItem>
          <CommandItem onSelect={() => { window.location.href = '/stats'; setCommandPaletteOpen(false); }}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Analytique</span>
          </CommandItem>
          <CommandItem onSelect={() => { window.location.href = '/settings'; setCommandPaletteOpen(false); }}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
