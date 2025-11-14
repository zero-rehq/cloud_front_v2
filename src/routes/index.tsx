import { createFileRoute } from '@tanstack/react-router'
import type { TFunction } from 'i18next'
import {
  ClockAnimateIcon,
  ImageIcon,
  ScreenSizeIcon,
  TextIcon,
} from '@/components/custom-icons'

import { Badge } from '@/components/ui/badge'
import { ReferenceCopy } from '@/components/tables/GenericTableVirtuoso/components/ReferenceCopy/ReferenceCopy'
import { GenericTableVirtuoso } from '@/components/tables/GenericTableVirtuoso'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/')({
  component: HomePage,
})

type FileType = 'image' | 'video'

type Resolution = {
  width: number
  height: number
}

type FileSchema = {
  id: string // Alias for fileUid to satisfy BaseItem requirement
  fileUid: string
  name: string
  type: FileType
  resolution: Resolution
  path: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

const MOCK_FILES: Record<string, FileSchema> = {
  'file-001': {
    id: 'file-001',
    fileUid: 'file-001',
    name: 'video-promocion-verano.mp4',
    type: 'video',
    path: '/uploads/public/videos/promo-verano.mp4',
    resolution: { width: 1920, height: 1080 },
    isPublic: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  'file-002': {
    id: 'file-002',
    fileUid: 'file-002',
    name: 'banner-ofertas.jpg',
    type: 'image',
    path: '/uploads/public/images/banner-ofertas.jpg',
    resolution: { width: 1920, height: 1080 },
    isPublic: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  'file-003': {
    id: 'file-003',
    fileUid: 'file-003',
    name: 'video-corporativo.mp4',
    type: 'video',
    path: '/uploads/public/videos/corporativo.mp4',
    resolution: { width: 1920, height: 1080 },
    isPublic: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  'file-004': {
    id: 'file-004',
    fileUid: 'file-004',
    name: 'imagen-promocional.png',
    type: 'image',
    path: '/uploads/private/images/promo.png',
    resolution: { width: 1600, height: 900 },
    isPublic: false,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
  },
  'file-005': {
    id: 'file-005',
    fileUid: 'file-005',
    name: 'documento-interno.pdf',
    type: 'image',
    path: '/uploads/private/docs/interno.pdf',
    resolution: { width: 1920, height: 1080 },
    isPublic: false,
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08'),
  },
}

export const filesColumns = (t: TFunction): Array<ColumnConfig<FileSchema>> => [
  {
    key: 'fileUid',
    label: t('headers.ref', 'Referencia'),
    width: '180px',
    icon: TextIcon,
    render: (value: unknown, row: FileSchema) => (
      <ReferenceCopy value={row.fileUid} />
    ),
  },
  {
    key: 'name',
    label: t('headers.name', 'Nombre'),
    width: '300px',
    sortable: true,
    icon: TextIcon,
    grow: true,
    render: (value: unknown, row: FileSchema) => (
      <div className="truncate font-medium" title={row.name}>
        {row.name}
      </div>
    ),
  },
  {
    key: 'type',
    label: t('headers.type', 'Tipo'),
    width: '120px',
    sortable: true,
    icon: ImageIcon,
    align: 'center',
    render: (value: unknown, row: FileSchema) => {
      const typeColors = {
        image: 'bg-primary',
        video: 'bg-secondary',
      }
      return Badge({
        variant: 'default',
        className: `${typeColors[row.type]} w-1/2`,
        children: row.type === 'image' ? 'Imagen' : 'Video',
      })
    },
  },
  {
    key: 'isPublic',
    label: t('headers.visibility', 'Visibilidad'),
    width: '120px',
    sortable: true,
    icon: ImageIcon,
    align: 'center',
    render: (value: unknown, row: FileSchema) => {
      return Badge({
        variant: 'default',
        className: row.isPublic
          ? 'bg-chart-3'
          : 'bg-chart-4',
        children: row.isPublic ? 'Público' : 'Privado',
      })
    },
  },
  {
    key: 'resolution',
    label: t('headers.resolution', 'Resolución'),
    width: '150px',
    icon: ScreenSizeIcon,
    align: 'center',
    render: (value: unknown, row: FileSchema) => (
      <span className="text-sm">
        {row.resolution.width} × {row.resolution.height}
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: t('headers.created', 'Creado'),
    width: '150px',
    sortable: true,
    icon: ClockAnimateIcon,
    align: 'center',
    render: (value: unknown, row: FileSchema) => (
      <span className="text-sm">
        {row.createdAt.toLocaleDateString()}
      </span>
    ),
  },
  {
    key: 'actions',
    label: '',
    width: '60px',
    align: 'center',
    sortable: false,
  },
]

function HomePage() {
  const { t } = useTranslation('translations')

  const FILES_TABLE_COLUMNS = useMemo(() => filesColumns(t), [t])

  return (
    <div className="h-full rounded-lg">
      <GenericTableVirtuoso<FileSchema>
        data={Object.values(MOCK_FILES)}
        columns={FILES_TABLE_COLUMNS}
        selectable
      />
    </div>
  )
}
