"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";

export const SampleButton = () =>{
     return (
          <Button onClick={() => {toast.success("just texting")}}>Test Toast</Button>
     )
}   