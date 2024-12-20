import { auth } from "@/app/_lib/auth";

export const metadata = {
  title: "Account",
};

export default async function Page() {
  const session = await auth();
  const fName = session.user.name.split(" ")[0];

  return <h2 className="font-semibold text-2xl text-accent-400 mb-7">Welcome, {fName}</h2>;
}
