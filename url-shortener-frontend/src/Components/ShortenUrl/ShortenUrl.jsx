import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API_LOCALHOST from "../../api/api";

function ShortenUrl() {
    const [url, setUrl] = useState("");
    const navigate = useNavigate();

    const createUrl = async () => {
        try {
            await axios.post(`${API_LOCALHOST}/api/shorten`, {
                original_url: url,
            });
            navigate("/");
        } catch (error) {
            console.error("Error creating URL:", error);
        }
    };

    return (
        <div>
            <h1>Create a Shortened URL</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createUrl();
                }}
            >
                <input
                    type="url"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <button type="submit">Shorten</button>
            </form>
        </div>
    );
}

export default ShortenUrl;
