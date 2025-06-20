import SettingPage from '@/pages/settingPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_layout/settings')({
  component: SettingPage,
})
