import Link from "next/link";
import { Box, styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      {/*<Image src="/images/logos/dark-logo.svg" alt="logo" height={70} width={174} priority />*/}
      <Box px={2} py={1}>
        <h1 style={{ margin: 0 }}>AlgoqubeAI</h1>
      </Box>
    </LinkStyled>
  );
};

export default Logo;