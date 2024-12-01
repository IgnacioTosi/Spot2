import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { vi } from "vitest";
import ShortenUrl from "./ShortenUrl";

// Mock de axios y useNavigate
vi.mock("axios");
vi.mock("react-router-dom", () => ({
    ...vi.importActual("react-router-dom"), // Importamos lo real de react-router-dom
    useNavigate: vi.fn(),
}));

describe("ShortenUrl Component", () => {
    const mockNavigate = vi.fn(); // Mock de useNavigate

    // Configuramos axios y el mock de navigate antes de cada prueba
    beforeEach(() => {
        axios.post.mockResolvedValue({ data: { short_code: "abc123" } }); // Simulamos respuesta exitosa
        vi.clearAllMocks(); // Limpiamos mocks
    });

    // Test 1: Verificar que los elementos del formulario se rendericen correctamente
    test("renders the form and the submit button", () => {
        render(<ShortenUrl />);

        expect(screen.getByPlaceholderText("Enter URL")).toBeInTheDocument();
        expect(screen.getByText("Shorten")).toBeInTheDocument();
    });

    // Test 2: Test para la creación exitosa de la URL y la redirección
    test("successfully creates a shortened URL and redirects", async () => {
        useNavigate.mockReturnValue(mockNavigate); // Hacemos que useNavigate devuelva el mock

        render(<ShortenUrl />);

        const input = screen.getByPlaceholderText("Enter URL");
        const button = screen.getByText("Shorten");

        // Simulamos que el usuario ingresa la URL y hace clic en el botón
        fireEvent.change(input, { target: { value: "https://example.com" } });
        fireEvent.click(button);

        // Verificamos que axios haya sido llamado correctamente
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                "http://127.0.0.1:8000/api/shorten",
                {
                    original_url: "https://example.com",
                }
            );
        });

        // Verificamos que navigate haya sido llamado con la ruta correcta
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/"); // Esperamos que la redirección sea hacia "/"
        });
    });

    // Test 3: Test para manejar errores cuando la creación de la URL falla
    test("handles error when URL creation fails", async () => {
        // Simulamos un error en la llamada a la API
        axios.post.mockRejectedValue(new Error("Error creating URL"));

        const mockConsoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {}); // Mock de console.error

        render(<ShortenUrl />);

        const input = screen.getByPlaceholderText("Enter URL");
        const button = screen.getByText("Shorten");

        // Simulamos que el usuario ingresa la URL y hace clic en el botón
        fireEvent.change(input, { target: { value: "https://example.com" } });
        fireEvent.click(button);

        // Verificamos que console.error haya sido llamado con el error
        await waitFor(() => {
            expect(mockConsoleError).toHaveBeenCalledWith(
                "Error creating URL:",
                expect.any(Error)
            );
        });

        // Restauramos el mock después de la prueba
        mockConsoleError.mockRestore();
    });
});
