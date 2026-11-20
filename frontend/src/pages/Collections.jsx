import React, {
    useContext,
    useEffect,
    useState,
} from "react";

import {
    FaChevronRight,
    FaChevronDown,
} from "react-icons/fa";

import { useSearchParams } from "react-router-dom";

import Title from "../components/Title";

import {
    shopDataContext,
} from "../context/ShopContext";

import Card from "../components/Card";


function Collections() {

    const [showFilter, setShowFilter] =
        useState(false);

    const {
        products,
        search,
        showSearch,
    } = useContext(shopDataContext);

    const [filterProduct, setFilterProduct] =
        useState([]);

    const [category, setCaterory] =
        useState([]);

    const [subCategory, setSubCaterory] =
        useState([]);

    const [sortType, SetSortType] =
        useState("relavent");

    const [searchParams] =
        useSearchParams();


    // --------------------------------------------------
    // CATEGORY CHECKBOX
    // --------------------------------------------------

    const toggleCategory = (e) => {

        const value = e.target.value;

        if (category.includes(value)) {

            setCaterory((prev) =>
                prev.filter(
                    (item) => item !== value
                )
            );

        } else {

            setCaterory((prev) => [
                ...prev,
                value,
            ]);

        }
    };


    // --------------------------------------------------
    // SUB-CATEGORY CHECKBOX
    // --------------------------------------------------

    const toggleSubCategory = (e) => {

        const value = e.target.value;

        if (subCategory.includes(value)) {

            setSubCaterory((prev) =>
                prev.filter(
                    (item) => item !== value
                )
            );

        } else {

            setSubCaterory((prev) => [
                ...prev,
                value,
            ]);

        }
    };


    // --------------------------------------------------
    // APPLY FILTER
    // --------------------------------------------------

    const applyFilter = () => {

        let productCopy = products.slice();


        // -----------------------------
        // SEARCH FILTER
        // -----------------------------

        if (search.trim()) {

            productCopy = productCopy.filter(
                (item) =>
                    item.name
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );

        }


        // -----------------------------
        // CATEGORY FILTER
        // -----------------------------

        if (category.length > 0) {

            productCopy = productCopy.filter(
                (item) =>
                    category.includes(
                        item.category
                    )
            );

        }


        // -----------------------------
        // SUB-CATEGORY FILTER
        // -----------------------------

        if (subCategory.length > 0) {

            productCopy = productCopy.filter(
                (item) =>
                    subCategory.includes(
                        item.subCategory
                    )
            );

        }


        setFilterProduct(productCopy);
    };


    // --------------------------------------------------
    // SORT PRODUCTS
    // --------------------------------------------------

    const sortProducts = () => {

        let fbCopy =
            filterProduct.slice();

        switch (sortType) {

            case "low-high":

                setFilterProduct(
                    fbCopy.sort(
                        (a, b) =>
                            a.price - b.price
                    )
                );

                break;


            case "high-low":

                setFilterProduct(
                    fbCopy.sort(
                        (a, b) =>
                            b.price - a.price
                    )
                );

                break;


            default:

                applyFilter();

                break;
        }
    };


    // --------------------------------------------------
    // SORT TYPE
    // --------------------------------------------------

    useEffect(() => {

        sortProducts();

    }, [sortType]);


    // --------------------------------------------------
    // READ HERO SLIDER URL FILTER
    // --------------------------------------------------
    //
    // Men:
    // ?category=Men&subCategory=TopWear,BottomWear
    //
    // Women:
    // ?category=Women&subCategory=TopWear,BottomWear
    //
    // Kids:
    // ?category=Kids&subCategory=TopWear,BottomWear
    //
    // Winter:
    // ?subCategory=WinterWear
    //
    // --------------------------------------------------

    useEffect(() => {

        const categoryParam =
            searchParams.get("category");

        const subCategoryParam =
            searchParams.get("subCategory");


        // -----------------------------
        // CATEGORY
        // -----------------------------

        if (categoryParam) {

            setCaterory([categoryParam]);

        } else {

            setCaterory([]);

        }


        // -----------------------------
        // SUB-CATEGORY
        // -----------------------------

        if (subCategoryParam) {

            const subCategories =
                subCategoryParam
                    .split(",")
                    .map(
                        (item) =>
                            item.trim()
                    )
                    .filter(Boolean);

            setSubCaterory(
                subCategories
            );

        } else {

            setSubCaterory([]);

        }

    }, [searchParams]);


    // --------------------------------------------------
    // APPLY FILTER WHEN DATA/FILTER CHANGES
    // --------------------------------------------------

    useEffect(() => {

        applyFilter();

    }, [
        products,
        category,
        subCategory,
        search,
        showSearch,
    ]);


    // --------------------------------------------------
    // CHECKBOX ROW
    // --------------------------------------------------

    const CheckboxRow = ({
        label,
        onChange,
        checked,
    }) => (

        <label
            className="
                flex
                items-center
                gap-2
                text-xs
                sm:text-sm
                text-slate-300
                cursor-pointer
                hover:text-teal-200
                transition-colors
            "
        >

            <input
                type="checkbox"
                value={label}
                checked={checked}
                onChange={onChange}
                className="
                    w-3.5
                    h-3.5
                    accent-teal-400
                "
            />

            {label}

        </label>

    );


    return (

        <div
            className="
                w-full
                min-h-screen
                overflow-x-hidden
                bg-gradient-to-br
                from-[#0a121a]
                via-[#0d1b24]
                to-[#0a1520]
                pt-24
                pb-24
                px-4
                sm:px-8
                lg:px-16
                flex
                flex-col
                lg:flex-row
                gap-6
            "
        >


            {/* ==========================================
                FILTER SIDEBAR
            ========================================== */}

            <aside
                className="
                    w-full
                    lg:w-40
                    lg:shrink-0
                    lg:sticky
                    lg:top-24
                    self-start
                "
            >

                <button
                    className="
                        w-full
                        flex
                        items-center
                        justify-between
                        text-sm
                        font-semibold
                        text-slate-100
                        lg:pointer-events-none
                    "
                    onClick={() =>
                        setShowFilter(
                            (prev) => !prev
                        )
                    }
                >

                    Filters

                    <span
                        className="
                            lg:hidden
                            text-teal-300
                        "
                    >

                        {showFilter ? (
                            <FaChevronDown />
                        ) : (
                            <FaChevronRight />
                        )}

                    </span>

                </button>


                <div
                    className={`
                        ${
                            showFilter
                                ? "flex"
                                : "hidden"
                        }
                        lg:flex
                        flex-col
                        gap-3
                        mt-3
                    `}
                >


                    {/* ========================================
                        CATEGORY FILTER
                    ======================================== */}

                    <div
                        className="
                            rounded-lg
                            border
                            border-white/10
                            bg-white/[0.04]
                            backdrop-blur-md
                            p-3
                        "
                    >

                        <p
                            className="
                                text-[11px]
                                uppercase
                                tracking-wider
                                text-teal-300
                                mb-2
                            "
                        >
                            Categories
                        </p>


                        <div
                            className="
                                flex
                                flex-col
                                gap-1.5
                            "
                        >

                            <CheckboxRow
                                label="Men"
                                onChange={
                                    toggleCategory
                                }
                                checked={
                                    category.includes(
                                        "Men"
                                    )
                                }
                            />


                            <CheckboxRow
                                label="Women"
                                onChange={
                                    toggleCategory
                                }
                                checked={
                                    category.includes(
                                        "Women"
                                    )
                                }
                            />


                            <CheckboxRow
                                label="Kids"
                                onChange={
                                    toggleCategory
                                }
                                checked={
                                    category.includes(
                                        "Kids"
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* ========================================
                        SUB-CATEGORY FILTER
                    ======================================== */}

                    <div
                        className="
                            rounded-lg
                            border
                            border-white/10
                            bg-white/[0.04]
                            backdrop-blur-md
                            p-3
                        "
                    >

                        <p
                            className="
                                text-[11px]
                                uppercase
                                tracking-wider
                                text-teal-300
                                mb-2
                            "
                        >
                            Sub-Categories
                        </p>


                        <div
                            className="
                                flex
                                flex-col
                                gap-1.5
                            "
                        >

                            <CheckboxRow
                                label="TopWear"
                                onChange={
                                    toggleSubCategory
                                }
                                checked={
                                    subCategory.includes(
                                        "TopWear"
                                    )
                                }
                            />


                            <CheckboxRow
                                label="BottomWear"
                                onChange={
                                    toggleSubCategory
                                }
                                checked={
                                    subCategory.includes(
                                        "BottomWear"
                                    )
                                }
                            />


                            <CheckboxRow
                                label="WinterWear"
                                onChange={
                                    toggleSubCategory
                                }
                                checked={
                                    subCategory.includes(
                                        "WinterWear"
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>

            </aside>


            {/* ==========================================
                PRODUCT SECTION
            ========================================== */}

            <div
                className="
                    flex-1
                    min-w-0
                "
            >


                {/* ========================================
                    HEADER
                ======================================== */}

                <div
                    className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        justify-between
                        gap-4
                        mb-8
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-1
                        "
                    >

                        <span
                            className="
                                text-xs
                                sm:text-sm
                                tracking-[0.35em]
                                uppercase
                                text-teal-300/70
                            "
                        >
                            Shop the Range
                        </span>

                        <Title
                            text1={"ALL"}
                            text2={"COLLECTIONS"}
                        />

                    </div>


                    {/* SORT */}

                    <select
                        className="
                            bg-white/5
                            border
                            border-white/10
                            w-full
                            sm:w-[220px]
                            h-11
                            px-4
                            text-slate-100
                            text-sm
                            rounded-full
                            hover:border-teal-300/40
                            focus:outline-none
                            focus:border-teal-300/50
                            transition-colors
                        "
                        value={sortType}
                        onChange={(e) =>
                            SetSortType(
                                e.target.value
                            )
                        }
                    >

                        <option value="relavent">
                            Sort By: Relevant
                        </option>

                        <option value="low-high">
                            Sort By: Low to High
                        </option>

                        <option value="high-low">
                            Sort By: High to Low
                        </option>

                    </select>

                </div>


                {/* ========================================
                    PRODUCT GRID
                ======================================== */}

                {filterProduct.length === 0 ? (

                    <div
                        className="
                            w-full
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-2
                            py-24
                            text-center
                        "
                    >

                        <p
                            className="
                                text-lg
                                text-slate-200
                                font-medium
                            "
                        >
                            No products match
                            your filters
                        </p>

                        <p
                            className="
                                text-sm
                                text-slate-400
                            "
                        >
                            Try clearing a filter
                            or searching for
                            something else.
                        </p>

                    </div>

                ) : (

                    <div
                        className="
                            grid
                            grid-cols-2
                            md:grid-cols-3
                            gap-5
                            sm:gap-7
                        "
                    >

                        {filterProduct.map(
                            (item, index) => (

                                <Card
                                    key={
                                        item._id ||
                                        index
                                    }

                                    id={item._id}

                                    name={item.name}

                                    price={item.price}

                                    image={item.image1}

                                    rating={item.rating}

                                    /*
                                     * IMPORTANT:
                                     * Bestseller badge is
                                     * enabled ONLY here.
                                     */
                                    showBestsellerBadge={true}

                                    /*
                                     * Actual bestseller
                                     * value from database.
                                     */
                                    bestseller={
                                        item.bestseller
                                    }
                                />

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );
}

export default Collections;