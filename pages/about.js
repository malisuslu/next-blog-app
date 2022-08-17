import Link from "next/link";
import Image from "next/image";

function About() {
  return (
    <div className="container mx-auto h-[90vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="max-h-full md:h-full h-32">
          <div className="relative w-full h-full object-top">
            <Image
              src="https://images.pexels.com/photos/270373/pexels-photo-270373.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              layout="fill"
              objectFit="cover"
              alt="code"
            />
          </div>
        </div>
        <div className="flex bg-gray-100 px-10 py-0">
          <div className="mb-auto mt-auto max-w-lg">
            <h1 className="text-3xl uppercase">Muhammed Ali SÜSLÜ</h1>
            <p className="font-semibold mb-5">Web Developer & Civil Engineer</p>
            <p>
              Described as curious, determined and professional member to
              provide his team the most effective and practical solutions.
              Recently, added some accomplishments to his 3+ years of background
              in IT world, and feels confident to prove himself in all aspects
              of front-end division. In the nearest past, mainly advancing in
              user-interface-based projects by using his deep knowledge and
              problem-solving skills with well-armed web design tools, such as,
              HTML, CSS, SASS, Bootstrap, JavaScript, React.js, Node.js, etc.
              Highly focused on providing the best user-interface experiences,
              and also currently improving at event loops, object-oriented
              modelling, algorithms, data structures and design principles. By
              using the most appropriate tools, libraries, frameworks and
              programming languages, really excited to introduce his pragmatic
              and analytical thinking capabilities to your high authority. You
              may check the projects via GitHub account, and review the
              portfolio via Netlify account, linked in personal info section
              above.
            </p>
            <button
              className="bg-black rounded-md py-3 px-7 mt-6 text-white"
              href="mailto:"
            >
              <Link href="mailto:malisuslu@yandex.com" className="text-white">
                Email Me
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
