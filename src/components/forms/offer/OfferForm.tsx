"use client";

import { useQuery } from "@tanstack/react-query";
import { TextInputGroup } from "../InputGroups";
import { MainForm, MainFormLoader } from "../MainForm";
import { ColumnInputWrapper } from "../wrappers";
import { fetchOfferById } from "@/server/offer/offer";
import { fetchCategorys } from "@/server/common/category";

export const OfferForm = ({onComplete, offerId}:{onComplete: () => void, offerId?:string}) => {
     const {data: offerData, isLoading: fetchingOfferData} = useQuery({
          queryKey: ["offer-form-data", offerId],
          queryFn: () => offerId ? fetchOfferById(offerId, {title:true}) : null
     });

     const {data: categoriesData, isLoading: fetchingCategories} = useQuery({
          queryKey: ["offer-form-categories"],
          queryFn: () => fetchCategorys({name:true, id:true}, {type: "TENDER"}, 100)
     });
     const offerCategories = categoriesData?.data || [];
     const offer = offerData || null;
     const isLoading = fetchingOfferData || fetchingCategories;

     const handleSubmit = async (data: FormData) => {
          
     }

     if(isLoading) return <MainFormLoader />
     return (
          <MainForm btnTitle="Save Offer" submitData={handleSubmit}>
               <ColumnInputWrapper title="Basic Information">
                    <TextInputGroup name="title" label="Offer Title" placeholder="ex Consulting" required />
               </ColumnInputWrapper>
          </MainForm>
     )
}