import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const meta = {
  title: 'UI/Accordion',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Blixx DS?</AccordionTrigger>
        <AccordionContent>
          A multi-brand casino design-system POC for Lonkero, Kanuuna, and
          Fyffe.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I switch brands?</AccordionTrigger>
        <AccordionContent>
          Use the Storybook toolbar globals or the POC controls on the Welcome
          page.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Where are tokens documented?</AccordionTrigger>
        <AccordionContent>
          See the /docs route in the app or the UI stories in Storybook.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
