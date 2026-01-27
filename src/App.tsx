import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Analytics } from "@vercel/analytics/react";
import { Navigation } from "./components/navigation";
import { HomePage } from "./components/homepage";
import { PassBooking } from "./components/pass-booking";
import EventSchedule from "./components/event-schedule";
import { EventsListing } from "./components/events-listing";
import {
  TenMinuteMillionPage,
  PitchArenaPage,
  IncubatorSummitPage,
  IplAuctionPage,
  AiBuildathonPage,
  StartupLeaguePage,
  DesignThinkingPage,
  FinanceMarketingPage,
  DataAnalyticsBdmPage,
  StartupExpoPage,
  PanelDiscussionPage,
  InternshipFairPage,
  StartupYouthConclavePage,
} from "./components/events";
import { Speakers } from "./components/speakers";
import { Venue } from "./components/venue";
import { Sponsors } from "./components/sponsors";
import { Team } from "./components/team";
import { ContactUs } from "./components/contact-us";
import { AuthModal } from "./components/auth-modal";
import { PrivacyPolicy } from "./components/privacy-policy";
import { TermsOfService } from "./components/terms-of-service";
import { CookiePolicy } from "./components/cookie-policy";
import { Footer } from "./components/footer";
import { Toaster } from "./components/ui/sonner";
import { API_BASE_URL } from "./lib/api";

// API URL verified at build time - no runtime logging needed in production

export default function App() {
  const { user, isSignedIn } = useUser();
  const [currentPage, setCurrentPage] = useState("home");
  const [isDark, setIsDark] = useState(false);
  const [userHasPass, setUserHasPass] = useState(false);
  const [userPasses, setUserPasses] = useState<any[]>([]);

  // Check if we're on an event detail page
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/event/')) {
      const eventId = path.split('/event/')[1];
      setCurrentPage(`event-${eventId}`);
    } else if (path === '/events') {
      setCurrentPage('events');
    }
  }, []);

  // Support session-based navigation (e.g., Back to Events buttons)
  useEffect(() => {
    const target = sessionStorage.getItem('navigateTo');
    if (target) {
      setCurrentPage(target);
      sessionStorage.removeItem('navigateTo');
    }
  }, []);

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Fetch user's pass status
  useEffect(() => {
    if (isSignedIn && user?.id) {
      fetch(`${API_BASE_URL}/passes/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data?.passes) {
            setUserPasses(data.data.passes);
            setUserHasPass(data.data.passes.length > 0);
          }
        })
        .catch(err => {
          console.error("Error fetching user passes:", err);
        });
    } else {
      setUserHasPass(false);
    }
  }, [isSignedIn, user?.id]);

  const toggleDark = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUserLogout = () => {
    // User logout is now handled by Clerk's SignOutButton
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage 
          onNavigate={handleNavigate} 
          user={userPasses.length > 0 ? { passes: userPasses } : undefined}
        />;
      case "booking":
        return (
          <PassBooking 
            isAuthenticated={!!isSignedIn}
            userData={user ? {
              name: user.fullName || user.firstName || "User",
              email: user.primaryEmailAddress?.emailAddress || ""
            } : null}
            onNavigate={handleNavigate}
            onRequestAuth={() => {
              setCurrentPage("auth");
            }}
          />
        );
      case "schedule":
        return <EventSchedule />;
      case "events":
        return <EventsListing onNavigate={handleNavigate} />;
      case "event-1":
        return <TenMinuteMillionPage />;
      case "event-2":
        return <PitchArenaPage />;
      case "event-3":
        return <IncubatorSummitPage />;
      case "event-4":
        return <IplAuctionPage />;
      case "event-5":
        return <AiBuildathonPage />;
      case "event-6":
        return <StartupLeaguePage />;
      case "event-7":
        return <DesignThinkingPage />;
      case "event-8":
        return <FinanceMarketingPage />;
      case "event-9":
        return <DataAnalyticsBdmPage />;
      case "event-10":
        return <StartupExpoPage />;
      case "event-11":
        return <PanelDiscussionPage />;
      case "event-13":
        return <InternshipFairPage />;
      case "event-14":
        return <StartupYouthConclavePage />;
      // Handle d1- and d2- prefixed event IDs
      case "event-d1-ten-minute-million":
        return <TenMinuteMillionPage />;
      case "event-d1-pitch-arena":
        return <PitchArenaPage />;
      case "event-d1-incubator-summit":
        return <IncubatorSummitPage />;
      case "event-d1-ipl-auction":
        return <IplAuctionPage />;
      case "event-d1-ai-buildathon-start":
        return <AiBuildathonPage />;
      case "event-d1-biz-arena":
        return <StartupLeaguePage />;
      case "event-d1-design-thinking":
        return <DesignThinkingPage />;
      case "event-d1-finance-marketing":
        return <FinanceMarketingPage />;
      case "event-d1-data-analytics":
        return <DataAnalyticsBdmPage />;
      case "event-d1-startup-expo":
        return <StartupExpoPage />;
      case "event-d1-internship-fair":
        return <InternshipFairPage />;
      case "event-d2-pitch-arena":
        return <PitchArenaPage />;
      case "event-d2-incubator-summit":
        return <IncubatorSummitPage />;
      case "speakers":
        return <Speakers />;
      case "venue":
        return <Venue />;
      case "sponsors":
        return <Sponsors />;
      case "team":
        return <Team />;
      case "contact":
        return <ContactUs />;
      case "auth":
        return <AuthModal onNavigate={handleNavigate} />;
      case "privacy-policy":
        return <PrivacyPolicy />;
      case "terms-of-service":
        return <TermsOfService />;
      case "cookie-policy":
        return <CookiePolicy />;
      default:
        return <HomePage 
          onNavigate={handleNavigate} 
          user={userPasses.length > 0 ? { passes: userPasses } : undefined}
        />;
    }
  };

  // Show navigation and footer on all pages
  const showNavAndFooter = true;

  return (
    <div className="min-h-screen bg-background">
      {showNavAndFooter && (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isDark={isDark}
          toggleDark={toggleDark}
          isUserAuthenticated={!!isSignedIn}
          userData={user ? {
            name: user.fullName || user.firstName || "User",
            email: user.primaryEmailAddress?.emailAddress || ""
          } : null}
          onLogout={handleUserLogout}
          userHasPass={userHasPass}
        />
      )}
      <main className={showNavAndFooter ? "pt-24" : ""}>{renderPage()}</main>
      {showNavAndFooter && <Footer onNavigate={handleNavigate} />}
      <Toaster />
      <Analytics />
    </div>
  );
}

