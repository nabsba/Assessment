import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
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
  FiTrash2,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from 'react-icons/fa'

import { AiOutlineDelete, AiOutlineCopy } from 'react-icons/ai' // Alternative icons

export const ICON_MAP = {
  // Navigation
  search: FiSearch,
  user: FiUser,
  home: FiHome,
  menu: FiMenu,
  close: FiX,
  chevronRight: FiChevronRight,
  chevronLeft: FiChevronLeft,

  // Actions - choose your preferred style
  star: FiStar,
  bin: FiTrash2,           // Feather style
  // bin: AiOutlineDelete, // Ant Design style
  duplicate: FiCopy,       // Feather style  
  // duplicate: AiOutlineCopy, // Ant Design style
  link: FiLink,
  settings: FiSettings,
  logout: FiLogOut,

  // Content
  branch: FiGitBranch,
  calendar: FiCalendar,
  location: FiMapPin,
  email: FiMail,

  // Social
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

