import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Navbar from "../componets/layout/Navbar";
import api from "../utils/request";

const initialForm = {
  title: "",
  description: "",
  propertyType: "apartment",
  purpose: "sale",
  price: "",
  currency: "AED",
  bedrooms: "0",
  bathrooms: "0",
  area: "",
  areaUnit: "sqft",
  city: "",
  areaName: "",
  address: "",
};

const availableAmenities = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Security",
  "Balcony",
  "Garden",
  "Central AC",
  "Built-in Wardrobes",
  "Pet Friendly",
  "Children's Play Area",
];

function AddProperty() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = images.map((image) => URL.createObjectURL(image));

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files || []);

    if (images.length + selectedImages.length > 10) {
      setError("You can upload a maximum of 10 images.");
      e.target.value = "";
      return;
    }

    const validImages = selectedImages.filter((image) =>
      ["image/jpeg", "image/png", "image/webp"].includes(image.type)
    );

    if (validImages.length !== selectedImages.length) {
      setError("Only JPG, PNG, and WebP images are allowed.");
    } else {
      setError("");
    }

    const oversizedImage = validImages.some(
      (image) => image.size > 5 * 1024 * 1024
    );

    if (oversizedImage) {
      setError("Each image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    setImages((prev) => [...prev, ...validImages]);

    // Allow selecting the same file again later.
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Please enter the property title and description.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Please enter a valid property price.");
      return;
    }

    if (!form.area || Number(form.area) <= 0) {
      setError("Please enter a valid property area.");
      return;
    }

    if (!form.city.trim() || !form.areaName.trim()) {
      setError("Please enter the city and community.");
      return;
    }

    if (images.length === 0) {
      setError("Please select at least one property image.");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("propertyType", form.propertyType);
    formData.append("purpose", form.purpose);
    formData.append("price", form.price);
    formData.append("currency", form.currency);
    formData.append("bedrooms", form.bedrooms);
    formData.append("bathrooms", form.bathrooms);
    formData.append("area", form.area);
    formData.append("areaUnit", form.areaUnit);

    formData.append(
      "location",
      JSON.stringify({
        city: form.city.trim(),
        area: form.areaName.trim(),
        address: form.address.trim(),
      })
    );

    amenities.forEach((amenity) => {
      formData.append("amenities", amenity);
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      setLoading(true);

      const response = await api.post("/properties", formData);

      setSuccess("Property created successfully!");

      const propertyId = response.data?.property?._id;

      if (propertyId) {
        setTimeout(() => {
          navigate(`/properties/${propertyId}`);
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create property. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <Page>
        <PageHeader>
          <div>
            <Eyebrow>PROPERTY MANAGEMENT</Eyebrow>
            <PageTitle>Add a New Property</PageTitle>
            <PageDescription>
              Share your property with potential buyers and tenants.
            </PageDescription>
          </div>
        </PageHeader>

        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionHeading>
              <StepNumber>01</StepNumber>
              <div>
                <SectionTitle>Basic Information</SectionTitle>
                <SectionDescription>
                  Tell us about the property.
                </SectionDescription>
              </div>
            </SectionHeading>

            <Field>
              <Label>Property Title *</Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Modern Apartment with Marina Views"
                required
              />
            </Field>

            <Field>
              <Label>Description *</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the property, its features and surroundings..."
                rows={5}
                required
              />
            </Field>

            <TwoColumns>
              <Field>
                <Label>Property Type *</Label>
                <Select
                  name="propertyType"
                  value={form.propertyType}
                  onChange={handleChange}
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="office">Office</option>
                  <option value="shop">Shop</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="land">Land</option>
                </Select>
              </Field>

              <Field>
                <Label>Purpose *</Label>
                <Select
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </Select>
              </Field>
            </TwoColumns>
          </Section>

          <Section>
            <SectionHeading>
              <StepNumber>02</StepNumber>
              <div>
                <SectionTitle>Pricing & Property Details</SectionTitle>
                <SectionDescription>
                  Add the price and property specifications.
                </SectionDescription>
              </div>
            </SectionHeading>

            <TwoColumns>
              <Field>
                <Label>Price *</Label>
                <Input
                  type="number"
                  name="price"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 1850000"
                  required
                />
              </Field>

              <Field>
                <Label>Currency</Label>
                <Select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                >
                  <option value="AED">AED</option>
                </Select>
              </Field>

              <Field>
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  name="bedrooms"
                  min="0"
                  value={form.bedrooms}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  name="bathrooms"
                  min="0"
                  value={form.bathrooms}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>Area *</Label>
                <Input
                  type="number"
                  name="area"
                  min="1"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="e.g. 1240"
                  required
                />
              </Field>

              <Field>
                <Label>Area Unit</Label>
                <Select
                  name="areaUnit"
                  value={form.areaUnit}
                  onChange={handleChange}
                >
                  <option value="sqft">Square Feet (sqft)</option>
                  <option value="sqm">Square Meters (sqm)</option>
                </Select>
              </Field>
            </TwoColumns>
          </Section>

          <Section>
            <SectionHeading>
              <StepNumber>03</StepNumber>
              <div>
                <SectionTitle>Property Location</SectionTitle>
                <SectionDescription>
                  Where is the property located?
                </SectionDescription>
              </div>
            </SectionHeading>

            <TwoColumns>
              <Field>
                <Label>City *</Label>
                <Input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Dubai"
                  required
                />
              </Field>

              <Field>
                <Label>Area / Community *</Label>
                <Input
                  name="areaName"
                  value={form.areaName}
                  onChange={handleChange}
                  placeholder="e.g. Dubai Marina"
                  required
                />
              </Field>
            </TwoColumns>

            <Field>
              <Label>Full Address</Label>
              <Input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Building name, street, apartment number..."
              />
            </Field>
          </Section>

          <Section>
            <SectionHeading>
              <StepNumber>04</StepNumber>
              <div>
                <SectionTitle>Property Images</SectionTitle>
                <SectionDescription>
                  Upload up to 10 images. JPG, PNG or WebP, maximum 5 MB each.
                </SectionDescription>
              </div>
            </SectionHeading>

            <UploadArea>
              <UploadIcon>+</UploadIcon>
              <UploadTitle>Choose property images</UploadTitle>
              <UploadDescription>
                Select images from your device
              </UploadDescription>

              <UploadButton>
                Browse Images
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                />
              </UploadButton>
            </UploadArea>

            {previews.length > 0 && (
              <ImageGrid>
                {previews.map((preview, index) => (
                  <ImagePreview key={preview}>
                    <PreviewImage src={preview} alt={`Property ${index + 1}`} />
                    <RemoveImage
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label="Remove image"
                    >
                      ×
                    </RemoveImage>
                    {index === 0 && <MainImageLabel>Main image</MainImageLabel>}
                  </ImagePreview>
                ))}
              </ImageGrid>
            )}

            <ImageCount>{images.length} / 10 images selected</ImageCount>
          </Section>

          <Section>
            <SectionHeading>
              <StepNumber>05</StepNumber>
              <div>
                <SectionTitle>Amenities</SectionTitle>
                <SectionDescription>
                  Select the facilities available at this property.
                </SectionDescription>
              </div>
            </SectionHeading>

            <AmenitiesGrid>
              {availableAmenities.map((amenity) => (
                <AmenityOption key={amenity}>
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  />
                  <span>{amenity}</span>
                </AmenityOption>
              ))}
            </AmenitiesGrid>
          </Section>

          {error && <Message $error>{error}</Message>}
          {success && <Message $success>{success}</Message>}

          <SubmitArea>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Creating Property..." : "Create Property"}
            </SubmitButton>

            <CancelButton type="button" onClick={() => navigate(-1)}>
              Cancel
            </CancelButton>
          </SubmitArea>
        </Form>
      </Page>
    </>
  );
}

export default AddProperty;

// Styled Components

const Page = styled.main`
  min-height: 100vh;
  background: #f8f8f6;
  padding: 55px 24px 90px;
`;

const PageHeader = styled.div`
  max-width: 950px;
  margin: 0 auto 35px;
`;

const Eyebrow = styled.span`
  color: #b89564;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
`;

const PageTitle = styled.h1`
  color: #173c32;
  font-size: clamp(28px, 4vw, 38px);
  margin: 10px 0;
`;

const PageDescription = styled.p`
  color: #858981;
  font-size: 14px;
  margin: 0;
`;

const Form = styled.form`
  max-width: 950px;
  margin: 0 auto;
`;

const Section = styled.section`
  background: #fff;
  border: 1px solid #eaece8;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 22px;

  @media (max-width: 600px) {
    padding: 22px 17px;
  }
`;

const SectionHeading = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 28px;
`;

const StepNumber = styled.span`
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: #f5f0e8;
  color: #b89564;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
`;

const SectionTitle = styled.h2`
  color: #173c32;
  font-size: 18px;
  margin: 0 0 6px;
`;

const SectionDescription = styled.p`
  color: #92968f;
  font-size: 13px;
  margin: 0;
  line-height: 1.6;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 21px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  color: #333c36;
  font-size: 13px;
  font-weight: 600;
`;

const inputStyles = `
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e3e6e1;
  border-radius: 7px;
  padding: 13px 14px;
  color: #27362e;
  background: #fff;
  font-family: inherit;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #b89564;
  }

  &::placeholder {
    color: #b0b4ad;
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const Select = styled.select`
  ${inputStyles}
  cursor: pointer;
`;

const Textarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 120px;
  line-height: 1.7;
`;

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const UploadArea = styled.div`
  border: 1px dashed #cbd2ca;
  border-radius: 10px;
  padding: 35px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fbfcfa;
  text-align: center;
`;

const UploadIcon = styled.div`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f5f0e8;
  color: #b89564;
  font-size: 27px;
  margin-bottom: 12px;
`;

const UploadTitle = styled.h3`
  color: #173c32;
  font-size: 14px;
  margin: 0 0 7px;
`;

const UploadDescription = styled.p`
  color: #92968f;
  font-size: 12px;
  margin: 0 0 18px;
`;

const UploadButton = styled.label`
  position: relative;
  overflow: hidden;
  background: #173c32;
  color: #fff;
  padding: 11px 22px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    width: 100%;
    cursor: pointer;
  }

  &:hover {
    background: #245346;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 13px;
  margin-top: 22px;
`;

const ImagePreview = styled.div`
  height: 125px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0ed;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImage = styled.button`
  position: absolute;
  top: 7px;
  right: 7px;
  width: 25px;
  height: 25px;
  border: 0;
  border-radius: 50%;
  background: rgba(23, 60, 50, 0.9);
  color: #fff;
  font-size: 19px;
  cursor: pointer;
`;

const MainImageLabel = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(23, 60, 50, 0.9);
  color: #fff;
  padding: 6px;
  text-align: center;
  font-size: 10px;
`;

const ImageCount = styled.p`
  color: #92968f;
  font-size: 11px;
  margin: 13px 0 0;
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const AmenityOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #505951;
  font-size: 13px;
  cursor: pointer;

  input {
    accent-color: #173c32;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const Message = styled.div`
  padding: 13px 16px;
  border-radius: 7px;
  margin-bottom: 18px;
  font-size: 13px;
  background: ${({ $error, $success }) =>
    $error ? "#fff0ee" : $success ? "#edf7f0" : "#f5f5f5"};
  color: ${({ $error, $success }) =>
    $error ? "#b23b30" : $success ? "#246b3b" : "#333"};
`;

const SubmitArea = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 28px;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SubmitButton = styled.button`
  border: 0;
  border-radius: 7px;
  background: #173c32;
  color: #fff;
  padding: 15px 30px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #245346;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  border: 1px solid #dfe3dd;
  border-radius: 7px;
  background: #fff;
  color: #59645c;
  padding: 14px 25px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f7f8f6;
  }
`;
