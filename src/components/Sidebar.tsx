import { useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  CogIcon,
  HomeIcon,
  LogoutIcon,
} from "@heroicons/react/solid";
import MainLogo from "../assets/MainLogo";
import { navigate } from "raviger";

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("home");

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
  };

  return (
    <Card className="border-r w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 border-blue-gray-100 h-[calc(110vh-2rem)] flex flex-col">
      <div className="mb-2 flex items-center w-56 gap-4 p-4">
        <MainLogo />
      </div>
      <hr className="my-2 border-blue-gray-50" />
      <List>
        <ListItem
          onClick={() => {
            handleItemClick("home");
            navigate("/Home");
          }}
          className={activeItem === "home" ? "bg-blue-50" : ""}
        >
          <ListItemPrefix>
            <HomeIcon className="h-5 w-5" />
          </ListItemPrefix>
          <Typography
            color="blue-gray"
            className={`mr-auto font-normal ${
              activeItem === "home" ? "text-blue-600" : ""
            }`}
          >
            Home
          </Typography>
        </ListItem>
        <ListItem
          onClick={() => handleItemClick("boards")}
          className={activeItem === "boards" ? "bg-blue-200" : ""}
        >
          <ListItemPrefix>
            <PresentationChartBarIcon className="h-5 w-5" />
          </ListItemPrefix>
          <Typography
            color="blue-gray"
            className={`mr-auto font-normal ${
              activeItem === "boards" ? "text-blue-200" : ""
            }`}
          >
            Boards
          </Typography>
        </ListItem>

        <hr className="my-2 border-blue-gray-50" />
        <ListItem
          onClick={() => handleItemClick("todo")}
          className={activeItem === "todo" ? "bg-blue-200" : ""}
        >
          <ListItemPrefix>
            <CogIcon className="h-5 w-5" />
          </ListItemPrefix>
          Todo
        </ListItem>
        <ListItem
          onClick={() => handleItemClick("profile")}
          className={activeItem === "profile" ? "bg-blue-200" : ""}
        >
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem>

        <ListItem
          onClick={() => {
            handleItemClick("logout");

            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            window.location.href = "/";
          }}
          className={activeItem === "logout" ? "bg-blue-200" : ""}
        >
          <ListItemPrefix>
            <LogoutIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
}
