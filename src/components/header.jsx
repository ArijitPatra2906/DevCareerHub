import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, Search, SquarePen } from "lucide-react";
import Logo from "./logo";
import { enqueueSnackbar } from "notistack";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const [scrolled, setScrolled] = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  const handlePostJob = () => {
    if (!user) {
      navigate("/post-job");
    } else {
      if (user?.unsafeMetadata?.role === "recruiter") {
        navigate("/post-job");
      } else {
        enqueueSnackbar("You are not allowed to post post!", {
          variant: "info",
        });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`py-4 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-50 px-4 md:px-14 ${
          scrolled ? "bg-black" : "bg-transparent"
        }`}
      >
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex gap-2">
          {/* Hide "Find Jobs" & "Post Jobs" buttons if the route is "/" */}
          {location.pathname !== "/" && (
            <>
              {location.pathname !== "/jobs" && (
                <Link to={"/jobs"}>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span className="hidden md:inline">Find Jobs</span>
                  </Button>
                </Link>
              )}
              {location.pathname !== "/post-job" && (
                <Button
                  variant="outline"
                  onClick={handlePostJob}
                  className="flex items-center space-x-2"
                >
                  <SquarePen className="w-5 h-5" />
                  <span className="hidden md:inline">Post Jobs</span>
                </Button>
              )}
            </>
          )}
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label={
                    user?.unsafeMetadata?.role === "recruiter"
                      ? "My Jobs"
                      : "My Applications"
                  }
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}

      <div className="pt-16"></div>
    </>
  );
};

export default Header;
