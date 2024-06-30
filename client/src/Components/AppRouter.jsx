import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { observer } from 'mobx-react-lite';
import { Context } from '..';

const AppRouter = observer(() => {
    const { user } = useContext(Context);

    return (
        <Routes>
            {user.isAuth ? (
                authRoutes.map(({ path, Component }) =>
                    <Route key={path} path={path} element={<Component />} />
                )
            ) : (
                <Route path="*" element={<Navigate to="/login" replace />} />
            )}

            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} />
            )}

            {user.isAuth ? (
                <Route path="*" element={<Navigate to="/" replace />} />
            ) : (
                <Route path="*" element={<Navigate to="/login" replace />} />
            )}
        </Routes>
    );
});

export default AppRouter;
