import {
  Grow,
  Box,
  Theme,
  Toolbar,
  Typography,
  FormControl,
  MenuItem,
  Select
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../api/services/User/store";
import { defaultLanguages, FALLBACK_LANGUAGE } from "../../i18n";
import AvatarMenu from "../AvatarMenu";

interface AppBarProps extends MuiAppBarProps {
  theme?: Theme;
}

interface AppHeaderProps {
  user: User;
  pageTitle: string;
}

const typoStyle = {
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  lineHeight: 1
};

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  height: theme.tokens.header.height
}));

const AppHeader = React.forwardRef<HTMLDivElement, AppHeaderProps>(
  (props, ref) => {
  const { user, pageTitle } = props;
  const { t, i18n } = useTranslation("app");
  const theme = useTheme();

  const hours = 1;
  const totalSeconds = hours * 60 * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);

  const countdownMinutes = `${Math.floor(remainingSeconds / 60)}`.padStart(2, "0");
  const countdownSeconds = `${remainingSeconds % 60}`.padStart(2, "0");

  useEffect(() => {
    const endAt = Date.now() + totalSeconds * 1000;
    let timeoutId: number;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemainingSeconds(remaining);

      if (remaining > 0) {
        timeoutId = window.setTimeout(tick, 1000);
      }
    };

    tick();

    return () => window.clearTimeout(timeoutId);
  }, [totalSeconds]);

  const selectedLanguage = defaultLanguages.includes(i18n.language)
    ? i18n.language
    : FALLBACK_LANGUAGE;

  return (
    <AppBar ref={ref} position="fixed" sx={{ width: "100vw" }}>
      <Toolbar sx={{ background: "#08140C 0% 0% no-repeat padding-box" }}>
        <Box sx={{ width: "100%", flexDirection: "row", display: "flex" }}>
          <Box>
            <Typography variant="h6" component="div" color="primary">
              {countdownMinutes}:{countdownSeconds}
            </Typography>
          </Box>
          <Box sx={{ width: 20, height: 20, flex: 1 }} />
          <Box sx={{ flex: 2 }}>
            <Typography
              sx={{
                ...typoStyle,
                color: theme.palette.primary.main,
                mb: theme.spacing(0.5)
              }}
              variant="h6"
              component="div"
            >
              {t("appTitle").toLocaleUpperCase()}
            </Typography>
            <Typography
              sx={{ ...typoStyle }}
              variant="overline"
              component="div"
              noWrap
            >
              {pageTitle.toLocaleUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, justifyContent: "flex-end", display: "flex" }}>
            <FormControl
              size="small"
              sx={{ mr: theme.spacing(2), minWidth: 120 }}
            >
              <Select
                value={selectedLanguage}
                onChange={(event) => i18n.changeLanguage(event.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
              </Select>
            </FormControl>
            {user && user.eMail && (
              <Grow in={Boolean(user && user.eMail)}>
                <AvatarMenu user={user} />
              </Grow>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default AppHeader;
