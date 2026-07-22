import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Info, Bold, Italic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { GameTile } from '@/components/ui/game-tile'
import { HeroBanner } from '@/components/ui/hero-banner'
import {
  TileCarousel,
  TileCarouselItem,
} from '@/components/ui/tile-carousel'
import { Toaster, toast } from '@/components/ui/toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

export function DocsComponentsPage() {
  const { t } = useTranslation()
  const [checked, setChecked] = useState(true)
  const [radio, setRadio] = useState('slots')
  const [switched, setSwitched] = useState(true)
  const [slider, setSlider] = useState([40])
  const [selectValue, setSelectValue] = useState('slots')

  return (
    <div className="flex flex-col gap-8">
      <Toaster />
      <p className="text-sm text-foreground/75">{t('docs.components.intro')}</p>
      <p className="text-sm text-foreground/60">
        Live previews of the UI atoms. Full variants and controls also live in
        Storybook (`npm run storybook`).
      </p>

      <Section title="Button">
        <p className="text-sm text-foreground/65">{t('docs.components.button')}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </Section>

      <Separator />

      <Section title="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Section>

      <Separator />

      <Section title="Input & Textarea">
        <div className="grid max-w-md gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="docs-input">Email</Label>
            <Input id="docs-input" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="docs-textarea">Notes</Label>
            <Textarea id="docs-textarea" placeholder="Write something…" />
          </div>
        </div>
      </Section>

      <Separator />

      <Section title="Checkbox, Radio & Switch">
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={checked}
              onCheckedChange={(v) => setChecked(Boolean(v))}
            />
            Accept terms
          </label>
          <RadioGroup value={radio} onValueChange={setRadio}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="slots" id="docs-radio-slots" />
              <Label htmlFor="docs-radio-slots">Slots</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="live" id="docs-radio-live" />
              <Label htmlFor="docs-radio-live">Live</Label>
            </div>
          </RadioGroup>
          <div className="flex items-center gap-2">
            <Switch checked={switched} onCheckedChange={setSwitched} />
            <Label>Enable notifications</Label>
          </div>
        </div>
      </Section>

      <Separator />

      <Section title="Select">
        <div className="max-w-xs">
          <Select value={selectValue} onValueChange={setSelectValue}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slots">Slots</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="table">Table</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Separator />

      <Section title="Slider & Progress">
        <div className="flex max-w-sm flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Bet amount: {slider[0]}</Label>
            <Slider value={slider} onValueChange={setSlider} max={100} step={1} />
          </div>
          <Progress value={slider[0]} />
        </div>
      </Section>

      <Separator />

      <Section title="Toggle & Toggle group">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1">
            <Toggle aria-label="Bold">
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Italic" variant="outline">
              <Italic className="h-4 w-4" />
            </Toggle>
          </div>
          <ToggleGroup type="single" defaultValue="slots" variant="outline">
            <ToggleGroupItem value="slots">Slots</ToggleGroupItem>
            <ToggleGroupItem value="live">Live</ToggleGroupItem>
            <ToggleGroupItem value="table">Table</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Section>

      <Separator />

      <Section title="Tabs">
        <Tabs defaultValue="overview" className="max-w-md">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-sm text-foreground/75">
            Overview tab content.
          </TabsContent>
          <TabsContent value="tokens" className="text-sm text-foreground/75">
            Token documentation goes here.
          </TabsContent>
          <TabsContent value="api" className="text-sm text-foreground/75">
            API notes for engineers.
          </TabsContent>
        </Tabs>
      </Section>

      <Separator />

      <Section title="Alert">
        <Alert className="max-w-lg">
          <Info className="h-4 w-4" />
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>
            Inline alert for status and system messages.
          </AlertDescription>
        </Alert>
      </Section>

      <Separator />

      <Section title="Avatar & Skeleton">
        <div className="flex flex-wrap items-center gap-6">
          <Avatar>
            <AvatarImage
              src="https://api.dicebear.com/9.x/shapes/svg?seed=blixx"
              alt="User"
            />
            <AvatarFallback>BX</AvatarFallback>
          </Avatar>
          <div className="flex w-48 flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </Section>

      <Separator />

      <Section title="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Components</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      <Separator />

      <Section title="Accordion">
        <Accordion type="single" collapsible className="max-w-md">
          <AccordionItem value="a">
            <AccordionTrigger>What is Blixx DS?</AccordionTrigger>
            <AccordionContent>
              Multi-brand casino design-system POC for Lonkero, Kanuuna, and
              Fyffe.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Where is Storybook?</AccordionTrigger>
            <AccordionContent>
              Run <code className="text-xs">npm run storybook</code> →
              localhost:6006.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Separator />

      <Section title="Overlays">
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog</DialogTitle>
                <DialogDescription>
                  Modal dialog for confirmations and forms.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Alert dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button variant="destructive">Continue</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet</SheetTitle>
                <SheetDescription>
                  Slide-over panel for filters and mobile nav.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-sm">Floating popover content.</p>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="tertiary">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Deposit</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Tooltip
              </Button>
            </TooltipTrigger>
            <TooltipContent>Helpful hint</TooltipContent>
          </Tooltip>

          <Button
            variant="secondary"
            onClick={() => toast('Snack / toast from sonner')}
          >
            Toast
          </Button>
        </div>
      </Section>

      <Separator />

      <Section title="Game tile">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <GameTile gameId="docs-starburst" label="Starburst" subtitle="NetEnt" />
          <GameTile
            gameId="docs-roulette"
            label="Live Roulette"
            subtitle="Evolution"
            variant="selected"
          />
          <GameTile label="Mega Jackpot" subtitle="Coming soon" disabled />
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          {(
            [
              ['4/3', '4:3'],
              ['3/4', '3:4'],
              ['16/9', '16:9'],
              ['9/16', '9:16'],
              ['1/1', '1:1'],
            ] as const
          ).map(([aspect, label]) => (
            <div key={aspect} className="w-28">
              <p className="mb-1 text-[10px] text-foreground/55">{label}</p>
              <GameTile
                gameId={`docs-aspect-${aspect}`}
                aspect={aspect}
                label={label}
                subtitle="Aspect"
              />
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      <Section title="Hero banner">
        <HeroBanner
          size="md"
          title="Welcome bonus"
          description="Shared promo hero — gradient fallback or HubHQ banner image."
          eyebrow={<Badge variant="info">Promo</Badge>}
          actions={
            <Button size="sm" variant="primary">
              Claim
            </Button>
          }
        />
      </Section>

      <Separator />

      <Section title="Tile carousel">
        <TileCarousel title="Popular" description="Scrollable theme row">
          {['Slots', 'Live', 'Jackpots', 'New', 'Table', 'Bonus'].map(
            (label) => (
              <TileCarouselItem key={label}>
                <GameTile
                  className="w-full"
                  gameId={`docs-${label.toLowerCase()}`}
                  label={label}
                  subtitle="Demo"
                />
              </TileCarouselItem>
            ),
          )}
        </TileCarousel>
      </Section>

      <Separator />

      <Section title="Card">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-foreground/80">
            Card body using surface tokens.
          </CardContent>
        </Card>
      </Section>
    </div>
  )
}
