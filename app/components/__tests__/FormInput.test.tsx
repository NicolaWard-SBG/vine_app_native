import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FormInput } from "../FormInput";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("FormInput", () => {
  it("calls onChangeText with user input", () => {
    const mockFn = jest.fn();
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Enter wine name" value="" onChangeText={mockFn} />
    );

    fireEvent.changeText(getByPlaceholderText("Enter wine name"), "Merlot");
    expect(mockFn).toHaveBeenCalledWith("Merlot");
  });
});
