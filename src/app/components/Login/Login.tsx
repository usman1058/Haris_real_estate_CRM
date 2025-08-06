'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button, Stack, Typography } from '@mui/material';

const Login = () => {
  const { data: session } = useSession();

  return (
    <Stack spacing={2} alignItems="center">
      {session ? (
        <>
          <Typography variant="h6">Welcome, {session.user?.name || 'User'}!</Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          color="success"
          onClick={() => signIn()}
        >
          Sign In
        </Button>
      )}
    </Stack>
  );
};

export default Login;
