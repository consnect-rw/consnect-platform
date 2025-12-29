import { revalidatePath } from "next/cache";

export function revalidatePages() {
     return revalidatePath("/");
}