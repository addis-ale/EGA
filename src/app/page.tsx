import { getCurrentUser } from "@/actions/getCurrentUser";
import SignOutButton from "@/components/signOutButton";
export default async function Home() {
  const user = await getCurrentUser();
  console.log(user); //name,email,id
  if (!user)
    return (
      <p className="flex justify-center items-center min-h-screen">
        no user exist
      </p>
    );
  const { name } = user;
  return (
    <div className="flex justify-center items-center min-h-screen flex-col gap-8">
      <div>{name}</div>
      <SignOutButton />
    </div>
  );
}
