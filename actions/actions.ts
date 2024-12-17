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


    const flattenUrls = submission.value.images.flatMap((url: string) => url.split(',').map(url => url.trim()))


    await prisma.product.create({
        data: {
            name: submission.value.name,
            description: submission.value.description,
            status: submission.value.status,
            price: submission.value.price,
            images: flattenUrls,
            isFeatured: submission.value.isFeatured,
            category: submission.value.category
        }
    })

    redirect('/dashboard/products')

}
export async function editProduct(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user || user.email !== "prosight11@gmail.com") {
      return redirect("/");
    }
  
    const submission = parseWithZod(formData, {
      schema: productSchema,
    });
  
    if (submission.status !== "success") {
      return submission.reply();
    }
  
    const flattenUrls = submission.value.images.flatMap((urlString) =>
      urlString.split(",").map((url) => url.trim())
    );
  
    const productId = formData.get("productId") as string;
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: submission.value.name,
        description: submission.value.description,
        category: submission.value.category,
        price: submission.value.price,
        isFeatured: submission.value.isFeatured === true ? true : false,
        status: submission.value.status,
        images: flattenUrls,
      },
    });
  
    redirect("/dashboard/products");
  }

  
export async function deleteProduct(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user || user.email !== "prosight11@gmail.com") {
      return redirect("/");
    }
  
    await prisma.product.delete({
      where: {
        id: formData.get("productId") as string,
      },
    });
  
    redirect("/dashboard/products");
  }