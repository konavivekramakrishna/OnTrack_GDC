import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { login, signup } from "../utils/apiutils";
import Loader from "./Loader";

export default function SignUp(props: { handleSignupCB: () => void }) {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password1, setPassword1] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [error, setError] = React.useState("");
  const [load, setLoad] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoad(true);
      if (
        username === "" ||
        email === "" ||
        password1 === "" ||
        password2 === "" ||
        password1 !== password2 ||
        password1.length < 8
      ) {
        setError("Please check the form again");
        setLoad(false);
        return;
      }

      await signup(username, email, password1, password2);
      const res = await login(username, password1);
      if (res) {
        if (rememberMe) {
          localStorage.setItem("token", res.token);
        } else {
          sessionStorage.setItem("token", res.token);
        }
        window.location.href = "/home";
      } else {
        setError("Please check the form again");
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
      setLoad(false);
    }
  };

  return (
    <>
      {load ? (
        <div className="mt-56">
          <Loader />
        </div>
      ) : (
        <>
          <div className="mt-10"></div>
          <Typography component="h1" variant="h5">
            SignUp
          </Typography>
          <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              label="Username"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              label="Email"
              type="email"
              id="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              name="password1"
              label="Password"
              type="password"
              id="password1"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              name="password2"
              label="Confirm Password"
              type="password"
              id="password2"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" className="hover:cursor-pointer" variant="body2">
                  About OnTrack?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  onClick={props.handleSignupCB}
                  className="hover:cursor-pointer"
                  variant="body2"
                >
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
            {error && <div className="text-red-500">{error}</div>}
          </Box>
        </>
      )}
    </>
  );
}
