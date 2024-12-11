/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchInput from "@/components/search/SearchInput";
import { mount } from "cypress/react18";

describe("<SearchInput />", () => {
  const id = "search-input";
  const label = "Search";
  let onChangeSpy: any;

  beforeEach(() => {
    onChangeSpy = cy.spy().as("onChangeSpy");
  });

  it("should render the correct elements", () => {
    // Mount the component
    mount(<SearchInput id={id} label={label} onChange={onChangeSpy} />);

    cy.get(`#${id}`).parent().contains(label);
  });

  it("should call the onChange function when input changes", () => {
    // Mount the component
    mount(<SearchInput id={id} label={label} onChange={onChangeSpy} />);

    const searchText = "Search Text";

    cy.get(`#${id}`).type(searchText);
    cy.wrap(onChangeSpy).should("be.calledWith", searchText);
    cy.get(`#${id}`).should("have.value", searchText);

    cy.get(`#${id}`).clear();
    cy.wrap(onChangeSpy).should("be.calledWith", "");
    cy.get(`#${id}`).should("have.value", "");
  });
});
