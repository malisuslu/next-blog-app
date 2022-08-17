import Link from "next/link";
import { useRouter } from "next/router";

function PageNotFound() {
  const router = useRouter();
  return (
    <div className="text-center items-center text-3xl mt-72">
      404 - This page could not be found! <br /> <br />
      Back to the the{" "}
      <span
        onClick={() => router.back()}
        className="text-blue-500 underline leading-[0] cursor-pointer"
      >
        previous page
      </span>
      <br />
      or
      <br />
      <span>
        Go to the{" "}
        <Link href="/">
          <a className="text-blue-500 underline leading-[0]">home page</a>
        </Link>
      </span>
    </div>
  );
}

export default PageNotFound;
