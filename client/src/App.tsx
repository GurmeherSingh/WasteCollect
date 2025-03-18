import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HouseholdDashboard from "@/pages/dashboard/household";
import CollectorDashboard from "@/pages/dashboard/collector";
import RecyclingDashboard from "@/pages/dashboard/recycling";
import AdminDashboard from "@/pages/dashboard/admin";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard/household" component={HouseholdDashboard} />
      <ProtectedRoute path="/dashboard/collector" component={CollectorDashboard} />
      <ProtectedRoute path="/dashboard/recycling" component={RecyclingDashboard} />
      <ProtectedRoute path="/dashboard/admin" component={AdminDashboard} />
      <ProtectedRoute path="/dashboard/marketplace" component={MarketplaceDashboard} />
      <Route path="/" component={() => <Redirect to="/auth" />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;