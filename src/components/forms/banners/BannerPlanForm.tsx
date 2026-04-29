"use client";

import { fetchBannerPlanById } from "@/server/banners/banner-plan";
import { createBannerPlan, updateBannerPlan } from "@/server/banners/banner-plan";
import { useQuery } from "@tanstack/react-query";
import { MainForm, MainFormLoader } from "../MainForm";
import { TextInputGroup, SelectInputGroup, TextAreaInputGroup } from "../InputGroups";
import { Grid2InputWrapper, ColumnInputWrapper } from "../wrappers";import { WordsInput } from "@/components/ui/upload/WordsInput";
import { EntityButton } from "@/components/ui/custom-buttons";
import { Dialog, DialogPanel } from "@headlessui/react";
import { SBannerPlan } from "@/types/banners/banner-plan";
import { EBannerLocation, EBannerOrientation, EBannerPagePosition } from "@prisma/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { getBannerDimensions } from "@/lib/bannerDimensions";
import { X, LayoutTemplate, Plus, Pencil, Ruler } from "lucide-react";

const LOCATION_OPTIONS = Object.values(EBannerLocation).map(v => ({ label: v.charAt(0) + v.slice(1).toLowerCase(), value: v }));
const PAGE_POSITION_OPTIONS = Object.values(EBannerPagePosition).map(v => ({ label: v.charAt(0) + v.slice(1).toLowerCase(), value: v }));
const ORIENTATION_OPTIONS = Object.values(EBannerOrientation).map(v => ({ label: v.charAt(0) + v.slice(1).toLowerCase(), value: v }));
const DURATION_UNIT_OPTIONS = [
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
  { label: "Months", value: "months" },
];

// ─── Form ────────────────────────────────────────────────────────────────────
export const BannerPlanForm = ({ planId, onComplete }: { planId?: string; onComplete?: () => void }) => {
  const { data: plan, isLoading } = useQuery({
    queryKey: ["banner-plan", planId],
    queryFn: () => planId ? fetchBannerPlanById(planId, SBannerPlan) : null,
    enabled: !!planId,
  });

  const [benefits, setBenefits] = useState<string[]>([]);
  const [orientation, setOrientation] = useState<EBannerOrientation | "">("");
  const [pagePosition, setPagePosition] = useState<EBannerPagePosition | "">("");

  // Populate state from fetched plan
  useEffect(() => {
    if (plan) {
      setBenefits(plan.benefits ?? []);
      setOrientation(plan.orientation as EBannerOrientation);
      setPagePosition(plan.pagePosition as EBannerPagePosition);
    }
  }, [plan]);

  // Auto-resolved dimensions based on orientation + page position
  const autoDimensions = getBannerDimensions(orientation, pagePosition);

  const submitData = async (data: FormData) => {
    const getRaw = (key: string) => (data.get(key) as string | null)?.trim() || undefined;

    const ori = (getRaw("orientation") ?? plan?.orientation) as EBannerOrientation | undefined;
    const pos = (getRaw("pagePosition") ?? plan?.pagePosition) as EBannerPagePosition | undefined;
    const dims = ori && pos ? getBannerDimensions(ori, pos) : null;

    if (!planId && benefits.length === 0) {
      return toast.warning("Please add at least one benefit");
    }

    // Only include fields that were actually filled in (for update, skip empties)
    const payload: Record<string, unknown> = {};
    if (getRaw("name"))         payload.name         = getRaw("name");
    if (getRaw("description"))  payload.description  = getRaw("description");
    if (getRaw("price"))        payload.price        = parseFloat(getRaw("price")!);
    if (getRaw("currency"))     payload.currency     = getRaw("currency");
    if (getRaw("duration"))     payload.duration     = parseInt(getRaw("duration")!);
    if (getRaw("durationUnit")) payload.durationUnit = getRaw("durationUnit");
    if (getRaw("location"))     payload.location     = getRaw("location") as EBannerLocation;
    if (ori)                    payload.orientation  = ori;
    if (pos)                    payload.pagePosition = pos;
    // Auto-apply standard dimensions
    if (dims) {
      payload.width  = dims.width;
      payload.height = dims.height;
    }
    if (getRaw("isActive") !== undefined && getRaw("isActive") !== null && getRaw("isActive") !== "")
                                payload.isActive     = getRaw("isActive") === "true";
    if (benefits.length > 0)    payload.benefits     = benefits;

    if (!planId) {
      const required = ["name", "price", "currency", "duration", "durationUnit", "location", "pagePosition", "orientation"];
      for (const key of required) {
        if (!payload[key] && payload[key] !== 0) {
          return toast.error(`"${key}" is required`);
        }
      }
      if (!dims) return toast.error("Select both orientation and page position to set dimensions");
      payload.isActive = payload.isActive ?? true;
    }

    if (planId) {
      const res = await updateBannerPlan(planId, payload);
      if (res) {
        toast.success("Banner plan updated successfully");
        await queryClient.invalidateQueries();
        onComplete?.();
      } else {
        toast.error("Failed to update banner plan");
      }
    } else {
      const res = await createBannerPlan(payload as Parameters<typeof createBannerPlan>[0]);
      if (res) {
        toast.success("Banner plan created successfully");
        await queryClient.invalidateQueries();
        onComplete?.();
      } else {
        toast.error("Failed to create banner plan");
      }
    }
  };

  if (isLoading) return <MainFormLoader />;

  const isEdit = !!planId;

  return (
    <MainForm submitData={submitData} btnTitle={isEdit ? "Update Plan" : "Create Plan"}>

      {/* Basic Info */}
      <ColumnInputWrapper title="Basic Information">
        <Grid2InputWrapper>
          <TextInputGroup label={`Plan Name${!isEdit ? " *" : ""}`} name="name" required={!isEdit} placeholder="e.g. Premium Banner" defaultValue={plan?.name ?? ""} />
          <TextInputGroup label={`Currency${!isEdit ? " *" : ""}`} name="currency" required={!isEdit} placeholder="e.g. USD, ZAR" defaultValue={plan?.currency ?? ""} />
        </Grid2InputWrapper>
        <TextAreaInputGroup label="Description" name="description" required={false} placeholder="Describe this banner plan..." maxWords={100} defaultValue={plan?.description ?? ""} />
      </ColumnInputWrapper>

      {/* Pricing & Duration */}
      <ColumnInputWrapper title="Pricing & Duration">
        <Grid2InputWrapper>
          <TextInputGroup label={`Price${!isEdit ? " *" : ""}`} name="price" type="number" required={!isEdit} placeholder="0.00" defaultValue={plan ? String(plan.price) : ""} />
          <Grid2InputWrapper>
            <TextInputGroup label={`Duration${!isEdit ? " *" : ""}`} name="duration" type="number" required={!isEdit} placeholder="e.g. 30" defaultValue={plan ? String(plan.duration) : ""} />
            <SelectInputGroup label={`Unit${!isEdit ? " *" : ""}`} name="durationUnit" required={!isEdit} values={DURATION_UNIT_OPTIONS} defaultValue={plan?.durationUnit} />
          </Grid2InputWrapper>
        </Grid2InputWrapper>
      </ColumnInputWrapper>

      {/* Placement */}
      <ColumnInputWrapper title="Placement">
        <Grid2InputWrapper>
          <SelectInputGroup label={`Location${!isEdit ? " *" : ""}`} name="location" required={!isEdit} values={LOCATION_OPTIONS} defaultValue={plan?.location} />
          <SelectInputGroup
            label={`Page Position${!isEdit ? " *" : ""}`}
            name="pagePosition"
            required={!isEdit}
            values={PAGE_POSITION_OPTIONS}
            defaultValue={plan?.pagePosition}
            action={(v) => setPagePosition(v as EBannerPagePosition)}
          />
          <SelectInputGroup
            label={`Orientation${!isEdit ? " *" : ""}`}
            name="orientation"
            required={!isEdit}
            values={ORIENTATION_OPTIONS}
            defaultValue={plan?.orientation}
            action={(v) => setOrientation(v as EBannerOrientation)}
          />
        </Grid2InputWrapper>
      </ColumnInputWrapper>

      {/* Auto Dimensions preview */}
      <ColumnInputWrapper title="Dimensions (auto-applied)">
        {autoDimensions ? (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <Ruler className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-900">{autoDimensions.width} × {autoDimensions.height} px</p>
              <p className="text-xs text-amber-600">{autoDimensions.label} &nbsp;·&nbsp; ratio {autoDimensions.ratio}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-400">
            <Ruler className="w-5 h-5 shrink-0" />
            Select orientation and page position to auto-apply standard dimensions.
          </div>
        )}
      </ColumnInputWrapper>

      {/* Benefits */}
      <ColumnInputWrapper title={`Benefits${!isEdit ? " *" : ""}`}>
        <WordsInput
          name="benefits"
          label="Add plan benefits (press Enter to add)"
          type="text"
          words={benefits}
          onChange={setBenefits}
        />
      </ColumnInputWrapper>

      {/* Status */}
      <ColumnInputWrapper title="Status">
        <SelectInputGroup
          label={`Active Status${!isEdit ? " *" : ""}`}
          name="isActive"
          required={!isEdit}
          values={[
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
          ]}
          defaultValue={plan ? String(plan.isActive) : "true"}
        />
      </ColumnInputWrapper>

    </MainForm>
  );
};

// ─── Button that opens the form in a Dialog ──────────────────────────────────
export const BannerPlanFormButton = ({
  planId,
  showText = true,
  showIcon = true,
  size,
  ...btnProps
}: {
  planId?: string;
  showText?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
} & Omit<React.ComponentProps<typeof EntityButton>, "name" | "icon">) => {
  const [open, setOpen] = useState(false);

  const isEdit = !!planId;
  const sizeClasses = size === "sm" ? "py-1 px-2 text-xs" : size === "lg" ? "py-3 px-6 text-base" : "py-2 px-4 text-sm";

  return (
    <>
      <EntityButton
        onClick={() => setOpen(true)}
        {...btnProps}
        className={`flex items-center gap-2 rounded-lg cursor-pointer font-semibold transition-all bg-linear-to-bl from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-sm hover:shadow-md ${sizeClasses} ${btnProps.className ?? ""}`}
        icon={showIcon ? (isEdit ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />) : undefined}
        name={showText ? (isEdit ? "Edit Plan" : "New Plan") : undefined}
      />

      <Dialog open={open} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" onClick={() => setOpen(false)} />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <LayoutTemplate className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-black text-gray-900 text-base">{isEdit ? "Edit Banner Plan" : "New Banner Plan"}</h2>
                  <p className="text-xs text-gray-400">{isEdit ? "Update plan details" : "Configure a new advertising plan"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <BannerPlanForm planId={planId} onComplete={() => setOpen(false)} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};