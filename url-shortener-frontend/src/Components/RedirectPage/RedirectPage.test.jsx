import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import RedirectPage from "./RedirectPage";

vi.mock("axios");

describe("RedirectPage Component", () => {
    const mockUrl = "https://example.com";

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("renders loading message initially", () => {
        render(
            <MemoryRouter initialEntries={["/redirect/test-code"]}>
                <Routes>
                    <Route path="/redirect/:code" element={<RedirectPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("fetches and displays the original URL", async () => {
        axios.get.mockResolvedValueOnce({ data: { original_url: mockUrl } });

        render(
            <MemoryRouter initialEntries={["/redirect/test-code"]}>
                <Routes>
                    <Route path="/redirect/:code" element={<RedirectPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(mockUrl)).toBeInTheDocument();
        });

        expect(screen.getByRole("link", { name: mockUrl })).toHaveAttribute(
            "href",
            mockUrl
        );
    });

    test("handles error when fetching URL fails", async () => {
        axios.get.mockRejectedValueOnce(new Error("Error fetching URL"));

        render(
            <MemoryRouter initialEntries={["/redirect/test-code"]}>
                <Routes>
                    <Route path="/redirect/:code" element={<RedirectPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Loading...")).toBeInTheDocument();
        });

        expect(axios.get).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/api/redirect/test-code"
        );
        // Puedes agregar más verificaciones si tienes un mensaje de error en el futuro.
    });

    test("redirects to the original URL when the button is clicked", async () => {
        axios.get.mockResolvedValueOnce({ data: { original_url: mockUrl } });

        // Mock `window.location.href`
        const originalLocation = window.location;
        delete window.location;
        window.location = { href: "" };

        render(
            <MemoryRouter initialEntries={["/redirect/test-code"]}>
                <Routes>
                    <Route path="/redirect/:code" element={<RedirectPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(mockUrl)).toBeInTheDocument();
        });

        const redirectButton = screen.getByText("Go to URL");
        fireEvent.click(redirectButton);

        expect(window.location.href).toBe(mockUrl);

        // Restaurar `window.location`
        window.location = originalLocation;
    });
});
