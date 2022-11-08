import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const PlaceholderProfile: React.FC = () => (
  <Box
    component="img"
    sx={{ objectFit: "cover", height: 120, width: 120 }}
    src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
    draggable={false}
  />
);

// TODO: Button & Dialog box for Change Password, Button & Confirmation Dialog for Delete Account
const UserPage: React.FC = () => {
  const userContext = useContext(UserContext);

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<boolean>(false);
  const [isChangePwOpen, setIsChangePwOpen] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");

  const [isPwMatchError, setIsPwMatchError] = useState<boolean>(false);
  const [isUnauthorisedError, setIsUnauthorisedError] =
    useState<boolean>(false);

  const handleLogOut = async (): Promise<void> => {
    const url = "http://18.141.230.17:3001/api/logout";
    const request = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: `{"username": "${userContext.user?.username}"}`,
    });
    const response = await request.json();
    console.log(response);
    if (response.status == 200) {
      userContext.setIsLoggedIn(false);
      userContext.setUser(null);
    }

  };

  const handleDeleteAccount = async (): Promise<void> => {
    userContext.setIsLoggedIn(false);
    userContext.setUser(null);
    const url = "http://18.141.230.17:3001/api/deleteaccount";
    const request = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: `{"username": "${userContext.user?.username}"}`,
    });
    const response = await request.json();
    console.log(response);
  };

  const handleChangePassword = async (): Promise<void> => {
    const url = "http://18.141.230.17:3001/api/updatepassword";
    const request = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: `{"username": "${userContext.user?.username}", "old-password": "${oldPassword}", "new-password": "${newPassword}", "retype-password": "${retypePassword}"}`,
    });
    const response = await request.json();
    console.log(response);

    // if error show msg if success close window
    if (response.status == 200) {
      setIsChangePwOpen(false);
      setOldPassword("");
      setNewPassword("");
      setRetypePassword("");
    } else if (response.status == 404) {
      setIsPwMatchError(true);
    } else if (response.status == 401) {
      setIsUnauthorisedError(true);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Hello {userContext.user?.username ?? "stranger"}, you are logged in.
      </Typography>
      <Container
        sx={{
          height: 200,
          width: 200,
          border: "1px solid grey",
          borderRadius: 100,
          margin: "40px 0px 20px 0px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PlaceholderProfile />
      </Container>
      <Container
        component="span"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onClick={() => setIsChangePwOpen(true)}>Change Password</Button>
        <Dialog
          onClose={() => {
            setIsChangePwOpen(false);
            setOldPassword("");
            setNewPassword("");
            setRetypePassword("");
            setIsPwMatchError(false);
            setIsUnauthorisedError(false);
          }}
          open={isChangePwOpen}
        >
          <ListItem>
            <TextField
              error={isUnauthorisedError}
              label="Old Password"
              variant="standard"
              multiline
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setIsPwMatchError(false);
                setIsUnauthorisedError(false);
              }}
              helperText={isUnauthorisedError && "Old password is incorrect"}
            />
          </ListItem>
          <ListItem>
            <TextField
              error={isPwMatchError}
              label="New Password"
              variant="standard"
              multiline
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setIsPwMatchError(false);
                setIsUnauthorisedError(false);
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              error={isPwMatchError}
              label="Re-type New Password"
              variant="standard"
              multiline
              value={retypePassword}
              onChange={(e) => {
                setRetypePassword(e.target.value);
                setIsPwMatchError(false);
                setIsUnauthorisedError(false);
              }}
              helperText={isPwMatchError && "New passwords do not match"}
            />
          </ListItem>
          <DialogActions>
            <Button onClick={() => handleChangePassword()}>Save</Button>
          </DialogActions>
        </Dialog>
        <Button onClick={handleLogOut}>Log Out</Button>
      </Container>
      <Button onClick={() => setIsDeleteConfirmationOpen(true)}>
        Delete Account
      </Button>
      <Dialog
        onClose={() => setIsDeleteConfirmationOpen(false)}
        open={isDeleteConfirmationOpen}
      >
        <DialogTitle>CONFIRM DELETE ACCOUNT? 😟</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleDeleteAccount()}>Yes</Button>
          <Button onClick={() => setIsDeleteConfirmationOpen(false)}>No</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserPage;
