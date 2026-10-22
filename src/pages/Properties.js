import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiSliders,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";

import request from "../utils/request";
import Navbar from "../componets/layout/Navbar";
import PropertyCard from "../componets/proporties/PropertyCard";

const Page = styled.main`
  min-height: 100vh;
  background: #f8f8f5;
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 48px 24px 80px;

  @media (max-width: 600px) {
    padding: 30px 16px 55px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;

  .eyebrow {
    margin-bottom: 10px;
    color: #a17e50;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.7px;
    text-transform: uppercase;
  }

  h1 {
    color: #20372b;
    font-size: clamp(30px, 4vw, 42px);
    letter-spacing: -1.2px;
  }

  p {
    margin-top: 12px;
    color: #858981;
    font-size: 14px;
    line-height: 1.8;
  }
`;

const SearchBar = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;

  input {
    flex: 1;
    min-width: 0;
    padding: 15px 17px;
    border: 1px solid #e6e5df;
    border-radius: 8px;
    outline: none;
    background: #fff;
    color: #25362c;
    font-size: 14px;
  }

  input:focus {
    border-color: #b89564;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 0 22px;
    border: 0;
    border-radius: 8px;
    background: #173c32;
    color: white;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    button {
      padding: 0 16px;
    }
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  align-items: start;
  gap: 28px;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const FilterPanel = styled.aside`
  padding: 24px;
  border: 1px solid #ecebe5;
  border-radius: 12px;
  background: #fff;

  @media (max-width: 850px) {
    padding: 20px;
  }
`;

const FilterHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 25px;

  h2 {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #20372b;
    font-size: 17px;
  }

  button {
    border: 0;
    background: transparent;
    color: #9a784b;
    font-size: 12px;
    font-weight: 600;
  }
`;

const Field = styled.label`
  display: block;
  margin-bottom: 20px;

  span {
    display: block;
    margin-bottom: 9px;
    color: #3d483f;
    font-size: 12px;
    font-weight: 700;
  }

  input,
  select {
    width: 100%;
    min-height: 43px;
    padding: 10px 11px;
    border: 1px solid #e7e6df;
    border-radius: 7px;
    outline: none;
    background: #fff;
    color: #424b43;
    font-size: 13px;
  }

  input:focus,
  select:focus {
    border-color: #b89564;
  }
`;

const PriceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
`;

const ApplyButton = styled.button`
  width: 100%;
  min-height: 46px;
  margin-top: 3px;
  border: 0;
  border-radius: 7px;
  background: #173c32;
  color: #fff;
  font-size: 13px;
  font-weight: 700;

  &:hover {
    background: #245748;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 22px;

  h2 {
    color: #26392e;
    font-size: 18px;
  }

  p {
    margin-top: 6px;
    color: #858981;
    font-size: 12px;
  }

  select {
    min-height: 42px;
    max-width: 100%;
    padding: 9px 12px;
    border: 1px solid #e7e6df;
    border-radius: 7px;
    background: #fff;
    color: #3d483f;
    font-size: 12px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StateBox = styled.div`
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 30px;
  border: 1px solid #ecebe5;
  border-radius: 12px;
  background: #fff;
  text-align: center;

  h3 {
    color: #20372b;
    font-size: 18px;
  }

  p {
    max-width: 420px;
    color: #858981;
    font-size: 13px;
    line-height: 1.8;
  }

  button {
    margin-top: 6px;
    padding: 11px 16px;
    border: 0;
    border-radius: 7px;
    background: #173c32;
    color: white;
    font-size: 13px;
  }
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 35px;
  flex-wrap: wrap;

  button {
    min-width: 39px;
    height: 39px;
    display: grid;
    place-items: center;
    padding: 0 10px;
    border: 1px solid #e5e4dd;
    border-radius: 7px;
    background: #fff;
    color: #37453b;
    font-size: 13px;
  }

  button.active {
    border-color: #173c32;
    background: #173c32;
    color: #fff;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const initialFilters = {
  purpose: "sale",
  propertyType: "",
  city: "",
  area: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
};

function getInitialFilters(searchParams) {
  return {
    purpose: searchParams.get("purpose") || "",
    propertyType: searchParams.get("propertyType") || "",
    city: searchParams.get("city") || "",
    area: searchParams.get("area") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
  };
}

function normalizePropertiesResponse(responseData) {
  if (Array.isArray(responseData)) {
    return {
      properties: responseData,
      total: responseData.length,
      totalPages: 1,
    };
  }

  const properties =
    responseData?.properties ??
    responseData?.data?.properties ??
    responseData?.data ??
    responseData?.results ??
    [];

  const safeProperties = Array.isArray(properties) ? properties : [];

  const pagination =
    responseData?.pagination ?? responseData?.data?.pagination ?? {};

  const total =
    responseData?.total ??
    responseData?.totalResults ??
    responseData?.count ??
    pagination?.total ??
    safeProperties.length;

  const totalPages =
    responseData?.totalPages ??
    pagination?.totalPages ??
    Math.max(1, Math.ceil(Number(total) / 9));

  return {
    properties: safeProperties,
    total: Number(total) || 0,
    totalPages: Number(totalPages) || 1,
  };
}

function PropertyListingCard({ property }) {
  const images = Array.isArray(property.images) ? property.images : [];

  const image =
    images[0]?.url ||
    property.image ||
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80";

  const location =
    [
      property.location?.area || property.areaName,
      property.location?.city || property.city,
    ]
      .filter(Boolean)
      .join(", ") || "Dubai, UAE";

  return (
    <PropertyCard
      property={{
        id: property._id || property.id,
        title: property.title || "Untitled property",
        price: Number(property.price) || 0,
        purpose: property.purpose || "sale",
        location,
        bedrooms: property.bedrooms ?? 0,
        bathrooms: property.bathrooms ?? 0,
        area: property.area ?? 0,
        image,
        featured: Boolean(property.featured),
      }}
    />
  );
}

function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => getInitialFilters(searchParams));

  const [appliedFilters, setAppliedFilters] = useState(() =>
    getInitialFilters(searchParams)
  );

  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const nextFilters = getInitialFilters(searchParams);
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProperties() {
      setLoading(true);
      setError("");

      try {
        const params = {
          page,
          limit: 9,
          sort,
        };

        Object.entries(appliedFilters).forEach(([key, value]) => {
          if (value !== "" && value != null) {
            params[key] = value;
          }
        });

        const response = await request.get("properties", {
          params,
          signal: controller.signal,
        });

        const result = normalizePropertiesResponse(response.data);

        setProperties(result.properties);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        if (err.code === "ERR_CANCELED") return;

        setProperties([]);
        setTotal(0);
        setTotalPages(1);
        setError(
          err.response?.data?.message ||
            "Could not load properties. Check that the backend is running and try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProperties();

    return () => controller.abort();
  }, [appliedFilters, page, sort]);

  const updateFilter = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const applyFilters = (event) => {
    event.preventDefault();

    const nextParams = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value != null) {
        nextParams[key] = value;
      }
    });

    setPage(1);
    setAppliedFilters({ ...filters });
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    const cleared = { ...initialFilters, purpose: "" };

    setFilters(cleared);
    setAppliedFilters(cleared);
    setPage(1);
    setSort("newest");
    setSearchParams({});
  };

  const changeSort = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  return (
    <>
      <Navbar />

      <Page>
        <Container>
          <PageHeader>
            <div className="eyebrow">Find your next property</div>
            <h1>Explore properties</h1>
            <p>
              Discover apartments, villas and investment opportunities that
              match your lifestyle.
            </p>
          </PageHeader>

          <SearchBar
            onSubmit={(event) => {
              event.preventDefault();

              setFilters((previous) => ({
                ...previous,
                city: filters.city,
              }));

              applyFilters(event);
            }}
          >
            <input
              name="city"
              value={filters.city}
              onChange={updateFilter}
              placeholder="Search by city, community or area..."
              aria-label="Search by location"
            />
            <button type="submit">
              <FiSearch />
              Search
            </button>
          </SearchBar>

          <Layout>
            <FilterPanel>
              <FilterHeading>
                <h2>
                  <FiSliders /> Filters
                </h2>
                <button type="button" onClick={resetFilters}>
                  Reset all
                </button>
              </FilterHeading>

              <form onSubmit={applyFilters}>
                <Field>
                  <span>Purpose</span>
                  <select
                    name="purpose"
                    value={filters.purpose}
                    onChange={updateFilter}
                  >
                    <option value="">Buy or rent</option>
                    <option value="sale">For sale</option>
                    <option value="rent">For rent</option>
                  </select>
                </Field>

                <Field>
                  <span>Property type</span>
                  <select
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={updateFilter}
                  >
                    <option value="">All types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="office">Office</option>
                    <option value="shop">Shop</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="land">Land</option>
                  </select>
                </Field>

                <Field>
                  <span>City</span>
                  <input
                    name="city"
                    value={filters.city}
                    onChange={updateFilter}
                    placeholder="e.g. Dubai"
                  />
                </Field>

                <Field>
                  <span>Community / area</span>
                  <input
                    name="area"
                    value={filters.area}
                    onChange={updateFilter}
                    placeholder="e.g. Dubai Marina"
                  />
                </Field>

                <Field>
                  <span>Price range (AED)</span>
                  <PriceGrid>
                    <input
                      type="number"
                      name="minPrice"
                      min="0"
                      value={filters.minPrice}
                      onChange={updateFilter}
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      min="0"
                      value={filters.maxPrice}
                      onChange={updateFilter}
                      placeholder="Max"
                    />
                  </PriceGrid>
                </Field>

                <Field>
                  <span>Bedrooms</span>
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={updateFilter}
                  >
                    <option value="">Any number</option>
                    <option value="0">Studio</option>
                    <option value="1">1 bedroom</option>
                    <option value="2">2 bedrooms</option>
                    <option value="3">3 bedrooms</option>
                    <option value="4">4 bedrooms</option>
                    <option value="5">5+ bedrooms</option>
                  </select>
                </Field>

                <ApplyButton type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Apply Filters"}
                </ApplyButton>
              </form>
            </FilterPanel>

            <section>
              <ResultsHeader>
                <div>
                  <h2>Available properties</h2>
                  <p>
                    {loading
                      ? "Finding properties..."
                      : `${total} ${
                          total === 1 ? "property" : "properties"
                        } found`}
                  </p>
                </div>

                <select
                  value={sort}
                  onChange={changeSort}
                  aria-label="Sort properties"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                  <option value="views">Most viewed</option>
                </select>
              </ResultsHeader>

              {loading ? (
                <StateBox>
                  <FiRefreshCw size={25} />
                  <h3>Loading properties</h3>
                  <p>We are finding properties that match your search.</p>
                </StateBox>
              ) : error ? (
                <StateBox>
                  <h3>Unable to load properties</h3>
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={() => setAppliedFilters({ ...appliedFilters })}
                  >
                    Try again
                  </button>
                </StateBox>
              ) : properties.length === 0 ? (
                <StateBox>
                  <FiSearch size={28} />
                  <h3>No properties found</h3>
                  <p>Try changing the filters or searching another area.</p>
                  <button type="button" onClick={resetFilters}>
                    Clear filters
                  </button>
                </StateBox>
              ) : (
                <>
                  <Grid>
                    {properties.map((property) => (
                      <PropertyListingCard
                        key={property._id || property.id}
                        property={property}
                      />
                    ))}
                  </Grid>

                  {totalPages > 1 && (
                    <Pagination>
                      <button
                        type="button"
                        aria-label="Previous page"
                        disabled={page <= 1}
                        onClick={() => setPage((current) => current - 1)}
                      >
                        <FiChevronLeft />
                      </button>

                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      )
                        .filter(
                          (number) =>
                            number === 1 ||
                            number === totalPages ||
                            Math.abs(number - page) <= 1
                        )
                        .map((number, index, visiblePages) => (
                          <span key={number} style={{ display: "contents" }}>
                            {index > 0 &&
                              number - visiblePages[index - 1] > 1 && (
                                <span style={{ padding: "0 3px" }}>…</span>
                              )}
                            <button
                              type="button"
                              className={page === number ? "active" : ""}
                              aria-current={
                                page === number ? "page" : undefined
                              }
                              onClick={() => setPage(number)}
                            >
                              {number}
                            </button>
                          </span>
                        ))}

                      <button
                        type="button"
                        aria-label="Next page"
                        disabled={page >= totalPages}
                        onClick={() => setPage((current) => current + 1)}
                      >
                        <FiChevronRight />
                      </button>
                    </Pagination>
                  )}
                </>
              )}
            </section>
          </Layout>
        </Container>
      </Page>
    </>
  );
}

export default Properties;
