import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('a')

    return (
      <div className="flex flex-col gap-3">
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="a" id="radio-a" />
            <Label htmlFor="radio-a">Option A</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="b" id="radio-b" />
            <Label htmlFor="radio-b">Option B</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="c" id="radio-c" />
            <Label htmlFor="radio-c">Option C</Label>
          </div>
        </RadioGroup>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <RadioGroup defaultValue="b" disabled>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="a" id="radio-a-2" />
          <Label htmlFor="radio-a-2">Option A</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="b" id="radio-b-2" />
          <Label htmlFor="radio-b-2">Option B</Label>
        </div>
      </RadioGroup>
    </div>
  ),
}

