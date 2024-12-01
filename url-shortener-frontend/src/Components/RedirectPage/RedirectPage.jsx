import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RedirectPage() {
    const { code } = useParams();
    const [url, setUrl] = useState("");

    useEffect(() => {
        fetchUrl();
    }, []);

    const fetchUrl = async () => {
        try {
            const response = await axios.get(
                `http://3.138.122.174:8000/api/redirect/${code}`
            );
            setUrl(response.data.original_url);
        } catch (error) {
            console.error("Error fetching URL:", error);
        }
    };

    const handleRedirect = () => {
        window.location.href = url;
    };

    return (
        <div>
            <h1>Redirect</h1>
            {url ? (
                <div>
                    <p>
                        Original URL:{" "}
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            {url}
                        </a>
                    </p>
                    <button onClick={handleRedirect}>Go to URL</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default RedirectPage;
