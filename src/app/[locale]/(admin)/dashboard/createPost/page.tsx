import ProductPostForm from "./productPostForm";

export default function Home() {
  return (
    <main className="w-full min-h-screen">
      <h1 className="text-3xl font-bold py-8 text-center  text-white">
        Create Product Post
      </h1>
      <ProductPostForm />
    </main>
  );
}
