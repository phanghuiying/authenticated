import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  TextField,
  DialogActions,
  Link,
} from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const LoginPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isCreateAccount, setIsCreateAccount] = useState<boolean>(false);
  const [isUsernameError, setIsUsernameError] = useState<boolean>(false);
  const [isLoginError, setIsLoginError] = useState<boolean>(false);

  const handleLoginOrCreateAcc = async (): Promise<void> => {
    const url = "http://18.141.230.17:3001";
    const api = isCreateAccount ? "/api/newuser" : "/api/login";
    const request = await fetch(url + api, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: `{"username": "${username}", "password": "${password}"}`,
    });

    const response = await request.json();
    console.log(response.status);
    if (response.status != 200 && isCreateAccount) {
      setIsUsernameError(true);
    }
    if (response.status != 200 && !isCreateAccount) {
      setIsLoginError(true);
    }
    if (response.status == 200) {
      userContext.setIsLoggedIn(true);
      userContext.setUser({ username: username });
    }
  };

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  return (
    <div>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to Authenticated 🐣
        </Typography>
        <Button
          size="large"
          variant="contained"
          onClick={() => setIsLoginOpen(true)}
        >
          Login
        </Button>
        <Dialog
          onClose={() => {
            setIsLoginOpen(false);
            setIsCreateAccount(false);
            setIsUsernameError(false);
            setIsLoginError(false);
            setUsername("");
            setPassword("");
          }}
          open={isLoginOpen}
        >
          <DialogTitle>
            {!isCreateAccount && "Login"}
            {isCreateAccount && "Create an account"} to view your profile
          </DialogTitle>
          <List>
            <ListItem>
              {!isCreateAccount && (
                <Typography>
                  or{" "}
                  <Link onClick={() => setIsCreateAccount(true)}>create</Link>{" "}
                  an account!
                </Typography>
              )}
            </ListItem>
            <ListItem>
              <TextField
                error={isUsernameError ? true : false}
                label="Username"
                value={username}
                variant="standard"
                multiline
                onChange={(e) => {
                  setUsername(e.target.value)
                  setIsUsernameError(false);
                }}
                helperText={isUsernameError ? "Username is taken" : ""}
              />
            </ListItem>
            <ListItem>
              <TextField
                label="Password"
                value={password}
                variant="standard"
                multiline
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
            </ListItem>
            {isLoginError ? (
              <ListItem>
                <Typography color="#f44336">
                  Login credentials are not matching, please try again.
                </Typography>
              </ListItem>
            ) : (
              ""
            )}
            <DialogActions>
              <Button
                onClick={() => {
                  handleLoginOrCreateAcc();
                }}
              >
                Submit
              </Button>
            </DialogActions>
          </List>
        </Dialog>
      </Container>
    </div>
  );
};

export default LoginPage;
