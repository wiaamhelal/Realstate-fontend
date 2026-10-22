import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiPlus } from "react-icons/fi";

const NavbarWrapper = styled.header`
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eeeae3;
  position: relative;
  z-index: 10;
`;

const Container = styled.nav`
  max-width: 1240px;
  min-height: 82px;
  margin: auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;

  @media (max-width: 768px) {
    min-height: 72px;
    padding: 0 18px;
  }
`;

const Logo = styled(Link)`
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -1px;
  color: #173c32;
  white-space: nowrap;

  span {
    color: #b89564;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  a {
    color: #626860;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
  }

  a:hover,
  a.active {
    color: #173c32;
  }

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    background: #fff;
    padding: 24px;
    flex-direction: column;
    align-items: stretch;
    gap: 22px;
    border-bottom: 1px solid #eeeae3;
    box-shadow: 0 14px 24px rgba(0, 0, 0, 0.05);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  .login {
    font-size: 14px;
    font-weight: 600;
    color: #173c32;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    gap: 12px;

    .login {
      display: none;
    }
  }
`;

const AddProperty = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 17px;
  border: 0;
  border-radius: 8px;
  background: #173c32;
  color: white;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover {
    background: #245748;
  }

  @media (max-width: 420px) {
    padding: 11px;
    font-size: 12px;
    gap: 5px;
  }
`;

const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: #173c32;
  font-size: 24px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <NavbarWrapper>
      <Container>
        <Logo to="/" onClick={closeMenu}>
          estate<span>.</span>
        </Logo>

        <NavLinks $open={menuOpen}>
          <Link className="active" to="/" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/properties" onClick={closeMenu}>
            Properties
          </Link>
          <Link to="/properties?purpose=rent" onClick={closeMenu}>
            Rent
          </Link>
          <Link to="/properties?purpose=sale" onClick={closeMenu}>
            Buy
          </Link>
          <a href="#locations" onClick={closeMenu}>
            Locations
          </a>
        </NavLinks>

        <Actions>
          <Link className="login" to="/login">
            Log in
          </Link>

          <AddProperty
            type="button"
            onClick={() => {
              window.location.href = "/add-property";
            }}
          >
            <FiPlus size={16} />
            List Property
          </AddProperty>

          <MenuButton
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </MenuButton>
        </Actions>
      </Container>
    </NavbarWrapper>
  );
}

export default Navbar;
