import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Rooms", to: "/rooms" },
  { label: "Dining", to: "/dining" },
  { label: "Facilities", to: "/facilities" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

const SOCIALS = [
  {
    icon: <FaFacebook />,
    label: "Facebook",
  },
  {
    icon: <FaInstagram />,
    label: "Instagram",
  },
  {
    icon: <FaTwitter />,
    label: "Twitter",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#171717] px-5 py-14 text-white">

      {/* Main Footer */}
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <Link
            to="/"
            className="text-2xl font-semibold tracking-tight text-white"
          >
            Star<span className="font-serif italic">Hotel</span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
            Experience luxury, comfort, and world-class hospitality
            on the Kenyan coast. Your perfect stay begins here.
          </p>

          <div className="mt-5 text-xs text-gray-500">
            Mombasa, Kenya
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="mb-4 text-sm font-medium text-white">
            Navigate
          </h3>

          <ul className="space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-medium text-white">
            Contact
          </h3>

          <ul className="space-y-3 text-sm text-gray-400">

            <li>
              <a
                href="tel:+254700000000"
                className="transition-colors duration-200 hover:text-white"
              >
                +254 700 000 000
              </a>
            </li>

            <li>
              <a
                href="mailto:info@starhotel.com"
                className="transition-colors duration-200 hover:text-white"
              >
                info@starhotel.com
              </a>
            </li>

            <li>
              Mombasa, Kenya
            </li>

            <li>
              <span className="mb-1 block text-xs text-gray-500">
                Check-in
              </span>

              From 2:00 PM daily
            </li>

          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-4 text-sm font-medium text-white">
            Follow Us
          </h3>

          <div className="space-y-3">
            {SOCIALS.map(({ icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex items-center gap-3 text-sm text-gray-400 transition-colors duration-200 hover:text-white"
              >
                <span className="text-base">
                  {icon}
                </span>

                {label}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="mx-auto mt-12 max-w-6xl border-t border-gray-800" />

      {/* Bottom Bar */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">

        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-serif italic text-gray-300">
            StarHotel
          </span>
          . All rights reserved.
        </p>

        <div className="flex gap-5">
          <a
            href="#"
            className="transition-colors duration-200 hover:text-white"
          >
            Privacy
          </a>

          <a
            href="#"
            className="transition-colors duration-200 hover:text-white"
          >
            Terms
          </a>

          <a
            href="#"
            className="transition-colors duration-200 hover:text-white"
          >
            Cookies
          </a>
        </div>

      </div>

    </footer>
  );
}