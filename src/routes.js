import React, { lazy } from "react";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const LoginScreen = lazy(() => import("./Layouts/Login"));
const Dashboard = lazy(() => import("./Layouts/Dashboard"));
const DetailEmployee = lazy(() => import("./Layouts/DetailEmployee"));
const JobGroup = lazy(() => import("./Layouts/JobGroup"));
const Employee = lazy(() => import("./Layouts/masterEmployee"));
const Backlog = lazy(() => import("./Layouts/Backlog/index"));

const CreateMasterEmployee = lazy(() =>
  import("./Layouts/masterEmployee/Tabnya")
);

export const routes = [
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/",
    element: <DetailBacklog />,
  },
  {
    path: "/masteremployee",
    element: <Employee />,
    name: "Employee",
    icon: <PersonPinOutlinedIcon />,
  },
  {
    path: "/workingReport",
    element: <WorkingReport />,
    name: "Working Report",
    icon: <PersonPinOutlinedIcon />,
  },
  {
    path: "/masteremployee/detail",
    element: <DetailEmployee />,
  },
  {
    path: "/masteremployee/create",
    element: <CreateMasterEmployee />,
  },
  {
    path: "/masterbacklog",
    element: <Backlog />,
    name: "Backlog",
    icon: <BookmarkBorderIcon />,
  },
];
