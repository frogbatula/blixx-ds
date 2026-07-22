import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, LayoutDashboard, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PocControls } from '@/components/settings/PocControls'
import { cn } from '@/lib/utils'

export function DebugMenu() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    function onPointerDown(e: MouseEvent | PointerEvent) {
      const target = e.target as Node
      if (
        panelRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div className="pointer-events-none fixed right-4 bottom-24 z-50 flex flex-col items-end gap-3 xl:bottom-6 xl:right-6">
      {open ? (
        <Card
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={t('welcome.controlsTitle')}
          className="pointer-events-auto w-[min(100vw-2rem,22rem)] shadow-lg sm:w-[28rem]"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {t('welcome.controlsTitle')}
            </CardTitle>
            <CardDescription>
              Brand · theme · light/dark · country · language
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <PocControls className="sm:grid-cols-2 lg:grid-cols-2" />
            <Separator />
            <Button asChild variant="secondary" className="w-full justify-start">
              <Link to="/docs" onClick={() => setOpen(false)}>
                <BookOpen className="size-4" />
                {t('docs.openDocs')}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/cms" onClick={() => setOpen(false)}>
                <LayoutDashboard className="size-4" />
                HubHQ
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Button
        ref={buttonRef}
        type="button"
        size="icon"
        variant="primary"
        aria-label={t('welcome.controlsTitle')}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'pointer-events-auto size-12 rounded-full shadow-lg',
          open && 'bg-primary-pressed',
        )}
      >
        <Settings className="size-5" />
      </Button>
    </div>
  )
}
