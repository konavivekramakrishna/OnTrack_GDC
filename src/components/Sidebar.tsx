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

export function Sidebar(props: { Active: string }) {
  return (
    <Card className="border-r w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 border-blue-gray-100 h-[calc(110vh-2rem)] flex flex-col">
      <div className="mb-2 flex items-center w-56 gap-4 p-4">
        <MainLogo />
      </div>
      <hr className="my-2 border-blue-gray-50" />
      <List>
        <ListItem
          onClick={() => {
            navigate("/Home");
          }}
          className={
            props.Active === "Home" ? "bg-blue-gray-100 text-blue-gray-700" : ""
          }
        >
          <ListItemPrefix>
            <HomeIcon className="h-5 w-5" />
          </ListItemPrefix>
          <Typography className={`mr-auto font-normal`}>Home</Typography>
        </ListItem>

        <hr className="my-2 border-blue-gray-50" />
        <ListItem
          onClick={() => {
            navigate("/todo");
          }}
          className={
            props.Active === "Todo" ? "bg-blue-gray-100 text-blue-gray-700" : ""
          }
        >
          <ListItemPrefix>
            <PresentationChartBarIcon className="h-5 w-5" />
          </ListItemPrefix>
          Todo
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem>

        <ListItem
          onClick={() => {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            window.location.href = "/";
          }}
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
