import { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiPlus } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiChevronDown, FiLogOut } from "react-icons/fi";
import { logoutUser } from "../../store/authSlice";
import { useDispatch } from "react-redux";

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

const UserMenuWrapper = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px 7px 7px;
  border: 1px solid rgba(184, 149, 100, 0.3);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(184, 149, 100, 0.12);
    border-color: #b89564;
  }

  > svg {
    color: #b89564;
    transition: transform 0.25s ease;
  }

  > svg.rotated {
    transform: rotate(180deg);
  }
`;

const UserAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #b89564;
  color: #173c32;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  max-width: 150px;
`;

const UserName = styled.span`
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
  color: #173c32;
}
`;

const UserLabel = styled.span`
  color: #b89564;
  font-size: 11px;
`;

const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 190px;
  padding: 7px;
  background: #fff;
  border: 1px solid #eee7dc;
  border-radius: 14px;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.16);
  z-index: 1000;

  &::before {
    content: "";
    position: absolute;
    top: -6px;
    right: 22px;
    width: 10px;
    height: 10px;
    background: #fff;
    border-top: 1px solid #eee7dc;
    border-left: 1px solid #eee7dc;
    transform: rotate(45deg);
  }
`;

const DropdownItem = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: #b33b32;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #fff1ef;
  }
`;

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, authLoading, logout } = useAuth();
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
          {/* <Link className="login" to="/login">
            Log in
          </Link> */}

          {/* {!authLoading &&
            (user ? (
              <div>
                <span>{user.name || user.username || user.email}</span>
                <button
                  type="button"
                  onClick={() => {
                    // سنضيف تسجيل الخروج الفعلي بعد مراجعة الـ Backend.
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link className="login" to="/login">
                Log in
              </Link>
            ))} */}

          {!authLoading &&
            (user ? (
              <UserMenuWrapper>
                <UserMenuButton
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-expanded={userMenuOpen}
                >
                  <UserAvatar>
                    <FiUser size={18} />
                  </UserAvatar>

                  <UserInfo>
                    <UserName>
                      {user.name || user.username || user.email}
                    </UserName>
                    <UserLabel>My Account</UserLabel>
                  </UserInfo>

                  <FiChevronDown
                    className={userMenuOpen ? "rotated" : ""}
                    size={16}
                  />
                </UserMenuButton>

                {userMenuOpen && (
                  <UserDropdown>
                    <DropdownItem
                      type="button"
                      // onClick={() => dispatch(logoutUser)}

                      onClick={async () => {
                        try {
                          logout();
                          setUserMenuOpen(false);
                          closeMenu();
                          navigate("/login", { replace: true });
                        } catch (error) {
                          console.error("Unable to log out.");
                        }
                      }}
                    >
                      <FiLogOut size={17} />
                      <span>Logout</span>
                    </DropdownItem>
                  </UserDropdown>
                )}
              </UserMenuWrapper>
            ) : (
              <Link className="login" to="/login">
                Log in
              </Link>
            ))}

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
