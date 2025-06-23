import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { WineItem } from "../WineItem";
import { WineType } from "../../../types";

const mockWine = {
  id: "1",
  wineName: "Wine Name",
  wineMaker: "Wine Maker",
  grape: "Grape Variety",
  type: "Red" as WineType,
  year: 1988,
  rating: "5",
  region: "Wine Region",
  foodPairings: ["Cheese", "Bread"],
  attributeTags: ["Female Owned", "Organic"],
  labelImage: "https://example.com/image.jpg",
  synced: true,
  userId: "001",
  isFavourite: true,
};

describe("WineItem", () => {
  it("renders wine info correctly", () => {
    const { getByText } = render(
      <WineItem
        wine={mockWine}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onToggleFavourite={jest.fn()}
      />
    );
    expect(getByText("Wine Name")).toBeTruthy();
    expect(getByText("Wine Maker")).toBeTruthy();
    expect(getByText("Grape Variety")).toBeTruthy();
    expect(getByText("Red")).toBeTruthy();
    expect(getByText("1988")).toBeTruthy();
    expect(getByText("5")).toBeTruthy();
    expect(getByText("Wine Region")).toBeTruthy();
    expect(getByText("Cheese")).toBeTruthy();
    expect(getByText("Bread")).toBeTruthy();
    expect(getByText("Female Owned")).toBeTruthy();
    expect(getByText("Organic")).toBeTruthy();
  });

  it("calls onToggleFavourite when favourite button is pressed", () => {
    const onToggleFavourite = jest.fn();
    const { getByTestId } = render(
      <WineItem
        wine={mockWine}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onToggleFavourite={onToggleFavourite}
      />
    );
    fireEvent.press(getByTestId("favourite-button"));
    expect(onToggleFavourite).toHaveBeenCalledWith(mockWine.id);
  });

  it("shows outline icon when not favourite", () => {
    const wine = { ...mockWine, isFavourite: false };
    const { getByTestId } = render(
      <WineItem
        wine={wine}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onToggleFavourite={jest.fn()}
      />
    );
    const image = getByTestId("favourite-icon");
    expect(image.props.source).toMatchObject(
      require("../../assets/icons/FavouritesIconOutline.png")
    );
  });

  it("shows filled icon when favourite", () => {
    const wine = { ...mockWine, isFavourite: true };
    const { getByTestId } = render(
      <WineItem
        wine={wine}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onToggleFavourite={jest.fn()}
      />
    );
    const image = getByTestId("favourite-icon");
    expect(image.props.source).toMatchObject(
      require("../../assets/icons/FavouritesIcon.png")
    );
  });
});
