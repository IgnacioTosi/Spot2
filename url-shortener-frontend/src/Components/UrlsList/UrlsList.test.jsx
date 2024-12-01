import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import UrlsList from "./UrlsList";

// Mock de Axios
vi.mock("axios");

describe("UrlsList Component", () => {
    const mockUrls = [
        { id: 1, short_code: "abc123", original_url: "https://example.com" },
        { id: 2, short_code: "def456", original_url: "https://another.com" },
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockUrls });
        axios.delete.mockResolvedValue({}); // Mock de DELETE
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("renders the list of shortened URLs", async () => {
        render(
            <BrowserRouter>
                <UrlsList />
            </BrowserRouter>
        );

        // Esperar a que las URLs sean cargadas
        await waitFor(() => {
            expect(screen.getByText("https://example.com")).toBeInTheDocument();
            expect(screen.getByText("https://another.com")).toBeInTheDocument();
        });
    });

    test("navigates to the shorten page when clicking the '+' button", async () => {
        render(
            <BrowserRouter>
                <UrlsList />
            </BrowserRouter>
        );

        const addButton = screen.getByText("+");

        await act(async () => {
            fireEvent.click(addButton);
        });

        // Verificar que la URL de navegación ha cambiado
        expect(location.pathname).toBe("/shorten");
    });

    test("deletes a URL when the delete button is clicked", async () => {
        render(
            <BrowserRouter>
                <UrlsList />
            </BrowserRouter>
        );

        // Esperar a que las URLs sean cargadas
        await waitFor(() => {
            expect(screen.getByText("https://example.com")).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByText("Delete");
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(
                "http://127.0.0.1:8000/api/urls/1"
            );
        });
    });
});
