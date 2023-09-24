import "./App.css";
import { useEffect, useState } from "react";
import Router from "./router/Router";
import { ThemeProvider } from "@material-tailwind/react";
import { me } from "./utils/apiutils";
import { User } from "./types/types";
import UnauthorizedUserRoutes from "./router/UnauthorizedUserRoutes";
import CenteredLoader from "./components/CenteredLoader";
import * as Sentry from "@sentry/react";

// Sentry.init({
//   sendClientReports: false,
//   dsn: "https://79c5a83d074900fa122c5a9ef55f1980@o4505896747401216.ingest.sentry.io/4505931765055488",
//   integrations: [
//     new Sentry.BrowserTracing({
//       // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//       tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
//     }),
//     new Sentry.Replay(),
//   ],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
//   // Session Replay
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });

function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    username: null,
    name: "",
    url: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const fetchedUser = await me();
      setCurrentUser(fetchedUser);
      setIsLoading(false);
    };

    fetchCurrentUser();
  }, []);

  return (
    <div>
      {isLoading ? (
        <CenteredLoader />
      ) : currentUser.username && currentUser.username !== "" ? (
        <ThemeProvider>
          <Router name={currentUser.username} />
        </ThemeProvider>
      ) : (
        <ThemeProvider>
          <UnauthorizedUserRoutes />
        </ThemeProvider>
      )}
    </div>
  );
}

export default App;
