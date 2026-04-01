"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductCatalogs } from "@/server/company/product-catalog";
import { SProductCatalogCard } from "@/types/company/product-catalog";
import { PublicCatalogCard } from "@/components/cards/PublicCatalogCard";
import Pagination from "@/components/ui/Pagination";
import { BookOpen, Loader2, Search, Filter, Inbox } from "lucide-react";
import { Prisma } from "@prisma/client";

const PER_PAGE = 16;

const SORT_OPTIONS = [
	{ value: "newest", label: "Newest First" },
	{ value: "oldest", label: "Oldest First" },
	{ value: "name_asc", label: "Name A–Z" },
	{ value: "name_desc", label: "Name Z–A" },
];

function buildOrderBy(sort: string): Prisma.ProductCatalogOrderByWithRelationInput {
	switch (sort) {
		case "oldest":
			return { createdAt: "asc" };
		case "name_asc":
			return { name: "asc" };
		case "name_desc":
			return { name: "desc" };
		default:
			return { createdAt: "desc" };
	}
}

export default function CatalogsPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("newest");

	const buildQuery = (): Prisma.ProductCatalogWhereInput => {
		const q: Prisma.ProductCatalogWhereInput = {
			fileUrl: { not: "" },
			company: { verification: { status: "VERIFIED" } },
		};
		if (search.trim()) {
			q.OR = [
				{ name: { contains: search.trim(), mode: "insensitive" } },
				{ description: { contains: search.trim(), mode: "insensitive" } },
				{ company: { name: { contains: search.trim(), mode: "insensitive" } } },
			];
		}
		return q;
	};

	const { data, isLoading } = useQuery({
		queryKey: ["public-catalogs", page, search, sort],
		queryFn: () =>
			fetchProductCatalogs(
				SProductCatalogCard,
				buildQuery(),
				PER_PAGE,
				(page - 1) * PER_PAGE,
				buildOrderBy(sort)
			),
	});

	const catalogs = data?.data ?? [];
	const total = data?.pagination.total ?? 0;

	return (
		<main className="min-h-screen bg-gray-50">
			{/* Hero header */}
			<div className="bg-white border-b-2 border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
					<div className="flex items-center gap-4 mb-4">
						<div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center shrink-0">
							<BookOpen className="w-7 h-7 text-gray-900" />
						</div>
						<div>
							<h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">
								Product Catalogs
							</h1>
							<p className="text-sm sm:text-base text-gray-600 mt-1">
								Browse construction material catalogs, equipment brochures, and
								product listings from verified companies.
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Toolbar */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
					{/* Search */}
					<div className="relative flex-1 max-w-md">
						<Search
							size={16}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
						/>
						<input
							type="text"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							placeholder="Search catalogs, companies..."
							className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl bg-white focus:border-yellow-400 focus:outline-none font-medium placeholder:text-gray-400 transition-colors"
						/>
					</div>

					{/* Sort */}
					<div className="flex items-center gap-2">
						<Filter size={14} className="text-gray-400 shrink-0" />
						<select
							value={sort}
							onChange={(e) => {
								setSort(e.target.value);
								setPage(1);
							}}
							className="text-sm border-2 border-gray-200 rounded-xl bg-white px-3 py-2.5 font-bold text-gray-700 focus:border-yellow-400 focus:outline-none cursor-pointer transition-colors"
						>
							{SORT_OPTIONS.map((o) => (
								<option key={o.value} value={o.value}>
									{o.label}
								</option>
							))}
						</select>
					</div>

					{/* Count */}
					{!isLoading && (
						<p className="text-sm text-gray-500 sm:ml-auto shrink-0">
							<span className="font-black text-gray-900">{total}</span>{" "}
							catalog{total !== 1 ? "s" : ""}
						</p>
					)}
				</div>

				{/* Content */}
				{isLoading ? (
					<div className="bg-white rounded-xl border-2 border-gray-200 p-16 flex items-center justify-center">
						<div className="text-center">
							<Loader2 className="w-8 h-8 text-yellow-500 animate-spin mx-auto mb-2" />
							<p className="text-gray-500 font-medium text-sm">
								Loading catalogs...
							</p>
						</div>
					</div>
				) : catalogs.length === 0 ? (
					<div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
						<Inbox className="w-10 h-10 text-gray-300 mx-auto mb-3" />
						<h3 className="text-base font-black text-gray-900 mb-1">
							{search ? "No catalogs found" : "No catalogs available"}
						</h3>
						<p className="text-gray-500 text-xs max-w-xs mx-auto">
							{search
								? "Try adjusting your search terms or clearing the filter."
								: "Verified construction companies will publish their product catalogs here."}
						</p>
					</div>
				) : (
					<>
						<div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{catalogs.map((catalog) => (
								<PublicCatalogCard key={catalog.id} catalog={catalog} />
							))}
						</div>

						{total > PER_PAGE && (
							<div className="mt-8">
								<Pagination
									currentPage={page}
									totalItems={total}
									itemsPerPage={PER_PAGE}
									onPageChange={setPage}
								/>
							</div>
						)}
					</>
				)}
			</div>
		</main>
	);
}
