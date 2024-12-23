import Link from 'next/link'
import React from 'react'

const links = [
    {
        name: 'Dashboard',
        href: '/dashboard'
    },
    {
        name: 'Orders',
        href: '/dashboard/orders'
    },
    {
        name: 'Products',
        href: '/dashboard/products'
    },
    {
        name: 'Banners',
        href: '/dashboard/banner'
    },

   
]

function DashboardNavigation() {
  return (

    <>

        { links.map((link) => (
            <Link key={link.href} href={link.href} >{link.name}
            </Link>

        ))}
    </>
  )
}

export default DashboardNavigation