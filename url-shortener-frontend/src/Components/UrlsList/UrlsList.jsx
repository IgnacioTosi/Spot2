import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UrlsList() {
    const [urls, setUrls] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/urls");
            setUrls(response.data);
        } catch (error) {
            console.error("Error fetching URLs:", error);
        }
    };

    const deleteUrl = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/urls/${id}`);
            fetchUrls();
        } catch (error) {
            console.error("Error deleting URL:", error);
        }
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Shortened URLs</h1>
                <button
                    onClick={() => navigate("/shorten")}
                    style={{ padding: "8px 16px", fontSize: "16px" }}
                >
                    +
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Code</th>
                        <th>Original URL</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {urls.map((url) => (
                        <tr key={url.id}>
                            <td>{url.id}</td>
                            <td>{url.short_code}</td>
                            <td>{url.original_url}</td>
                            <td>
                                <button
                                    onClick={() =>
                                        navigate(`/redirect/${url.short_code}`)
                                    }
                                >
                                    Redirect
                                </button>
                                <button onClick={() => deleteUrl(url.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UrlsList;
