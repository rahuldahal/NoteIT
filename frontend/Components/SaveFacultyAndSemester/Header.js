import React, { useEffect } from "react";
import Form from "@components/Form/Form";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import Greeting from "./Greeting";
import formFieldsDetail from "@components/SaveFacultyAndSemester/utils/formFieldsDetail";
import getFormFields from "@components/Form/utils/getFormFields";

export default function Header() {
  const { fieldRefs, fieldsJSX } = getFormFields(formFieldsDetail);

  async function handleFormSubmit(e) {
    e.preventDefault();
    console.log("submitting form...");
    fieldRefs.forEach((field) => console.log(field.current.value));
  }

  return (
    <section className="saveFacultyAndSemester__header">
      <Greeting />
      <Form
        className="form saveFacultyAndSemester__form"
        action="/users/saveFacultyAndSemester"
        method="POST"
        fieldsJSX={fieldsJSX}
        onSubmit={(e) => handleFormSubmit(e)}
      >
        <button type="submit" className="btn btn--large">
          <TextWithIcon
            textContent="Save"
            pathData={getIconPaths("save")}
            viewBox="0 0 512 512"
            fill="var(--black)"
            strokeWidth="0"
            iconWidth="2rem"
          />
        </button>
      </Form>
    </section>
  );
}
