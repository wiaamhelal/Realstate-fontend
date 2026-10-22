import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiArrowRight,
  FiArrowUpRight,
  FiShield,
  FiHome,
  FiUsers,
} from "react-icons/fi";
import api from "../utils/request";
import Navbar from "../componets/layout/Navbar";
import PropertyCard from "../componets/proporties/PropertyCard";

const properties = [
  {
    id: "property-1",
    title: "Modern Apartment with Marina Views",
    price: 1850000,
    purpose: "sale",
    location: "Dubai Marina, Dubai",
    bedrooms: 2,
    bathrooms: 2,
    area: 1240,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "property-2",
    title: "Contemporary Luxury Villa",
    price: 420000,
    purpose: "rent",
    location: "Arabian Ranches, Dubai",
    bedrooms: 4,
    bathrooms: 5,
    area: 3400,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "property-3",
    title: "Elegant Downtown Residence",
    price: 2750000,
    purpose: "sale",
    location: "Downtown Dubai, Dubai",
    bedrooms: 2,
    bathrooms: 3,
    area: 1580,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
  },
];

const locations = [
  {
    name: "Dubai Marina",
    count: "Waterfront living",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Downtown Dubai",
    count: "City living",
    image:
      "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Palm Jumeirah",
    count: "Exclusive residences",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85",
  },
];

const Page = styled.main`
  overflow: hidden;
`;

const Hero = styled.section`
  position: relative;
  min-height: 590px;
  display: flex;
  align-items: center;
  background: linear-gradient(
      90deg,
      rgba(15, 37, 30, 0.94) 0%,
      rgba(15, 37, 30, 0.78) 44%,
      rgba(15, 37, 30, 0.18) 100%
    ),
    url("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=90")
      center 55% / cover no-repeat;

  @media (max-width: 768px) {
    min-height: 620px;
    background-position: center;
  }
`;

const HeroInner = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 75px 24px 90px;
  color: #fff;

  @media (max-width: 768px) {
    padding: 65px 20px 70px;
  }
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  color: #e2c69b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 28px;
    height: 1px;
    background: #b89564;
  }
`;

const HeroTitle = styled.h1`
  max-width: 700px;
  font-size: clamp(40px, 5.5vw, 70px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -2.5px;

  span {
    color: #d5b581;
  }

  @media (max-width: 600px) {
    letter-spacing: -1.5px;
  }
`;

const HeroDescription = styled.p`
  max-width: 490px;
  margin-top: 23px;
  color: rgba(255, 255, 255, 0.79);
  font-size: 15px;
  line-height: 1.9;
`;

const SearchBox = styled.form`
  max-width: 900px;
  margin-top: 38px;
  padding: 10px;
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr auto;
  gap: 8px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.17);

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 14px;
  }
`;

const SearchField = styled.label`
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  padding: 9px 14px;
  border-right: 1px solid #eeece6;

  span {
    color: #858981;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.7px;
    text-transform: uppercase;
  }

  select,
  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: #25362c;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    border-right: 0;
    border-bottom: 1px solid #eeece6;
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 23px;
  border: 0;
  border-radius: 8px;
  background: #b89564;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  transition: background 0.2s;

  &:hover {
    background: #9d7949;
  }

  @media (max-width: 768px) {
    min-height: 48px;
    grid-column: 1 / -1;
  }
`;

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 35px;
  margin-top: 38px;

  div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  strong {
    color: #fff;
    font-size: 22px;
  }

  span {
    color: rgba(255, 255, 255, 0.68);
    font-size: 12px;
  }

  @media (max-width: 480px) {
    gap: 22px;

    strong {
      font-size: 19px;
    }
  }
`;

const Section = styled.section`
  padding: 95px 24px;

  @media (max-width: 768px) {
    padding: 65px 20px;
  }
`;

const SectionInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const SectionEyebrow = styled.p`
  margin-bottom: 11px;
  color: #a17e50;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.7px;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  color: #20372b;
  font-size: clamp(27px, 3vw, 38px);
  font-weight: 750;
  line-height: 1.2;
  letter-spacing: -1px;
`;

const SectionDescription = styled.p`
  max-width: 490px;
  margin-top: 12px;
  color: #858981;
  font-size: 14px;
  line-height: 1.8;
`;

const ViewAll = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 0;
  border: 0;
  background: transparent;
  color: #173c32;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;

  svg {
    transition: transform 0.2s;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Benefits = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 55px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const Benefit = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;

  .icon {
    flex-shrink: 0;
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: #f5f1e9;
    color: #947345;
    font-size: 21px;
  }

  h3 {
    margin: 2px 0 7px;
    color: #26392e;
    font-size: 15px;
  }

  p {
    color: #858981;
    font-size: 12px;
    line-height: 1.8;
  }
`;

const LocationsSection = styled(Section)`
  background: #f7f6f2;
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
  }
`;

const LocationCard = styled.button`
  position: relative;
  min-height: 330px;
  overflow: hidden;
  border: 0;
  border-radius: 13px;
  text-align: left;
  background: #25362c;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.03) 20%,
      rgba(9, 24, 18, 0.86) 100%
    );
    z-index: 1;
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  &:hover img {
    transform: scale(1.06);
  }

  .location-content {
    position: absolute;
    z-index: 2;
    right: 23px;
    bottom: 24px;
    left: 23px;
    color: #fff;
  }

  .subtitle {
    display: block;
    margin-bottom: 9px;
    color: #e0c69b;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .location-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 21px;
    font-weight: 700;
  }

  @media (max-width: 750px) {
    min-height: 280px;
  }
`;

const BottomCta = styled.section`
  padding: 75px 24px;
  background: #173c32;
  color: #fff;
`;

const CtaInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;

  h2 {
    max-width: 600px;
    font-size: clamp(26px, 3vw, 38px);
    line-height: 1.25;
    letter-spacing: -0.8px;
  }

  p {
    margin-top: 13px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    line-height: 1.8;
  }

  @media (max-width: 700px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const CtaButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-shrink: 0;
  padding: 15px 21px;
  border: 0;
  border-radius: 7px;
  background: #c4a16d;
  color: #fff;
  font-size: 13px;
  font-weight: 700;

  &:hover {
    background: #ae8955;
  }
`;

const Footer = styled.footer`
  padding: 28px 24px;
  background: #102b23;
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;

  div {
    max-width: 1240px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    gap: 15px;
    flex-wrap: wrap;
  }

  strong {
    color: #fff;
  }
`;

function Home() {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState("sale");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (purpose) params.set("purpose", purpose);
    if (propertyType) params.set("propertyType", propertyType);
    if (location.trim()) params.set("city", location.trim());

    navigate(`/properties?${params.toString()}`);
  };

  const openLocation = (name) => {
    navigate(`/properties?city=${encodeURIComponent(name)}`);
  };

  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState("");

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setFeaturedLoading(true);
        setFeaturedError("");

        const response = await api.get("/properties", {
          params: {
            featured: true,
            status: "available",
            limit: 3,
            page: 1,
            sort: "newest",
          },
        });

        const data = response.data;

        const properties = Array.isArray(data)
          ? data
          : Array.isArray(data?.properties)
          ? data.properties
          : Array.isArray(data?.data?.properties)
          ? data.data.properties
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setFeaturedProperties(properties);
      } catch (error) {
        console.error("Failed to fetch featured properties:", error);
        setFeaturedError("Unable to load featured properties.");
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);
  console.log(featuredProperties);
  return (
    <>
      <Navbar />

      <Page>
        <Hero>
          <HeroInner>
            <Eyebrow>Discover your next address</Eyebrow>

            <HeroTitle>
              Find a place
              <br />
              to call <span>home.</span>
            </HeroTitle>

            <HeroDescription>
              Explore exceptional properties across Dubai. From contemporary
              apartments to private villas, discover a space that fits your
              lifestyle.
            </HeroDescription>

            <SearchBox onSubmit={handleSearch}>
              <SearchField>
                <span>I am looking to</span>
                <select
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                >
                  <option value="sale">Buy a property</option>
                  <option value="rent">Rent a property</option>
                </select>
              </SearchField>

              <SearchField>
                <span>Property type</span>
                <select
                  value={propertyType}
                  onChange={(event) => setPropertyType(event.target.value)}
                >
                  <option value="">All property types</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="office">Office</option>
                </select>
              </SearchField>

              <SearchField>
                <span>Location</span>
                <input
                  type="text"
                  placeholder="e.g. Dubai Marina"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </SearchField>

              <SearchButton type="submit">
                <FiSearch size={17} />
                Search
              </SearchButton>
            </SearchBox>

            <Stats>
              <div>
                <strong>1,200+</strong>
                <span>Properties listed</span>
              </div>
              <div>
                <strong>350+</strong>
                <span>Trusted agents</span>
              </div>
              <div>
                <strong>25+</strong>
                <span>Dubai communities</span>
              </div>
            </Stats>
          </HeroInner>
        </Hero>

        <Section>
          <SectionInner>
            <SectionHeader>
              <div>
                <SectionEyebrow>Handpicked for you</SectionEyebrow>
                <SectionTitle>Featured properties</SectionTitle>
                <SectionDescription>
                  Explore a selection of standout homes and investment
                  opportunities in Dubai.
                </SectionDescription>
              </div>

              <ViewAll type="button" onClick={() => navigate("/properties")}>
                View all properties <FiArrowRight />
              </ViewAll>
            </SectionHeader>

            <PropertyGrid>
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </PropertyGrid>

            <Benefits>
              <Benefit>
                <div className="icon">
                  <FiShield />
                </div>
                <div>
                  <h3>Properties you can trust</h3>
                  <p>
                    A clear, organized way to explore listings and compare your
                    options.
                  </p>
                </div>
              </Benefit>

              <Benefit>
                <div className="icon">
                  <FiHome />
                </div>
                <div>
                  <h3>Homes for every lifestyle</h3>
                  <p>
                    Browse apartments, villas, and other property types in one
                    place.
                  </p>
                </div>
              </Benefit>

              <Benefit>
                <div className="icon">
                  <FiUsers />
                </div>
                <div>
                  <h3>Connect with agents</h3>
                  <p>
                    Find property details and agent information to support your
                    next move.
                  </p>
                </div>
              </Benefit>
            </Benefits>
          </SectionInner>
        </Section>

        <LocationsSection id="locations">
          <SectionInner>
            <SectionHeader>
              <div>
                <SectionEyebrow>Explore Dubai</SectionEyebrow>
                <SectionTitle>Discover popular locations</SectionTitle>
                <SectionDescription>
                  Explore some of Dubai’s best-known communities and find the
                  area that suits you.
                </SectionDescription>
              </div>
            </SectionHeader>

            <LocationGrid>
              {locations.map((item) => (
                <LocationCard
                  key={item.name}
                  type="button"
                  onClick={() => openLocation(item.name)}
                >
                  <img src={item.image} alt={item.name} loading="lazy" />

                  <span className="location-content">
                    <span className="subtitle">{item.count}</span>
                    <span className="location-name">
                      {item.name}
                      <FiArrowUpRight size={21} />
                    </span>
                  </span>
                </LocationCard>
              ))}
            </LocationGrid>
          </SectionInner>
        </LocationsSection>

        <BottomCta>
          <CtaInner>
            <div>
              <h2>Have a property to sell or rent?</h2>
              <p>
                Showcase your property and connect with people looking for their
                next home.
              </p>
            </div>

            <CtaButton type="button" onClick={() => navigate("/add-property")}>
              List your property <FiArrowRight />
            </CtaButton>
          </CtaInner>
        </BottomCta>

        <Footer>
          <div>
            <span>
              <strong>estate.</strong> — Your next move starts here.
            </span>
            <span>
              © {new Date().getFullYear()} Estate. All rights reserved.
            </span>
          </div>
        </Footer>
      </Page>
    </>
  );
}

export default Home;
