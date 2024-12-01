import axios from "axios";
import './bootstrap';

// Obtener el token CSRF del meta tag
const csrfToken = document.head.querySelector(
    'meta[name="csrf-token"]'
).content;

// Configurar Axios para incluir el token CSRF
axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
