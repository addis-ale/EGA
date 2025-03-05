import HomeBanner from "@/components/clientComponents/homeBanner";
import Container from "@/components/container";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("NavBar");
  return (
    <Container>
      <div>{/* <HomeBanner /> */}</div>
    </Container>
  );
}
