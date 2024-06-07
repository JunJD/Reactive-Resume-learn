import { t } from "@lingui/macro";
import { EnvelopeSimpleOpen, SignOut } from "@phosphor-icons/react";
import { Button } from "@reactive-resume/ui";
import { Link } from "react-router-dom";

import { useLogout } from "@/client/services/auth";
import { useAuthStore } from "@/client/stores/auth";

export const HeroCTA = () => {
  const { logout } = useLogout();

  const isLoggedIn = useAuthStore((state) => !!state.user);

  if (isLoggedIn) {
    return (
      <>
        <Button asChild size="lg">
          <Link to="/dashboard">{t`Go to Dashboard`}</Link>
        </Button>

        <Button size="lg" variant="link" onClick={() => logout()}>
          <SignOut className="mr-3" />
          {t`Logout`}
        </Button>
      </>
    );
  }

  return (
    <>
      <Button asChild size="lg">
        <Link to="/auth/login">{t`Get Started`}</Link>
      </Button>

      <Button asChild size="lg" variant="link">
        <a href="mailto:dingjunjie_222@qq.com" target="_blank" rel="noopener noreferrer nofollow">
          <EnvelopeSimpleOpen size={14} weight="bold" className="mr-2" />
          {t`Send me a message`}
        </a>
      </Button>
    </>
  );
};
