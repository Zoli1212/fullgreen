'use server'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect, RedirectType } from "next/navigation";
import { parseWithZod} from '@conform-to/zod'
;
import { parse } from "path";
import { productSchema } from "@/lib/zodSchemas";
import prisma from "@/utils/db";

export async function createProduct(prevState: unknown, formData: FormData){

    const { getUser } = getKindeServerSession()

    const user = await getUser()

    if(!user || user === null || !user.id || user.email !== "prosight11@gmail.com"){
        return redirect('/')
    }

    const submission = parseWithZod(formData, { schema: productSchema })

    if(submission.status !== "success"){
        return submission.reply()
    }


    await prisma.product.create({
        data: {
            name: submission.value.name,
            description: submission.value.description,
            status: submission.value.status,
            price: submission.value.price,
            images: submission.value.images,
            isFeatured: submission.value.isFeatured,
            category: submission.value.category
        }
    })

    redirect('/dashboard/products')

} 