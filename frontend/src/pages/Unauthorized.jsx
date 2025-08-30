import React from 'react';

function UnauthorizedPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
            textAlign: 'center',
            color: '#c0392b'
        }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>403</h1>
            <h2>You do not have permission to access this page</h2>
            <p>Please contact the administrator or log in with an authorized account.</p>

        </div>
    );
}

export default UnauthorizedPage;
