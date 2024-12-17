import { EditForm } from '@/components/dashboard/EditForm'
import prisma from '@/utils/db'
import { notFound } from 'next/navigation'
import React from 'react'

async function getData(productId: string){

  const data = await prisma.product.findUnique({
    where: {
      id: productId
    }
  })

  if(!data){
    return notFound()

  }

  return data
}

async function EditRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const data = await getData(id)
  return (
    <EditForm data={data} />
  )
}

export default EditRoute