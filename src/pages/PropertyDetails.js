import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import PropertyCard from "../componets/proporties/PropertyCard";
import {
  FiArrowLeft,
  FiMapPin,
  FiMaximize2,
  FiHeart,
  FiShare2,
  FiCheckCircle,
  FiPhone,
  FiMail,
  FiMessageCircle,
  FiCalendar,
  FiHome,
  FiShield,
  FiGrid,
  FiDroplet,
} from "react-icons/fi";

import api from "../utils/request";
import Navbar from "../componets/layout/Navbar";

const RelatedSection = styled.section`
  margin-top: 55px;
  padding-top: 35px;
  border-top: 1px solid #e9e8e1;
`;

const RelatedHeader = styled.div`
  margin-bottom: 25px;

  h2 {
    color: #20372b;
    font-size: 25px;
    letter-spacing: -0.5px;
  }

  p {
    margin-top: 8px;
    color: #858981;
    font-size: 13px;
    line-height: 1.7;
  }
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

const RelatedMessage = styled.p`
  padding: 25px;
  border-radius: 9px;
  background: #fff;
  color: #858981;
  font-size: 13px;
  text-align: center;
`;

const Page = styled.main`
  min-height: 100vh;
  background: #f8f8f5;
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 35px 24px 80px;

  @media (max-width: 600px) {
    padding: 24px 16px 55px;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 27px;
  color: #657067;
  font-size: 13px;
  font-weight: 600;

  &:hover {
    color: #173c32;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 25px;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

const TitleGroup = styled.div`
  .badge {
    display: inline-block;
    margin-bottom: 13px;
    padding: 7px 11px;
    border-radius: 5px;
    background: #e8efe9;
    color: #173c32;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  h1 {
    color: #20372b;
    font-size: clamp(26px, 4vw, 39px);
    line-height: 1.25;
    letter-spacing: -1px;
  }

  .location {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 13px;
    color: #858981;
    font-size: 13px;
  }

  .location svg {
    color: #b89564;
    flex-shrink: 0;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;

  button {
    min-height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 13px;
    border: 1px solid #e4e4dc;
    border-radius: 7px;
    background: #fff;
    color: #344238;
    font-size: 12px;
    font-weight: 600;
  }

  button:hover {
    border-color: #b89564;
  }
  @media (max-width: 650px) {
    width: 100%;
    button {
      flex: 1;
      min-width: 0;
    }
  }
  @media (max-width: 400px) {
    button {
      padding: 0 10px;
    }
  }
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
  grid-template-rows: repeat(2, 220px);
  gap: 10px;
  overflow: hidden;
  border-radius: 13px;
  background: #eee;

  .gallery-image {
    position: relative;
    overflow: hidden;
    padding: 0;
    border: 0;
    background: #e7e5de;
    cursor: zoom-in;
  }

  .gallery-image:first-child {
    grid-row: 1 / 3;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s;
  }

  .gallery-image:hover img {
    transform: scale(1.035);
  }

  .image-count {
    position: absolute;
    right: 14px;
    bottom: 14px;
    padding: 9px 12px;
    border-radius: 6px;
    background: rgba(18, 35, 27, 0.88);
    color: white;
    font-size: 12px;
  }
  &.gallery-1 {
    grid-template-columns: 1fr;
    grid-template-rows: 420px;
  }

  &.gallery-1 .gallery-image:first-child {
    grid-row: auto;
    grid-column: auto;
  }

  &.gallery-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: 320px;
  }

  &.gallery-2 .gallery-image:first-child {
    grid-row: auto;
  }
  @media (max-width: 750px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 270px 135px;
    &.gallery-1 {
      grid-template-rows: 260px;
    }

    &.gallery-2 {
      grid-template-rows: 190px;
    }

    &.gallery-2 .gallery-image:first-child {
      grid-column: auto;
    }
    .gallery-image:first-child {
      grid-column: 1 / 3;
      grid-row: auto;
    }
  }

  @media (max-width: 420px) {
    grid-template-rows: 230px 100px;
    gap: 6px;
  }
`;

const NoImages = styled.div`
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  display: grid;
  place-items: center;
  color: #858981;
  background: #eeece6;
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  align-items: start;
  gap: 28px;
  margin-top: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ContentColumn = styled.div`
  min-width: 0;
`;

const Panel = styled.section`
  padding: 26px;
  margin-bottom: 20px;
  border: 1px solid #ecebe5;
  border-radius: 12px;
  background: #fff;

  h2 {
    color: #20372b;
    font-size: 19px;
    letter-spacing: -0.3px;
  }

  @media (max-width: 500px) {
    padding: 20px;
  }
  @media (max-width: 400px) {
    padding: 16px;
  }
`;

const Specs = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
  margin-top: 24px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Spec = styled.div`
  padding: 17px 12px;
  border-radius: 8px;
  background: #f8f7f3;

  svg {
    margin-bottom: 13px;
    color: #a17e50;
    font-size: 19px;
  }

  strong {
    display: block;
    color: #26392e;
    font-size: 15px;
  }

  span {
    display: block;
    margin-top: 6px;
    color: #858981;
    font-size: 11px;
  }
`;

const Description = styled.p`
  margin-top: 18px;
  color: #6e756d;
  font-size: 14px;
  line-height: 2;
  white-space: pre-line;
  overflow-wrap: anywhere;
`;

const Amenities = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
  margin-top: 22px;

  div {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #59645a;
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  svg {
    flex-shrink: 0;
    color: #a17e50;
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const SideColumn = styled.aside`
  position: sticky;
  top: 20px;

  @media (max-width: 900px) {
    position: static;
  }
`;

const ContactCard = styled.div`
  padding: 25px;
  border: 1px solid #e9e7df;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(27, 49, 36, 0.04);
  @media (max-width: 400px) {
    padding: 18px;
  }
`;

const Price = styled.div`
  color: #173c32;
  font-size: clamp(25px, 3vw, 31px);
  font-weight: 800;
  letter-spacing: -1px;
  overflow-wrap: anywhere;

  span {
    color: #858981;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0;
  }
`;

const ContactText = styled.p`
  margin: 12px 0 22px;
  color: #858981;
  font-size: 12px;
  line-height: 1.8;
`;

const ContactButton = styled.a`
  min-height: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 10px;
  padding: 12px;
  border: 1px solid ${({ $primary }) => ($primary ? "#173c32" : "#e5e5dc")};
  border-radius: 7px;
  background: ${({ $primary }) => ($primary ? "#173c32" : "#fff")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#344238")};
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    opacity: 0.9;
  }
`;

const AgentCard = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 24px;
  padding-top: 21px;
  border-top: 1px solid #eeece6;

  .avatar {
    width: 45px;
    height: 45px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    border-radius: 50%;
    background: #e8efe9;
    color: #173c32;
    font-size: 17px;
    font-weight: 800;
  }

  h3 {
    color: #26392e;
    font-size: 13px;
  }

  p {
    margin-top: 5px;
    color: #858981;
    font-size: 11px;
  }
`;

const Notice = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  color: #858981;
  font-size: 11px;
  line-height: 1.8;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: #a17e50;
  }
`;

const StateBox = styled.div`
  max-width: 600px;
  margin: 70px auto;
  padding: 45px 25px;
  border: 1px solid #ecebe5;
  border-radius: 12px;
  background: #fff;
  text-align: center;

  h2 {
    color: #20372b;
    font-size: 22px;
  }

  p {
    margin-top: 12px;
    color: #858981;
    font-size: 13px;
    line-height: 1.8;
  }

  a {
    display: inline-flex;
    margin-top: 22px;
    padding: 12px 17px;
    border-radius: 7px;
    background: #173c32;
    color: #fff;
    font-size: 13px;
  }
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 55px 70px;
  background: rgba(8, 17, 12, 0.96);

  img {
    max-width: 100%;
    max-height: 82vh;
    object-fit: contain;
    border-radius: 5px;
  }

  button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.35);
    background: rgba(255, 255, 255, 0.08);
    color: white;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .close-button {
    top: 20px;
    right: 25px;
    width: 42px;
    height: 42px;
    border-radius: 7px;
    font-size: 20px;
  }

  .nav-button {
    top: 50%;
    transform: translateY(-50%);
    width: 46px;
    height: 55px;
    border-radius: 7px;
    font-size: 23px;
  }

  .previous {
    left: 20px;
  }

  .next {
    right: 20px;
  }

  .image-counter {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 13px;
    background: rgba(0, 0, 0, 0.4);
    padding: 8px 14px;
    border-radius: 20px;
  }

  @media (max-width: 600px) {
    padding: 55px 12px;

    img {
      max-height: 75vh;
    }

    .nav-button {
      width: 36px;
      height: 45px;
      font-size: 18px;
    }

    .previous {
      left: 8px;
    }

    .next {
      right: 8px;
    }

    .close-button {
      top: 12px;
      right: 12px;
    }
  }
`;

function getPropertyFromResponse(data) {
  if (data?.property) return data.property;
  if (data?.data?.property) return data.data.property;
  if (data?.data && !Array.isArray(data.data)) return data.data;
  return data;
}

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [saved, setSaved] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const checkFavorite = async () => {
      try {
        const response = await api.get(`/favorites/${id}`);

        if (isMounted) {
          setSaved(response.data.isFavorite);
        }
      } catch (error) {
        if (isMounted && error.response?.status !== 401) {
          console.error("Unable to check favorite:", error);
        }
      }
    };

    checkFavorite();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleFavorite = async () => {
    if (favoriteLoading) return;

    setFavoriteLoading(true);
    setFavoriteError("");

    try {
      if (saved) {
        await api.delete(`/favorites/${id}`);
        setSaved(false);
      } else {
        await api.post(`/favorites/${id}`);
        setSaved(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setFavoriteError("Please log in to save properties.");
      } else {
        setFavoriteError(
          error.response?.data?.message ||
            "Unable to update favorites. Please try again."
        );
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProperty() {
      setLoading(true);
      setError("");
      setProperty(null);
      setActiveImageIndex(null);

      try {
        const response = await api.get(`/properties/${id}`, {
          signal: controller.signal,
        });

        const result = getPropertyFromResponse(response.data);

        if (!result || !(result._id || result.id)) {
          throw new Error("The server returned an invalid property.");
        }

        setProperty(result);

        // Tracking is best-effort; it must not block property details.
        api.post(`/properties/${id}/view`).catch(() => {});
      } catch (err) {
        if (err.code === "ERR_CANCELED") return;

        setError(
          err.response?.status === 404
            ? "This property could not be found. It may have been removed."
            : err.response?.data?.message ||
                err.message ||
                "Unable to load this property. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProperty();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (
      !property?.propertyType ||
      !property?.purpose ||
      !property?.location?.city
    ) {
      setRelatedProperties([]);
      setRelatedLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchRelatedProperties = async () => {
      try {
        setRelatedLoading(true);

        const response = await api.get("/properties", {
          params: {
            propertyType: property.propertyType,
            purpose: property.purpose,
            city: property.location.city,
            page: 1,
            limit: 10,
            sort: "newest",
          },
          signal: controller.signal,
        });

        const data = response.data;

        const properties = Array.isArray(data)
          ? data
          : Array.isArray(data?.data?.properties)
          ? data.data.properties
          : Array.isArray(data?.properties)
          ? data.properties
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const currentPropertyId = String(property._id || property.id);

        const filteredProperties = properties
          .filter((item) => String(item._id || item.id) !== currentPropertyId)
          .slice(0, 4);

        setRelatedProperties(filteredProperties);
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error("Failed to load related properties:", error);
          setRelatedProperties([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setRelatedLoading(false);
        }
      }
    };

    fetchRelatedProperties();

    return () => controller.abort();
  }, [property]);

  const images = (property?.images || [])
    .map((item) => (typeof item === "string" ? item : item?.url))
    .filter(Boolean);

  const fallbackImage =
    property?.image ||
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85";

  const galleryImages = images.length ? images : [fallbackImage];

  const showNextImage = () => {
    setActiveImageIndex((current) => (current + 1) % galleryImages.length);
  };

  const showPreviousImage = () => {
    setActiveImageIndex(
      (current) => (current - 1 + galleryImages.length) % galleryImages.length
    );
  };

  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        showNextImage();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "Escape") {
        setActiveImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImageIndex, galleryImages.length]);

  const location = [
    property?.location?.address,
    property?.location?.area,
    property?.location?.city,
  ]
    .filter(Boolean)
    .join(", ");

  const agent = property?.agent;
  const agentName = agent
    ? [agent.firstName, agent.lastName].filter(Boolean).join(" ")
    : "";

  const phone = agent?.phone || property?.agentPhone || "";
  const email = agent?.email || "";

  const formattedPrice = property
    ? new Intl.NumberFormat("en-AE", {
        maximumFractionDigits: 0,
      }).format(Number(property.price) || 0)
    : "";

  const purposeLabel = property?.purpose === "rent" ? "For rent" : "For sale";

  const propertyTypeLabel = property?.propertyType
    ? property.propertyType.charAt(0).toUpperCase() +
      property.propertyType.slice(1)
    : "Property";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property?.title || "Property details",
          text: property?.title || "View this property",
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Property link copied.");
      } else {
        window.prompt("Copy this property link:", window.location.href);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Could not share property:", err);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Page>
          <Container>
            <StateBox>
              <h2>Loading property details...</h2>
              <p>Please wait while we retrieve the property information.</p>
            </StateBox>
          </Container>
        </Page>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Navbar />
        <Page>
          <Container>
            <StateBox>
              <h2>Property unavailable</h2>
              <p>{error || "We could not find this property."}</p>
              <Link to="/properties">Back to properties</Link>
            </StateBox>
          </Container>
        </Page>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <Page>
        <Container>
          <BackLink to="/properties">
            <FiArrowLeft /> Back to properties
          </BackLink>

          <Header>
            <TitleGroup>
              <span className="badge">{purposeLabel}</span>
              <h1>{property.title}</h1>
              <div className="location">
                <FiMapPin />
                {location || "Location not specified"}
              </div>
            </TitleGroup>

            <HeaderActions>
              <button type="button" onClick={handleShare}>
                <FiShare2 /> Share
              </button>

              {/* <button
                type="button"
                aria-pressed={saved}
                onClick={() => setSaved((previous) => !previous)}
              >
                <FiHeart
                  color={saved ? "#b34e4e" : "currentColor"}
                  fill={saved ? "#b34e4e" : "none"}
                />
                {saved ? "Saved" : "Save"}
              </button> */}
              <button
                type="button"
                aria-pressed={saved}
                disabled={favoriteLoading}
                onClick={handleFavorite}
              >
                <FiHeart
                  color={saved ? "#b34e4e" : "currentColor"}
                  fill={saved ? "#b34e4e" : "none"}
                />
                {favoriteLoading ? "Saving..." : saved ? "Saved" : "Save"}
              </button>
            </HeaderActions>
            {favoriteError && <p>{favoriteError}</p>}
          </Header>

          <Gallery className={`gallery-${Math.min(galleryImages.length, 3)}`}>
            {galleryImages.slice(0, 3).map((image, index) => (
              <button
                className="gallery-image"
                type="button"
                key={`${image}-${index}`}
                onClick={() => setActiveImageIndex(index)}
                aria-label={`View property image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${property.title} - image ${index + 1}`}
                />

                {index === 2 && galleryImages.length > 3 && (
                  <span className="image-count">
                    +{galleryImages.length - 3} more photos
                  </span>
                )}
              </button>
            ))}

            {/* {galleryImages.length < 2 && (
              <NoImages>More property photos coming soon</NoImages>
            )} */}
          </Gallery>

          <MainLayout>
            <ContentColumn>
              <Panel>
                <h2>Property overview</h2>

                <Specs>
                  <Spec>
                    <FiHome />
                    <strong>{propertyTypeLabel}</strong>
                    <span>Property type</span>
                  </Spec>

                  <Spec>
                    <FiGrid />
                    <strong>{property.bedrooms ?? 0}</strong>
                    <span>Bedrooms</span>
                  </Spec>

                  <Spec>
                    <FiDroplet />
                    <strong>{property.bathrooms ?? 0}</strong>
                    <span>Bathrooms</span>
                  </Spec>

                  <Spec>
                    <FiMaximize2 />
                    <strong>
                      {Number(property.area || 0).toLocaleString()}
                    </strong>
                    <span>{property.areaUnit || "sqft"} area</span>
                  </Spec>
                </Specs>
              </Panel>

              <Panel>
                <h2>About this property</h2>
                <Description>
                  {property.description || "No description provided."}
                </Description>
              </Panel>

              <Panel>
                <h2>Property details</h2>

                <Amenities>
                  <div>
                    <FiCheckCircle />
                    <span>Purpose: {purposeLabel}</span>
                  </div>

                  <div>
                    <FiCheckCircle />
                    <span>Type: {propertyTypeLabel}</span>
                  </div>

                  <div>
                    <FiCheckCircle />
                    <span>Status: {property.status || "Available"}</span>
                  </div>

                  <div>
                    <FiCheckCircle />
                    <span>
                      Area: {Number(property.area || 0).toLocaleString()}{" "}
                      {property.areaUnit || "sqft"}
                    </span>
                  </div>
                </Amenities>
              </Panel>

              {Array.isArray(property.amenities) &&
                property.amenities.length > 0 && (
                  <Panel>
                    <h2>Features and amenities</h2>

                    <Amenities>
                      {property.amenities.map((amenity, index) => (
                        <div key={`${amenity}-${index}`}>
                          <FiCheckCircle />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </Amenities>
                  </Panel>
                )}
            </ContentColumn>

            <SideColumn>
              <ContactCard>
                <Price>
                  AED {formattedPrice}
                  {property.purpose === "rent" && <span> / year</span>}
                </Price>

                <ContactText>
                  Interested in this property? Contact the listing agent to ask
                  questions or arrange a viewing.
                </ContactText>

                {phone && (
                  <ContactButton $primary href={`tel:${phone}`}>
                    <FiPhone /> Call agent
                  </ContactButton>
                )}

                {phone && (
                  <ContactButton
                    href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FiMessageCircle /> WhatsApp
                  </ContactButton>
                )}

                {email && (
                  <ContactButton href={`mailto:${email}`}>
                    <FiMail /> Email agent
                  </ContactButton>
                )}

                {!phone && !email && (
                  <Notice>
                    <FiCalendar />
                    <span>
                      Agent contact details are not available for this listing
                      yet.
                    </span>
                  </Notice>
                )}

                {agent && (
                  <AgentCard>
                    <div className="avatar">
                      {agent.profileImage ? (
                        <img
                          src={agent.profileImage}
                          alt={agentName || "Property agent"}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        (agentName || "A").charAt(0).toUpperCase()
                      )}
                    </div>

                    <div>
                      <h3>{agentName || "Listing agent"}</h3>
                      <p>Property agent</p>
                    </div>
                  </AgentCard>
                )}

                <Notice>
                  <FiShield />
                  <span>
                    Verify property details and applicable fees with the agent
                    before making a decision.
                  </span>
                </Notice>
              </ContactCard>
            </SideColumn>
          </MainLayout>
          {(relatedLoading || relatedProperties.length > 0) && (
            <RelatedSection>
              <RelatedHeader>
                <h2>Related Properties</h2>
                <p>Explore similar properties in the same location.</p>
              </RelatedHeader>

              {relatedLoading ? (
                <RelatedMessage>Loading related properties...</RelatedMessage>
              ) : (
                <RelatedGrid>
                  {relatedProperties.map((relatedProperty) => (
                    <PropertyCard
                      key={relatedProperty._id || relatedProperty.id}
                      property={relatedProperty}
                    />
                  ))}
                </RelatedGrid>
              )}
            </RelatedSection>
          )}
        </Container>
      </Page>

      {/* {activeImage && (
        <Lightbox
          role="dialog"
          aria-modal="true"
          aria-label="Property image viewer"
          onClick={() => setActiveImage(null)}
        >
          <button type="button" onClick={() => setActiveImage(null)}>
            Close ✕
          </button>

          <img
            src={activeImage}
            alt={property.title}
            onClick={(event) => event.stopPropagation()}
          />
        </Lightbox>
      )} */}
      {activeImageIndex !== null && (
        <Lightbox
          role="dialog"
          aria-modal="true"
          aria-label="Property image viewer"
          onClick={() => setActiveImageIndex(null)}
        >
          <button
            className="close-button"
            type="button"
            onClick={() => setActiveImageIndex(null)}
            aria-label="Close gallery"
          >
            ✕
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                className="nav-button previous"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
                aria-label="Previous image"
              >
                &#10094;
              </button>

              <button
                className="nav-button next"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
                aria-label="Next image"
              >
                &#10095;
              </button>
            </>
          )}

          <img
            src={galleryImages[activeImageIndex]}
            alt={`${property.title} - image ${activeImageIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
          />

          <span className="image-counter">
            {activeImageIndex + 1} / {galleryImages.length}
          </span>
        </Lightbox>
      )}
    </>
  );
}

export default PropertyDetails;
