/* eslint-disable @typescript-eslint/no-explicit-any */

import ImageCard from "@/components/cards/ImageCard/ImageCard";
import { mount } from "cypress/react18";

describe("<ImageCard />", () => {
  let cardProps: {
    id: string;
    idDisplay: string;
    title: string;
    imageSrc: string;
    actionButton?: React.ReactNode;
    extraContent?: React.ReactNode;
    onCardClick?: () => void;
    cardClasses?: string;
    imgAlt?: string;
  };

  beforeEach(() => {
    cardProps = {
      id: "test-card-id",
      idDisplay: "1",
      title: "Test Card Title",
      imageSrc: "https://via.placeholder.com/150",
      actionButton: <button>Action</button>,
      extraContent: <div>Extra Content</div>,
      onCardClick: cy.stub().as("cardClick"),
      cardClasses: "test-card-class",
      imgAlt: "Test Image Alt",
    };
  });

  it("should render card with correct content", () => {
    mount(<ImageCard {...cardProps} />);

    cy.contains(cardProps.idDisplay).should("be.visible");
    cy.contains(cardProps.title).should("be.visible");
    cy.get("img").should("have.attr", "src", cardProps.imageSrc);
    cy.get("img").should("have.attr", "alt", cardProps.imgAlt);
    cy.contains("Extra Content").should("be.visible");
  });

  it("should render action button correctly", () => {
    mount(<ImageCard {...cardProps} />);

    cy.contains("Action").should("be.visible");
  });

  it("should call onCardClick when card is clicked", () => {
    mount(<ImageCard {...cardProps} />);

    cy.get(`#${cardProps.id}`).click();
    cy.get("@cardClick").should("be.calledOnce");
  });

  it("should apply custom classes", () => {
    mount(<ImageCard {...cardProps} />);

    cy.get(`#${cardProps.id}`).should("have.class", cardProps.cardClasses);
  });
});
