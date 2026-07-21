import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'UI/Slider',
  component: Slider,
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState([50])

    return (
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Label>Volume: {value[0]}%</Label>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
        />
      </div>
    )
  },
}
