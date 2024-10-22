import React from "react";
import { Field } from "react-final-form";
import { useRouter } from "next/router";
import styled from "styled-components";
import LoginRegistrationLayout from "components/LoginRegistrationLayout";
import tempId from "lib/tempId";
import TextInput from "components/TextInput";
import PageQuery from "components/PageQuery";
import ImageUploadInput from "components/ImageUploadInput";
import Button from "components/Button";
// import SelectDropdown from "components/SelectDropdown";
import AddressDropdown from "components/AddressDropdown";
import permitUser from "lib/permit-user";
import VendorUser from "types/VendorUser";
import GenericNavigation from "components/GenericNavigation";

const CustomHeader = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes[5]}px;
  margin: 0;
`;

const CreateAccountButtonWrapper = styled.div`
  margin: 21px 0;
`;

// const Error = styled.div`
//   color: ${({ theme }) => theme.themeColors.orange2};
//   font-size: 0.9rem;
// `;

// const ErrorTitle = styled.b`
//   color: ${({ theme }) => theme.themeColors.orange2};
//   font-size: 0.9rem;
//   font-weight: ${({ theme }) => theme.fontWeights.bold};
// `;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TextInputWrapper = styled.div`
  margin: 21px 0 0 0;
`;

// const businessTypeOptions = [
//   { value: "cat_grooming", label: "Cat Grooming" },
//   { value: "dog_grooming", label: "Dog Grooming" },
//   { value: "cat_training", label: "Cat Training" },
//   { value: "dog_training", label: "Dog Training" },
// ];

// const BusinessTypeDropdown = (props) => (
//   <SelectDropdown
//     placeholder="Business Type"
//     displayLabel="Business Type"
//     isMulti
//     {...props}
//   />
// );

export default function BusinessRegistration({ vendorUser }) {
  const { push } = useRouter();

  return (
    <GenericNavigation>
      <LoginRegistrationLayout
        image="/cat_on_yellow_background.jpg"
        altText="cat on yellow background"
      >
        <div>
          <CustomHeader>Tell us about your business</CustomHeader>

          <PageQuery
            userType="vendor"
            query={{
              serviceTypes: {
                fields: ['name']
              },
              vendorBusiness: {
                writeOnly: true,
                id: tempId("vendorBusiness"),
                fields: [
                  "businessName",
                  "vendorUserId",
                  "phone",
                  "contactEmail",
                  "website",
                  "streetAddress",
                  "vendorUserId",
                  "logo",
                ],
                onCreate: ({ id }) => {
                  push(`/provider/${id}/dashboard/business-profile`);
                },
                mapToApi: ((node) => {
                  node.include.vendorServices = { data: [] };
                  node.serviceTypes.forEach((serviceType) => {
                    node.include.vendorServices.push({
                      id: tempId('vendor-service'),
                      attributes: {
                        vendorBusinessId: node.id,
                        serviceTypeId: serviceType,
                      }
                    })
                  });
                  return node;
                }),
              },
            }}
          >
            {({ data, handleSubmit, submitting }) => {
              // options for service types
              // [{ value: <id>, label: <name> }]
              const serviceTypeOptions = reduce(serviceTypes, (memo, val)) => {
                memo.push({ id: val.id, name: val.attributes.name });
              }, []);

              return (
                <>
                  <RegisterForm onSubmit={handleSubmit}>
                    <Field
                      type="hidden"
                      name="vendorBusiness.attributes.vendorUserId"
                      initialValue={vendorUser ? vendorUser.id : null}
                      component="input"
                    />

                    <Field
                      component={ServiceTypesField}
                      name="vendorBusiness.serviceTypes"
                      options={}
                    />

                    <TextInputWrapper>
                      <Field
                        id="business-name"
                        label="Business Name"
                        name="vendorBusiness.attributes.businessName"
                        component={TextInput}
                      />
                    </TextInputWrapper>

                    <TextInputWrapper>
                      <Field
                        id="business-logo"
                        logo="Logo"
                        name="vendorBusiness.attributes.logo"
                        component={ImageUploadInput}
                      />
                    </TextInputWrapper>

                    {/*
                    <TextInputWrapper>
                      <Field
                        id="business-type"
                        label="Business Type"
                        name="vendorBusiness.attributes.businessType"
                        options={businessTypeOptions}
                        component={BusinessTypeDropdown}
                      />
                      {get(errors, "business_type", []).map((e) => (
                        <Error key={e}>{e}</Error>
                      ))}
                    </TextInputWrapper>
                    */}

                    <TextInputWrapper>
                      <Field
                        id="business-phone"
                        inputMode="tel"
                        label="Business Phone Number"
                        name="vendorBusiness.attributes.phone"
                        component={TextInput}
                        type="tel"
                      />
                    </TextInputWrapper>

                    <TextInputWrapper>
                      <Field
                        autoComplete="email"
                        id="business-email"
                        inputMode="email"
                        label="Business Email"
                        name="vendorBusiness.attributes.contactEmail"
                        component={TextInput}
                        type="email"
                      />
                    </TextInputWrapper>
                    <TextInputWrapper>
                      <Field
                        autoComplete="url"
                        id="business-website"
                        inputMode="url"
                        label="Business Website"
                        name="vendorBusiness.attributes.website"
                        component={TextInput}
                      />
                    </TextInputWrapper>
                    <TextInputWrapper>
                      <Field
                        id="business-address"
                        label="Business Address"
                        name="vendorBusiness.attributes.streetAddress"
                        component={AddressDropdown}
                      />
                    </TextInputWrapper>
                    <CreateAccountButtonWrapper>
                      <Button type="submit" disabled={submitting}>
                        Next
                      </Button>
                    </CreateAccountButtonWrapper>
                  </RegisterForm>
                </>
              );
            }}
          </PageQuery>
        </div>
      </LoginRegistrationLayout>
    </GenericNavigation>
  );
}

BusinessRegistration.getInitialProps = async ({ res, store, asPath }) => {
  const vendorUser = await permitUser({
    store,
    asPath,
    res,
    userType: "vendor",
  });

  return {
    vendorUser,
  };
};

BusinessRegistration.propTypes = {
  vendorUser: VendorUser.isRequired,
};