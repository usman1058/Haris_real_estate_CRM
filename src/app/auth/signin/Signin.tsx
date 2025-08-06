"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Divider,
  Alert,
} from "@mui/material";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push("/Dashboard");
    }
  }, [session]);

  const handleCredentialsLogin = async (e: any) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/Dashboard",
    });

    if (res?.error) {
      setError("Invalid email or password.");
    } else if (res?.ok && res.url) {
      router.push(res.url);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/Dashboard" });
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Login to CRM
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <form
          onSubmit={handleCredentialsLogin}
          style={{ width: "100%", marginTop: 24 }}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
        </form>

        <Divider sx={{ my: 3, width: "100%" }}>OR</Divider>

        <Button
          onClick={handleGoogleLogin}
          fullWidth
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Continue with Google
        </Button>
      </Box>
    </Container>
  );
}
