import { ProductCard } from "@/components/storefront/ProductCard";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { title } from "process";
import React from "react";

async function getData(productCategory: string) {
  switch (productCategory) {
    case "all": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
        },
        select: {
          id: true,
          name: true,
          description: true,
          images: true,
          price: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
      });
      return { title: "All", data: data };
    }
    case "commercial": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "commercial",
        },
        select: {
          id: true,
          name: true,
          description: true,
          images: true,
          price: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
      });
      return { title: "Commercial", data: data };
    }
    case "residential": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "residental",
        },
        select: {
          id: true,
          name: true,
          description: true,
          images: true,
          price: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
      });
      return { title: "Residential", data: data };
    }
    default: {
      return notFound();
    }
  }
}

async function CategoriesPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;

    const { title, data } = await getData(name);

  return <section>
    <h1 className="font-semibold text-3xl my-5">{title}</h1>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item: any) => (
            <ProductCard key={item.id} item={item} />
        ))}
    </div>
  </section>;
}

export default CategoriesPage;
