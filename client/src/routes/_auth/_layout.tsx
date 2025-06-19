import NavBar from '@/components/NavBar'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout')({
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  return (
    <div className='w-screen h-screen relative'>
      <NavBar />
      <Outlet />
    </div>
  )
}