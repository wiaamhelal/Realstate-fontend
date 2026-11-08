import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiArrowRight,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { registerUser, clearAuthError } from "../store/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // If the user is already authenticated, don't show registration
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

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

    const { firstName, lastName, email, phone, password, confirmPassword } =
      formData;

    const normalizedEmail = email.trim().toLowerCase();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !normalizedEmail ||
      !password
    ) {
      setValidationError("Please complete all required fields.");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      await dispatch(
        registerUser({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          password,
        })
      ).unwrap();

      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    } catch {
      // Error is managed by authSlice.
    }
  };

  return (
    <Page>
      <RegisterCard>
        <Brand>
          <BrandMark>R</BrandMark>
          <BrandName>
            REAL<span>ESTATE</span>
          </BrandName>
        </Brand>

        <Eyebrow>JOIN OUR COMMUNITY</Eyebrow>

        <Heading>Create your account</Heading>

        <Description>
          Create an account to explore properties and manage your real estate
          journey.
        </Description>

        <Form onSubmit={handleSubmit}>
          <NameRow>
            <FieldGroup>
              <FieldLabel htmlFor="firstName">First name</FieldLabel>

              <InputWrapper>
                <FieldIcon>
                  <FiUser />
                </FieldIcon>

                <Input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
              </InputWrapper>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="lastName">Last name</FieldLabel>

              <InputWrapper>
                <FieldIcon>
                  <FiUser />
                </FieldIcon>

                <Input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </InputWrapper>
            </FieldGroup>
          </NameRow>

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
            <FieldLabel htmlFor="phone">
              Phone number <Optional>(Optional)</Optional>
            </FieldLabel>

            <InputWrapper>
              <FieldIcon>
                <FiPhone />
              </FieldIcon>

              <Input
                id="phone"
                type="tel"
                name="phone"
                placeholder="+971 50 123 4567"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
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
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <PasswordToggle
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </InputWrapper>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>

            <InputWrapper>
              <FieldIcon>
                <FiLock />
              </FieldIcon>

              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </InputWrapper>
          </FieldGroup>

          {(validationError || error) && (
            <ErrorMessage role="alert">{validationError || error}</ErrorMessage>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              "Creating account..."
            ) : (
              <>
                Create account <FiArrowRight />
              </>
            )}
          </SubmitButton>
        </Form>

        <FooterText>
          Already have an account? <StyledLink to="/login">Sign in</StyledLink>
        </FooterText>

        <SecurityNote>
          Your personal information is protected by secure authentication.
        </SecurityNote>
      </RegisterCard>
    </Page>
  );
};

export default Register;

// STYLES

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

const RegisterCard = styled.section`
  width: 100%;
  max-width: 510px;
  padding: 42px;
  border: 1px solid rgba(184, 149, 100, 0.25);
  border-radius: 18px;
  background: #171e19;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);

  @media (max-width: 520px) {
    padding: 30px 22px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
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
  margin-bottom: 28px;
  color: #a5ada6;
  font-size: 14px;
  line-height: 1.8;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 19px;
`;

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
`;

const FieldLabel = styled.label`
  color: #e7e9e4;
  font-size: 13px;
  font-weight: 600;
`;

const Optional = styled.span`
  color: #7f8980;
  font-size: 11px;
  font-weight: 400;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 51px;
  padding: 0 13px;
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
  flex-shrink: 0;
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

const PasswordToggle = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border: none;
  background: transparent;
  color: #89948b;
  font-size: 17px;
  cursor: pointer;

  &:hover {
    color: #b89564;
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
  margin: 25px 0 0;
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
  margin: 25px 0 0;
  padding-top: 19px;
  border-top: 1px solid #303a32;
  color: #7f8980;
  text-align: center;
  font-size: 11px;
  line-height: 1.6;
`;
