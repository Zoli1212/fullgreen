import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
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
        </>

    )

}