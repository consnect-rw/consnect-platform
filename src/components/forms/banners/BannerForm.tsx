"use client";

import { fetchBannerById } from "@/server/banners/banner";
import { createBanner, updateBanner } from "@/server/banners/banner";
import { fetchBannerPlanById, fetchBannerPlans } from "@/server/banners/banner-plan";
import { SBanner } from "@/types/banners/banner";
import { SBannerPlan, TBannerPlan } from "@/types/banners/banner-plan";
import { useQuery } from "@tanstack/react-query";
import { MainForm, MainFormLoader } from "../MainForm";
import { TextInputGroup, SelectInputGroup } from "../InputGroups";
import { ColumnInputWrapper } from "../wrappers";
import { EntityButton } from "@/components/ui/custom-buttons";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { uploadSingleImage, deleteSingleImage } from "@/util/s3Helpers";
import { getCroppedImg, ANIMATED_FORMATS } from "@/util/images";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import { X, ImagePlus, Pencil, Plus, Megaphone, UploadCloud, Trash2, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EUserRole } from "@prisma/client";

// ─── Banner Image Uploader using plan aspect ratio ───────────────────────────
const BannerImageUploader = ({
  planWidth,
  planHeight,
  currentUrl,
  onUploadComplete,
  onDelete,
}: {
  planWidth: number;
  planHeight: number;
  currentUrl: string;
  onUploadComplete: (url: string) => void;
  onDelete: () => void;
}) => {
  const aspect = planWidth / planHeight;
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileMime, setFileMime] = useState<string>("image/jpeg");
  const [rawFile, setRawFile] = useState<File | null>(null); // kept for animated formats
  const [isAnimated, setIsAnimated] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const mime = file.type;
    setFileMime(mime);
    setRawFile(file);
    const animated = ANIMATED_FORMATS.includes(mime);
    setIsAnimated(animated);
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".apng", ".avif"] },
    multiple: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCropComplete = useCallback((_: any, pixels: any) => setCroppedAreaPixels(pixels), []);

  const handleUpload = async () => {
    if (!imageSrc) return;
    try {
      setUploading(true);
      let file: File;

      if (isAnimated && rawFile) {
        // Animated formats (GIF, WebP, APNG) — upload original to preserve animation
        file = rawFile;
      } else {
        // Static image — crop then upload, preserving original format
        if (!croppedAreaPixels) return toast.error("Please crop the image first");
        const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, fileMime);
        if (!cropped) return toast.error("Failed to crop image");
        const blob = await (await fetch(cropped)).blob();
        const ext = fileMime.split("/")[1] ?? "jpg";
        file = new File([blob], `banner.${ext}`, { type: fileMime });
      }

      const url = await uploadSingleImage(file, "banners");
      if (!url) return toast.error("Upload failed");
      // Delete old image if replacing
      if (currentUrl) {
        await deleteSingleImage(currentUrl).catch(() => {});
      }
      onUploadComplete(url);
      toast.success("Banner image uploaded");
      setIsOpen(false);
      setImageSrc(null);
      setRawFile(null);
    } catch {
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUrl) return;
    try {
      setDeleting(true);
      await deleteSingleImage(currentUrl);
      onDelete();
      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image");
    } finally {
      setDeleting(false);
    }
  };

  // Preview box sized proportionally to plan dimensions — capped at 280px tall
  const maxPreviewH = 280;
  const naturalH = (planHeight / planWidth) * 100; // percent of width
  // If natural height would exceed maxPreviewH we cap and derive a fixed pixel height
  const useFixedHeight = planHeight > planWidth; // vertical or square-ish
  const previewPadding = useFixedHeight ? undefined : `${naturalH}%`;

  return (
    <div className="flex flex-col gap-3">
      {/* Dimension badge */}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        Required size: <span className="font-bold text-gray-700">{planWidth} × {planHeight}px</span>
        <span className="text-gray-400">({planWidth > planHeight ? "Horizontal" : planWidth < planHeight ? "Vertical" : "Square"})</span>
      </div>

      {/* Preview / upload zone */}
      <div
        className="relative w-full max-w-lg"
        style={
          useFixedHeight
            ? { height: maxPreviewH }
            : { paddingBottom: previewPadding, height: 0 }
        }
      >
        <div className={`${useFixedHeight ? "absolute inset-0" : "absolute inset-0"} rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden`}>
          {currentUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentUrl} alt="Banner preview" className="w-full h-full object-contain bg-gray-950" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="p-2.5 bg-white/90 rounded-lg text-gray-900 hover:bg-yellow-400 transition-colors"
                  title="Replace image"
                >
                  <UploadCloud className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-2.5 bg-white/90 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                  title="Remove image"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-2 right-2">
                <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Uploaded
                </span>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 hover:bg-amber-50 transition-colors group"
            >
              <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-amber-500 transition-colors" />
              <span className="text-sm font-semibold text-gray-500 group-hover:text-amber-600">Click to upload banner</span>
              <span className="text-xs text-gray-400">PNG, JPG, GIF accepted</span>
            </button>
          )}
        </div>
      </div>

      {/* Cropper Dialog */}
      <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setIsOpen(false); setImageSrc(null); }} />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900">Upload Banner Image</h3>
              <button type="button" onClick={() => { setIsOpen(false); setImageSrc(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {!imageSrc ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-amber-500 bg-amber-50" : "border-gray-300 hover:border-amber-400 hover:bg-amber-50/50"}`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-600">{isDragActive ? "Drop it here!" : "Drag & drop or click to select"}</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP — target size {planWidth}×{planHeight}px</p>
                  <p className="text-xs text-amber-500 font-medium mt-1">GIF & WebP animations are preserved as-is</p>
                </div>
              ) : isAnimated ? (
                // Animated format — show preview, skip cropper
                <>
                  <div className="rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center" style={{ maxHeight: 280 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageSrc} alt="Animated preview" className="max-w-full max-h-72 object-contain" />
                  </div>
                  <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Animated file detected — will be uploaded as-is to preserve animation
                  </p>
                  <div className="flex gap-3 mt-3">
                    <button type="button" onClick={() => { setImageSrc(null); setRawFile(null); }} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">
                      ← Back
                    </button>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={handleUpload}
                      className="flex-1 py-2.5 rounded-xl bg-linear-to-bl from-amber-600 to-amber-700 text-white text-sm font-bold hover:from-amber-700 hover:to-amber-800 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading..." : "Upload & Save"}
                    </button>
                  </div>
                </>
              ) : (
                // Static image — show cropper
                <>
                  <div className="relative bg-gray-900 rounded-xl overflow-hidden" style={{ height: Math.min(320, Math.round((planHeight / planWidth) * 560)) }}>
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={aspect}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-xs text-gray-500 font-medium">Zoom</span>
                    <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="flex-1 accent-amber-500" />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => { setImageSrc(null); setRawFile(null); }} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">
                      ← Back
                    </button>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={handleUpload}
                      className="flex-1 py-2.5 rounded-xl bg-linear-to-bl from-amber-600 to-amber-700 text-white text-sm font-bold hover:from-amber-700 hover:to-amber-800 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading..." : "Upload & Save"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

// ─── Form ────────────────────────────────────────────────────────────────────
const computeExpiry = (duration: number, unit: string): Date => {
  const d = new Date();
  switch (unit.toLowerCase()) {
    case "day": case "days":     d.setDate(d.getDate() + duration); break;
    case "week": case "weeks":   d.setDate(d.getDate() + duration * 7); break;
    case "month": case "months": d.setMonth(d.getMonth() + duration); break;
    case "year": case "years":   d.setFullYear(d.getFullYear() + duration); break;
  }
  return d;
};

export const BannerForm = ({
  bannerId,
  planId: defaultPlanId,
  onComplete,
}: {
  bannerId?: string;
  planId?: string;
  onComplete?: () => void;
}) => {
     const {user} = useAuth()
  const isAdmin = user?.role === EUserRole.ADMIN;

  const { data: banner, isLoading: isFetchingBanner } = useQuery({
    queryKey: ["banner-form", bannerId],
    queryFn: () => bannerId ? fetchBannerById(bannerId, SBanner) : null,
    enabled: !!bannerId,
  });

  const { data: bannerPlansData, isLoading: isFetchingBannerPlans } = useQuery({
    queryKey: ["banner-plans-active"],
    queryFn: () => fetchBannerPlans(SBannerPlan, { isActive: true }),
    enabled: !defaultPlanId,
  });

  const {data: defaultPlanData, isLoading: isFetchingDefaultPlan} = useQuery({
    queryKey: ["banner-plan", defaultPlanId],
    queryFn: () => defaultPlanId ? fetchBannerPlanById(defaultPlanId, SBannerPlan) : null,
    enabled: !!defaultPlanId,
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId ?? "");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isActive, setIsActive] = useState(false);

  // Pre-fill from banner on edit
  useEffect(() => {
    if (banner) {
      setImageUrl(banner.imageUrl ?? "");
      setSelectedPlanId(banner.plan?.id ?? "");
      // Banner is "active" if expireAt is in the future
      if (banner.expireAt) {
        setIsActive(new Date(banner.expireAt) > new Date());
      }
    }
  }, [banner]);

  const plans = bannerPlansData?.data ?? [];
  const activePlan: TBannerPlan | null | undefined = defaultPlanId
    ? banner?.plan as TBannerPlan ?? defaultPlanData
    : plans.find(p => p.id === selectedPlanId) ?? null;

  const planOptions = plans.map(p => ({ label: `${p.name} (${p.width}×${p.height}px — ${p.currency} ${p.price}/${p.duration} ${p.durationUnit})`, value: p.id }));

  const isLoading = isFetchingBanner || isFetchingBannerPlans;

  const submitData = async (data: FormData) => {
    if (!imageUrl) return toast.warning("Please upload a banner image");
    if (!selectedPlanId) return toast.warning("Please select a banner plan");

    // Admin: compute expiry from plan duration if isActive toggle is on
    // User: expireAt stays undefined (pending — admin will activate later)
    let expireAt: Date | undefined = undefined;
    if (isAdmin && isActive && activePlan) {
      expireAt = computeExpiry(activePlan.duration, activePlan.durationUnit);
    } else if (isAdmin && !isActive) {
      // Explicitly set to past date to mark as inactive
      expireAt = new Date(0);
    }

    const payload = {
      title:          data.get("title") as string,
      destinationUrl: data.get("destinationUrl") as string,
      imageUrl,
      plan:           { connect: { id: selectedPlanId } },
      ...(expireAt !== undefined ? { expireAt } : {}),
    };

    if (bannerId) {
      const res = await updateBanner(bannerId, payload);
      if (res) {
        toast.success("Banner updated successfully");
        await queryClient.invalidateQueries();
        onComplete?.();
      } else {
        toast.error("Failed to update banner");
      }
    } else {
      const res = await createBanner(payload);
      if (res) {
        toast.success("Banner created successfully");
        await queryClient.invalidateQueries();
        onComplete?.();
      } else {
        toast.error("Failed to create banner");
      }
    }
  };

  if (isLoading) return <MainFormLoader />;

  return (
    <MainForm submitData={submitData} btnTitle={bannerId ? "Update Banner" : "Create Banner"}>

      {/* Plan Selection */}
      {!defaultPlanId && (
        <ColumnInputWrapper title="Select Plan">
          <SelectInputGroup
            label="Banner Plan *"
            name="planId"
            required={bannerId ? false : true}
            values={planOptions}
            action={(v) => setSelectedPlanId(v)}
          />
          {activePlan && (
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Size", value: `${activePlan.width}×${activePlan.height}px` },
                { label: "Location", value: activePlan.location },
                { label: "Price", value: `${activePlan.currency} ${activePlan.price}` },
                { label: "Duration", value: `${activePlan.duration} ${activePlan.durationUnit}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-amber-50 rounded-lg px-3 py-2 text-center">
                  <p className="text-xs text-amber-600 font-semibold">{label}</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          )}
        </ColumnInputWrapper>
      )}

      {/* Banner Details */}
      <ColumnInputWrapper title="Banner Details">
        <TextInputGroup label="Title *" name="title" required={bannerId ? false : true} placeholder="e.g. Summer Sale Promotion" defaultValue={banner?.title ?? ""}  />
        <TextInputGroup label="Destination URL *" name="destinationUrl" required={bannerId ? false : true} placeholder="https://yoursite.com/promo" defaultValue={banner?.destinationUrl ?? ""} />

        {/* Admin only: isActive toggle that auto-computes expiry from plan duration */}
        {isAdmin && (
          <div className="flex items-center justify-between rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-gray-800">Activate Banner</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {isActive && activePlan
                  ? `Expires ${computeExpiry(activePlan.duration, activePlan.durationUnit).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                  : "Banner will be set as inactive / pending"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
            >
              {isActive
                ? <><ToggleRight className="w-5 h-5" /> Active</>
                : <><ToggleLeft className="w-5 h-5" /> Inactive</>
              }
            </button>
          </div>
        )}
      </ColumnInputWrapper>

      {/* Banner Image */}
      <ColumnInputWrapper title="Banner Image">
        {activePlan ? (
          <BannerImageUploader
            planWidth={activePlan.width}
            planHeight={activePlan.height}
            currentUrl={imageUrl}
            onUploadComplete={setImageUrl}
            onDelete={() => setImageUrl("")}
          />
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-6 border-2 border-dashed border-gray-200">
            <AlertCircle className="w-5 h-5 shrink-0" />
            Select a banner plan first to enable image upload
          </div>
        )}
      </ColumnInputWrapper>

    </MainForm>
  );
};

// ─── Button that opens the form in a Dialog ──────────────────────────────────
export const BannerFormButton = ({
  bannerId,
  planId,
  showText = true,
  showIcon = true,
  size,
  ...btnProps
}: {
  bannerId?: string;
  planId?: string;
  showText?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
} & Omit<React.ComponentProps<typeof EntityButton>, "name" | "icon">) => {
  const [open, setOpen] = useState(false);
  const isEdit = !!bannerId;
  const sizeClasses = size === "sm" ? "py-1 px-2 text-xs" : size === "lg" ? "py-3 px-6 text-base" : "py-2 px-4 text-sm";

  return (
    <>
      <EntityButton
        onClick={() => setOpen(true)}
        {...btnProps}
        className={`flex items-center gap-2 rounded-lg cursor-pointer font-semibold transition-all bg-linear-to-bl from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-sm hover:shadow-md ${sizeClasses} ${btnProps.className ?? ""}`}
        icon={showIcon ? (isEdit ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />) : undefined}
        name={showText ? (isEdit ? "Edit Banner" : "New Banner") : undefined}
      />

      <Dialog open={open} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" onClick={() => setOpen(false)} />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-black text-gray-900 text-base">{isEdit ? "Edit Banner" : "New Banner"}</h2>
                  <p className="text-xs text-gray-400">{isEdit ? "Update banner details" : "Create a new advertising banner"}</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <BannerForm bannerId={bannerId} planId={planId} onComplete={() => setOpen(false)} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};