import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiGitBranch,
  FiHome,
  FiLink,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiMenu,
  FiSearch,
  FiSettings,
  FiStar,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from 'react-icons/fa'

// Icon mapping object
export const ICON_MAP = {
    search: FiSearch,
    user: FiUser,
    star: FiStar,
    branch: FiGitBranch,
    calendar: FiCalendar,
    location: FiMapPin,
    email: FiMail,
    link: FiLink,
    close: FiX,
    menu: FiMenu,
    chevronRight: FiChevronRight,
    chevronLeft: FiChevronLeft,
    home: FiHome,
    settings: FiSettings,
    logout: FiLogOut,
    github: FaGithub,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
    globe: FaGlobe,
} as const;



// Icon sizes
export const ICON_SIZES = {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
    xl: '40px',
} as const;

