import * as React from 'react'
import { Link } from '@tanstack/react-router'
import {
  BadgeCheck,
  Bell,
  Check,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  Languages,
  LogOut,
  Moon,
  Plus,
  Sparkles,
  Sun,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/animate-ui/components/radix/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTheme } from '@/hooks/use-theme'
import { useLanguage } from '@/hooks/use-language'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n'
import {
  GROUPED_MENU,
  TEAMS,
  USER_DATA,
  CURRENT_USER_ROLE,
  ICON_MAP,
  type Team,
  type MenuItem,
} from './navigation.constants'

// Helper para verificar si el usuario tiene acceso según roles
function hasAccess(allowedRoles: number[], userRole: number): boolean {
  return allowedRoles.includes(userRole)
}

export function AppSidebar() {
  const isMobile = useIsMobile()
  const { theme, toggleTheme } = useTheme()
  const { currentLanguage, setLanguage } = useLanguage()
  const { t } = useTranslation()
  const [activeTeam, setActiveTeam] = React.useState<Team>(TEAMS[0])
  const userRole = CURRENT_USER_ROLE

  // Filtrar menú según roles del usuario
  const filteredMenu = React.useMemo(() => {
    return Object.entries(GROUPED_MENU).reduce(
      (acc, [groupKey, group]) => {
        const filteredItems = group.items.filter((item) =>
          hasAccess(item.role, userRole),
        )

        if (filteredItems.length > 0) {
          acc[groupKey] = {
            ...group,
            items: filteredItems,
          }
        }

        return acc
      },
      {} as typeof GROUPED_MENU,
    )
  }, [userRole])

  // Renderizar un item del menú (link o accordion)
  const renderMenuItem = (item: MenuItem) => {
    const Icon = ICON_MAP[item.icon]
    const translatedLabel = t(`navigation.${item.key}`, item.key)

    // Si es un link simple
    if (item.type === 'link' && item.path) {
      return (
        <SidebarMenuItem key={item.key}>
          <SidebarMenuButton asChild tooltip={translatedLabel}>
            <Link to={item.path}>
              {Icon && <Icon />}
              <span>{translatedLabel}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

    // Si es un accordion con sub-items
    if (item.type === 'accordion' && item.options) {
      const filteredOptions = item.options.filter((option) =>
        hasAccess(option.role, userRole),
      )

      if (filteredOptions.length === 0) return null

      return (
        <Collapsible
          key={item.key}
          asChild
          defaultOpen={false}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={translatedLabel}>
                {Icon && <Icon />}
                <span>{translatedLabel}</span>
                <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {filteredOptions.map((option) => {
                  const OptionIcon = ICON_MAP[option.icon]
                  const translatedOptionLabel = t(
                    `navigation.${option.key}`,
                    option.key,
                  )
                  return (
                    <SidebarMenuSubItem key={option.key}>
                      <SidebarMenuSubButton asChild>
                        <Link to={option.path || '#'}>
                          {OptionIcon && <OptionIcon className="size-4" />}
                          <span>{translatedOptionLabel}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      )
    }

    return null
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* Team Switcher */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <activeTeam.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-xs">{activeTeam.plan}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side={isMobile ? 'bottom' : 'right'}
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Teams
                </DropdownMenuLabel>
                {TEAMS.map((team, index) => (
                  <DropdownMenuItem
                    key={team.name}
                    onClick={() => setActiveTeam(team)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <team.logo className="size-4 shrink-0" />
                    </div>
                    {team.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    {t('user.addTeam')}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Renderizar grupos de menú filtrados por rol */}
        {Object.entries(filteredMenu).map(([groupKey, group]) => (
          <SidebarGroup key={groupKey}>
            <SidebarGroupLabel>
              {t(`navigation.${group.label}`, group.label)}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => renderMenuItem(item))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {/* User Menu */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={USER_DATA.avatar} alt={USER_DATA.name} />
                    <AvatarFallback className="rounded-lg">
                      {USER_DATA.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {USER_DATA.name}
                    </span>
                    <span className="truncate text-xs">{USER_DATA.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={USER_DATA.avatar}
                        alt={USER_DATA.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {USER_DATA.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {USER_DATA.name}
                      </span>
                      <span className="truncate text-xs">
                        {USER_DATA.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    {t('user.upgradeToPro')}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    {t('user.account')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    {t('user.billing')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    {t('user.notifications')}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Languages />
                      {t('language.select')}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48">
                      {Object.entries(SUPPORTED_LANGUAGES).map(
                        ([code, { name, flag }]) => (
                          <DropdownMenuItem
                            key={code}
                            onClick={() =>
                              setLanguage(code as SupportedLanguage)
                            }
                            className="gap-2"
                          >
                            <span className="text-lg">{flag}</span>
                            <span>{name}</span>
                            {currentLanguage === code && (
                              <Check className="ml-auto size-4" />
                            )}
                          </DropdownMenuItem>
                        ),
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === 'dark' ? (
                      <>
                        <Sun />
                        {t('theme.light')}
                      </>
                    ) : (
                      <>
                        <Moon />
                        {t('theme.dark')}
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  {t('common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
