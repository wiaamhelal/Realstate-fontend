import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiMapPin,
  FiHome,
  FiMaximize2,
  FiArrowUpRight,
} from "react-icons/fi";

const Card = styled.article`
  min-width: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid #eeeae3;
  border-radius: 14px;
  transition: transform 0.25s, box-shadow 0.25s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 35px rgba(25, 45, 35, 0.09);
  }
`;

const ImageWrapper = styled.div`
  height: 235px;
  position: relative;
  overflow: hidden;
  background: #f0eee8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }

  @media (max-width: 600px) {
    height: 220px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 7px 11px;
  border-radius: 5px;
  background: #fff;
  color: #173c32;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.95);
  color: #263b31;
  font-size: 17px;
`;

const Content = styled.div`
  padding: 20px;
`;

const Price = styled.div`
  color: #173c32;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;

  span {
    font-size: 12px;
    font-weight: 500;
    color: #8b8e87;
    letter-spacing: 0;
  }
`;

const PropertyTitle = styled(Link)`
  display: block;
  margin-top: 10px;
  color: #242b25;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;

  &:hover {
    color: #947345;
  }
`;

const Location = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 9px;
  color: #858981;
  font-size: 12px;

  svg {
    flex-shrink: 0;
    color: #b89564;
  }
`;

const Divider = styled.div`
  height: 1px;
  margin: 18px 0 15px;
  background: #f0eee8;
`;

const Features = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #686e66;
  font-size: 12px;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }

  svg {
    color: #b89564;
    font-size: 15px;
  }
`;

const DetailsLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 18px;
  padding: 12px;
  border: 1px solid #dce3dc;
  border-radius: 7px;
  color: #173c32;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s;

  &:hover {
    background: #173c32;
    color: #fff;
    border-color: #173c32;
  }
`;

// function PropertyCard({ property }) {
function PropertyCard({
  property,
  isFavorite = false,
  onFavorite,
  favoriteLoading = false,
}) {
  const { _id, title, price, purpose, bedrooms, bathrooms, area, featured } =
    property;

  const propertyId = _id || property.id;

  const formattedPrice = new Intl.NumberFormat("en-AE", {
    maximumFractionDigits: 0,
  }).format(price || 0);

  return (
    <Card>
      <ImageWrapper>
        <img
          src={property?.images?.[0]?.url || "/images/property-placeholder.jpg"}
          alt={title || "Property"}
          loading="lazy"
        />

        <Badge>{featured ? "Featured" : purpose}</Badge>

        {/* <FavoriteButton
          type="button"
          aria-label="Add to favorites"
          onClick={() => {
            // سنربط هذا الزر بواجهة Favorites API لاحقًا.
          }}
        >
          <FiHeart />
        </FavoriteButton> */}
        <FavoriteButton
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          disabled={favoriteLoading}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onFavorite?.(propertyId);
          }}
          style={{
            color: isFavorite ? "#b89564" : "#263b31",
            opacity: favoriteLoading ? 0.6 : 1,
            cursor: favoriteLoading ? "not-allowed" : "pointer",
          }}
        >
          <FiHeart fill={isFavorite ? "#b89564" : "none"} />
        </FavoriteButton>
      </ImageWrapper>

      <Content>
        <Price>
          AED {formattedPrice}
          {purpose === "rent" && <span> / year</span>}
        </Price>
        <PropertyTitle to={`/properties/${propertyId}`}>{title}</PropertyTitle>

        <Location>
          <FiMapPin size={15} />
          {[property.location?.area, property.location?.city]
            .filter(Boolean)
            .join(", ") || "Location unavailable"}
        </Location>

        <Divider />
        <Features>
          <span>
            <FiHome /> {bedrooms ?? 0} Beds
          </span>

          <span>
            <FiMaximize2 /> {area ?? 0} sqft
          </span>
        </Features>
        <DetailsLink to={`/properties/${propertyId}`}>
          View Details <FiArrowUpRight />
        </DetailsLink>
      </Content>
    </Card>
  );
}

export default PropertyCard;
