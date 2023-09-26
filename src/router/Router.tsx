import { useRoutes, Redirect } from "raviger";

import { Suspense, lazy } from "react";
import CenteredLoader from "../components/CenteredLoader";
import Error from "../components/Error";

const Dashboard = lazy(() => import("../pages/DashBoard"));
const BoardPage = lazy(() => import("../pages/BoardPage"));

const PrintPage = lazy(() => import("../pages/PrintPage"));

export default function Router(props: { name: string }) {
  const routes = {
    "/": () => <Redirect to="/Home" />,
    "/Home": () => (
      <Suspense fallback={<CenteredLoader />}>
        <Dashboard name={props.name} />
      </Suspense>
    ),
    "/todo": () => (
      <Suspense fallback={<CenteredLoader />}>
        <PrintPage />
      </Suspense>
    ),

    "/board/:id": ({ id }: { id: string }) => (
      <Suspense fallback={<CenteredLoader />}>
        <BoardPage id={Number(id)} />
      </Suspense>
    ),
    "/*": () => <Error />,
  };

  const res = useRoutes(routes) || <Error />;

  return res;
}
