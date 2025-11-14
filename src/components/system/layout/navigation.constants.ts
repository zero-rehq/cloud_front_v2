import {
  AudioWaveform,
  BarChart3,
  Building2,
  Command,
  FileText,
  GalleryVerticalEnd,
  Home,
  ImageIcon,
  LayoutList,
  ListChecks,
  Monitor,
  Package,
  Settings,
  Shield,
  ShoppingCart,
  Tag,
  Users,
  type LucideIcon,
} from 'lucide-react'

// Tipos para el sistema de navegación
export type IconName = string

export interface MenuItem {
  key: string
  type: 'link' | 'accordion'
  path?: string
  icon: IconName
  role: Array<number>
  options?: Array<MenuItem>
}

export interface MenuGroup {
  label: string
  items: Array<MenuItem>
}

export interface GroupedMenu {
  [key: string]: MenuGroup
}

export interface Team {
  name: string
  logo: LucideIcon
  plan: string
}

export interface User {
  name: string
  email: string
  avatar: string
}

// Mapeo de nombres de iconos a componentes de Lucide
export const ICON_MAP: Record<IconName, LucideIcon> = {
  homeIcon: Home,
  adminIcon: Shield,
  analyticsIcon: BarChart3,
  articlesIcon: Package,
  promotionsIcon: Tag,
  ListAltOutlinedIcon: ListChecks,
  shoppingCarIcon: ShoppingCart,
  tagsIcon: Tag,
  catalogsIcon: FileText,
  playlistsIcon: LayoutList,
  listIcon: LayoutList,
  touchIcon: Monitor,
  sensorIcon: Monitor,
  homeMaxIcon: Monitor,
  devicesIcon: Monitor,
  companiesIcon: Building2,
  localsIcon: Building2,
  usersIcon: Users,
  consoleIcon: FileText,
  versionIcon: Settings,
  managementIcon: Settings,
  multimediaIcon: ImageIcon,
}

// Menú agrupado con roles
export const GROUPED_MENU: GroupedMenu = {
  dashboard: {
    label: 'dashboard',
    items: [
      {
        key: 'home',
        type: 'link',
        path: '/',
        icon: 'homeIcon',
        role: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
      {
        key: 'admin',
        type: 'link',
        path: '/admin',
        icon: 'adminIcon',
        role: [1, 2],
      },
    ],
  },
  productManagement: {
    label: 'productManagement',
    items: [
      {
        key: 'articles',
        type: 'link',
        path: '/articles',
        icon: 'articlesIcon',
        role: [1, 2, 3, 4, 8],
      },
      {
        key: 'promotions',
        type: 'link',
        path: '/promotions',
        icon: 'promotionsIcon',
        role: [1, 2, 3, 4, 8],
      },
      {
        key: 'list',
        type: 'link',
        path: '/list',
        icon: 'ListAltOutlinedIcon',
        role: [1, 2, 3, 4, 8],
      },
      {
        key: 'tags',
        type: 'link',
        path: '/tags',
        icon: 'tagsIcon',
        role: [1, 2, 3, 4, 8],
      },
    ],
  },
  deviceManagement: {
    label: 'deviceManagement',
    items: [
      {
        key: 'touch',
        path: '/devices/touch',
        type: 'link',
        icon: 'touchIcon',
        role: [1, 2, 3, 4, 8],
      },
      {
        key: 'catalog',
        type: 'link',
        path: '/catalog',
        icon: 'catalogsIcon',
        role: [1, 2, 3, 4],
      },
      {
        key: 'playlists',
        type: 'link',
        path: '/playlists',
        icon: 'playlistsIcon',
        role: [1, 2],
      },
    ],
  },
  admin: {
    label: 'admin',
    items: [
      {
        key: 'companies',
        type: 'link',
        path: '/companies',
        icon: 'companiesIcon',
        role: [1, 2, 3, 4, 8],
      },
      {
        key: 'locals',
        type: 'link',
        path: '/locals',
        icon: 'localsIcon',
        role: [1, 2, 3, 4, 8],
      },
      {
        key: 'users',
        type: 'link',
        path: '/users',
        icon: 'usersIcon',
        role: [1, 2, 3, 4, 8],
      },
    ],
  },
  management: {
    label: 'management',
    items: [
      {
            key: 'logs',
            type: 'link',
            path: '/logs',
            icon: 'consoleIcon',
            role: [1, 2],
          },
          {
            key: 'antenna-logs',
            type: 'link',
            path: '/antenna-logs',
            icon: 'consoleIcon',
            role: [1, 2],
          },
          {
            key: 'versions',
            type: 'link',
            path: '/versions',
            icon: 'versionIcon',
            role: [1, 2],
          },
    ],
  },
  media: {
    label: 'media',
    items: [
      {
        key: 'multimedia',
        type: 'link',
        path: '/gallery',
        icon: 'multimediaIcon',
        role: [1, 2, 9],
      },
    ],
  },
}

// Teams disponibles
export const TEAMS: Array<Team> = [
  {
    name: 'Acme Inc',
    logo: GalleryVerticalEnd,
    plan: 'Enterprise',
  },
  {
    name: 'Acme Corp.',
    logo: AudioWaveform,
    plan: 'Startup',
  },
  {
    name: 'Evil Corp.',
    logo: Command,
    plan: 'Free',
  },
]

// Usuario actual
export const USER_DATA: User = {
  name: 'Skyleen',
  email: 'skyleen@example.com',
  avatar:
    'https://pbs.twimg.com/profile_images/1909615404789506048/MTqvRsjo_400x400.jpg',
}

// Role actual del usuario (esto debería venir de tu sistema de autenticación)
export const CURRENT_USER_ROLE = 1 // Cambiar según el usuario logueado
