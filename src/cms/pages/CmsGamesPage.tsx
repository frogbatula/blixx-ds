import { useCallback, useState } from 'react'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import { useCmsStore } from '@/cms/CmsProvider'
import { saveDraft } from '@/cms/lib/storage'
import {
  GAME_CATEGORIES,
  GAME_CATEGORY_LABELS,
  type GameItem,
  type GameCategory,
} from '@/cms/lib/types'
import { AssetPicker } from '@/cms/components/AssetPicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

type GameFormData = {
  name: string
  provider: string
  categories: GameCategory[]
  tileAssetId?: string
  tileUrl?: string
  active: boolean
}

const emptyForm: GameFormData = {
  name: '',
  provider: '',
  categories: [],
  tileAssetId: undefined,
  tileUrl: undefined,
  active: true,
}

function GameForm({
  data,
  onChange,
}: {
  data: GameFormData
  onChange: (data: GameFormData) => void
}) {
  const toggleCategory = (cat: GameCategory) => {
    const has = data.categories.includes(cat)
    onChange({
      ...data,
      categories: has
        ? data.categories.filter((c) => c !== cat)
        : [...data.categories, cat],
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="game-name">Game name *</Label>
          <Input
            id="game-name"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="Starburst"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="game-provider">Provider</Label>
          <Input
            id="game-provider"
            value={data.provider}
            onChange={(e) => onChange({ ...data, provider: e.target.value })}
            placeholder="NetEnt"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Categories</Label>
        <div className="flex flex-wrap gap-2">
          {GAME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                data.categories.includes(cat)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border-muted hover:bg-background-subtle',
              )}
            >
              {GAME_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Game tile image</Label>
        <AssetPicker
          kind="game-tile"
          value={data.tileAssetId}
          onChange={(assetId, url) =>
            onChange({ ...data, tileAssetId: assetId, tileUrl: url })
          }
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="game-active"
          checked={data.active}
          onCheckedChange={(checked) => onChange({ ...data, active: checked })}
        />
        <Label htmlFor="game-active">Active (visible on site)</Label>
      </div>
    </div>
  )
}

function GameListItem({
  game,
  tileUrl,
  onEdit,
  onDelete,
}: {
  game: GameItem
  tileUrl?: string
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-muted bg-card p-3">
      <GripVertical className="size-4 shrink-0 cursor-grab text-foreground/30" />
      {tileUrl ? (
        <img
          src={tileUrl}
          alt={game.name}
          className="size-14 shrink-0 rounded-lg object-cover bg-background-subtle"
        />
      ) : (
        <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-background-subtle text-xs text-foreground/40">
          No tile
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{game.name}</p>
          {!game.active && <Badge variant="outline">Inactive</Badge>}
        </div>
        {game.provider && (
          <p className="text-sm text-foreground/55">{game.provider}</p>
        )}
        {game.categories.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {game.categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-[10px]">
                {GAME_CATEGORY_LABELS[cat]}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Edit game"
          onClick={onEdit}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Delete game"
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function CmsGamesPage() {
  const { doc, setDoc } = useCmsStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<GameFormData>(emptyForm)
  const [status, setStatus] = useState<string | null>(null)

  const games = doc.games ?? []

  const persist = useCallback(
    (next: typeof doc) => {
      setDoc(next)
      saveDraft(next)
    },
    [setDoc],
  )

  const resolveUrl = (game: GameItem): string | undefined => {
    if (game.tileUrl) return game.tileUrl
    if (game.tileAssetId) {
      const asset = doc.assets?.find((a) => a.id === game.tileAssetId)
      return asset?.url
    }
    return undefined
  }

  const openNew = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (game: GameItem) => {
    setEditingId(game.id)
    setFormData({
      name: game.name,
      provider: game.provider ?? '',
      categories: [...game.categories],
      tileAssetId: game.tileAssetId,
      tileUrl: game.tileUrl,
      active: game.active,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) return

    const now = new Date().toISOString()

    if (editingId) {
      const updated = games.map((g) =>
        g.id === editingId
          ? {
              ...g,
              name: formData.name.trim(),
              slug: slugify(formData.name),
              provider: formData.provider.trim() || undefined,
              categories: formData.categories,
              tileAssetId: formData.tileAssetId,
              tileUrl: formData.tileUrl,
              active: formData.active,
              updatedAt: now,
            }
          : g,
      )
      persist({ ...doc, games: updated })
      setStatus('Game updated.')
    } else {
      const newGame: GameItem = {
        id: crypto.randomUUID(),
        slug: slugify(formData.name),
        name: formData.name.trim(),
        provider: formData.provider.trim() || undefined,
        categories: formData.categories,
        tileAssetId: formData.tileAssetId,
        tileUrl: formData.tileUrl,
        active: formData.active,
        order: games.length,
        createdAt: now,
        updatedAt: now,
      }
      persist({ ...doc, games: [...games, newGame] })
      setStatus('Game added.')
    }

    setDialogOpen(false)
    setFormData(emptyForm)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    persist({ ...doc, games: games.filter((g) => g.id !== id) })
    setStatus('Game deleted.')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Games</h1>
          <p className="mt-1 text-sm text-foreground/70">
            Manage the game catalog. Assign categories, providers, and tile
            images.
          </p>
        </div>
        <Button type="button" onClick={openNew}>
          <Plus className="size-4" />
          Add game
        </Button>
      </div>

      {status && (
        <p className="rounded-xl border border-border-muted bg-background-subtle px-3 py-2 text-xs text-foreground/75">
          {status}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Game catalog ({games.length})
          </CardTitle>
          <CardDescription>
            Games appear in carousels based on their assigned categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {games.length === 0 ? (
            <p className="text-sm text-foreground/60">
              No games yet. Click "Add game" to create one.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {games.map((game) => (
                <GameListItem
                  key={game.id}
                  game={game}
                  tileUrl={resolveUrl(game)}
                  onEdit={() => openEdit(game)}
                  onDelete={() => handleDelete(game.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit game' : 'Add game'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update game details and save.'
                : 'Fill in the details and add to the catalog.'}
            </DialogDescription>
          </DialogHeader>
          <GameForm data={formData} onChange={setFormData} />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!formData.name.trim()}
            >
              {editingId ? 'Save changes' : 'Add game'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
