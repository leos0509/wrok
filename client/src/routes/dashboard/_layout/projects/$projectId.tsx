import ProjectIdPage from '@/pages/projectIdPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_layout/projects/$projectId')({
  component: ProjectIdPage,
})
