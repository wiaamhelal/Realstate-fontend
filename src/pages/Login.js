import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

import { loginUser, clearAuthError } from "../store/authSlice";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { fetchCurrentUser } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // useEffect(() => {
  //   useAuth();
  // }, [user]);
  const { loading, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidationError("");

    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();

    if (!email || !formData.password) {
      setValidationError("Please enter your email and password.");
      return;
    }

    try {
      await dispatch(
        loginUser({
          email,
          password: formData.password,
        })
      ).unwrap();

      await fetchCurrentUser();

      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    } catch {
      // The error message is managed by authSlice.
    }
  };
  console.log(user);
  return (
    <Page>
      <LoginCard>
        <Brand>
          <BrandMark>R</BrandMark>
          <BrandName>
            REAL<span>ESTATE</span>
          </BrandName>
        </Brand>

        <Eyebrow>WELCOME BACK</Eyebrow>

        <Heading>Sign in to your account</Heading>

        <Description>
          Find your next property and manage your real estate journey.
        </Description>

        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldLabel htmlFor="email">Email address</FieldLabel>

            <InputWrapper>
              <FieldIcon>
                <FiMail />
              </FieldIcon>

              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </InputWrapper>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="password">Password</FieldLabel>

            <InputWrapper>
              <FieldIcon>
                <FiLock />
              </FieldIcon>

              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </InputWrapper>
          </FieldGroup>

          {(validationError || error) && (
            <ErrorMessage role="alert">{validationError || error}</ErrorMessage>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign in <FiArrowRight />
              </>
            )}
          </SubmitButton>
        </Form>

        <FooterText>
          Don't have an account?{" "}
          <StyledLink to="/register">Create account</StyledLink>
        </FooterText>

        <SecurityNote>
          Your account is protected by secure authentication.
        </SecurityNote>
      </LoginCard>
    </Page>
  );
};

export default Login;

const Page = styled.main`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  background: radial-gradient(
      circle at 10% 10%,
      rgba(184, 149, 100, 0.09),
      transparent 35%
    ),
    #101713;
`;

const LoginCard = styled.section`
  width: 100%;
  max-width: 460px;
  padding: 42px;
  border: 1px solid rgba(184, 149, 100, 0.25);
  border-radius: 18px;
  background: #171e19;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);

  @media (max-width: 480px) {
    padding: 30px 22px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 38px;
`;

const BrandMark = styled.div`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #b89564;
  color: #111710;
  font-size: 25px;
  font-weight: 800;
`;

const BrandName = styled.div`
  color: #f5f2eb;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1.5px;

  span {
    color: #b89564;
    margin-left: 4px;
  }
`;

const Eyebrow = styled.p`
  margin-bottom: 10px;
  color: #b89564;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
`;

const Heading = styled.h1`
  margin: 0 0 12px;
  color: #f7f5ef;
  font-size: clamp(25px, 4vw, 31px);
  font-weight: 700;
  line-height: 1.3;
`;

const Description = styled.p`
  margin-bottom: 30px;
  color: #a5ada6;
  font-size: 14px;
  line-height: 1.8;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 21px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const FieldLabel = styled.label`
  color: #e7e9e4;
  font-size: 13px;
  font-weight: 600;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 51px;
  padding: 0 15px;
  border: 1px solid #354138;
  border-radius: 9px;
  background: #111713;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #b89564;
  }
`;

const FieldIcon = styled.span`
  display: flex;
  color: #b89564;
  font-size: 17px;
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #f7f5ef;
  font-size: 14px;

  &::placeholder {
    color: #727c73;
  }

  &:-webkit-autofill {
    -webkit-text-fill-color: #f7f5ef;
    transition: background-color 9999s ease-in-out 0s;
  }
`;

const ErrorMessage = styled.p`
  margin: 0;
  padding: 12px;
  border: 1px solid rgba(235, 100, 100, 0.3);
  border-radius: 8px;
  background: rgba(235, 100, 100, 0.08);
  color: #ff9999;
  font-size: 13px;
  line-height: 1.5;
`;

const SubmitButton = styled.button`
  width: 100%;
  min-height: 51px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
  border: none;
  border-radius: 9px;
  background: #b89564;
  color: #111710;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    background: #c9a978;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const FooterText = styled.p`
  margin: 26px 0 0;
  text-align: center;
  color: #a5ada6;
  font-size: 13px;
`;

const StyledLink = styled(Link)`
  color: #c6a475;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    color: #e0bf8c;
    text-decoration: underline;
  }
`;

const SecurityNote = styled.p`
  margin: 27px 0 0;
  padding-top: 19px;
  border-top: 1px solid #303a32;
  color: #7f8980;
  text-align: center;
  font-size: 11px;
`;
