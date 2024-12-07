import React from 'react'
import Dashboard from './page'
import DashboardNavigation from '@/components/DashboardNavigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { CircleUser, Menu, MenuIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from 'next/navigation'


type Props = {

    children: React.ReactNode
}

async function DashboardLayout({ children}: Props) {
    const { getUser} = getKindeServerSession()

    const user = await getUser()

    if(!user){

        return redirect('/')

    }
  return (
    <div className='flex w-full flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <header className='sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-white'>
            <nav className='hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>

            <DashboardNavigation />
            </nav>

            <Sheet>
                <SheetTrigger asChild>
                    <Button className='shrink-0 md:hidden' variant='outline' size='icon'>
                        <MenuIcon className='h-5 w-5' />
                        
                    </Button>

                </SheetTrigger>
                <SheetContent side='left'>
                    <nav className='grid gap-6 text-lg font-medium'>
                        <DashboardNavigation />
                    </nav>
                </SheetContent>

            </Sheet>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='secondary' size='icon' className='rounded-full'>
                        <CircleUser className='w-5 h-5'  />
                        
                    </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                    
                    </DropdownMenuContent>


            </DropdownMenu>

        </header>

    </div>
  )
}

export default DashboardLayout