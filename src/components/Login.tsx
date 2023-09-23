import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import { navigate } from "raviger";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MainLogo from "../assets/MainLogo";
import { login } from "../utils/apiutils";

import Loader from "./Loader"; // Adjust the import path as needed

export default function Login(props: { handleSignupCB: () => void }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (username === "" || password === "") {
        setError("Please check the form again");
        setLoading(false);
        return;
      }
      const res = await login(username, password);

      if (res) {
        if (rememberMe) {
          localStorage.setItem("token", res.token);
        } else {
          sessionStorage.setItem("token", res.token);
        }
        window.location.href = "/home";
      } else {
        setError("Please check the form again");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false); // Hide loader on error
    }
  };

  return (
    <>
      {loading ? (
        <div className="mt-56">
          <Loader />
        </div>
      ) : (
        <>
          <div className="mt-10"></div>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="text-red-500">{error}</div>}
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
              Login
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
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
