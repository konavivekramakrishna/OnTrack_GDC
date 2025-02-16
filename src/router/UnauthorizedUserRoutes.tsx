import { Redirect, useRoutes } from "raviger";

import { Suspense, lazy } from "react";

import CenteredLoader from "../components/CenteredLoader";

const LoginAndSignUp = lazy(() => import("../pages/LoginAndSignUp"));

export default function UnauthorizedUserRoutes() {
  const routes = {
    "/": () => (
      <Suspense fallback={<CenteredLoader />}>
        <LoginAndSignUp />
      </Suspense>
    ),
    "/*": () => <Redirect to="/" />,
  };

  let res = useRoutes(routes) || <LoginAndSignUp />;
  return res;
}
