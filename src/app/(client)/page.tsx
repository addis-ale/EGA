import HomeBanner from "@/components/clientComponents/homeBanner";
import Container from "@/components/container";

export default async function HomePage() {
  return (
    // TODO Get all product from the server and populate to the components
    <div className="flex min-h-screen  px-4 lg:px-12  justify-between w-full pt-0 sm:pt-3">
      <Container>
        <HomeBanner />
      </Container>
    </div>
  );
}
