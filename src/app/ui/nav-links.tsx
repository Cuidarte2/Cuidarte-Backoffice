import Image from "next/image";
import Link from "next/link";

const links = [
  {
    href: "/",
    name: "Inicio",
  },
  {
    href: "/registro",
    name: "Registro",
  },
  {
    href: "/pages/backoffice/login",
    name: "Login",
  },
];

export default function NavLinks() {
return (
  <div className="flex flex-wrap items-center justify-between gap-4 p-1 bg-gray-100">
    <div className="flex items-center gap-2">
      <Image
        src="/cuidarte-logo.png"
        alt="Logo"
        width={64}
        height={64}
      />
    </div>

    <div className="flex flex-wrap gap-3 justify-center sm:justify-end w-full sm:w-auto">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm sm:text-base transition-colors"
        >
          {link.name}
        </Link>
      ))}
    </div>
  </div>
);
}
