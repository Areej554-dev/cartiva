import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SortSelect from "@/components/SortSelect";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// =========================================
// GET PRODUCTS
// =========================================

async function getProducts(category, search, sort) {
  await connectDB();

  let query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        category: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  let sortOption = {};

  if (sort === "price-asc") {
    sortOption.price = 1;
  }

  if (sort === "price-desc") {
    sortOption.price = -1;
  }

  if (sort === "name-asc") {
    sortOption.name = 1;
  }

  if (sort === "name-desc") {
    sortOption.name = -1;
  }

  const products = await Product.find(query)
    .sort(sortOption)
    .lean();

  return products.map((product) => ({
    ...product,
    _id: product._id.toString(),
  }));
}

// =========================================
// PRODUCTS PAGE
// =========================================

export default async function Products({
  searchParams,
}) {
  const params = await searchParams;

  const category = params?.category || "";
  const search = params?.search || "";
  const sort = params?.sort || "";

  const products = await getProducts(
    category,
    search,
    sort
  );

  const categories = [
    "Clothing",
    "Shoes",
    "Bags",
    "Watches",
    "Accessories",
    "Beauty",
  ];

  const hasFilters =
    Boolean(category || search || sort);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FFF9F5] text-[#2D2723]">

      {/* =====================================
          HEADER
      ====================================== */}

      <section className="border-b border-[#E9DED6] bg-white px-4 pb-7 pt-8 sm:px-6 sm:pb-9 sm:pt-10 lg:px-8 lg:pb-10 lg:pt-14">
        <div className="mx-auto max-w-[1500px]">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E98B50] sm:tracking-[0.25em]">
            The Cartiva Collection
          </p>

          <h1 className="mt-3 max-w-5xl break-words text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {search
              ? `Search Results for "${search}"`
              : category
                ? `${category} Products`
                : "All Products"}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-[#756C65]">
            <span>
              Discover our latest collection.
            </span>

            <span
              className="hidden sm:inline"
              aria-hidden="true"
            >
              •
            </span>

            <span>
              {products.length}{" "}
              {products.length === 1
                ? "product"
                : "products"}
            </span>
          </div>

        </div>
      </section>

      {/* =====================================
          SEARCH
      ====================================== */}

      <section className="bg-[#FFF9F5] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">

          <div className="rounded-2xl border border-[#E9DED6] bg-white p-3 shadow-sm sm:p-4">
            <SearchBar />
          </div>

        </div>
      </section>

      {/* =====================================
          FILTERS
      ====================================== */}

      <section className="bg-[#FFF9F5] px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8">
        <div className="mx-auto max-w-[1500px]">

          <div className="rounded-2xl border border-[#E9DED6] bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">

                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#756C65]">
                  Browse
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#2D2723]">
                  Find your style
                </h2>

              </div>

              {hasFilters && (
                <Link
                  href="/products"
                  className="inline-flex w-fit shrink-0 items-center rounded-lg text-base font-semibold text-[#E98B50] transition hover:text-[#C96C35] hover:underline"
                >
                  Clear all filters
                </Link>
              )}

            </div>

            {/* Categories */}

            <div className="min-w-0">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#756C65]">
                Categories
              </p>

              <div className="flex min-w-0 gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pb-0">

                <Link
                  href="/products"
                  className={`flex min-h-11 shrink-0 items-center rounded-full border px-4 py-2 text-base font-semibold transition ${!category
                    ? "border-[#E98B50] bg-[#E98B50] text-white"
                    : "border-[#E9DED6] bg-white text-[#2D2723] hover:border-[#E98B50] hover:bg-[#FFF9F5]"
                    }`}
                >
                  All
                </Link>

                {categories.map((item) => {
                  const categoryParams =
                    new URLSearchParams();

                  categoryParams.set(
                    "category",
                    item
                  );

                  if (search) {
                    categoryParams.set(
                      "search",
                      search
                    );
                  }

                  if (sort) {
                    categoryParams.set(
                      "sort",
                      sort
                    );
                  }

                  return (
                    <Link
                      key={item}
                      href={`/products?${categoryParams.toString()}`}
                      className={`flex min-h-11 shrink-0 items-center rounded-full border px-4 py-2 text-base font-semibold transition ${category === item
                        ? "border-[#E98B50] bg-[#E98B50] text-white"
                        : "border-[#E9DED6] bg-white text-[#2D2723] hover:border-[#E98B50] hover:bg-[#FFF9F5]"
                        }`}
                    >
                      {item}
                    </Link>
                  );
                })}

              </div>
            </div>

            {/* Sort */}

            <div className="mt-5 flex flex-col gap-3 border-t border-[#E9DED6] pt-5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">

                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#756C65]">
                  Sort
                </p>

                <p className="mt-1 text-base text-[#2D2723]">
                  Arrange products by preference
                </p>

              </div>

              <div className="w-full min-w-0 sm:w-auto sm:min-w-[210px]">
                <SortSelect sort={sort} />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================
          ACTIVE FILTERS
      ====================================== */}

      {hasFilters && (
        <section className="bg-[#FFF9F5] px-4 pb-5 sm:px-6 sm:pb-6 lg:px-8">

          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-2">

            <span className="text-sm font-bold uppercase tracking-[0.12em] text-[#756C65]">
              Showing
            </span>

            {search && (
              <span className="max-w-full break-words rounded-full border border-[#E9DED6] bg-white px-3 py-1.5 text-sm sm:text-base">
                Search: {search}
              </span>
            )}

            {category && (
              <span className="rounded-full border border-[#E9DED6] bg-white px-3 py-1.5 text-sm sm:text-base">
                Category: {category}
              </span>
            )}

            {sort && (
              <span className="rounded-full border border-[#E9DED6] bg-white px-3 py-1.5 text-sm capitalize sm:text-base">
                Sort:{" "}
                {sort.replace(
                  /-/g,
                  " "
                )}
              </span>
            )}

          </div>
        </section>
      )}

      {/* =====================================
          PRODUCT GRID
      ====================================== */}

      <section className="bg-[#FFF9F5] px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-[1500px]">

          {products.length === 0 ? (
            <div className="rounded-2xl border border-[#E9DED6] bg-white px-5 py-14 text-center shadow-sm sm:rounded-3xl sm:px-6 sm:py-20">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">

                <svg
                  className="h-10 w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 8h14l1 12H4L5 8Z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>

              </div>

              <h2 className="mt-6 text-2xl font-bold text-[#2D2723] sm:text-3xl">
                Nothing matches your search
              </h2>

              <p className="mx-auto mt-3 max-w-md text-base leading-6 text-[#756C65]">
                Try another search term, choose a
                different category, or explore the
                full Cartiva collection.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#E98B50] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35] sm:w-auto"
              >
                View All Products
              </Link>

            </div>
          ) : (
            <>

              <div className="mb-5 flex min-w-0 flex-col gap-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">

                <div className="min-w-0">
                  <h2 className="break-words text-2xl font-bold text-[#2D2723]">
                    {category || "All Products"}
                  </h2>

                  <p className="mt-1 text-base text-[#756C65]">
                    {products.length}{" "}
                    {products.length === 1
                      ? "item"
                      : "items"}{" "}
                    available
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">

                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}

              </div>

            </>
          )}

        </div>
      </section>

    </main>
  );
}