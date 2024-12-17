'use client'
import { createProduct } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing";


import { ChevronLeftIcon, Upload, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useActionState, useState } from "react";
import {useForm } from '@conform-to/react'
import { parseWithZod } from "@conform-to/zod";
import { productSchema } from "@/lib/zodSchemas";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { categories } from "@/lib/categories";
import { SubmitButton } from "@/components/SubmitButtons";



type Props = {};


function ProductCreateRoute({}: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [lastResult, action] = useActionState(createProduct, undefined )
  const handleDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const [ form, fields ] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: productSchema })
    },

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput'

  })
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-4">
        <Button variant='outline' size='icon' asChild>
          <Link href='/dashboard/products'>
       
          <ChevronLeftIcon className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className='text-xl font-semibold tracking-tight'>New Product</h1>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>In this form you can create your product</CardDescription>

        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-6'>
            <div className="flex flex-col gap-3">
              <Label>Name</Label>
              <Input type="text" key={fields.name.key} name={fields.name.name} defaultValue={fields.name.initialValue} className='w-full' placeholder='Product Name' />

              <p className='text-red-500'>{ fields.name.errors }</p>

            </div>

            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <Textarea key={fields.description.key} 
              name={fields.description.name} defaultValue={fields.description.initialValue} placeholder='Write your description right here ...' />
             <p className='text-red-500'>{ fields.description.errors }</p>

            </div>

            <div className='flex flex-col gap-3'>
              <Label>Price</Label>
              <Input key={fields.price.key} name={fields.price.name} defaultValue={fields.price.initialValue} type='number' placeholder='$55' />
              <p className="text-red-500">{fields.price.errors}</p>

            </div>
            <div className='flex flex-col gap-3'>
              <Label>Featured Product</Label>
              <Switch key={fields.isFeatured.key} name={fields.isFeatured.name} defaultValue={fields.isFeatured.initialValue}  />
              <p className="text-red-500">{fields.isFeatured.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Status</Label>
              <Select key={fields.status.key} name={fields.status.name} defaultValue={fields.status.initialValue}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Status' />

                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='draft'>Draft</SelectItem>
                  <SelectItem value='published'>Published</SelectItem>
                  <SelectItem value='archived'>Archived</SelectItem>

                </SelectContent>

              </Select>
              <p className='text-red-500'>{fields.status.errors}</p>

            </div>

            <div className="flex flex-col gap-3">
              <Label>Category</Label>
              <Select
                key={fields.category.key}
                name={fields.category.name}
                defaultValue={fields.category.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-red-500">{fields.category.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Images</Label>
              <input type="hidden" value={images} key={fields.images.key} name={fields.images.name} defaultValue={fields.images.initialValue as any} />
              {images.length > 0 ? (
                <div className="flex gap-5">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-[100px] h-[100px]">
                      <Image
                        height={100}
                        width={100}
                        src={image}
                        alt="Product Image"
                        className="w-full h-full object-cover rounded-lg border"
                      />

                      <button
                        onClick={() => handleDelete(index)}
                        type="button"
                        className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-lg text-white"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    setImages(res.map((r) => r.url));
                  }}
                  onUploadError={() => {
                    alert("Something went wrong");
                  }}
                />
              )}

              <p className="text-red-500">{ fields.images.errors }</p>
            </div>

          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text='SAVE PRODUCT' variant='secondary'/>

        </CardFooter>
      </Card>
    </form>
  );
}

export default ProductCreateRoute;
