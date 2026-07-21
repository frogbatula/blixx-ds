import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const meta = {
  title: 'UI/Tabs',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('tab-a')

    return (
      <div className="flex flex-col gap-4">
        <Tabs
          value={value}
          onValueChange={setValue}
          defaultValue="tab-a"
        >
          <TabsList>
            <TabsTrigger value="tab-a">Tab A</TabsTrigger>
            <TabsTrigger value="tab-b">Tab B</TabsTrigger>
            <TabsTrigger value="tab-c">Tab C</TabsTrigger>
          </TabsList>
          <TabsContent value="tab-a">
            <div className="rounded-xl border border-border-muted bg-background-subtle p-4 text-sm text-foreground/80">
              Content for Tab A. Replace with real design-team panels.
            </div>
          </TabsContent>
          <TabsContent value="tab-b">
            <div className="rounded-xl border border-border-muted bg-background-subtle p-4 text-sm text-foreground/80">
              Content for Tab B.
            </div>
          </TabsContent>
          <TabsContent value="tab-c">
            <div className="rounded-xl border border-border-muted bg-background-subtle p-4 text-sm text-foreground/80">
              Content for Tab C.
            </div>
          </TabsContent>
        </Tabs>

        <Button
          variant="secondary"
          onClick={() => setValue((prev) => (prev === 'tab-a' ? 'tab-b' : 'tab-a'))}
        >
          Quick switch (demo)
        </Button>
      </div>
    )
  },
}

