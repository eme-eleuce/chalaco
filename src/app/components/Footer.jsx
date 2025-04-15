import { FaInstagram, FaLinkedinIn, FaRegCopyright } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/chalacofilms/', icon: FaInstagram },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/chalaco-films/', icon: FaLinkedinIn }
  ];

  return (
    <footer className="w-full bg-green-500 text-black relative">
      {/* Línea horizontal */}
      <div className="w-full h-0.5 bg-black" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
          {/* Copyright */}
          <div className="flex items-center space-x-2">
            <span className="text-[#0a0a0a] sm:text-lg font-bold tracking-wider">CHALACO FILMS</span>
            <FaRegCopyright className="text-sm sm:text-base" />
            <span className="text-[#0a0a0a] sm:text-lg">{currentYear}</span>
          </div>

          {/* Redes sociales */}
          <div className="flex space-x-4">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl sm:text-3xl hover:opacity-75 transition-opacity duration-300"
                  aria-label={link.name}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
