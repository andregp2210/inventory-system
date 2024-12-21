import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LoginImage } from "@/images";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Home",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <Image src={LoginImage} alt="login image" width={350} height={350} />
        <h1 className="text-2xl font-bold leading-[32px] text-center">
          Welcome to EasyInventory
        </h1>
        <p className="text-xl leading-[28px]">Login to Your Account</p>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="Email" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Password</Label>
          <Input type="password" id="password" placeholder="Password" />
        </div>
        <Button className="cursor-pointer  w-full h-[48px] px-2 border-0 box-border rounded-[12px] text-base font-poppins font-bold leading-[24px] outline-none">
          Button
        </Button>
      </main>
    </>
  );
}
