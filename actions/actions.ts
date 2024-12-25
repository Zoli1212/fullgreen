'use server'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect, RedirectType } from "next/navigation";
import { parseWithZod} from '@conform-to/zod'
;
import { parse } from "path";
import { bannerSchema, productSchema } from "@/lib/zodSchemas";
import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/redis";
import { Cart } from "@/lib/interfaces";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

interface SubscriptionItem {
  priceId: string;
  name: string; // Ha van másik mező, például a név
}
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

  export async function createBanner(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user || user.email !== "prosight11@gmail.com") {
      return redirect("/");
    }
  
    const submission = parseWithZod(formData, {
      schema: bannerSchema,
    });
  
    if (submission.status !== "success") {
      return submission.reply();
    }
  
    await prisma.banner.create({
      data: {
        title: submission.value.title,
        imageString: submission.value.imageString,
      },
    });
  
    redirect("/dashboard/banner");
  }
  
  export async function deleteBanner(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user || user.email !== "prosight11@gmail.com") {
      return redirect("/");
    }
  
    await prisma.banner.delete({
      where: {
        id: formData.get("bannerId") as string,
      },
    });
  
    redirect("/dashboard/banner");
  }

  export async function addItem(productId: string) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user) {
      return redirect("/");
    }
  
    let cart: Cart | null = await redis.get(`cart-${user.id}`);
  
    const selectedProduct = await prisma.product.findUnique({
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
      },
      where: {
        id: productId,
      },
    });
  
    if (!selectedProduct) {
      throw new Error("No product with this id");
    }
    let myCart = {} as Cart;
  
    if (!cart || !cart.items) {
      myCart = {
        userId: user.id,
        items: [
          {
            price: selectedProduct.price,
            id: selectedProduct.id,
            imageString: selectedProduct.images[0],
            name: selectedProduct.name,
            quantity: 1,
          },
        ],
      };
    } else {
      let itemFound = false;
  
      myCart.items = cart.items.map((item: any) => {
        if (item.id === productId) {
          itemFound = true;
          item.quantity += 1;
        }
  
        return item;
      });
  
      if (!itemFound) {
        myCart.items.push({
          id: selectedProduct.id,
          imageString: selectedProduct.images[0],
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1,
        });
      }
    }
  
    await redis.set(`cart-${user.id}`, myCart);
  
    revalidatePath("/", "layout");
  }

  export async function delItem(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user) {
      return redirect("/");
    }
  
    const productId = formData.get("productId");
  
    let cart: Cart | null = await redis.get(`cart-${user.id}`);
  
    if (cart && cart.items) {
      const updateCart: Cart = {
        userId: user.id,
        items: cart.items.filter((item) => item.id !== productId),
      };
  
      await redis.set(`cart-${user.id}`, updateCart);
    }
  
    revalidatePath("/bag");
  }
  
  export async function checkOut() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user) {
      return redirect("/");
    }
  
    let cart: Cart | null = await redis.get(`cart-${user.id}`);
  
    if (cart && cart.items) {
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        cart.items.map((item) => ({
          price_data: {
            currency: "usd",
            unit_amount: item.price * 100,
            product_data: {
              name: item.name,
              images: [item.imageString],
              tax_code: "txcd_99999999",
            },
          },
          quantity: item.quantity,
        }));
  
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/payment/success"
            : "",
        cancel_url:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/payment/cancel"
            : "",
        billing_address_collection: "required", 
        shipping_address_collection: {
          allowed_countries: [
              "AT", // Ausztria
              "BE", // Belgium
              "BG", // Bulgária
              "CY", // Ciprus
              "CZ", // Csehország
              "DE", // Németország
              "DK", // Dánia
              "EE", // Észtország
              "ES", // Spanyolország
              "FI", // Finnország
              "FR", // Franciaország
              "GR", // Görögország
              "HR", // Horvátország
              "HU", // Magyarország
              "IE", // Írország
              "IT", // Olaszország
              "LT", // Litvánia
              "LU", // Luxemburg
              "LV", // Lettország
              "MT", // Málta
              "NL", // Hollandia
              "PL", // Lengyelország
              "PT", // Portugália
              "RO", // Románia
              "SE", // Svédország
              "SI", // Szlovénia
              "SK"  // Szlovákia
          ],
      },
      
        tax_id_collection: {
          enabled: true,
        },
        automatic_tax: {
          enabled: true, // Engedélyezi az adószámítást
        },
            
        metadata: {
          userId: user.id,
        },
      });
  
      return redirect(session.url as string);
    }
  }
  

  export async function checkOutSubscription() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/");
    }

    // Feltételezzük, hogy a felhasználónak egyetlen előfizetési csomagja van
    const subscriptionItem: SubscriptionItem | null = await redis.get(`subscription-item-${user.id}`);

    if (!subscriptionItem) {
        return redirect("/subscriptions"); // Ha nincs előfizetési elem, irányítsd a felhasználót az előfizetési oldalra
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
            price: subscriptionItem.priceId, // Az ár ID-ja, amit Stripe-ban hoztál létre az előfizetéshez
            quantity: 1, // Általában előfizetésnél a mennyiség 1
        },
    ];

    const session = await stripe.checkout.sessions.create({
        mode: "subscription", // Az előfizetési mód beállítása
        line_items: lineItems,
        success_url:
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000/subscription/success"
                : "https://your-production-domain.com/subscription/success",
        cancel_url:
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000/subscription/cancel"
                : "https://your-production-domain.com/subscription/cancel",
        billing_address_collection: "required", // Számlázási cím kötelező
        tax_id_collection: {
            enabled: true, // Adószám gyűjtés engedélyezése
        },
        automatic_tax: {
            enabled: true, // Automatikus adószámítás engedélyezése
        },
        metadata: {
            userId: user.id,
            subscriptionName: subscriptionItem.name, // Opcionális metaadat
        },
    });

    return redirect(session.url!); // Átirányítás a Stripe fizetési oldalára
}
