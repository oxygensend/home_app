import React from 'react';
import './App.css';
import { Route } from 'react-router';
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Login } from './pages/login';
import { ProtectedRoute } from './components/protectedRoute';
import { getAccessToken } from './tokenStorage';

function App() {
    const isAuthorized = !!getAccessToken();
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path={'/'}>
                <Route
                    path={''}
                    element={
                        <ProtectedRoute
                            isAuthorized={!isAuthorized}
                            redirect={'/dashboard'}
                        >
                            <Login />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={'login'}
                    element={
                        <ProtectedRoute isAuthorized={false} redirect={'/'} />
                    }
                />
                <Route
                    path={'dashboard'}
                    element={
                        <ProtectedRoute
                            isAuthorized={isAuthorized}
                            redirect={'/'}
                        >
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Route>
        )
    );
    return <RouterProvider router={router} />;
}

export default App;
