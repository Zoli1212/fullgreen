import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, User2 } from "lucide-react";
import Link from "next/link";

export default function BannerRoute(){

    return (
        <>
        <div className="flex items-center justify-center">
            <Button asChild className="flex items-center gap-x-2">
                <Link href="/dashboard/banner/create">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Banner</span>
                </Link>
            </Button>


        </div>
        <Card className='mt-5'>
            <CardHeader>
                <CardTitle>Banners</CardTitle>
                <CardDescription>Manage your banners</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-end">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <User2 className="h-16 w-16 "   />

                            </TableCell>
                            <TableCell className='font-medium'>Great Products

                            </TableCell>

                        </TableRow>
                    </TableBody>
                </Table>

            </CardContent>

        </Card>
        </>

    )

}