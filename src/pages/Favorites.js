import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import Navbar from "../componets/layout/Navbar";
import PropertyCard from "../componets/proporties/PropertyCard";
import api from "../utils/request";

const Page = styled.main`
  min-height: 100vh;
  background: #f8f8f5;
`;

const Container = styled.div`
  width: min(1200px, 92%);
  margin: 0 auto;
  padding: 55px 0 80px;
`;

const Header = styled.div`
  margin-bottom: 35px;

  h1 {
    color: #173c32;
    font-size: clamp(28px, 4vw, 38px);
    margin: 0 0 10px;
  }

  p {
    color: #858981;
    font-size: 14px;
    margin: 0;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 25px;
  color: #947345;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: #173c32;
  }
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 25px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StateMessage = styled.div`
  padding: 65px 20px;
  text-align: center;
  background: #fff;
  border: 1px solid #eeeae3;
  border-radius: 14px;

  svg {
    color: #b89564;
    font-size: 38px;
    margin-bottom: 15px;
  }

  h2 {
    color: #173c32;
    font-size: 21px;
    margin: 0 0 10px;
  }

  p {
    color: #858981;
    font-size: 14px;
    margin: 0 0 22px;
  }
`;

const BrowseLink = styled(Link)`
  display: inline-flex;
  padding: 12px 22px;
  border-radius: 7px;
  background: #173c32;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background: #245343;
  }
`;

const ErrorMessage = styled.p`
  color: #b42318;
  background: #fff1f0;
  border: 1px solid #ffd5d2;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 13px;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-top: 40px;

  button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 15px;
    border: 1px solid #dce3dc;
    border-radius: 7px;
    background: #fff;
    color: #173c32;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  span {
    color: #686e66;
    font-size: 13px;
  }
`;

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchFavorites = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/favorites", {
          params: {
            page,
            limit: 12,
          },
        });

        const result = response.data?.data;

        if (isMounted) {
          const validFavorites = (result?.favorites || []).filter(
            (favorite) => favorite.property
          );

          setFavorites(validFavorites);
          setPagination(result?.pagination || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load your favorite properties."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFavorites();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const handleRemoveFavorite = async (propertyId) => {
    if (removingId) return;

    setRemovingId(propertyId);
    setError("");

    try {
      await api.delete(`/favorites/${propertyId}`);

      setFavorites((previous) =>
        previous.filter((favorite) => favorite.property?._id !== propertyId)
      );

      setPagination((previous) => {
        if (!previous) return previous;

        const total = Math.max(0, previous.total - 1);
        const pages = Math.ceil(total / previous.limit);

        return {
          ...previous,
          total,
          count: Math.max(0, previous.count - 1),
          pages,
        };
      });

      if (favorites.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to remove this property from favorites."
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Page>
      <Navbar />

      <Container>
        <BackLink to="/properties">
          <FiArrowLeft /> Back to properties
        </BackLink>

        <Header>
          <h1>My Favorites</h1>
          <p>
            Your saved properties, all in one place.
            {pagination && ` ${pagination.total} saved properties.`}
          </p>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading ? (
          <StateMessage>
            <p>Loading your favorite properties...</p>
          </StateMessage>
        ) : favorites.length === 0 ? (
          <StateMessage>
            <FiHeart />
            <h2>No favorites yet</h2>
            <p>
              You haven't saved any properties yet. Explore our listings and
              save the ones you like.
            </p>
            <BrowseLink to="/properties">Explore Properties</BrowseLink>
          </StateMessage>
        ) : (
          <>
            <PropertyGrid>
              {favorites.map((favorite) => (
                <PropertyCard
                  key={favorite._id}
                  property={favorite.property}
                  isFavorite={true}
                  onFavorite={handleRemoveFavorite}
                  favoriteLoading={removingId === favorite.property?._id}
                />
              ))}
            </PropertyGrid>

            {pagination && pagination.pages > 1 && (
              <Pagination>
                <button
                  type="button"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((previous) => previous - 1)}
                >
                  <FiChevronLeft /> Previous
                </button>

                <span>
                  Page {pagination.page} of {pagination.pages}
                </span>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((previous) => previous + 1)}
                >
                  Next <FiChevronRight />
                </button>
              </Pagination>
            )}
          </>
        )}
      </Container>
    </Page>
  );
}

export default Favorites;
