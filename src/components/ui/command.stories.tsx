import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

const meta = {
  title: 'UI/Command',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Command className="max-w-md">
      <CommandInput placeholder="Search games…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Games">
          <CommandItem>Starburst</CommandItem>
          <CommandItem>Book of Dead</CommandItem>
          <CommandItem>Gonzo&apos;s Quest</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Categories">
          <CommandItem>Slots</CommandItem>
          <CommandItem>Live casino</CommandItem>
          <CommandItem>Jackpots</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}
