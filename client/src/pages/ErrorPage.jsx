import { useRouteError, useNavigate } from "react-router-dom";

export function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    return (
        <div id="error-page" style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error?.statusText || error?.message}</i>
            </p>
            <div style={{ marginTop: '20px' }}>
                <button onClick={() => navigate('/')} style={{ marginRight: '10px' }}>
                    Go Home
                </button>
                <button onClick={() => window.location.reload()}>
                    Reload Page
                </button>
            </div>
        </div>
    );
}