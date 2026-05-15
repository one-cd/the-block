import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App integration", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("navigates from filtered inventory to the matching detail experience", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.type(screen.getByLabelText("Search inventory"), "Tesla");

    await waitFor(() => {
      expect(container.querySelectorAll(".vcard")).toHaveLength(9);
    });

    await user.click(container.querySelector(".vcard") as HTMLElement);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Tesla/ })).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Bid" })).toBeInTheDocument();
  });
});
