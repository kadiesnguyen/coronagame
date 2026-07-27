import { Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";
const BreadcrumbBar = ({ data = [] }) => {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        {data?.map((item) => (
          <Link key={item.href} underline="hover" color="inherit" href={item.href}>
            <Typography
              sx={{
                textTransform: "capitalize",
                cursor: "pointer",
              }}
            >
              {item.title}
            </Typography>
          </Link>
        ))}
      </Breadcrumbs>
    </>
  );
};
export default BreadcrumbBar;
