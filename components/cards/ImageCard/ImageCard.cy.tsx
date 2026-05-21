/* eslint-disable @typescript-eslint/no-explicit-any */

import ImageCard from "@/components/cards/ImageCard/ImageCard";
import { noImageAvailableSrc } from "@/helpers/errors";
import { getThumbnailUrl } from "@/helpers/images";
import { mount } from "cypress/react18";

describe("<ImageCard />", () => {
  const triggerImageError = () => {
    cy.get("img").then(($img) => {
      $img[0].dispatchEvent(new Event("error"));
    });
  };

  let cardProps: {
    id: string;
    idDisplay: string;
    title: string;
    imageSrc?: string;
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
      imageSrc: "https://example.com/poster.jpg",
      actionButton: <button>Action</button>,
      extraContent: <div>Extra Content</div>,
      onCardClick: cy.stub().as("cardClick"),
      cardClasses: "test-card-class",
      imgAlt: "Test Image Alt",
    };
  });

  it("should render card with correct content", () => {
    mount(<ImageCard {...cardProps} />);

    const expectedThumb = getThumbnailUrl(cardProps.imageSrc, 500, 20);

    cy.contains(cardProps.idDisplay).should("be.visible");
    cy.contains(cardProps.title).should("be.visible");
    cy.get("img").should("have.attr", "src", expectedThumb);
    cy.get("img").should("have.attr", "alt", cardProps.imgAlt);
    cy.contains("Extra Content").should("be.visible");
  });

  it("should fall back to the original image when the thumbnail proxy fails", () => {
    mount(<ImageCard {...cardProps} />);

    triggerImageError();

    cy.get("img").should("have.attr", "src", cardProps.imageSrc);
  });

  it("should fall back to the default image when the original image also fails", () => {
    mount(<ImageCard {...cardProps} />);

    triggerImageError();
    triggerImageError();

    cy.get("img").should("have.attr", "src", noImageAvailableSrc);
  });

  it("should render the default image when no image source is provided", () => {
    const propsWithoutImage = { ...cardProps };
    delete propsWithoutImage.imageSrc;

    mount(<ImageCard {...propsWithoutImage} />);

    cy.get("img").should("have.attr", "src", noImageAvailableSrc);
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
