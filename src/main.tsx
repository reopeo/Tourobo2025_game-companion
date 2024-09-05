import { MantineProvider, createTheme } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Score } from './Score.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import '@mantine/core/styles.css';
import { Home } from './Home.tsx';
import { Manage } from './Manage.tsx';

const theme = createTheme({});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/red',
    element: <Score zone="red" />,
  },
  {
    path: '/blue',
    element: <Score zone="blue" />,
  },
  {
    path: '/manage',
    element: <Manage />,
  },
]);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
);
