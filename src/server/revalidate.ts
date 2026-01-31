import { revalidatePath, revalidateTag } from "next/cache";

export function revalidatePages() {
     revalidateTag("common", "default");
     return revalidatePath("/");
}